import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [news, highlights, dashboards, topics] = await Promise.all([
    prisma.news.findMany({
      where: { published: true },
      select: { title: true, slug: true, summary: true, date: true },
    }),
    prisma.highlight.findMany({
      where: { published: true },
      select: { title: true, slug: true, summary: true, date: true, tags: true },
    }),
    prisma.dashboard.findMany({
      where: { published: true },
      select: { title: true, slug: true, description: true },
    }),
    prisma.topic.findMany({
      select: { name: true, slug: true, description: true },
    }),
  ]);

  return NextResponse.json({
    news: news.map((n) => ({ ...n, type: "news" })),
    highlights: highlights.map((h) => ({ ...h, type: "highlight" })),
    dashboards: dashboards.map((d) => ({ ...d, type: "dashboard" })),
    topics: topics.map((t) => ({ ...t, type: "topic" })),
  });
}
