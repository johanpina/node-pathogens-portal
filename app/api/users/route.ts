import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  if (auth.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ users, currentUserId: auth.user.sub });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  if (auth.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { email, password, name, role } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role ?? "EDITOR",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El email ya existe" }, { status: 409 });
  }
}
