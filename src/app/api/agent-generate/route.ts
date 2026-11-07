import { NextResponse } from "next/server";

// Simula a fila de comandos e geração que os agentes locais consomem
let agentGenerationJobs: Array<{
  id: string;
  project: string;
  style: string;
  assetType: "video" | "screenshot" | "carousel";
  status: "queued" | "generating" | "completed";
  createdAt: string;
  resultUrl?: string;
  resultThumb?: string;
  caption?: string;
}> = [
  {
    id: "job-1",
    project: "Job Hunter AI",
    style: "style_04_bento_grid",
    assetType: "video",
    status: "completed",
    createdAt: new Date().toISOString(),
    resultUrl: "https://quick-lavoisier.vercel.app/jobhunter_story_1080x1920.mp4",
    resultThumb: "https://quick-lavoisier.vercel.app/jobhunter_story_thumb.png",
    caption: "Job Hunter AI — Conquiste vagas internacionais com radar em tempo real e Job Matcher determinístico."
  },
  {
    id: "job-2",
    project: "DevSync",
    style: "style_06_terminal_cyber",
    assetType: "video",
    status: "completed",
    createdAt: new Date().toISOString(),
    resultUrl: "https://quick-lavoisier.vercel.app/devsync_story_1080x1920.mp4",
    resultThumb: "https://quick-lavoisier.vercel.app/devsync_story_thumb.png",
    caption: "DevSync — Sincronização Git P2P em tempo real entre computadores e resolução semântica de conflitos com IA."
  }
];

export async function GET() {
  return NextResponse.json({ success: true, jobs: agentGenerationJobs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project, style, assetType } = body;

    if (!project || !style) {
      return NextResponse.json(
        { success: false, error: "Projeto e estilo são obrigatórios." },
        { status: 400 }
      );
    }

    const newJob = {
      id: `job-${Date.now()}`,
      project,
      style,
      assetType: assetType || "video",
      status: "queued" as const,
      createdAt: new Date().toISOString()
    };

    agentGenerationJobs.unshift(newJob);

    return NextResponse.json({
      success: true,
      job: newJob,
      message: `Comando enviado aos agentes para criar ${assetType || "vídeo"} do projeto ${project}!`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
