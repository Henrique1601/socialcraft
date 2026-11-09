"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Send, 
  Sparkles, 
  Clock, 
  Flame, 
  RefreshCw,
  FolderGit2,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";

export function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-cyan-400" />
        <p className="text-xs font-mono">Carregando métricas e predições da IA...</p>
      </div>
    );
  }

  const { overview, topPerformingProjects, aiRecommendations } = data;

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-extrabold text-white text-xl">Analytics & Inteligência de Engajamento</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Métricas de esteira social, distribuição multicanal e recomendações preditivas
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="self-start sm:self-auto px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* Grid de 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono">PROJETOS INDEXADOS</span>
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{overview.totalIndexedProjects}</div>
          <div className="text-[11px] text-zinc-500 mt-2">
            {overview.localPCProjects} locais (PC) • {overview.githubRepos} no GitHub
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono">FILA ATIVA NO BUFFER</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{overview.totalPostsQueued}</div>
          <div className="text-[11px] text-zinc-500 mt-2">
            {overview.draftCount} rascunhos • {overview.scheduledCount} agendados
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono">ALCANCE ESTIMADO</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{overview.estimatedWeeklyReach}</div>
          <div className="text-[11px] text-zinc-500 mt-2">
            Multi-canal (LinkedIn + 2 Instagrams)
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono">CANAIS CONECTADOS</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{overview.activeChannels}</div>
          <div className="text-[11px] text-zinc-500 mt-2">
            LinkedIn & Instagram Business ativos
          </div>
        </div>
      </div>

      {/* Grid Duplo: Top Projetos para Postar & Recomendações da IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Top Projetos com Potencial Viral */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Projetos com Maior Potencial de Conversão</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Score IA</span>
          </div>

          <div className="flex flex-col gap-3">
            {topPerformingProjects.map((p: any, i: number) => (
              <div
                key={p.name}
                className="bg-zinc-950/70 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center font-bold">
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{p.name}</h4>
                    <p className="text-[11px] text-zinc-500 truncate">{p.category} • Melhor em: <span className="text-cyan-400">{p.bestChannel}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-zinc-500 block">HORÁRIO NOBRE</span>
                    <span className="text-xs text-zinc-300 font-semibold">{p.bestTime}</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                    {p.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Recomendações Táticas do Global Master Agent */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Diretrizes da IA de Engajamento</h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {aiRecommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                className="bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-2"
              >
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded w-fit">
                  {rec.tag}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {rec.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
