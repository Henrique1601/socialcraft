"use client";

import React from "react";
import { SocialPost } from "@/types/social";
import { Calendar as CalendarIcon, Clock, Share2, CheckCircle2 } from "lucide-react";

interface ScheduleCalendarProps {
  posts: SocialPost[];
}

export function ScheduleCalendar({ posts }: ScheduleCalendarProps) {
  // Ordena os posts pela data agendada
  const sorted = [...posts].sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-white text-lg">Esteira de Agendamentos & Buffer Queue</h2>
        </div>
        <span className="text-xs font-mono text-zinc-400">Total: {posts.length} postagens na fila</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((post, idx) => {
          const dateObj = new Date(post.scheduledFor);
          const dayStr = dateObj.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
          const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={post.id}
              className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{dayStr} às {timeStr}</span>
                  </span>
                  <div className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  {post.project}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {post.caption}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono text-[11px] truncate max-w-[140px]">
                  {post.styleName}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Buffer Ativo</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
