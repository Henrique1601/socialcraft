import { NextResponse } from "next/server";
import { generateBentoCarouselData } from "@/lib/carousel-generator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Projeto";
  const desc = searchParams.get("desc") || "Tecnologia e performance";

  const slides = generateBentoCarouselData(title, desc);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Carrossel Bento Multi-Slide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html {
      width: 100%;
      height: 100%;
      background: #030712;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #f3f4f6;
      overflow-x: hidden;
    }
    .carousel-container {
      display: flex;
      width: 100%;
      height: 100%;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
    }
    .carousel-container::-webkit-scrollbar { display: none; }
    .slide {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      scroll-snap-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 36px 32px;
      background: radial-gradient(circle at 50% 10%, rgba(6, 182, 212, 0.15), transparent 60%),
                  radial-gradient(circle at 80% 90%, rgba(16, 185, 129, 0.1), transparent 50%),
                  #030712;
      border-right: 1px solid rgba(255,255,255,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #22d3ee;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 5px 12px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }
    .brand-mark {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #94a3b8;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: auto 0;
    }
    .title {
      font-size: 28px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 40%, #a5f3fc 80%, #6ee7b7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 14px;
      line-height: 1.5;
      color: #94a3b8;
    }
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
    }
    .card-item {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 16px;
      font-size: 12px;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(10px);
    }
    .card-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      shrink: 0;
    }
    .terminal-box {
      background: #020617;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #38bdf8;
      line-height: 1.4;
      white-space: pre-wrap;
      margin-top: 8px;
    }
    .cta-banner {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.15));
      border: 1px solid rgba(6, 182, 212, 0.4);
      border-radius: 16px;
      padding: 16px;
      font-size: 13px;
      font-weight: 700;
      color: #f8fafc;
      text-align: center;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748b;
    }
    .nav-hint {
      color: #22d3ee;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  </style>
</head>
<body>
  <div class="carousel-container" id="container">
    ${slides
      .map(
        (slide, i) => `
      <div class="slide">
        <div class="header">
          <span class="badge">${slide.badge}</span>
          <span class="brand-mark">SOCIALCRAFT // BENTO</span>
        </div>

        <div class="content">
          <h2 class="title">${slide.title}</h2>
          <p class="subtitle">${slide.subtitle}</p>

          <div class="cards-grid">
            ${slide.highlights
              .map(
                (h) => `
              <div class="card-item">
                <div class="card-dot"></div>
                <span>${h}</span>
              </div>
            `
              )
              .join("")}
          </div>

          ${
            slide.terminalSnippet
              ? `<div class="terminal-box">${slide.terminalSnippet}</div>`
              : ""
          }
          ${
            slide.ctaText
              ? `<div class="cta-banner">${slide.ctaText}</div>`
              : ""
          }
        </div>

        <div class="footer">
          <span>DESLIZE PARA O LADO ❯</span>
          <span class="nav-hint">${i + 1} de ${slides.length}</span>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
