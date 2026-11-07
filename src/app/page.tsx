"use client";

import React, { useState } from "react";
import { INITIAL_SCHEDULED_POSTS } from "@/data/posts";
import { SocialPost } from "@/types/social";
import { DropzoneStudio } from "@/components/DropzoneStudio";
import { AgentInbox } from "@/components/AgentInbox";
import { AgentGeneratorStudio } from "@/components/AgentGeneratorStudio";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { StylesCatalog } from "@/components/StylesCatalog";
import { Bot, UploadCloud, Calendar as CalendarIcon, Film, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"create_agents" | "studio" | "inbox" | "calendar" | "styles">("create_agents");
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SCHEDULED_POSTS);

  const handlePostCreated = (newPost: SocialPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab("calendar");
  };

  const handleAssetDispatched = (job: any) => {
    const newPost: SocialPost = {
      id: `post-gen-${Date.now()}`,
      project: job.project,
      title: `Lançamento: ${job.project}`,
      caption: `${job.project} — Apresentação completa e demonstração prática desenvolvida pelos agentes com engenharia de alto padrão.`,
      hashtags: ["#buildinpublic", "#softwareengineering", "#innovation", "#tech"],
      platform: "instagram",
      status: "scheduled",
      videoUrl: "https://quick-lavoisier.vercel.app/devsync_story_1080x1920.mp4",
      thumbnailUrl: "https://quick-lavoisier.vercel.app/devsync_story_thumb.png",
      styleName: job.style || "Estilo 06: Terminal Cyber",
      scheduledFor: new Date(Date.now() + 86400000 * 3).toISOString(),
      source: "agent"
    };

    setPosts([newPost, ...posts]);
  };

  const navItems = [
    { id: "create_agents", label: "Criar com IA", icon: Sparkles, color: "text-cyan-400", badge: true },
    { id: "studio", label: "Meu Upload", icon: UploadCloud, color: "text-emerald-400", badge: false },
    { id: "inbox", label: "Galeria Agentes", icon: Bot, color: "text-purple-400", badge: false },
    { id: "calendar", label: "Agenda Buffer", icon: CalendarIcon, color: "text-amber-400", badge: false },
    { id: "styles", label: "10 Estilos", icon: Film, color: "text-pink-400", badge: false },
  ] as const;

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar Desktop & Header Mobile */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-black text-lg sm:text-xl shadow-lg shadow-cyan-500/20">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight flex items-center gap-2">
              SocialCraft <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-full font-bold">STUDIO</span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Painel de Criação e Lançamento de Mídia dos Agentes</p>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-white shadow-md shadow-black/50"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
                {item.badge && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </button>
            );
          })}
        </nav>

        {/* Status Mobile indicator */}
        <div className="md:hidden flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>AGENTS ONLINE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {activeTab === "create_agents" && <AgentGeneratorStudio onAssetDispatched={handleAssetDispatched} />}
        {activeTab === "studio" && <DropzoneStudio onPostCreated={handlePostCreated} />}
        {activeTab === "inbox" && <AgentInbox posts={posts} />}
        {activeTab === "calendar" && <ScheduleCalendar posts={posts} />}
        {activeTab === "styles" && <StylesCatalog />}
      </main>

      {/* Mobile Bottom Navigation Bar (Estilo App Nativo) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-zinc-400"}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950"></span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight truncate max-w-[65px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Desktop */}
      <footer className="hidden md:flex border-t border-zinc-900 px-6 py-6 text-center text-xs text-zinc-500 font-mono items-center justify-between max-w-7xl mx-auto w-full">
        <div>SOCIALCRAFT STUDIO &bull; HB COMPANY 2026</div>
        <div>MESA DIRETORA: GLOBAL-MASTER-AGENT &bull; SOCIAL-PUBLISHER-AGENT</div>
      </footer>
    </div>
  );
}
