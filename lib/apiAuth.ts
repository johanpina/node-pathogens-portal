import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, JWTPayload } from "./auth";

export async function requireAuth(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await verifyJWT(token);
  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  return { user };
}

export function isNextResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse;
}
