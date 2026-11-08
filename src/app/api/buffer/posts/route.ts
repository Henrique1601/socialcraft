import { NextResponse } from "next/server";
import { getValidBufferToken } from "@/lib/buffer-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId") || "6ad937ba778b240e2f820c1e"; // default LinkedIn

  const token = await getValidBufferToken();
  if (!token) {
    return NextResponse.json({
      success: false,
      posts: [],
      error: "Buffer Token indisponível"
    });
  }

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
          name: "list_posts",
          arguments: {
            organizationId: "6ad4d4c96f988628673c8964",
            channelId
          }
        }
      })
    });

    const data = await res.json();
    if (data?.result?.content?.[0]?.text) {
      const parsed = JSON.parse(data.result.content[0].text);
      const posts = (parsed.edges || []).map((e: any) => ({
        id: e.node.id,
        status: e.node.status,
        text: e.node.text,
        channelId: e.node.channelId,
        channelService: e.node.channelService,
        dueAt: e.node.dueAt,
        createdAt: e.node.createdAt,
        assets: e.node.assets || []
      }));

      return NextResponse.json({
        success: true,
        channelId,
        total: posts.length,
        posts
      });
    }

    return NextResponse.json({
      success: false,
      posts: [],
      error: data?.error?.message || "Erro ao consultar posts no Buffer"
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      posts: [],
      error: error.message
    });
  }
}
