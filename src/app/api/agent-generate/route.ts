import { NextResponse } from "next/server";
import { generateSmartCopy } from "@/lib/copywriter";
import { getValidBufferToken } from "@/lib/buffer-auth";
import { getProjectAssets } from "@/lib/asset-catalog";
import { getProjectMotionUrl } from "@/data/real-motions";
import { generateBentoCarouselData } from "@/lib/carousel-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      project, 
      style = "style_02_pov_hands_on", 
      assetType = "video",
      liveUrl = null,
      targetChannels = [],
      schedulePreference = "ai-smart",
      customTime = null,
      customCopy = null,
      copyStyle = "technical",
      autoPostToBuffer = true,
      publishMode = "addToQueue"
    } = body;

    const projectName = typeof project === "object" ? project.name : (project || "Projeto");
    const projectDesc = typeof project === "object" ? project.desc : "Projeto de tecnologia e inovação";
    const resolvedLiveUrl = liveUrl || (typeof project === "object" && project.source?.startsWith("http") ? project.source : null);

    // 1. Gera Copywriting Otimizado (ou usa o customizado se o usuário editou na tela)
    const copyResult = generateSmartCopy(projectName, copyStyle as any);
    const headline = `🚀 Conheça o ${projectName}: ${projectDesc}`;
    const fullCaption = customCopy || `${copyResult.caption}\n\nConfira todos os detalhes no GitHub ou teste agora mesmo!`;

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

    // 3. Verifica URLs de Prévia (Motion, Carrossel Bento ou Mockup)
    const realMotionPath = getProjectMotionUrl(projectName);
    let previewUrl = `/api/motion-preview?title=${encodeURIComponent(projectName)}&desc=${encodeURIComponent(projectDesc)}&style=${encodeURIComponent(style)}`;

    if (assetType === "carousel") {
      previewUrl = `/api/bento-carousel?title=${encodeURIComponent(projectName)}&desc=${encodeURIComponent(projectDesc)}`;
    } else if (realMotionPath) {
      previewUrl = realMotionPath;
    }

    // Gera dados dos slides caso seja carrossel
    const carouselSlides = assetType === "carousel" ? generateBentoCarouselData(projectName, projectDesc) : null;

    // 4. Resolve o arquivo real para o Buffer (MP4 real do projeto ou captura real da tela)
    const assetBundle = getProjectAssets(projectName, style, resolvedLiveUrl);
    const useVideoForBuffer = assetType === "video" && assetBundle.hasRealMp4 && !!assetBundle.videoUrl;
    const bufferMediaUrl = useVideoForBuffer ? assetBundle.videoUrl! : assetBundle.mockup3DUrl;

    // 5. Dispara para o Buffer com status 100% honesto
    const token = await getValidBufferToken();
    const bufferResults: any[] = [];
    const bufferErrors: string[] = [];

    const LINKEDIN_CHANNEL_IDS = ["6ad937ba778b240e2f820c1e"];

    if (autoPostToBuffer && targetChannels.length > 0) {
      if (!token) {
        bufferErrors.push("Token do Buffer ausente ou expirado (401). Conecte seu token no topo do painel.");
      } else {
        for (const channelId of targetChannels) {
          try {
            const isLinkedIn = LINKEDIN_CHANNEL_IDS.includes(channelId);
            const saveToDraft = publishMode === "draft";
            const mode = publishMode === "shareNow" ? "shareNow" : "addToQueue";

            const postArgs: any = {
              channelId,
              schedulingType: "automatic",
              saveToDraft,
              mode,
              text: `${headline}\n\n${fullCaption}\n\n${copyResult.hashtags.join(" ")}`
            };

            if (useVideoForBuffer) {
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
              if (!isLinkedIn) {
                postArgs.metadata = {
                  instagram: {
                    type: "reel",
                    shouldShareToFeed: true
                  }
                };
              }
            } else {
              postArgs.assets = [
                {
                  image: {
                    url: bufferMediaUrl,
                    metadata: {
                      altText: `Captura e Mockup para ${projectName}`
                    }
                  }
                }
              ];
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

            if (!res.ok) {
              const errText = await res.text();
              bufferErrors.push(`HTTP ${res.status} no canal ${channelId}: ${errText.slice(0, 140)}`);
              continue;
            }

            const mcpData = await res.json();
            if (mcpData?.result?.content?.[0]?.text) {
              const parsedResult = JSON.parse(mcpData.result.content[0].text);
              bufferResults.push(parsedResult);
            } else if (mcpData?.error) {
              bufferErrors.push(mcpData.error.message || JSON.stringify(mcpData.error));
            } else {
              bufferErrors.push(`Resposta inesperada do Buffer para o canal ${channelId}`);
            }
          } catch (e: any) {
            bufferErrors.push(e.message);
          }
        }
      }
    }

    let finalBufferStatus = "local_only";
    if (autoPostToBuffer && targetChannels.length > 0) {
      if (bufferResults.length > 0 && bufferErrors.length === 0) {
        finalBufferStatus = publishMode === "draft" ? "synced-draft" : "synced-queued";
      } else if (bufferResults.length > 0) {
        finalBufferStatus = "partial";
      } else {
        finalBufferStatus = "error";
      }
    }

    const job = {
      id: `job-${Date.now()}`,
      project: projectName,
      projectDesc,
      liveUrl: resolvedLiveUrl,
      style,
      assetType,
      status: "completed",
      assetUrl: bufferMediaUrl,
      screenshotUrl: assetBundle.screenshotUrl,
      hasRealMp4: assetBundle.hasRealMp4,
      previewUrl: previewUrl,
      carouselSlides,
      isRealMotion: !!realMotionPath && assetType === "video",
      headline,
      copy: fullCaption,
      hashtags: copyResult.hashtags,
      targetChannels,
      scheduledTime: scheduledDate.toISOString(),
      schedulePreference,
      bufferStatus: finalBufferStatus,
      bufferErrorMessage: bufferErrors.length > 0 ? bufferErrors.join(" | ") : null,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      job,
      bufferResults,
      bufferErrors,
      message:
        bufferResults.length > 0
          ? `Enviado com sucesso para ${bufferResults.length} canal(is) no Buffer!`
          : bufferErrors.length > 0
          ? `Asset gerado, mas falhou ao enviar para o Buffer: ${bufferErrors[0]}`
          : `Asset gerado com sucesso! Prévia pronta.`
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
