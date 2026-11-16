import { NextResponse } from "next/server";

function isPublicHttpUrl(raw: string): URL | null {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.startsWith("127.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const redirect = searchParams.get("redirect") === "true";

  const validUrl = isPublicHttpUrl(rawUrl);
  if (!validUrl) {
    return NextResponse.json(
      { success: false, error: "URL pública inválida. Use https://..." },
      { status: 400 }
    );
  }

  const mshotsFallback = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(validUrl.toString())}?w=1280`;

  try {
    const mlRes = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(validUrl.toString())}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (mlRes.ok) {
      const mlData = await mlRes.json();
      const shotUrl = mlData?.data?.screenshot?.url;
      if (shotUrl) {
        if (redirect) {
          return NextResponse.redirect(shotUrl);
        }
        return NextResponse.json({
          success: true,
          screenshotUrl: shotUrl,
          fallbackUrl: mshotsFallback,
          source: "microlink"
        });
      }
    }
  } catch {
    // Fallback para mShots caso Microlink atinja timeout ou rate limit
  }

  if (redirect) {
    return NextResponse.redirect(mshotsFallback);
  }

  return NextResponse.json({
    success: true,
    screenshotUrl: mshotsFallback,
    fallbackUrl: mshotsFallback,
    source: "mshots"
  });
}
