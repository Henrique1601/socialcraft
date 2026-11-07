"use client";

import React, { useState, useMemo } from "react";
import { 
  Bot, 
  Sparkles, 
  Camera, 
  Film, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Folder, 
  GitBranch, 
  Search, 
  ExternalLink,
  Laptop,
  Check
} from "lucide-react";
import { VIDEO_STYLES_CATALOG } from "@/data/posts";
import confetti from "canvas-confetti";
import allProjectsData from "@/data/projects.json";

interface AgentGeneratorStudioProps {
  onAssetDispatched?: (job: any) => void;
}

export function AgentGeneratorStudio({ onAssetDispatched }: AgentGeneratorStudioProps) {
  // Tabs de filtro: Todos, PC Local (87), GitHub (94)
  const [sourceFilter, setSourceFilter] = useState<"all" | "local" | "github">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lista unificada
  const allProjects = useMemo(() => {
    const list = [
      ...allProjectsData.local.map((p) => ({ ...p, isLocal: true })),
      ...allProjectsData.github.map((p) => ({ ...p, isLocal: false }))
    ];
    return list;
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesFilter =
        sourceFilter === "all" ||
        (sourceFilter === "local" && p.isLocal) ||
        (sourceFilter === "github" && !p.isLocal);

      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [allProjects, sourceFilter, searchQuery]);

  // Projeto selecionado
  const [selectedProject, setSelectedProject] = useState(allProjects[0]);
  const [selectedAssetType, setSelectedAssetType] = useState<"video" | "screenshot" | "carousel">("video");
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLES_CATALOG[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  const handleTriggerAgent = async () => {
    if (!selectedProject) return;

    setIsGenerating(true);
    setGenerationLogs([]);

    // Pipeline visual orquestrado pelo global-master-agent
    const logsSequence = [
      `[global-master-agent] Ordem recebida: criar ${selectedAssetType.toUpperCase()} para "${selectedProject.name}"...`,
      selectedProject.isLocal
        ? `[repo-scan] Conectando ao diretório local em ${selectedProject.source}...`
        : `[git-master-agent] Inspecionando repositório remoto: ${selectedProject.source}...`,
      `[memory-architect-agent] Resgatando contexto histórico de arquitetura e Segundo Cérebro...`,
      selectedAssetType === "screenshot"
        ? `[chrome-devtools-mcp] Iniciando Headless Browser, navegando em rotas e gerando prints 4K com molduras 3D...`
        : `[social-publisher-agent] Compilando Motion vertical 9:16 com o estilo "${selectedStyle}"...`,
      `[typesafe-ai] Gerando copy de alto impacto com gancho técnico e tags virais...`,
      `[video-producer-agent] Finalizando renderização a 60 FPS com áudio sintetizado...`,
      `[buffer-mcp] Asset gerado com sucesso e anexado à esteira de postagens!`
    ];

    for (let i = 0; i < logsSequence.length; i++) {
      await new Promise((res) => setTimeout(res, 800));
      setGenerationLogs((prev) => [...prev, logsSequence[i]]);
    }

    setIsGenerating(false);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });

    const jobResult = {
      id: `job-${Date.now()}`,
      project: selectedProject.name,
      projectSource: selectedProject.source,
      isLocal: selectedProject.isLocal,
      style: selectedStyle,
      assetType: selectedAssetType,
      status: "completed",
      createdAt: new Date().toISOString()
    };

    setActiveJob(jobResult);
    if (onAssetDispatched) {
      onAssetDispatched(jobResult);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna Esquerda: Seletor Completo com Busca Dinâmica */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-lg">Central de Criação dos Agentes</h2>
                <p className="text-xs text-zinc-400">Escolha qualquer projeto do seu PC ou GitHub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                {allProjects.length} PROJETOS INDEXADOS
              </span>
            </div>
          </div>

          {/* 1. Seleção do Projeto com Filtros e Busca */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                1. Escolha o Projeto ({filteredProjects.length})
              </label>
              
              {/* Filtro de Origem */}
              <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setSourceFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sourceFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Todos ({allProjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter("local")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    sourceFilter === "local" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  PC ({allProjectsData.local.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter("github")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    sourceFilter === "github" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  GitHub ({allProjectsData.github.length})
                </button>
              </div>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Pesquisar por nome do projeto (ex: devsync, promo, pdf, jm-motors)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Grid Scrollável de Projetos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredProjects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="mt-0.5">
                      {proj.isLocal ? (
                        <Folder className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-zinc-500"}`} />
                      ) : (
                        <GitBranch className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-white truncate">{proj.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          proj.isLocal ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {proj.isLocal ? "LOCAL" : "GIT"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">{proj.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Projeto Atualmente Selecionado - Indicador */}
            {selectedProject && (
              <div className="bg-zinc-950/80 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-cyan-400 font-mono font-bold">ALVO:</span>
                  <span className="text-white font-semibold truncate">{selectedProject.name}</span>
                  <span className="text-zinc-500 text-[11px] truncate hidden sm:inline">({selectedProject.source})</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] shrink-0">
                  <Check className="w-3.5 h-3.5" /> PRONTO
                </div>
              </div>
            )}
          </div>

          {/* 2. Tipo de Mídia a Criar */}
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2.5">
              2. O Que Você Quer Que os Agentes Criem?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedAssetType("video")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedAssetType === "video"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="text-xs font-bold">Vídeo Motion</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAssetType("screenshot")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedAssetType === "screenshot"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs font-bold">Prints 4K & Mockup</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAssetType("carousel")}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedAssetType === "carousel"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold">Carrossel Bento</span>
              </button>
            </div>
          </div>

          {/* 3. Escolha do Estilo do Vídeo */}
          {selectedAssetType === "video" && (
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2.5">
                3. Escolha o Estilo de Motion (10 Estilos dos Agentes)
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {VIDEO_STYLES_CATALOG.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — {st.desc.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botão de Disparo */}
          <button
            onClick={handleTriggerAgent}
            disabled={isGenerating || !selectedProject}
            className="w-full mt-1 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-cyan-500/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs sm:text-sm">Agentes Criando para {selectedProject?.name}...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span className="text-xs sm:text-sm">Disparar Criação com os Agentes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coluna Direita: Terminal HUD com Logs em Tempo Real da IA */}
      <div className="lg:col-span-5 flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-6 min-h-[500px] justify-between font-mono">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4 text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              LIVE AGENT TERMINAL
            </span>
            <span className="text-zinc-600">ANTIGRAVITY MESH</span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            {generationLogs.length === 0 ? (
              <div className="text-zinc-600 text-center py-20 flex flex-col items-center">
                <Bot className="w-12 h-12 mb-3 opacity-30 text-zinc-500" />
                <p className="font-semibold text-zinc-400">Aguardando comando de geração...</p>
                <p className="text-[11px] text-zinc-600 mt-1 max-w-xs leading-relaxed">
                  Busque e selecione qualquer um dos seus {allProjects.length} projetos (PC ou GitHub) para os agentes criarem os vídeos e capturas.
                </p>
              </div>
            ) : (
              generationLogs.map((log, index) => (
                <div key={index} className="text-zinc-300 leading-relaxed flex items-start gap-2">
                  <span className="text-cyan-400">❯</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {activeJob && !isGenerating && (
          <div className="mt-6 pt-4 border-t border-zinc-800/80 bg-zinc-900/50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Asset Gerado com Sucesso!</span>
            </div>
            <span className="text-[11px] text-zinc-400">Disponível em "Agentes Inbox"</span>
          </div>
        )}
      </div>
    </div>
  );
}
