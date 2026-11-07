"use client";

import React, { useState } from "react";
import { SocialPost } from "@/types/social";
import { Bot, Check, Play, ExternalLink, RefreshCw } from "lucide-react";
import { MockupPlayer } from "./MockupPlayer";
import confetti from "canvas-confetti";

interface AgentInboxProps {
  posts: SocialPost[];
  onApprovePost?: (id: string) => void;
}

export function AgentInbox({ posts, onApprovePost }: AgentInboxProps) {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(posts[0] || null);

  const handleApprove = (post: SocialPost) => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    if (onApprovePost) {
      onApprovePost(post.id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Lista de Vídeos Gerados pelos Agentes */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-lg">Vídeos Gerados Autonomamente</h2>
          </div>
          <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">
            {posts.length} disponíveis
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {posts.map((post) => {
            const isSelected = selectedPost?.id === post.id;
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                  isSelected
                    ? "bg-zinc-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                    : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-bold text-white text-base">{post.project}</h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                    {post.styleName}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs text-zinc-500 font-mono">
                  <span>DISPARO: {new Date(post.scheduledFor).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(post);
                      }}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition-all text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprovado</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview do Vídeo do Agente Selecionado */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 min-h-[500px]">
        {selectedPost ? (
          <div className="flex flex-col items-center w-full">
            <MockupPlayer videoUrl={selectedPost.videoUrl} format="story" title={selectedPost.project} />
            <div className="mt-6 text-center max-w-sm">
              <h4 className="font-bold text-white text-lg">{selectedPost.project}</h4>
              <p className="text-xs text-zinc-400 mt-1">{selectedPost.caption}</p>
              <a
                href={selectedPost.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 mt-3 font-mono"
              >
                <span>Abrir stream direto MP4</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Selecione um projeto para ver a reprodução.</p>
        )}
      </div>
    </div>
  );
}
