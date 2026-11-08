import { NextResponse } from "next/server";
import { generateSmartCopy } from "@/lib/copywriter";
import { getValidBufferToken } from "@/lib/buffer-auth";
import { getProjectAssets } from "@/lib/asset-catalog";

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

    // 3. Monta a URL de Prévia Visual Dinâmica
    const previewUrl = `/api/motion-preview?title=${encodeURIComponent(projectName)}&desc=${encodeURIComponent(projectDesc)}&style=${encodeURIComponent(style)}`;

    // 4. Resolve o arquivo binário real para o Buffer (Vídeo MP4 ou Imagem Mockup 3D)
    const assetBundle = getProjectAssets(projectName, style);
    const bufferMediaUrl = assetType === "video" 
      ? assetBundle.videoUrl 
      : assetBundle.mockup3DUrl;

    const job = {
      id: `job-${Date.now()}`,
      project: projectName,
      projectDesc,
      style,
      assetType,
      status: "completed",
      assetUrl: bufferMediaUrl,
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

    // 5. Dispara para o Buffer com o payload de assets cirurgicamente adaptado por rede social
    const token = await getValidBufferToken();
    const bufferResults = [];
    const bufferErrors = [];

    // Mapeamento de canal para determinar se é instagram ou linkedin
    const LINKEDIN_CHANNEL_IDS = ["6ad937ba778b240e2f820c1e"];

    if (token && autoPostToBuffer && targetChannels.length > 0) {
      for (const channelId of targetChannels) {
        try {
          const isLinkedIn = LINKEDIN_CHANNEL_IDS.includes(channelId);

          const postArgs: any = {
            channelId,
            schedulingType: "automatic",
            saveToDraft: true,
            text: `${headline}\n\n${fullCaption}\n\n${copyResult.hashtags.join(" ")}`
          };

          if (assetType === "video") {
            postArgs.assets = [
              {
                video: {
                  url: bufferMediaUrl,
                  metadata: {
                    title: `Vídeo Motion: ${projectName}`
                  }
                }
              }
            ];
            // Somente Instagram recebe metadata.instagram
            if (!isLinkedIn) {
              postArgs.metadata = {
                instagram: {
                  type: "reel",
                  shouldShareToFeed: true
                }
              };
            }
          } else {
            // Imagem Mockup 3D / Print 4K
            postArgs.assets = [
              {
                image: {
                  url: bufferMediaUrl,
                  metadata: {
                    altText: `Mockup 3D de alta resolução para ${projectName}`
                  }
                }
              }
            ];
            // Somente Instagram recebe metadata.instagram
            if (!isLinkedIn) {
              postArgs.metadata = {
                instagram: {
                  type: "post",
                  shouldShareToFeed: true
                }
              };
            }
          }

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
                arguments: postArgs
              }
            })
          });

          const mcpData = await res.json();
          if (mcpData?.result?.content?.[0]?.text) {
            const parsedResult = JSON.parse(mcpData.result.content[0].text);
            bufferResults.push(parsedResult);
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
        ? `Criado e enviado com mídia anexada (Vídeo/Mockup 3D) para ${bufferResults.length} canal(is) no Buffer!`
        : `Asset gerado com sucesso! Prévia renderizada.`
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
