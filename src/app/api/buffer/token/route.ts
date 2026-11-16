import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getValidBufferToken, setInMemoryBufferToken, verifyBufferToken } from "@/lib/buffer-auth";

export async function GET() {
  const token = await getValidBufferToken();
  if (!token) {
    return NextResponse.json({
      connected: false,
      error: "Nenhum token ativo do Buffer encontrado ou o token expirou."
    });
  }

  const check = await verifyBufferToken(token);
  if (!check.valid) {
    return NextResponse.json({
      connected: false,
      error: check.error || "Token do Buffer inválido ou expirado."
    });
  }

  return NextResponse.json({
    connected: true,
    account: check.account || null
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawToken = (body?.accessToken || "").trim();

    if (!rawToken) {
      return NextResponse.json(
        { connected: false, error: "Cole um token válido do Buffer." },
        { status: 400 }
      );
    }

    const check = await verifyBufferToken(rawToken);
    if (!check.valid) {
      return NextResponse.json(
        { connected: false, error: check.error || "Token recusado pelo Buffer." },
        { status: 401 }
      );
    }

    setInMemoryBufferToken(rawToken, 86400);
    const cookieStore = await cookies();
    cookieStore.set("buffer_access_token", rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return NextResponse.json({
      connected: true,
      account: check.account || null,
      message: "Buffer conectado com sucesso!"
    });
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, error: err?.message || "Erro ao salvar token." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("buffer_access_token");
  return NextResponse.json({ connected: false });
}
