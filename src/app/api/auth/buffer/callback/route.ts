import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setInMemoryBufferToken } from "@/lib/buffer-auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(`${origin}/?buffer_error=${encodeURIComponent(oauthError)}`);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("buffer_oauth_state")?.value;
  const verifier = cookieStore.get("buffer_pkce_verifier")?.value;

  if (!code || !state || !savedState || state !== savedState || !verifier) {
    return NextResponse.redirect(`${origin}/?buffer_error=invalid_oauth_state`);
  }

  const clientId = process.env.BUFFER_OAUTH_CLIENT_ID || process.env.BUFFER_CLIENT_ID || "";
  const redirectUri = `${origin}/api/auth/buffer/callback`;

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier
    });

    const tokenRes = await fetch("https://auth.buffer.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(
        `${origin}/?buffer_error=${encodeURIComponent(tokenData.error_description || tokenData.error || "token_exchange_failed")}`
      );
    }

    setInMemoryBufferToken(tokenData.access_token, tokenData.expires_in || 3600);

    cookieStore.set("buffer_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    if (tokenData.refresh_token) {
      cookieStore.set("buffer_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
      });
    }

    cookieStore.delete("buffer_pkce_verifier");
    cookieStore.delete("buffer_oauth_state");

    return NextResponse.redirect(`${origin}/?buffer_connected=1`);
  } catch (err: any) {
    return NextResponse.redirect(`${origin}/?buffer_error=${encodeURIComponent(err?.message || "oauth_error")}`);
  }
}
