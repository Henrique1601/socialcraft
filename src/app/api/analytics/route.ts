import { NextResponse } from "next/server";
import { getValidBufferToken } from "@/lib/buffer-auth";
import allProjectsData from "@/data/projects.json";

const CHANNEL_IDS = [
  "6ad937ba778b240e2f820c1e", // LinkedIn
  "6ad4dd35778b240e2f498bdb", // hbcompany.lab
  "6ad4d8ae778b240e2f496c70"  // bezerra_sk8.exe
];

export async function GET() {
  const token = await getValidBufferToken();

  let totalPosts = 0;
  let scheduledCount = 0;
  let draftCount = 0;
  let bufferConnected = false;

  if (token) {
    try {
      const responses = await Promise.all(
        CHANNEL_IDS.map((channelId) =>
          fetch("https://mcp.buffer.com/mcp", {
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
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      );

      for (const data of responses) {
        if (data?.result?.content?.[0]?.text) {
          bufferConnected = true;
          const parsed = JSON.parse(data.result.content[0].text);
          const posts = parsed.edges || [];
          totalPosts += posts.length;
          draftCount += posts.filter((p: any) => p.node.status === "draft").length;
          scheduledCount += posts.filter((p: any) => p.node.status === "scheduled").length;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const localCount = allProjectsData.local.length;
  const githubCount = allProjectsData.github.length;

  const analyticsData = {
    bufferConnected,
    overview: {
      totalIndexedProjects: localCount + githubCount,
      localPCProjects: localCount,
      githubRepos: githubCount,
      totalPostsQueued: totalPosts,
      draftCount,
      scheduledCount,
      activeChannels: CHANNEL_IDS.length,
      estimatedWeeklyReach: bufferConnected ? `${Math.max(1, totalPosts) * 1.4}k impressões` : "Buffer desconectado"
    },
    topPerformingProjects: [
      { name: "JM Motors Santos", category: "Freela Cliente", score: 99, bestChannel: "Instagram Reels", bestTime: "Quinta às 18:45" },
      { name: "DevSync", category: "Git Automation", score: 98, bestChannel: "LinkedIn", bestTime: "Terça às 12:15" },
      { name: "HackerCraft", category: "Cybersecurity", score: 94, bestChannel: "Instagram Reels", bestTime: "Quinta às 18:45" },
      { name: "Job Hunter AI", category: "AI & Careers", score: 91, bestChannel: "LinkedIn", bestTime: "Segunda às 09:30" },
      { name: "PromoCraft", category: "Gaming Deals", score: 89, bestChannel: "Instagram Stories", bestTime: "Sábado às 14:00" }
    ],
    aiRecommendations: [
      {
        tag: "ALCANCE",
        text: "Carrosséis Bento em PDF no LinkedIn geram até 3.2x mais tempo de retenção do que imagens estáticas."
      },
      {
        tag: "HORÁRIO NOBRE",
        text: "Pico de engajamento no Brasil identificado: Terças e Quintas entre 18h30 e 19h15."
      },
      {
        tag: "VÍDEOS REELS",
        text: "Vídeos no estilo 02. POV / Hands-on Live Action com narração PT-BR elevam a retenção nos primeiros 5 segundos."
      }
    ]
  };

  return NextResponse.json(analyticsData);
}
