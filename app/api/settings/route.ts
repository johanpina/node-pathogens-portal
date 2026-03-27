import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const obj = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json(obj);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();

  const updates = Object.entries(body as Record<string, string>).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );

  await prisma.$transaction(updates);
  return NextResponse.json({ success: true });
}
