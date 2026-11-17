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

async function resolveScreenshotUrl(targetUrl: string): Promise<{ url: string; source: string }> {
  const mshotsFallback = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1280`;
  try {
    const mlRes = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (mlRes.ok) {
      const mlData = await mlRes.json();
      const shotUrl = mlData?.data?.screenshot?.url;
      if (shotUrl) return { url: shotUrl, source: "microlink" };
    }
  } catch {
    // Fallback para mShots
  }
  return { url: mshotsFallback, source: "mshots" };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const redirect = searchParams.get("redirect") === "true";
  const proxy = searchParams.get("proxy") === "1" || searchParams.get("proxy") === "true";

  const validUrl = isPublicHttpUrl(rawUrl);
  if (!validUrl) {
    return NextResponse.json(
      { success: false, error: "URL pública inválida. Use https://..." },
      { status: 400 }
    );
  }

  const resolved = await resolveScreenshotUrl(validUrl.toString());

  if (proxy) {
    try {
      const imgRes = await fetch(resolved.url, { signal: AbortSignal.timeout(10000) });
      if (imgRes.ok) {
        const bytes = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get("content-type") || "image/png";
        return new NextResponse(bytes, {
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    } catch {
      // Se falhar, retorna 404 limpo sem CORS error
    }
    return new NextResponse(null, { status: 404 });
  }

  if (redirect) {
    return NextResponse.redirect(resolved.url);
  }

  return NextResponse.json({
    success: true,
    screenshotUrl: resolved.url,
    proxyUrl: `/api/capture-screenshot?url=${encodeURIComponent(validUrl.toString())}&proxy=1`,
    source: resolved.source
  });
}
