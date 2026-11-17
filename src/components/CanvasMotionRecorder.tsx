"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Film, Loader2, UploadCloud, Volume2, VolumeX } from "lucide-react";

interface CanvasMotionRecorderProps {
  projectName: string;
  projectDesc: string;
  styleId: string;
  styleName: string;
  highlightPhrase?: string;
  screenshotUrl?: string;
  liveUrl?: string | null;
  onVideoUploaded?: (publicUrl: string) => void;
}

const STYLE_PALETTES: Record<string, { primary: string; glow: string; bg: string }> = {
  style_01_cinematic_teaser: { primary: "#f4f4f5", glow: "rgba(255,255,255,0.14)", bg: "#050505" },
  style_02_pov_hands_on: { primary: "#f97316", glow: "rgba(249,115,22,0.22)", bg: "#09090b" },
  style_03_before_after: { primary: "#10b981", glow: "rgba(16,185,129,0.20)", bg: "#09090b" },
  style_04_bento_grid: { primary: "#38bdf8", glow: "rgba(56,189,248,0.20)", bg: "#030712" },
  style_05_micro_feature: { primary: "#a855f7", glow: "rgba(168,85,247,0.20)", bg: "#09090b" },
  style_06_terminal_cyber: { primary: "#22d3ee", glow: "rgba(34,211,238,0.22)", bg: "#020617" },
  style_07_interactive_3d: { primary: "#ec4899", glow: "rgba(236,72,153,0.20)", bg: "#09090b" },
  style_08_kinetic_text: { primary: "#facc15", glow: "rgba(250,204,21,0.20)", bg: "#09090b" },
  style_09_pain_to_relief: { primary: "#ef4444", glow: "rgba(239,68,68,0.22)", bg: "#09090b" },
  style_10_satisfying_loop: { primary: "#34d399", glow: "rgba(52,211,153,0.20)", bg: "#09090b" },
  style_11_tech_stack_pills: { primary: "#b4f72e", glow: "rgba(180,247,46,0.16)", bg: "#080c09" },
  style_12_editorial_made_in_br: { primary: "#15803d", glow: "rgba(21,128,61,0.08)", bg: "#f6f3ea" }
};

