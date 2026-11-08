export function generateMotionHTML(projectName: string, projectDesc: string, styleId: string): string {
  const title = projectName.trim() || "Meu Projeto";
  const desc = projectDesc.trim() || "Inovação tecnológica e arquitetura moderna";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — SocialCraft Motion Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #030712;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #f3f4f6;
    }
    .viewport {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15), transparent 70%),
                  radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.12), transparent 60%),
                  #030712;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }
    .hud-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #22d3ee;
      margin-bottom: 20px;
      animation: pulse 2s infinite ease-in-out;
    }
    .hud-dot {
      width: 6px;
      height: 6px;
      background: #22d3ee;
      border-radius: 50%;
      box-shadow: 0 0 8px #22d3ee;
    }
    .card-preview {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: rgba(17, 24, 39, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 32px 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
                  0 0 30px rgba(6, 182, 212, 0.15);
      display: flex;
      flex-direction: column;
      gap: 18px;
      transform-style: preserve-3d;
      animation: floatCard 4s ease-in-out infinite;
    }
    .project-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 30%, #a5f3fc 70%, #6ee7b7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .project-desc {
      font-size: 13px;
      line-height: 1.5;
      color: #9ca3af;
    }
    .terminal-box {
      background: #020617;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #38bdf8;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .terminal-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .terminal-prompt {
      color: #34d399;
      font-weight: bold;
    }
    .stats-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #6b7280;
    }
    .stat-item strong {
      color: #f3f4f6;
      display: block;
      font-size: 13px;
    }
    @keyframes floatCard {
      0%, 100% { transform: translateY(0px) rotateX(0deg); }
      50% { transform: translateY(-8px) rotateX(1deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  </style>
</head>
<body>
  <div class="viewport">
    <div class="grid-bg"></div>
    
    <div class="hud-badge">
      <div class="hud-dot"></div>
      <span>SOCIALCRAFT // MOTION RENDER</span>
    </div>

    <div class="card-preview">
      <div class="project-title">${title}</div>
      <div class="project-desc">${desc}</div>

      <div class="terminal-box">
        <div class="terminal-row">
          <span class="terminal-prompt">❯</span>
          <span>git status --audit=live</span>
        </div>
        <div class="terminal-row" style="color: #94a3b8;">
          <span style="color: #4ade80;">✔</span>
          <span>Build verified // 60fps</span>
        </div>
        <div class="terminal-row" style="color: #cbd5e1;">
          <span style="color: #38bdf8;">★</span>
          <span>Estilo: ${styleId}</span>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <span>PIPELINE</span>
          <strong>AGENTS 4K</strong>
        </div>
        <div class="stat-item">
          <span>FPS</span>
          <strong>60 SMOOTH</strong>
        </div>
        <div class="stat-item">
          <span>ENGAGEMENT</span>
          <strong>MAX REACH</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
