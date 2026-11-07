import { NextResponse } from "next/server";
import { generateSmartCopy } from "@/lib/copywriter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      project, 
      style = "terminal-cyber", 
      assetType = "video",
      targetChannels = [],
      schedulePreference = "ai-smart",
      customTime = null,
      autoPostToBuffer = true
    } = body;

    const projectName = typeof project === "object" ? project.name : (project || "Projeto");
    const projectDesc = typeof project === "object" ? project.desc : "Projeto de tecnologia e inovação";

    // 1. Gera Copywriting Otimizado
    const copyResult = generateSmartCopy(projectName, "technical");
    const headline = `🚀 Conheça o ${projectName}: ${projectDesc}`;
    const fullCaption = `${copyResult.caption}\n\nConfira todos os detalhes no GitHub ou teste agora mesmo!`;

    // 2. Determina Horário via IA (pico brasileiro 18h45 ou 12h15)
    let scheduledDate = new Date();
    scheduledDate.setHours(18, 45, 0, 0);
    if (scheduledDate.getTime() < Date.now()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      scheduledDate.setHours(12, 15, 0, 0);
    }

    if (schedulePreference === "custom" && customTime) {
      scheduledDate = new Date(customTime);
    }

    // 3. Monta o Asset Preview Interativo
    const assetUrl = assetType === "video"
      ? "/samples/promocraft-motion.html"
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";

    const job = {
      id: `job-${Date.now()}`,
      project: projectName,
      projectDesc,
      style,
      assetType,
      status: "completed",
      assetUrl,
      previewUrl: assetUrl,
      headline,
      copy: fullCaption,
      hashtags: copyResult.hashtags,
      targetChannels,
      scheduledTime: scheduledDate.toISOString(),
      schedulePreference,
      bufferStatus: autoPostToBuffer ? "synced-draft" : "pending_approval",
      createdAt: new Date().toISOString()
    };

    // 4. Se o usuário marcou autoPostToBuffer e há canais selecionados, dispara para o Buffer
    const token = process.env.BUFFER_ACCESS_TOKEN;
    const bufferResults = [];

    if (token && autoPostToBuffer && targetChannels.length > 0) {
      for (const channelId of targetChannels) {
        try {
          const res = await fetch("https://mcp.buffer.com/mcp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json, text/event-stream",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: Date.now(),
              method: "tools/call",
              params: {
                name: "create_post",
                arguments: {
                  channelId,
                  schedulingType: "automatic",
                  saveToDraft: true,
                  text: `${headline}\n\n${fullCaption}\n\n${copyResult.hashtags.join(" ")}`
                }
              }
            })
          });
          const mcpData = await res.json();
          if (mcpData?.result?.content?.[0]?.text) {
            bufferResults.push(JSON.parse(mcpData.result.content[0].text));
          }
        } catch (e) {
          console.error("Erro ao criar draft no Buffer para canal:", channelId, e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      job,
      bufferResults,
      message: `Asset criado com sucesso! Prévia interativa gerada e agendamento configurado.`
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