export function CanvasMotionRecorder({
  projectName,
  projectDesc,
  styleId,
  styleName,
  highlightPhrase,
  screenshotUrl,
  liveUrl,
  onVideoUploaded
}: CanvasMotionRecorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const palette = STYLE_PALETTES[styleId] || STYLE_PALETTES.style_02_pov_hands_on;

  useEffect(() => {
    setImgLoaded(false);
    setRecordedUrl(null);
    setRecordedBlob(null);
    setUploadStatus(null);
    if (!screenshotUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => {
      imgRef.current = null;
      setImgLoaded(false);
    };
    img.src = screenshotUrl;
  }, [screenshotUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const start = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = ((now - start) % 6000) / 6000;
      const W = canvas.width;
      const H = canvas.height;

      // ESTILO 11: DARK NEON TECH STACK PILLS (Estilo FullCycle)
      if (styleId === "style_11_tech_stack_pills") {
        ctx.fillStyle = "#080c09";
        ctx.fillRect(0, 0, W, H);
        const limeGlow = ctx.createRadialGradient(W * 0.78, H * 0.78, 10, W * 0.78, H * 0.78, 360);
        limeGlow.addColorStop(0, "rgba(180, 247, 46, 0.18)");
        limeGlow.addColorStop(1, "rgba(8, 12, 9, 0)");
        ctx.fillStyle = limeGlow;
        ctx.fillRect(0, 0, W, H);

        // Top Brand + Outlined Pill
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 22px system-ui, sans-serif";
        ctx.fillText("HB", 36, 68);
        ctx.fillStyle = "#b4f72e";
        ctx.fillText("Studio", 68, 68);

        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(W - 230, 44, 194, 34, 17);
        ctx.stroke();
        ctx.fillStyle = "#e4e4e7";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillText("Projeto em produção", W - 205, 65);

        // Giant 3-line Headline with Lime middle line
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 38px system-ui, sans-serif";
        ctx.fillText("Conheça o novo", 36, 155);
        ctx.fillStyle = "#b4f72e";
        ctx.fillText(projectName.slice(0, 19), 36, 203);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("na prática", 36, 251);

        // Subtitle
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText((projectDesc || "Arquitetura moderna e deploy em produção.").slice(0, 46), 36, 300);

        if (highlightPhrase?.trim()) {
          ctx.fillStyle = "rgba(180, 247, 46, 0.12)";
          ctx.strokeStyle = "#b4f72e";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(36, 326, W - 72, 46, 12);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#b4f72e";
          ctx.font = "bold 14px system-ui, sans-serif";
          ctx.fillText(highlightPhrase.trim().slice(0, 45), 50, 354);
        }

        // Floating Tilted Tech Stack Pills
        const pills = [
          { label: "Next.js 16", color: "#ffffff", x: 46, y: 420 },
          { label: "React 19", color: "#38bdf8", x: 196, y: 408 },
          { label: "TypeScript", color: "#3b82f6", x: 344, y: 400 },
          { label: "Docker", color: "#0ea5e9", x: 42, y: 492 },
          { label: "Tailwind", color: "#22d3ee", x: 176, y: 482 },
          { label: "Node.js", color: "#4ade80", x: 320, y: 472 },
          { label: "PostgreSQL", color: "#60a5fa", x: 64, y: 564 },
          { label: "Vercel Edge", color: "#b4f72e", x: 244, y: 552 },
          { label: "IA Agents", color: "#f97316", x: 150, y: 632 }
        ];

        pills.forEach((p, idx) => {
          const bob = Math.sin(elapsed * Math.PI * 2 + idx * 0.7) * 5;
          ctx.save();
          ctx.translate(p.x, p.y + bob);
          ctx.rotate(-0.07);
          ctx.fillStyle = "rgba(20, 26, 22, 0.94)";
          ctx.strokeStyle = "rgba(255,255,255,0.12)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(0, 0, 134, 44, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(20, 22, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#f4f4f5";
          ctx.font = "bold 14px system-ui, sans-serif";
          ctx.fillText(p.label, 34, 27);
          ctx.restore();
        });

        // Bottom Neon Outlined CTA
        ctx.strokeStyle = "#b4f72e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(36, H - 140, 290, 52, 26);
        ctx.stroke();
        ctx.fillStyle = "#b4f72e";
        ctx.font = "bold 16px system-ui, sans-serif";
        ctx.fillText("CONFERIR PROJETO  →", 72, H - 108);

        ctx.fillStyle = "#b4f72e";
        ctx.fillRect(0, H - 6, W * elapsed, 6);
        animId = requestAnimationFrame(renderFrame);
        return;
      }

      // ESTILO 12: EDITORIAL CREAM & MADE IN BRAZIL (Estilo MatLivre)
      if (styleId === "style_12_editorial_made_in_br") {
        ctx.fillStyle = "#f6f3ea";
        ctx.fillRect(0, 0, W, H);

        // Barra Superior Bandeira do Brasil (Verde / Amarelo / Azul)
        ctx.fillStyle = "#009c3b";
        ctx.fillRect(0, 0, W / 3, 10);
        ctx.fillStyle = "#ffdf00";
        ctx.fillRect(W / 3, 0, W / 3, 10);
        ctx.fillStyle = "#002776";
        ctx.fillRect((W / 3) * 2, 0, W / 3, 10);

        // App Icon Box
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.roundRect(36, 48, 60, 60, 14);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px Georgia, serif";
        ctx.fillText(projectName.slice(0, 2).toUpperCase(), 48, 88);

        // Editorial Serif Title (2-tone)
        const parts = projectName.split(" ");
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 44px Georgia, serif";
        ctx.fillText(parts[0]?.slice(0, 14) || projectName.slice(0, 14), 36, 168);
        if (parts[1]) {
          ctx.fillStyle = "#15803d";
          ctx.font = "italic bold 44px Georgia, serif";
          ctx.fillText(parts.slice(1).join(" ").slice(0, 18), 36, 218);
        }

        // Crisp Editorial Subtitle
        ctx.fillStyle = "#3f3f46";
        ctx.font = "20px system-ui, sans-serif";
        ctx.fillText((projectDesc || "Software moderno de alta velocidade").slice(0, 42), 36, 272);

        if (highlightPhrase?.trim()) {
          ctx.fillStyle = "#15803d";
          ctx.font = "bold 16px system-ui, sans-serif";
          ctx.fillText(highlightPhrase.trim().slice(0, 46), 36, 314);
        } else {
          ctx.fillStyle = "#15803d";
          ctx.font = "bold 16px monospace";
          ctx.fillText("fast • open source • made in brazil", 36, 314);
        }

        // Light UI Screenshot Card with soft drop shadow
        const cardX = 36;
        const cardY = 355;
        const cardW = W - 72;
        const cardH = 420;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 16);
        ctx.fill();
        ctx.restore();

        if (imgLoaded && imgRef.current) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(cardX + 4, cardY + 4, cardW - 8, cardH - 8, 12);
          ctx.clip();
          const scale = 1 + Math.sin(elapsed * Math.PI) * 0.03;
          ctx.drawImage(imgRef.current, cardX + 4, cardY + 4, (cardW - 8) * scale, (cardH - 8) * scale);
          ctx.restore();
        } else {
          ctx.fillStyle = "#f4f4f5";
          ctx.beginPath();
          ctx.roundRect(cardX + 12, cardY + 12, cardW - 24, cardH - 24, 12);
          ctx.fill();
          ctx.fillStyle = "#18181b";
          ctx.font = "bold 20px Georgia, serif";
          ctx.fillText(projectName, cardX + 32, cardY + 80);
          ctx.fillStyle = "#52525b";
          ctx.font = "14px monospace";
          ctx.fillText(liveUrl || "https://socialcraft-eight.vercel.app", cardX + 32, cardY + 114);
        }

        // Floating "MADE IN BRAZIL" Pill Badge
        const bx = W - 268;
        const by = cardY + cardH - 28;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.14)";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#faf7ee";
        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx, by, 224, 48, 24);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Mini Bandeira BR
        ctx.fillStyle = "#009c3b";
        ctx.fillRect(bx + 18, by + 15, 24, 17);
        ctx.fillStyle = "#ffdf00";
        ctx.beginPath();
        ctx.moveTo(bx + 30, by + 17);
        ctx.lineTo(bx + 39, by + 23.5);
        ctx.lineTo(bx + 30, by + 30);
        ctx.lineTo(bx + 21, by + 23.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#002776";
        ctx.beginPath();
        ctx.arc(bx + 30, by + 23.5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#18181b";
        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.fillText("MADE IN BRAZIL", bx + 52, by + 28);

        ctx.fillStyle = "#15803d";
        ctx.fillRect(0, H - 6, W * elapsed, 6);
        animId = requestAnimationFrame(renderFrame);
        return;
      }

      // 1. Fundo Studio
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(W * 0.25, H * 0.15, 10, W * 0.25, H * 0.15, 380);
      grad.addColorStop(0, palette.glow);
      grad.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. HUD Badge do Estilo
      ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(30, 34, W - 60, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.arc(50, 51, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f4f4f5";
      ctx.font = "bold 12px monospace";
      ctx.fillText(styleName.toUpperCase().slice(0, 38), 66, 55);

      // 3. Título & Descrição
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 32px system-ui, sans-serif";
      ctx.fillText(projectName.slice(0, 22), 30, 114);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "15px system-ui, sans-serif";
      ctx.fillText((projectDesc || "Projeto em produção").slice(0, 48), 30, 142);

      // 4. Frase em Destaque (opcional)
      const hasHighlight = !!highlightPhrase && highlightPhrase.trim().length > 0;
      if (hasHighlight) {
        ctx.fillStyle = "rgba(127, 29, 29, 0.85)";
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(30, 162, W - 60, 54, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px system-ui, sans-serif";
        ctx.fillText(highlightPhrase!.trim().slice(0, 44), 46, 195);
      }

      const stageX = 30;
      const stageY = hasHighlight ? 234 : 185;
      const stageW = W - 60;
      const stageH = hasHighlight ? 410 : 450;

      // 5. Renderizador Específico por Estilo Escolhido!
      if (styleId === "style_06_terminal_cyber") {
        // ESTILO 06: TERMINAL CYBER / CODE FLOW
        ctx.fillStyle = "#020617";
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(stageX, stageY, stageW, stageH, 16);
        ctx.fill();
        ctx.stroke();

        const lines = [
          `$ git clone ${projectName.toLowerCase().replace(/\s+/g, "-")}`,
          `> Resolving dependencies...`,
          `> Compiling Next.js + TypeScript...`,
          `✓ Build passed in 780ms`,
          `> Deploying to Global Edge CDN...`,
          `✓ Live: ${liveUrl ? liveUrl.replace(/^https?:\/\//, "").slice(0, 28) : "200 OK"}`
        ];
        const visibleCount = Math.min(lines.length, Math.floor(elapsed * (lines.length + 1)) + 1);
        ctx.font = "bold 15px monospace";
        lines.slice(0, visibleCount).forEach((ln, idx) => {
          ctx.fillStyle = ln.startsWith("✓") ? "#34d399" : ln.startsWith("$") ? "#22d3ee" : "#94a3b8";
          ctx.fillText(ln, stageX + 22, stageY + 54 + idx * 46);
        });

        // CRT Scanlines
        ctx.fillStyle = "rgba(34, 211, 238, 0.05)";
        for (let sy = stageY + 8; sy < stageY + stageH - 8; sy += 6) {
          ctx.fillRect(stageX + 4, sy, stageW - 8, 1);
        }
      } else if (styleId === "style_04_bento_grid") {
        // ESTILO 04: BENTO GRID DINÂMICO
        const activeCell = Math.floor(elapsed * 4) % 4;
        const cells = [
          { label: "01 // ARQUITETURA", val: "Next.js + Edge" },
          { label: "02 // PERFORMANCE", val: "99/100 Core Vitals" },
          { label: "03 // RESPONSIVO", val: "Desktop & Mobile" },
          { label: "04 // CONVERSÃO", val: "WhatsApp + CTA" }
        ];
        const cw = (stageW - 14) / 2;
        const ch = (stageH - 14) / 2;
        cells.forEach((c, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = stageX + col * (cw + 14);
          const by = stageY + row * (ch + 14);
          const isLit = idx === activeCell;
          ctx.fillStyle = isLit ? "rgba(56, 189, 248, 0.16)" : "#111827";
          ctx.strokeStyle = isLit ? "#38bdf8" : "rgba(255,255,255,0.1)";
          ctx.lineWidth = isLit ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.roundRect(bx, by, cw, ch, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 12px monospace";
          ctx.fillText(c.label, bx + 18, by + 40);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px system-ui, sans-serif";
          ctx.fillText(c.val, bx + 18, by + 90);
        });
      } else if (styleId === "style_08_kinetic_text") {
        // ESTILO 08: KINETIC TYPOGRAPHY
        const words = [projectName.toUpperCase().slice(0, 14), "ZERO ATRASO", "DESIGN REAL", "NO AR AGORA"];
        const idx = Math.floor(elapsed * 4) % words.length;
        const pulse = 1 + Math.sin(elapsed * Math.PI * 8) * 0.05;
        ctx.save();
        ctx.translate(W / 2, stageY + stageH / 2);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = "#facc15";
        ctx.textAlign = "center";
        ctx.font = "900 46px system-ui, sans-serif";
        ctx.fillText(words[idx], 0, 12);
        ctx.restore();
        ctx.textAlign = "left";
      } else if (styleId === "style_09_pain_to_relief") {
        // ESTILO 09: PAIN TO RELIEF
        const isRelief = elapsed >= 0.45;
        ctx.fillStyle = isRelief ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.16)";
        ctx.strokeStyle = isRelief ? "#10b981" : "#ef4444";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(stageX, stageY, stageW, stageH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isRelief ? "#34d399" : "#f87171";
        ctx.font = "bold 18px monospace";
        ctx.fillText(isRelief ? "✓ SOLUÇÃO APLICADA" : "⚠ PROBLEMA IDENTIFICADO", stageX + 28, stageY + 75);

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 30px system-ui, sans-serif";
        ctx.fillText(isRelief ? "Rápido, limpo e no ar." : "Fluxo lento e manual.", stageX + 28, stageY + 135);
      } else if (styleId === "style_10_satisfying_loop") {
        // ESTILO 10: SATISFYING WORKFLOW LOOP
        const steps = ["1. Captura do Projeto", "2. Render Motion 9:16", "3. Publicação Automática"];
        const activeStep = Math.floor(elapsed * 3) % 3;
        steps.forEach((st, idx) => {
          const sy = stageY + 30 + idx * 120;
          const isLit = idx <= activeStep;
          ctx.fillStyle = isLit ? "rgba(52, 211, 153, 0.16)" : "#18181b";
          ctx.strokeStyle = isLit ? "#34d399" : "rgba(255,255,255,0.1)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(stageX, sy, stageW, 92, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isLit ? "#34d399" : "#71717a";
          ctx.font = "bold 20px system-ui, sans-serif";
          ctx.fillText(st, stageX + 24, sy + 54);
        });
      } else if (styleId === "style_01_cinematic_teaser") {
        // ESTILO 01: CINEMATIC APPLE TEASER (Minimalista P&B)
        const alpha = Math.min(1, elapsed * 2.2);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#111111";
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(stageX, stageY, stageW, stageH, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 36px system-ui, sans-serif";
        ctx.fillText(projectName.slice(0, 18), W / 2, stageY + stageH / 2 - 10);
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText("Minimalismo. Velocidade. Precisão.", W / 2, stageY + stageH / 2 + 28);
        ctx.restore();
        ctx.textAlign = "left";
      } else {
        // ESTILOS VISUAIS COM SCREENSHOT (02 POV, 03 Before/After, 05 Micro-Feature, 07 3D Perspective)
        ctx.save();
        if (styleId === "style_07_interactive_3d") {
          ctx.translate(W / 2, stageY + stageH / 2);
          ctx.rotate(Math.sin(elapsed * Math.PI * 2) * 0.03);
          ctx.translate(-W / 2, -(stageY + stageH / 2));
        }

        ctx.fillStyle = "#18181b";
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(stageX, stageY, stageW, stageH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#27272a";
        ctx.beginPath();
        ctx.roundRect(stageX, stageY, stageW, 28, [16, 16, 0, 0]);
        ctx.fill();
        ["#ef4444", "#f59e0b", "#10b981"].forEach((c, idx) => {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(stageX + 16 + idx * 14, stageY + 14, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        if (imgLoaded && imgRef.current) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(stageX + 2, stageY + 30, stageW - 4, stageH - 32, [0, 0, 14, 14]);
          ctx.clip();
          const zoomBase = styleId === "style_05_micro_feature" ? 1.18 : 1.0;
          const scale = zoomBase + Math.sin(elapsed * Math.PI) * 0.05;
          const dw = (stageW - 4) * scale;
          const dh = (stageH - 32) * scale;
          ctx.drawImage(imgRef.current, stageX + 2 - (dw - (stageW - 4)) / 2, stageY + 30, dw, dh);
          ctx.restore();
        } else {
          ctx.fillStyle = "#09090b";
          ctx.fillRect(stageX + 2, stageY + 30, stageW - 4, stageH - 32);
          ctx.fillStyle = palette.primary;
          ctx.font = "bold 18px monospace";
          ctx.fillText(">_ " + projectName, stageX + 24, stageY + 120);
          ctx.fillStyle = "#71717a";
          ctx.font = "13px monospace";
          ctx.fillText(liveUrl || "Renderizando interface...", stageX + 24, stageY + 150);
        }

        if (styleId === "style_03_before_after") {
          const splitX = stageX + stageW * (0.25 + 0.5 * Math.sin(elapsed * Math.PI));
          ctx.strokeStyle = palette.primary;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(splitX, stageY + 30);
          ctx.lineTo(splitX, stageY + stageH);
          ctx.stroke();
        }

        if (styleId === "style_02_pov_hands_on") {
          const cx = stageX + 80 + Math.sin(elapsed * Math.PI * 2) * 140 + 140;
          const cy = stageY + 140 + Math.cos(elapsed * Math.PI * 2) * 60 + 40;
          if (elapsed > 0.35 && elapsed < 0.65) {
            const rp = (elapsed - 0.35) / 0.3;
            ctx.strokeStyle = palette.primary;
            ctx.globalAlpha = 1 - rp;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 8 + rp * 26, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + 20);
          ctx.lineTo(cx + 6, cy + 15);
          ctx.lineTo(cx + 11, cy + 23);
          ctx.lineTo(cx + 15, cy + 21);
          ctx.lineTo(cx + 10, cy + 13);
          ctx.lineTo(cx + 17, cy + 13);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // 6. Rodapé URL + Barra de Progresso
      if (liveUrl) {
        ctx.fillStyle = "#18181b";
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.roundRect(30, H - 80, W - 60, 42, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px monospace";
        ctx.fillText(liveUrl.replace(/^https?:\/\//, "").slice(0, 42), 46, H - 54);
      }

      ctx.fillStyle = palette.primary;
      ctx.fillRect(0, H - 6, W * elapsed, 6);

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [projectName, projectDesc, styleId, styleName, highlightPhrase, imgLoaded, liveUrl, palette]);

  const toggleNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const script = `${projectName}. ${projectDesc}. ${highlightPhrase ? highlightPhrase + "." : ""} Confira o link na bio!`;
    const utter = new SpeechSynthesisUtterance(script);
    utter.lang = "pt-BR";
    utter.rate = 1.05;
    utter.onend = () => setIsNarrating(false);
    utter.onerror = () => setIsNarrating(false);
    setIsNarrating(true);
    window.speechSynthesis.speak(utter);
  };

  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    setIsRecording(true);
    setRecordProgress(0);
    setRecordedUrl(null);
    setRecordedBlob(null);
    setUploadStatus(null);

    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setRecordedBlob(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      setIsRecording(false);
      setRecordProgress(100);
    };

    recorder.start();
    const totalMs = 6000;
    const interval = setInterval(() => {
      setRecordProgress((prev) => Math.min(98, prev + 5));
    }, totalMs / 20);

    setTimeout(() => {
      clearInterval(interval);
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, totalMs);
  };

  const handleUploadRecordedVideo = async () => {
    if (!recordedBlob) return;
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", recordedBlob, `${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-motion.webm`);

      const res = await fetch("/api/upload-media", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setUploadStatus(`Vídeo hospedado (${data.provider})!`);
        onVideoUploaded?.(data.url);
      } else {
        setUploadStatus(data.error || "Configure BLOB_READ_WRITE_TOKEN para upload direto.");
      }
    } catch (err: any) {
      setUploadStatus(err?.message || "Erro ao enviar vídeo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
        <canvas ref={canvasRef} width={540} height={960} className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={handleRecordVideo}
          disabled={isRecording}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-bold cursor-pointer disabled:opacity-60 transition-all"
        >
          {isRecording ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Gravando ({recordProgress}%)...</span>
            </>
          ) : (
            <>
              <Film className="w-3.5 h-3.5" />
              <span>Gravar Vídeo (6s)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={toggleNarration}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 cursor-pointer transition-all"
          title="Ouvir narração PT-BR do projeto"
        >
          {isNarrating ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isNarrating ? "Parar Voz" : "Narração PT-BR"}</span>
        </button>

        {recordedUrl && (
          <>
            <a
              href={recordedUrl}
              download={`${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-motion.webm`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baixar .webm</span>
            </a>

            <button
              type="button"
              onClick={handleUploadRecordedVideo}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer disabled:opacity-60 transition-all"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>Hospedar URL</span>
            </button>
          </>
        )}
      </div>

      {uploadStatus && (
        <p className="text-[11px] text-center text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 w-full">
          {uploadStatus}
        </p>
      )}
    </div>
  );
}
