import { NextResponse } from "next/server";
import { generateMotionHTML } from "@/lib/motion-generator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Projeto";
  const desc = searchParams.get("desc") || "Inovação tecnológica e arquitetura moderna";
  const style = searchParams.get("style") || "terminal-cyber";

  const html = generateMotionHTML(title, desc, style);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
