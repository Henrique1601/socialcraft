"use client";

import React, { useState, useEffect } from "react";
import { SocialPost } from "@/types/social";
import { Calendar as CalendarIcon, Clock, Share2, CheckCircle2, RefreshCw, Send, Layers, ExternalLink } from "lucide-react";

interface ScheduleCalendarProps {
  posts: SocialPost[];
}

export function ScheduleCalendar({ posts: initialPosts }: ScheduleCalendarProps) {
  const [activeTab, setActiveTab] = useState<"live-buffer" | "local">("live-buffer");
  const [bufferPosts, setBufferPosts] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState("6ad937ba778b240e2f820c1e"); // LinkedIn
  const [isLoading, setIsLoading] = useState(false);

  const channelsList = [
    { id: "6ad937ba778b240e2f820c1e", name: "LinkedIn (Henrique)", service: "linkedin" },
    { id: "6ad4dd35778b240e2f498bdb", name: "Instagram (hbcompany.lab)", service: "instagram" },
    { id: "6ad4d8ae778b240e2f496c70", name: "Instagram (bezerra_sk8)", service: "instagram" }
  ];

  const fetchBufferPosts = async (channelId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/buffer/posts?channelId=${channelId}`);
      const data = await res.json();
      if (data.success && data.posts) {
        setBufferPosts(data.posts);
      }
    } catch (e) {
      console.error("Erro ao buscar posts do Buffer:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBufferPosts(selectedChannel);
  }, [selectedChannel]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-lg">Esteira de Agendamentos & Buffer Live Queue</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Gerencie os posts reais agendados no Buffer ou na fila local</p>
        </div>

        {/* Alternador de Canais do Buffer */}
        <div className="flex items-center gap-2">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {channelsList.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchBufferPosts(selectedChannel)}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Atualizar fila do Buffer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <RefreshCw className="w-8 h-8 animate-spin mb-3 text-cyan-400" />
          <p className="text-xs">Consultando a API oficial do Buffer em tempo real...</p>
        </div>
      ) : bufferPosts.length === 0 ? (
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center">
          <Layers className="w-12 h-12 text-zinc-600 mb-3" />
          <h3 className="font-bold text-white text-base">Nenhum post na fila deste canal</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            Dispare uma criação na aba "Criar com IA" e marque este canal para vê-lo agendado aqui instantaneamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bufferPosts.map((post) => {
            const hasMedia = post.assets && post.assets.length > 0;
            const asset = hasMedia ? post.assets[0] : null;

            return (
              <div
                key={post.id}
                className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded flex items-center gap-1.5 uppercase">
                      <Clock className="w-3 h-3" />
                      <span>{post.status}</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {post.id.slice(-6)}
                    </span>
                  </div>

                  {/* Thumbnail do Asset Anexado se houver */}
                  {hasMedia && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-3 border border-zinc-800">
                      {asset.type === "video" ? (
                        <video
                          src={asset.source}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={asset.source}
                          alt="Asset"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                        {asset.type === "video" ? "VÍDEO MP4" : "MOCKUP 3D"}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                    {post.text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {post.channelService.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sincronizado</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
