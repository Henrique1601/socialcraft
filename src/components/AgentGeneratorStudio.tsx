"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Check,
  Calendar,
  Clock,
  Share2,
  Eye,
  Maximize2,
  RefreshCw,
  Download,
  Edit3,
  CheckSquare,
  Square
} from "lucide-react";
import { VIDEO_STYLES_CATALOG } from "@/data/posts";
import confetti from "canvas-confetti";
import allProjectsData from "@/data/projects.json";
import { BentoCarouselViewer } from "@/components/BentoCarouselViewer";
import { generateBentoCarouselData } from "@/lib/carousel-generator";

interface Channel {
  id: string;
  name: string;
  displayName: string;
  service: "linkedin" | "instagram" | "twitter" | string;
  avatar: string;
}

interface AgentGeneratorStudioProps {
  onAssetDispatched?: (job: any) => void;
}

export function AgentGeneratorStudio({ onAssetDispatched }: AgentGeneratorStudioProps) {
  // Filtros de Projetos
  const [sourceFilter, setSourceFilter] = useState<"all" | "local" | "github">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lista de Projetos
  const allProjects = useMemo(() => {
    return [
      ...allProjectsData.local.map((p) => ({ ...p, isLocal: true })),
      ...allProjectsData.github.map((p) => ({ ...p, isLocal: false }))
    ];
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

  // Estados de Seleção
  const [selectedProject, setSelectedProject] = useState(allProjects[0]);
  const [selectedAssetType, setSelectedAssetType] = useState<"video" | "screenshot" | "carousel">("video");
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLES_CATALOG[0].id);

  // Canais Conectados (Buffer)
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);

  // Agendamento & Horário (IA Inteligente vs Manual)
  const [scheduleMode, setScheduleMode] = useState<"ai-smart" | "custom">("ai-smart");
  const [customDateTime, setCustomDateTime] = useState("");
  const [autoSyncBuffer, setAutoSyncBuffer] = useState(true);

  // Copiloto de Copywriting
  const [copyStyle, setCopyStyle] = useState<"technical" | "storytelling" | "direct">("technical");
  const [customCopyText, setCustomCopyText] = useState("");
  const [isEditingCopy, setIsEditingCopy] = useState(false);

  // Execução e Logs
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // Carrega os canais reais do Buffer
  useEffect(() => {
    async function loadChannels() {
      try {
        const res = await fetch("/api/buffer/channels");
        const data = await res.json();
        if (data.channels && data.channels.length > 0) {
          setAvailableChannels(data.channels);
          setSelectedChannelIds(data.channels.map((c: Channel) => c.id));
        }
      } catch (e) {
        console.error("Erro ao carregar canais do Buffer:", e);
      } finally {
        setIsLoadingChannels(false);
      }
    }
    loadChannels();
  }, []);

  const toggleChannel = (channelId: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  const handleTriggerAgent = async () => {
    if (!selectedProject) return;

    setIsGenerating(true);
    setGenerationLogs([]);
    setActiveJob(null);

    const logsSequence = [
      `[global-master-agent] Ordem recebida: criar ${selectedAssetType.toUpperCase()} para "${selectedProject.name}"...`,
      selectedProject.isLocal
        ? `[repo-scan] Inspecionando repositório local em ${selectedProject.source}...`
        : `[git-master-agent] Conectando ao repositório remoto: ${selectedProject.source}...`,
      `[memory-architect-agent] Carregando regras do Segundo Cérebro e decisões arquiteturais...`,
      selectedAssetType === "screenshot"
        ? `[chrome-devtools-mcp] Capturando telas em 4K Retina e aplicando molduras fotorrealistas 3D...`
        : `[social-publisher-agent] Montando Motion em código (GSAP/CSS3D) com estilo "${selectedStyle}"...`,
      `[typesafe-ai] Calibrando gancho de copywriting (${copyStyle.toUpperCase()}) de alta retenção e hashtags...`,
      scheduleMode === "ai-smart"
        ? `[growth-marketing-agent] Analisando pico de engajamento do público brasileiro: 18h45 selecionado!`
        : `[schedule-engine] Horário personalizado fixado para ${customDateTime || "horário escolhido"}`,
      autoSyncBuffer
        ? `[buffer-mcp] Anexando mídias (Vídeo MP4 / Mockup 3D) e enviando para ${selectedChannelIds.length} canal(is)...`
        : `[local-engine] Asset gerado na esteira interna para aprovação prévia.`,
      `[socialcraft-core] Concluído com sucesso! Player de prévia e rascunhos liberados no Buffer.`
    ];

    for (let i = 0; i < logsSequence.length; i++) {
      await new Promise((res) => setTimeout(res, 650));
      setGenerationLogs((prev) => [...prev, logsSequence[i]]);
    }

    try {
      const res = await fetch("/api/agent-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: selectedProject,
          style: selectedStyle,
          assetType: selectedAssetType,
          targetChannels: selectedChannelIds,
          schedulePreference: scheduleMode,
          customTime: customDateTime,
          customCopy: customCopyText || null,
          copyStyle,
          autoPostToBuffer: autoSyncBuffer
        })
      });

      const data = await res.json();
      if (data.success && data.job) {
        setActiveJob(data.job);
        setCustomCopyText(data.job.copy);
        if (onAssetDispatched) {
          onAssetDispatched(data.job);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna Esquerda: Painel de Controle e Parâmetros */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-lg">Central de Criação com IA</h2>
                <p className="text-xs text-zinc-400">Escolha projeto, formato, canais e agende no Buffer com mídias</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                {allProjects.length} PROJETOS
              </span>
            </div>
          </div>

          {/* 1. Escolha o Projeto com Busca e Filtros */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                1. Selecione o Projeto ({filteredProjects.length})
              </label>
              
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

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Pesquisar projetos (ex: devsync, promo, pdf, jm-motors)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredProjects.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
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
          </div>

          {/* 2. Formato & Estilo de Mídia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                2. Formato do Asset
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssetType("video")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAssetType === "video"
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span className="text-[11px]">Vídeo MP4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAssetType("screenshot")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAssetType === "screenshot"
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-[11px]">Mockup 3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAssetType("carousel")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAssetType === "carousel"
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px]">Bento</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                3. Estilo de Motion (10 Prompts)
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {VIDEO_STYLES_CATALOG.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Canais de Destino (Buffer Real) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                4. Onde Publicar / Agendar (Canais Buffer)
              </label>
              <span className="text-[10px] text-zinc-500">
                {selectedChannelIds.length} selecionado(s)
              </span>
            </div>

            {isLoadingChannels ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500 py-3">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando canais conectados...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {availableChannels.map((channel) => {
                  const isChecked = selectedChannelIds.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => toggleChannel(channel.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? "bg-purple-950/40 border-purple-500/80 text-white shadow-md shadow-purple-500/10"
                          : "bg-zinc-950/40 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-7 h-7 rounded-full object-cover border border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate text-white">
                            {channel.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                          {channel.service}
                        </span>
                      </div>
                      <div className="shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Copiloto de Copywriting: Ajuste de Tom & Edição */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>5. Tom de Copywriting por IA</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCopyStyle("technical")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    copyStyle === "technical" ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Técnico
                </button>
                <button
                  type="button"
                  onClick={() => setCopyStyle("storytelling")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    copyStyle === "storytelling" ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Storytelling
                </button>
                <button
                  type="button"
                  onClick={() => setCopyStyle("direct")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    copyStyle === "direct" ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Direto
                </button>
              </div>
            </div>

            {isEditingCopy ? (
              <textarea
                value={customCopyText}
                onChange={(e) => setCustomCopyText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                placeholder="Personalize a legenda antes de disparar..."
              />
            ) : (
              <div 
                onClick={() => setIsEditingCopy(true)}
                className="text-xs text-zinc-400 bg-zinc-900/60 p-2.5 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between"
              >
                <span className="truncate">{customCopyText || "Clique para personalizar a legenda do post..."}</span>
                <Edit3 className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2" />
              </div>
            )}
          </div>

          {/* 6. Horário da Postagem: IA vs Personalizado */}
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              6. Horário da Postagem
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScheduleMode("ai-smart")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  scheduleMode === "ai-smart"
                    ? "bg-amber-950/40 border-amber-500 text-amber-300"
                    : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">IA Escolhe Melhor Horário</div>
                  <div className="text-[10px] text-zinc-400">
                    Otimizado para pico no Brasil (18:45 ou 12:15)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScheduleMode("custom")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  scheduleMode === "custom"
                    ? "bg-cyan-950/40 border-cyan-500 text-cyan-300"
                    : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-white mb-0.5">Escolher Manualmente</div>
                  {scheduleMode === "custom" ? (
                    <input
                      type="datetime-local"
                      value={customDateTime}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                    />
                  ) : (
                    <div className="text-[10px] text-zinc-500">Defina dia e hora exatos</div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Disparo Automático ao Buffer */}
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-zinc-300">Anexar Mídia e Criar Rascunho Oficial no Buffer</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncBuffer}
                onChange={(e) => setAutoSyncBuffer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Botão de Disparo */}
          <button
            onClick={handleTriggerAgent}
            disabled={isGenerating || !selectedProject}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-cyan-500/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs sm:text-sm">Agentes Criando & Anexando no Buffer...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span className="text-xs sm:text-sm">Criar Vídeo/Prints & Enviar para o Buffer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coluna Direita: Player de Prévia Visual + Terminal HUD */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Bloco 1: Player de Prévia Visual do Vídeo Gerado */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>PRÉVIA VISUAL DO ASSET</span>
            </div>
            {activeJob && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {activeJob.isRealMotion ? "MOTION 9:16 REAL" : "RENDERIZADO"}
              </span>
            )}
          </div>

          {/* Visualizador Inteligente: Suporte a Carrossel Bento com Download PDF/PNG ou Motion Player */}
          {activeJob && activeJob.assetType === "carousel" ? (
            <BentoCarouselViewer 
              slides={activeJob.carouselSlides || generateBentoCarouselData(activeJob.project, activeJob.projectDesc || "")} 
              projectName={activeJob.project} 
            />
          ) : (
            <div className="relative aspect-[9/14] sm:aspect-video w-full bg-black rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center group shadow-2xl">
              {activeJob ? (
                <div className="w-full h-full relative">
                  {activeJob.previewUrl.endsWith(".html") || activeJob.previewUrl.includes("motion-preview") ? (
                    <iframe
                      src={activeJob.previewUrl}
                      className="w-full h-full border-0 pointer-events-auto"
                      title="Vídeo Motion Gerado"
                    />
                  ) : (
                    <img
                      src={activeJob.assetUrl}
                      alt="Mockup do Projeto"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <a
                      href={activeJob.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-black/70 hover:bg-black text-white p-2 rounded-xl backdrop-blur-md border border-zinc-700 transition-all"
                      title="Abrir em Tela Cheia"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </a>
                    <a
                      href={activeJob.assetUrl}
                      download={`socialcraft-${activeJob.project}.mp4`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-xl font-bold backdrop-blur-md transition-all flex items-center gap-1 text-xs"
                      title="Baixar Arquivo"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-600">
                  <Film className="w-12 h-12 mb-3 opacity-30 text-zinc-500" />
                  <p className="text-xs font-semibold text-zinc-400">Nenhum asset renderizado ainda</p>
                  <p className="text-[11px] text-zinc-600 mt-1 max-w-xs">
                    Quando os agentes finalizarem, o player interativo tocará a animação 9:16 ou o mockup 3D aqui.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dados de Agendamento do Buffer Confirmados */}
          {activeJob && (
            <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-mono text-[10px]">BUFFER STATUS:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado com Mídia
                </span>
              </div>
              <div className="text-[11px] text-zinc-300">
                <strong className="text-white">Horário Agendado:</strong> {new Date(activeJob.scheduledTime).toLocaleString("pt-BR")}
              </div>
              <div className="text-[11px] text-zinc-300">
                <strong className="text-white">Canais Ativos:</strong> {selectedChannelIds.length} redes selecionadas
              </div>
              <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800/80 mt-1 line-clamp-2">
                "{activeJob.headline}"
              </p>
            </div>
          )}
        </div>

        {/* Bloco 2: Terminal HUD dos Agentes */}
        <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl p-5 min-h-[220px] justify-between font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-3 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE AGENT TERMINAL
              </span>
              <span className="text-zinc-600">ANTIGRAVITY MESH</span>
            </div>

            <div className="flex flex-col gap-2 text-[11px]">
              {generationLogs.length === 0 ? (
                <div className="text-zinc-600 text-center py-6">
                  <Bot className="w-8 h-8 mb-2 mx-auto opacity-30 text-zinc-500" />
                  <p>Pronto para executar ordem de criação.</p>
                </div>
              ) : (
                generationLogs.map((log, index) => (
                  <div key={index} className="text-zinc-300 leading-relaxed flex items-start gap-1.5">
                    <span className="text-cyan-400">❯</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
