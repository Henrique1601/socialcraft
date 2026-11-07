"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles, Send, CheckCircle2, Video, FileText } from "lucide-react";
import { MockupPlayer } from "./MockupPlayer";
import { generateSmartCopy } from "@/lib/copywriter";
import confetti from "canvas-confetti";

interface DropzoneStudioProps {
  onPostCreated?: (newPost: any) => void;
}

export function DropzoneStudio({ onPostCreated }: DropzoneStudioProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<"story" | "landscape">("story");
  const [copyTone, setCopyTone] = useState<"technical" | "storytelling" | "direct">("technical");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Por favor, selecione um arquivo de vídeo (.mp4, .mov, .webm)");
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Auto generate title from filename if empty
    if (!projectTitle) {
      const clean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setProjectTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerateCopy = () => {
    const copy = generateSmartCopy(projectTitle, copyTone);
    setCaption(copy.caption);
    setHashtags(copy.hashtags);
  };

  const handleSchedule = () => {
    if (!videoUrl) {
      alert("Carregue um vídeo primeiro!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });

      if (onPostCreated) {
        onPostCreated({
          id: `post-user-${Date.now()}`,
          project: projectTitle || "Projeto Criador",
          title: projectTitle || "Novo Lançamento",
          caption: caption || `${projectTitle} disponível agora!`,
          hashtags: hashtags.length > 0 ? hashtags : ["#buildinpublic", "#software"],
          platform: "instagram",
          status: "scheduled",
          videoUrl: videoUrl,
          styleName: "Upload do Criador",
          scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString(),
          source: "human"
        });
      }

      setTimeout(() => setIsSuccess(false), 3500);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna Esquerda: Upload & Copy */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Dropzone Card */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/50 hover:bg-zinc-900/40 transition-all rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="video/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:scale-110 group-hover:border-emerald-500/50 group-hover:text-emerald-400 flex items-center justify-center text-zinc-400 transition-all mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {videoFile ? videoFile.name : "Arraste e solte o vídeo aqui"}
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm">
            Suporta arquivos <span className="text-zinc-200">.mp4</span>, <span className="text-zinc-200">.mov</span> ou <span className="text-zinc-200">.webm</span> do celular ou PC.
          </p>
        </div>

        {/* Inputs de Configuração */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">Nome do Projeto</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Ex: OmniPDF Studio, DevSync..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm"
            />
          </div>

          {/* Seletor de Formato e Tom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">Formato Visual</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="story">9:16 Instagram Story / Reels</option>
                <option value="landscape">16:9 LinkedIn / Desktop</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">Tom do Copywriter IA</label>
              <select
                value={copyTone}
                onChange={(e) => setCopyTone(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="technical">Engenharia / Técnico</option>
                <option value="storytelling">Storytelling & Dor</option>
                <option value="direct">Direto / Lançamento</option>
              </select>
            </div>
          </div>

          {/* Gerador de Copy com IA */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-400">Deseja que os agentes criem a legenda?</span>
            <button
              onClick={handleGenerateCopy}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Copy com IA</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">Legenda do Post</label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A legenda do seu post gerada ou digitada..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm resize-none"
            />
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleSchedule}
            disabled={isSubmitting || !videoUrl}
            className="w-full mt-2 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Agendado com Sucesso no Buffer!</span>
              </>
            ) : isSubmitting ? (
              <span>Processando Envio...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Aprovar e Agendar no Buffer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coluna Direita: Mockup Preview Interativo */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 min-h-[500px]">
        {videoUrl ? (
          <MockupPlayer videoUrl={videoUrl} format={selectedFormat} title={projectTitle} />
        ) : (
          <div className="text-center text-zinc-500 p-8 flex flex-col items-center">
            <Video className="w-16 h-16 mb-4 opacity-40 text-zinc-600" />
            <p className="font-semibold text-zinc-400 mb-1">Nenhum vídeo carregado</p>
            <p className="text-xs max-w-xs">Arraste um vídeo na área ao lado para vê-lo instantaneamente dentro da moldura 3D do iPhone ou desktop.</p>
          </div>
        )}
      </div>
    </div>
  );
}
