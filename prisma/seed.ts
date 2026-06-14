import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedPathogens } from "./seedPathogens";
import { seedCharts } from "./seedCharts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Admin user ──
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@pathogens.cl" },
    update: {},
    create: {
      email: "admin@pathogens.cl",
      password: hashedPassword,
      name: "Admin",
      role: Role.ADMIN,
    },
  });
  console.log("Admin user: admin@pathogens.cl / admin123");

  // ── Settings ──
  const defaultSettings = [
    { key: "site_title", value: "Portal de Patógenos Chile" },
    { key: "site_description", value: "Vigilancia, identificación e investigación de patógenos en Chile" },
    { key: "contact_email", value: "contacto@pathogens.cl" },
    { key: "country", value: "Chile" },
    { key: "europepmc_query", value: "pathogen Chile" },
    { key: "twitter_url", value: "" },
    { key: "github_url", value: "" },
    { key: "umami_src", value: "" },
    { key: "umami_website_id", value: "" },
    {
      key: "news_query",
      value:
        '(brote OR patógeno OR hantavirus OR dengue OR influenza OR sarampión OR "virus respiratorio") Chile',
    },
    {
      key: "weekly_prompt",
      value: readFileSync(join(process.cwd(), "prisma", "data", "WEEKLY_PROMPT_ES.md"), "utf-8"),
    },
  ];
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`Upserted ${defaultSettings.length} settings`);

  // ── Topics (organising categories; pathogens link to these) ──
  const topicData = [
    {
      slug: "respiratory-viruses",
      name: "Virus respiratorios",
      description:
        "Vigilancia y datos genómicos de influenza, SARS-CoV-2, VRS y otros patógenos respiratorios circulantes en Chile.",
      menuOrder: 1,
    },
    {
      slug: "vector-borne-diseases",
      name: "Enfermedades transmitidas por vectores",
      description:
        "Datos epidemiológicos y entomológicos de dengue, hantavirus y otros patógenos transmitidos por vectores.",
      menuOrder: 2,
    },
    {
      slug: "antimicrobial-resistance",
      name: "Resistencia antimicrobiana",
      description:
        "Monitoreo nacional de RAM: perfiles de resistencia, tendencias por región y caracterización genómica.",
      menuOrder: 3,
    },
    {
      slug: "foodborne-pathogens",
      name: "Patógenos transmitidos por alimentos",
      description:
        "Datos sobre Salmonella y otros organismos relevantes para la inocuidad alimentaria detectados en vigilancia nacional.",
      menuOrder: 4,
    },
    {
      slug: "emerging-pathogens",
      name: "Patógenos emergentes",
      description:
        "Señales tempranas y datos genómicos de patógenos nuevos o re-emergentes con impacto potencial en Chile.",
      menuOrder: 5,
    },
  ];

  for (const t of topicData) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, menuOrder: t.menuOrder },
      create: t,
    });
  }
  console.log(`Upserted ${topicData.length} topics`);

  // ── Pathogen surveillance (ported weekly bundle — real Chilean data) ──
  await seedPathogens();

  // ── Pathogen charts (historical Chart.js dashboards) ──
  await seedCharts();

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
