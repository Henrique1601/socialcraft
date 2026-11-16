import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

function base64UrlEncode(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const clientId = process.env.BUFFER_OAUTH_CLIENT_ID || process.env.BUFFER_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(`${origin}/?buffer_error=missing_client_id`);
  }

  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(crypto.createHash("sha256").update(verifier).digest());
  const state = base64UrlEncode(crypto.randomBytes(16));

  const cookieStore = await cookies();
  cookieStore.set("buffer_pkce_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600
  });
  cookieStore.set("buffer_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600
  });

  const redirectUri = `${origin}/api/auth/buffer/callback`;
  const authUrl = new URL("https://auth.buffer.com/auth");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "offline_access posts:read posts:write account:read insights:read assets:read assets:write");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
