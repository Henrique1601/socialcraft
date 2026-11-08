import { NextResponse } from "next/server";
import { generateSmartCopy } from "@/lib/copywriter";
import { getValidBufferToken } from "@/lib/buffer-auth";

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

    // 3. Monta o Asset Preview Interativo DINÂMICO com o nome e dados do projeto real
    const previewUrl = `/api/motion-preview?title=${encodeURIComponent(projectName)}&desc=${encodeURIComponent(projectDesc)}&style=${encodeURIComponent(style)}`;

    const job = {
      id: `job-${Date.now()}`,
      project: projectName,
      projectDesc,
      style,
      assetType,
      status: "completed",
      assetUrl: previewUrl,
      previewUrl: previewUrl,
      headline,
      copy: fullCaption,
      hashtags: copyResult.hashtags,
      targetChannels,
      scheduledTime: scheduledDate.toISOString(),
      schedulePreference,
      bufferStatus: autoPostToBuffer ? "synced-draft" : "pending_approval",
      createdAt: new Date().toISOString()
    };

    // 4. Se o usuário marcou autoPostToBuffer e há canais selecionados, dispara para o Buffer com token renovado
    const token = await getValidBufferToken();
    const bufferResults = [];
    const bufferErrors = [];

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
          } else if (mcpData?.error) {
            bufferErrors.push(mcpData.error);
          }
        } catch (e: any) {
          bufferErrors.push(e.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      job,
      bufferResults,
      bufferErrors,
      message: bufferResults.length > 0
        ? `Criado com sucesso e ${bufferResults.length} rascunho(s) enviado(s) ao Buffer!`
        : `Asset gerado com sucesso! Prévia dinâmica renderizada.`
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
