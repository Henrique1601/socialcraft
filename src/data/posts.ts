import { SocialPost } from "@/types/social";

export const INITIAL_SCHEDULED_POSTS: SocialPost[] = [
  {
    id: "post-prospector-1",
    project: "Prospector CRM",
    title: "Lançamento Oficial: Prospector CRM",
    caption: "Prospector CRM — Domine seu pipeline B2B com velocidade instantânea, Kanban dinâmico e follow-ups inteligentes.",
    hashtags: ["#crm", "#b2b", "#sales", "#softwareengineering"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/prospector_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/prospector_story_thumb.png",
    styleName: "Cenas P&B Launch (Estilo 01)",
    scheduledFor: "2026-11-07T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-devquest-2",
    project: "DevQuest",
    title: "Aprenda Codando na Prática",
    caption: "DevQuest — Aprenda programação resolvendo desafios reais na prática com gamificação, XP e trilhas de carreira.",
    hashtags: ["#dev", "#programming", "#coding", "#gamification"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/devquest_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/devquest_story_thumb.png",
    styleName: "Gamificação & Code (Estilo 01)",
    scheduledFor: "2026-11-08T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-omnipdf-3",
    project: "OmniPDF Studio",
    title: "Sua Suíte Desktop 100% Offline",
    caption: "OmniPDF Studio — A mais completa e privada suíte de PDF para Windows com TrueEdit, OCR offline e Inteligência Artificial. Seus arquivos nunca saem da sua máquina.",
    hashtags: ["#pdf", "#software", "#desktop", "#privacy", "#productivity"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/omnipdf_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/omnipdf_story_thumb.png",
    styleName: "Productivity & Privacy (Estilo 01)",
    scheduledFor: "2026-11-09T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-jobhunter-4",
    project: "Job Hunter AI",
    title: "Radar Inteligente de Vagas Internacionais",
    caption: "Job Hunter AI — Conquiste vagas internacionais com radar em tempo real e Job Matcher determinístico (score 0 a 100).",
    hashtags: ["#ai", "#jobs", "#careers", "#remotework", "#developer"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/jobhunter_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/jobhunter_story_thumb.png",
    styleName: "Dashboard & Radar Glass (Estilo 04)",
    scheduledFor: "2026-11-10T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-devsync-5",
    project: "DevSync",
    title: "Git P2P em Alta Velocidade",
    caption: "DevSync — Sincronização Git P2P em tempo real entre computadores e resolução semântica de conflitos com IA.",
    hashtags: ["#git", "#devtools", "#programming", "#opensource"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/devsync_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/devsync_story_thumb.png",
    styleName: "Terminal Cyber / Code Flow (Estilo 06)",
    scheduledFor: "2026-11-11T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-hackercraft-6",
    project: "HackerCraft",
    title: "Laboratório de Pentest & Defesa Web",
    caption: "HackerCraft — Laboratório prático de cibersegurança ofensiva, simulações de invasão controlada e auditoria OWASP.",
    hashtags: ["#cybersecurity", "#infosec", "#redteam", "#ethicalhacking"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/hackercraft_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/hackercraft_story_thumb.png",
    styleName: "POV / Hands-on Live Action (Estilo 02)",
    scheduledFor: "2026-11-12T15:00:00.000Z",
    source: "agent"
  },
  {
    id: "post-fotohidro-7",
    project: "FotoHidro PWA",
    title: "Vistoria Predial 100% Offline",
    caption: "FotoHidro PWA — Vistoria predial e captura fotográfica de alta definição 100% offline em subsolos, com download organizado por sala em 1 clique.",
    hashtags: ["#pwa", "#mobile", "#offlinefirst", "#engineering"],
    platform: "instagram",
    status: "scheduled",
    videoUrl: "https://quick-lavoisier.vercel.app/fotohidro_story_1080x1920.mp4",
    thumbnailUrl: "https://quick-lavoisier.vercel.app/fotohidro_story_thumb.png",
    styleName: "Mobile Utility (Estilo 05)",
    scheduledFor: "2026-11-13T15:00:00.000Z",
    source: "agent"
  }
];

export const VIDEO_STYLES_CATALOG = [
  { id: "style_01_cinematic_teaser", name: "01. Cinematic Apple Teaser", desc: "Minimalista P&B, blur contínuo, revelação palavra por palavra e logo solene." },
  { id: "style_02_pov_hands_on", name: "02. POV / Hands-on Live Action", desc: "Cursor do mouse se movendo e clicando em tempo real na tela do app com zoom suave." },
  { id: "style_03_before_after", name: "03. Split-Screen Before vs. After", desc: "Tela dividida com o caos manual vs. a solução automática em 1 segundo." },
  { id: "style_04_bento_grid", name: "04. Bento Grid Dinâmico", desc: "Mosaico estilo Apple/Linear com quadrantes que acendem e focam uma feature por vez." },
  { id: "style_05_micro_feature", name: "05. Micro-Feature Deep Dive", desc: "Câmera macro lenta com foco absoluto em uma microinteração de UI/UX de alto padrão." },
  { id: "style_06_terminal_cyber", name: "06. Terminal Cyber / Code Flow", desc: "Janela hacker/DevOps com comandos sendo digitados, git diffs e scanlines CRT." },
  { id: "style_07_interactive_3d", name: "07. Interactive 3D Perspective Tilt", desc: "Mockup 3D flutuando em ângulo isométrico com física de vidro líquido e reflexos." },
  { id: "style_08_kinetic_text", name: "08. High-Retention Kinetic Typography", desc: "Palavras gigantes animadas no centro no ritmo para alta retenção em Reels." },
  { id: "style_09_pain_to_relief", name: "09. Pain-to-Relief Storytelling", desc: "Alerta vermelho de estresse e erro que transiciona para a clareza e alívio do software." },
  { id: "style_10_satisfying_loop", name: "10. Satisfying Workflow Loop", desc: "Fluxo ponta a ponta perfeito que faz um loop contínuo e hipnótico." }
];
