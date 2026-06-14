import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/db";

/**
 * Phase 2 — automated weekly draft generation.
 *
 * Calls Claude (claude-opus-4-8) with the server-side `web_search` tool, using
 * Javier's weekly editor prompt. Claude reads the official Chilean sources and
 * returns the markdown bundle (`### FILE:` blocks). This module only produces
 * the markdown; the caller validates it and stores it as a REVIEW draft —
 * nothing is ever auto-published.
 */

/** ISO-8601 week number for a given date. */
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

async function resolveApiKey(): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const setting = await prisma.setting.findUnique({ where: { key: "anthropic_api_key" } });
  if (setting?.value) return setting.value;
  throw new Error(
    "Falta ANTHROPIC_API_KEY (env var o setting 'anthropic_api_key')"
  );
}

async function resolveWeeklyPrompt(): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key: "weekly_prompt" } });
  if (setting?.value) return setting.value;
  // Fallback to the bundled template.
  return readFileSync(join(process.cwd(), "prisma", "data", "WEEKLY_PROMPT_ES.md"), "utf-8");
}

export interface GenerateResult {
  markdown: string;
  epiWeek: string;
  today: string;
}

export async function generateBundle(now: Date = new Date()): Promise<GenerateResult> {
  const apiKey = await resolveApiKey();
  const template = await resolveWeeklyPrompt();

  const today = now.toISOString().slice(0, 10);
  const week = isoWeek(now);
  const epiWeek = `SE ${week}-2026`;

  const prompt =
    `IMPORTANTE: Hoy es ${today}. La semana epidemiológica ISO actual es SE ${week}. ` +
    `Usa estos valores donde el documento diga <HOY> o <SE>.\n\n` +
    template.replaceAll("<HOY>", today).replaceAll("<SE>", String(week));

  const client = new Anthropic({ apiKey });

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: prompt }];
  let final: Anthropic.Message | undefined;

  // Server-side web_search runs an internal loop; on `pause_turn` we re-send.
  for (let i = 0; i < 8; i++) {
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 32000,
      thinking: { type: "adaptive" },
      system:
        "Eres el editor científico semanal del Portal de Patógenos Chile. " +
        "Devuelve ÚNICAMENTE el bundle: varios bloques '### FILE: data/curated/<archivo>.json' " +
        "seguidos de un bloque ```json```, y al final '### NOTAS PARA EL EDITOR'. " +
        "No escribas preámbulo, ni resúmenes, ni comentarios fuera de ese formato.",
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages,
    });
    final = await stream.finalMessage();
    if (final.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: final.content });
      continue;
    }
    break;
  }

  if (!final) throw new Error("no se obtuvo respuesta del modelo");

  const markdown = final.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  if (!markdown) throw new Error("la respuesta del modelo no contiene texto");

  return { markdown, epiWeek, today };
}
