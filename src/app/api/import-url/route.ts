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

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string, pattern: RegExp): string {
  const m = html.match(pattern);
  return m?.[1] ? decodeHtmlEntities(m[1]) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = (body?.url || "").trim();
    const validUrl = isPublicHttpUrl(rawUrl);

    if (!validUrl) {
      return NextResponse.json(
        { success: false, error: "Informe uma URL pública válida (https://...)" },
        { status: 400 }
      );
    }

    const res = await fetch(validUrl.toString(), {
      headers: { "User-Agent": "SocialCraftBot/1.0 (+https://socialcraft-eight.vercel.app)" },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Site respondeu com HTTP ${res.status}` },
        { status: 422 }
      );
    }

    const html = (await res.text()).slice(0, 150000);

    const title =
      extractMeta(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<title[^>]*>([^<]+)<\/title>/i) ||
      validUrl.hostname;

    const desc =
      extractMeta(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
      extractMeta(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      `Projeto web publicado em ${validUrl.hostname}`;

    const themeColor =
      extractMeta(html, /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i) || "#06b6d4";

    const shortName = title.split(/[|\-–—]/)[0].trim().slice(0, 48) || validUrl.hostname;

    return NextResponse.json({
      success: true,
      project: {
        id: `url-${Date.now()}`,
        name: shortName,
        desc: desc.slice(0, 180),
        type: "local" as const,
        source: validUrl.toString(),
        isLocal: true,
        themeColor
      },
      screenshotEndpoint: `/api/capture-screenshot?url=${encodeURIComponent(validUrl.toString())}`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Erro ao analisar URL." },
      { status: 500 }
    );
  }
}
