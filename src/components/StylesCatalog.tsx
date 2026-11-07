"use client";

import React from "react";
import { VIDEO_STYLES_CATALOG } from "@/data/posts";
import { Sparkles, Film, ArrowRight } from "lucide-react";

export function StylesCatalog() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-white text-lg">Catálogo dos 10 Estilos de Vídeo do Social-Publisher-Agent</h2>
        </div>
        <span className="text-xs font-mono text-zinc-400">10 Prompts Parametrizados</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VIDEO_STYLES_CATALOG.map((st) => (
          <div
            key={st.id}
            className="bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{st.name}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>STATUS: DISPONÍVEL NO AGENTE</span>
              <span className="text-emerald-400 flex items-center gap-1">
                Prompt Pronto <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
