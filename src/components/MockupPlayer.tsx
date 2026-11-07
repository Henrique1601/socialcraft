"use client";

import React from "react";
import { Smartphone, Monitor } from "lucide-react";

interface MockupPlayerProps {
  videoUrl: string;
  format?: "story" | "landscape";
  title?: string;
}

export function MockupPlayer({ videoUrl, format = "story", title }: MockupPlayerProps) {
  if (format === "story") {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>MOCKUP IPHONE (9:16 STORY / REELS)</span>
        </div>
        {/* Phone Bezel */}
        <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] bg-zinc-950 border-[6px] border-zinc-800 rounded-[44px] shadow-2xl shadow-emerald-500/10 overflow-hidden ring-1 ring-white/10">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full"></div>
          </div>
          {/* Video element */}
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
        <Monitor className="w-4 h-4 text-cyan-400" />
        <span>MOCKUP DESKTOP (16:9 LINKEDIN / WEB)</span>
      </div>
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-zinc-400 truncate max-w-[200px]">{title || "SocialCraft Video"}</span>
          <div className="w-12"></div>
        </div>
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video object-contain bg-black"
        />
      </div>
    </div>
  );
}
