"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Film, Loader2, Play, RotateCcw, Sparkles } from "lucide-react";

interface CanvasMotionRecorderProps {
  projectName: string;
  projectDesc: string;
  styleName: string;
  screenshotUrl?: string;
  liveUrl?: string | null;
}

export function CanvasMotionRecorder({
  projectName,
  projectDesc,
  styleName,
  screenshotUrl,
  liveUrl
}: CanvasMotionRecorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // Carrega captura real quando disponível (CORS anônimo para não sujar o canvas)
  useEffect(() => {
    setImgLoaded(false);
    setRecordedUrl(null);
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

  // Loop de animação POV / Motion 30fps no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const start = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = ((now - start) % 6000) / 6000; // Loop de 6s
      const W = canvas.width;
      const H = canvas.height;

      // 1. Fundo Studio Dark
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(W * 0.25, H * 0.15, 10, W * 0.25, H * 0.15, 360);
      grad.addColorStop(0, "rgba(6, 182, 212, 0.22)");
      grad.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. HUD Badge do Estilo
      ctx.fillStyle = "rgba(24, 24, 27, 0.9)";
      ctx.strokeStyle = "rgba(34, 211, 238, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(30, 36, W - 60, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(50, 53, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f4f4f5";
      ctx.font = "bold 12px monospace";
      ctx.fillText(styleName.toUpperCase().slice(0, 38), 66, 57);

      // 3. Título & Descrição
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 32px system-ui, sans-serif";
      ctx.fillText(projectName.slice(0, 22), 30, 118);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "15px system-ui, sans-serif";
      ctx.fillText((projectDesc || "Projeto em produção").slice(0, 48), 30, 146);

      // 4. Janela Browser com Screenshot Real (ou Cartão Estilizado)
      const cardX = 30;
      const cardY = 185;
      const cardW = W - 60;
      const cardH = 380;

      ctx.fillStyle = "#18181b";
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Barra macOS
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, 28, [16, 16, 0, 0]);
      ctx.fill();
      ["#ef4444", "#f59e0b", "#10b981"].forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(cardX + 16 + idx * 14, cardY + 14, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (imgLoaded && imgRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX + 2, cardY + 30, cardW - 4, cardH - 32, [0, 0, 14, 14]);
        ctx.clip();
        // Zoom suave (Ken Burns)
        const scale = 1 + Math.sin(elapsed * Math.PI) * 0.04;
        const dw = (cardW - 4) * scale;
        const dh = (cardH - 32) * scale;
        ctx.drawImage(imgRef.current, cardX + 2 - (dw - (cardW - 4)) / 2, cardY + 30, dw, dh);
        ctx.restore();
      } else {
        ctx.fillStyle = "#09090b";
        ctx.fillRect(cardX + 2, cardY + 30, cardW - 4, cardH - 32);
        ctx.fillStyle = "#22d3ee";
        ctx.font = "bold 18px monospace";
        ctx.fillText(">_ " + projectName, cardX + 24, cardY + 120);
        ctx.fillStyle = "#71717a";
        ctx.font = "13px monospace";
        ctx.fillText(liveUrl || "Renderizando interface...", cardX + 24, cardY + 150);
      }

      // 5. Cursor POV animado + Ripple de Clique
      const cx = cardX + 80 + Math.sin(elapsed * Math.PI * 2) * 140 + 140;
      const cy = cardY + 140 + Math.cos(elapsed * Math.PI * 2) * 60 + 40;

      if (elapsed > 0.35 && elapsed < 0.65) {
        const rp = (elapsed - 0.35) / 0.3;
        ctx.strokeStyle = `rgba(34, 211, 238, ${1 - rp})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 8 + rp * 26, 0, Math.PI * 2);
        ctx.stroke();
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

      // 6. Tooltip POV + Rodapé URL + Barra de Progresso
      ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
      ctx.beginPath();
      ctx.roundRect(30, 600, 290, 38, 10);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("POV: Navegação Real & Responsiva", 44, 624);

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

      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(0, H - 6, W * elapsed, 6);

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [projectName, projectDesc, styleName, imgLoaded, liveUrl]);

  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    setIsRecording(true);
    setRecordProgress(0);
    setRecordedUrl(null);

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
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-bold cursor-pointer disabled:opacity-60 transition-all"
        >
          {isRecording ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Gravando Vídeo ({recordProgress}%)...</span>
            </>
          ) : (
            <>
              <Film className="w-3.5 h-3.5" />
              <span>Gravar Vídeo Real (6s)</span>
            </>
          )}
        </button>

        {recordedUrl && (
          <a
            href={recordedUrl}
            download={`${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-motion.webm`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Baixar Vídeo (.webm)</span>
          </a>
        )}
      </div>
    </div>
  );
}
