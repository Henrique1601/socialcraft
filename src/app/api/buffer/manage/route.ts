import { NextResponse } from "next/server";
import { getValidBufferToken } from "@/lib/buffer-auth";

export async function POST(request: Request) {
  const token = await getValidBufferToken();
  if (!token) {
    return NextResponse.json({ success: false, error: "Buffer Token indisponível" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, postId, channelId, text, dueAt } = body;

    if (!postId && action !== "bulk_delete") {
      return NextResponse.json({ success: false, error: "postId é obrigatório" }, { status: 400 });
    }

    // 1. AÇÃO: EXCLUIR POST
    if (action === "delete") {
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
            name: "delete_post",
            arguments: { postId }
          }
        })
      });

      const data = await res.json();
      return NextResponse.json({
        success: !data.error,
        action: "delete",
        postId,
        data
      });
    }

    // 2. AÇÃO: PUBLICAR AGORA (shareNow)
    if (action === "share_now") {
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
            name: "edit_post",
            arguments: {
              postId,
              mode: "shareNow"
            }
          }
        })
      });

      const data = await res.json();
      return NextResponse.json({
        success: !data.error,
        action: "share_now",
        postId,
        data
      });
    }

    // 3. AÇÃO: EDITAR TEXTO OU REAGENDAR
    if (action === "update") {
      const editArgs: any = { postId };
      if (text) editArgs.text = text;
      if (dueAt) {
        editArgs.mode = "customScheduled";
        editArgs.dueAt = dueAt;
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
            name: "edit_post",
            arguments: editArgs
          }
        })
      });

      const data = await res.json();
      return NextResponse.json({
        success: !data.error,
        action: "update",
        postId,
        data
      });
    }

    return NextResponse.json({ success: false, error: "Ação não suportada" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
