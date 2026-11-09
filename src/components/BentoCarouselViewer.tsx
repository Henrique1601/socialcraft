"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Loader2, 
  Copy, 
  Maximize2,
  Terminal,
  Share2
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import { BentoSlide } from "@/lib/carousel-generator";

interface BentoCarouselViewerProps {
  slides: BentoSlide[];
  projectName: string;
}

export function BentoCarouselViewer({ slides, projectName }: BentoCarouselViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Refs para capturar os slides na resolução exata de 1080x1080 (1:1 padrão LinkedIn e Instagram)
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Exportar o Slide Atual em PNG 1080x1080
  const handleExportCurrentPng = async () => {
    if (!activeSlideRef.current) return;
    setIsExportingPng(true);

    try {
      const canvas = await html2canvas(activeSlideRef.current, {
        scale: 2, // 2x para Retina Display
        useCORS: true,
        backgroundColor: "#030712"
      });

      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `${projectName.toLowerCase()}-slide-${currentSlideIndex + 1}.png`;
      a.click();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error("Erro ao gerar PNG:", err);
    } finally {
      setIsExportingPng(false);
    }
  };

  // Exportar Todos os Slides em um documento PDF perfeito para o LinkedIn Carousel
  const handleExportFullPdf = async () => {
    if (!slidesContainerRef.current) return;
    setIsExportingPdf(true);

    try {
      const slideElements = slidesContainerRef.current.querySelectorAll<HTMLDivElement>(".bento-slide-render");
      if (slideElements.length === 0) return;

      // Cria PDF quadrado (1080 x 1080 pt)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [1080, 1080]
      });

      for (let i = 0; i < slideElements.length; i++) {
        const slideEl = slideElements[i];
        const canvas = await html2canvas(slideEl, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#030712"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) {
          pdf.addPage([1080, 1080], "portrait");
        }
        pdf.addImage(imgData, "JPEG", 0, 0, 1080, 1080);
      }

      pdf.save(`${projectName.toLowerCase()}-carrossel-linkedin.pdf`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Topbar com Ações de Download e Navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {projectName} // Bento Carousel
          </span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
            Slide {currentSlideIndex + 1} de {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Baixar Slide PNG */}
          <button
            type="button"
            onClick={handleExportCurrentPng}
            disabled={isExportingPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Baixar este slide em alta resolução PNG"
          >
            {isExportingPng ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Baixar PNG</span>
          </button>

          {/* Botão Baixar Carrossel Completo em PDF para LinkedIn */}
          <button
            type="button"
            onClick={handleExportFullPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
            title="Gera PDF 1080x1080 pronto para arrastar no LinkedIn"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-black" />
            )}
            <span>Exportar PDF LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Visualizador do Slide Ativo (Preview Interativo) */}
      <div className="relative w-full max-w-xl mx-auto aspect-square bg-[#030712] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-8 ring-1 ring-white/10 group">
        <div 
          ref={activeSlideRef} 
          className="w-full h-full flex flex-col justify-between"
        >
          {/* Cabeçalho do Slide */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              {currentSlide.badge}
            </span>
            <span className="font-mono text-[11px] text-zinc-500 tracking-wider">
              SOCIALCRAFT // SUITE
            </span>
          </div>

          {/* Conteúdo Central */}
          <div className="flex flex-col gap-4 my-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-cyan-300 leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {currentSlide.subtitle}
            </p>

            {/* Lista Bento de Destaques */}
            <div className="flex flex-col gap-2 mt-2">
              {currentSlide.highlights.map((h, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2.5 bg-zinc-900/70 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-zinc-200 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0" />
                  <span className="font-medium">{h}</span>
                </div>
              ))}
            </div>

            {/* Snippet de Terminal (se houver) */}
            {currentSlide.terminalSnippet && (
              <div className="mt-2 bg-black/90 border border-zinc-800 rounded-xl p-3 font-mono text-[11px] text-cyan-300 flex items-center gap-2 overflow-x-auto">
                <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{currentSlide.terminalSnippet}</span>
              </div>
            )}

            {/* Banner CTA (se houver) */}
            {currentSlide.ctaText && (
              <div className="mt-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 rounded-xl p-3 text-xs font-bold text-center text-white">
                {currentSlide.ctaText}
              </div>
            )}
          </div>

          {/* Rodapé do Slide */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSlideIndex 
                      ? "w-6 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" 
                      : "w-2 bg-zinc-700 cursor-pointer"
                  }`}
                  onClick={() => setCurrentSlideIndex(i)}
                />
              ))}
            </div>
            <span className="text-cyan-400">
              {currentSlideIndex + 1} de {slides.length}
            </span>
          </div>
        </div>

        {/* Setas de Navegação Sobrepostas */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-900/90 border border-zinc-700 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 disabled:opacity-20 cursor-pointer transition-all shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-900/90 border border-zinc-700 text-white flex items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 disabled:opacity-20 cursor-pointer transition-all shadow-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Renderizador Oculto em Alta Resolução (1080x1080) para exportação em PDF de Todos os Slides */}
      <div 
        ref={slidesContainerRef} 
        className="fixed -left-[9999px] top-0 flex flex-col"
        aria-hidden="true"
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className="bento-slide-render w-[1080px] h-[1080px] p-[80px] bg-[#030712] text-white flex flex-col justify-between"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 10%, rgba(6, 182, 212, 0.18), transparent 65%), radial-gradient(circle at 80% 90%, rgba(16, 185, 129, 0.12), transparent 55%), #030712",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-8">
              <span className="font-mono text-2xl font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/40 px-6 py-2.5 rounded-full">
                {slide.badge}
              </span>
              <span className="font-mono text-xl text-zinc-500 tracking-widest">
                SOCIALCRAFT // CAROUSEL
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-8 my-auto">
              <h2 className="text-6xl font-black text-white leading-tight">
                {slide.title}
              </h2>
              <p className="text-2xl text-zinc-300 leading-relaxed font-normal max-w-4xl">
                {slide.subtitle}
              </p>

              <div className="flex flex-col gap-4 mt-4">
                {slide.highlights.map((h, hIdx) => (
                  <div 
                    key={hIdx}
                    className="flex items-center gap-4 bg-zinc-900/90 border border-white/10 rounded-2xl px-6 py-4 text-2xl text-zinc-100"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {slide.terminalSnippet && (
                <div className="mt-4 bg-black/95 border border-zinc-800 rounded-2xl p-6 font-mono text-xl text-cyan-300">
                  {slide.terminalSnippet}
                </div>
              )}

              {slide.ctaText && (
                <div className="mt-4 bg-gradient-to-r from-cyan-500/25 to-emerald-500/25 border border-cyan-500/50 rounded-2xl p-6 text-2xl font-bold text-center text-white">
                  {slide.ctaText}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-8 font-mono text-xl text-zinc-500">
              <span>DESLIZE PARA O LADO ❯</span>
              <span className="text-cyan-400 font-bold">{idx + 1} de {slides.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
