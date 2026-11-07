import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Canais conhecidos caso a chamada ao MCP remoto falhe
const FALLBACK_CHANNELS = [
  {
    id: "6ad937ba778b240e2f820c1e",
    name: "henriquebezerra-dev",
    displayName: "Henrique Bezerra dos Santos",
    service: "linkedin",
    type: "profile",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHkmT1FWRjvNw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1683024007561?e=1794441600&v=beta&t=O3QLyIRsvBWjC5KkXFoqutK0AOf9K120sLwsamhpUlA"
  },
  {
    id: "6ad4dd35778b240e2f498bdb",
    name: "hbcompany.lab",
    displayName: "hbcompany.lab",
    service: "instagram",
    type: "business",
    avatar: "https://buffer-channel-avatars-bucket.s3.amazonaws.com/6ad4dd35778b240e2f498bdb_1792335157728"
  },
  {
    id: "6ad4d8ae778b240e2f496c70",
    name: "bezerra_sk8.exe",
    displayName: "bezerra_sk8.exe",
    service: "instagram",
    type: "business",
    avatar: "https://buffer-channel-avatars-bucket.s3.amazonaws.com/6ad4d8ae778b240e2f496c70_1792334166278"
  }
];

export async function GET() {
  const token = process.env.BUFFER_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      connected: false,
      channels: FALLBACK_CHANNELS,
      message: "BUFFER_ACCESS_TOKEN não configurado no ambiente, exibindo canais em modo fallback."
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
        id: 1,
        method: "tools/call",
        params: {
          name: "list_channels",
          arguments: {
            organizationId: "6ad4d4c96f988628673c8964"
          }
        }
      })
    });

    const data = await res.json();
    if (data?.result?.content?.[0]?.text) {
      const parsedChannels = JSON.parse(data.result.content[0].text);
      return NextResponse.json({
        connected: true,
        channels: parsedChannels
      });
    }

    return NextResponse.json({
      connected: true,
      channels: FALLBACK_CHANNELS
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      channels: FALLBACK_CHANNELS,
      error: error.message
    });
  }
}
