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
  style_10_satisfying_loop: { primary: "#34d399", glow: "rgba(52,211,153,0.20)", bg: "#09090b" }
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

      // 1. Fundo Studio por Estilo
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(W * 0.25, H * 0.15, 10, W * 0.25, H * 0.15, 380);
      grad.addColorStop(0, palette.glow);
      grad.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Efeito especial para Estilo 08 (Kinetic Text fundo)
      if (styleId === "style_08_kinetic_text") {
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = palette.primary;
        ctx.font = "900 92px system-ui, sans-serif";
        ctx.fillText(projectName.toUpperCase(), 20 - elapsed * 120, 740);
        ctx.restore();
      }

      // 2. HUD Badge
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

      // 4. Banner de Destaque (se o usuário informou uma frase em destaque)
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

      // 5. Janela Browser com Screenshot Real
      const cardX = 30;
      const cardY = hasHighlight ? 234 : 185;
      const cardW = W - 60;
      const cardH = hasHighlight ? 350 : 385;

      ctx.fillStyle = "#18181b";
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

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
        const scale = 1 + Math.sin(elapsed * Math.PI) * 0.04;
        const dw = (cardW - 4) * scale;
        const dh = (cardH - 32) * scale;
        ctx.drawImage(imgRef.current, cardX + 2 - (dw - (cardW - 4)) / 2, cardY + 30, dw, dh);
        ctx.restore();
      } else {
        ctx.fillStyle = "#09090b";
        ctx.fillRect(cardX + 2, cardY + 30, cardW - 4, cardH - 32);
        ctx.fillStyle = palette.primary;
        ctx.font = "bold 18px monospace";
        ctx.fillText(">_ " + projectName, cardX + 24, cardY + 120);
        ctx.fillStyle = "#71717a";
        ctx.font = "13px monospace";
        ctx.fillText(liveUrl || "Renderizando interface...", cardX + 24, cardY + 150);
      }

      // Scanlines para Terminal Cyber (style_06)
      if (styleId === "style_06_terminal_cyber") {
        ctx.fillStyle = "rgba(34, 211, 238, 0.05)";
        for (let sy = cardY + 30; sy < cardY + cardH; sy += 6) {
          ctx.fillRect(cardX + 2, sy, cardW - 4, 1);
        }
      }

      // Divisor Before/After para style_03
      if (styleId === "style_03_before_after") {
        const splitX = cardX + cardW * (0.3 + 0.4 * Math.sin(elapsed * Math.PI));
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(splitX, cardY + 30);
        ctx.lineTo(splitX, cardY + cardH);
        ctx.stroke();
      }

      // 6. Cursor POV animado + Ripple
      const cx = cardX + 80 + Math.sin(elapsed * Math.PI * 2) * 140 + 140;
      const cy = cardY + 140 + Math.cos(elapsed * Math.PI * 2) * 60 + 40;

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

      // 7. Tooltip + Rodapé URL + Barra de Progresso
      const tipY = cardY + cardH + 22;
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.roundRect(30, tipY, 310, 38, 10);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("POV: Navegação Real & Responsiva", 44, tipY + 24);

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
