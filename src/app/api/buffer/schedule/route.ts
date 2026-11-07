import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = process.env.BUFFER_ACCESS_TOKEN;

  try {
    const body = await request.json();
    const { channelId, text, assetUrl, dueAt, mode = "addToQueue", saveToDraft = true } = body;

    if (!channelId || !text) {
      return NextResponse.json(
        { error: "channelId e text são obrigatórios" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Buffer Access Token ausente. Agendamento simulado com sucesso na fila local!",
        post: {
          id: `sim-${Date.now()}`,
          channelId,
          text,
          status: saveToDraft ? "draft" : "scheduled",
          dueAt: dueAt || new Date(Date.now() + 3600000).toISOString()
        }
      });
    }

    // Monta os argumentos para o MCP create_post
    const args: any = {
      channelId,
      schedulingType: "automatic",
      text,
      saveToDraft,
      mode
    };

    if (dueAt && mode === "customScheduled") {
      args.dueAt = dueAt;
    }

    // Se houver asset (imagem/vídeo público)
    if (assetUrl && assetUrl.startsWith("http")) {
      if (assetUrl.endsWith(".mp4") || assetUrl.includes("video")) {
        args.assets = [
          {
            video: {
              url: assetUrl,
              metadata: {
                title: "Post gerado pelo SocialCraft"
              }
            }
          }
        ];
      } else {
        args.assets = [
          {
            image: {
              url: assetUrl,
              metadata: {
                altText: "Visual gerado pelo SocialCraft"
              }
            }
          }
        ];
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
          arguments: args
        }
      })
    });

    const data = await res.json();
    if (data?.result?.content?.[0]?.text) {
      const createdPost = JSON.parse(data.result.content[0].text);
      return NextResponse.json({
        success: true,
        realBuffer: true,
        post: createdPost,
        message: saveToDraft ? "Rascunho criado com sucesso no Buffer!" : "Post agendado com sucesso no Buffer!"
      });
    }

    return NextResponse.json({
      success: false,
      error: data?.error?.message || "Erro desconhecido ao agendar no Buffer",
      raw: data
    }, { status: 500 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
