import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "Henrique1601").replace(/[^a-zA-Z0-9-]/g, "");

  if (!username) {
    return NextResponse.json({ success: false, error: "Username inválido." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=25`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "SocialCraft-Studio"
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API retornou HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const repos = await res.json();
    const mapped = (Array.isArray(repos) ? repos : [])
      .filter((r: any) => !r.fork)
      .map((r: any) => ({
        id: `gh-live-${r.id}`,
        name: r.name,
        desc: r.description || `Repositório ${r.language || "Web"} • ★ ${r.stargazers_count}`,
        type: "github" as const,
        source: r.homepage && r.homepage.startsWith("http") ? r.homepage : r.html_url,
        repoUrl: r.html_url,
        liveUrl: r.homepage && r.homepage.startsWith("http") ? r.homepage : null,
        language: r.language,
        stars: r.stargazers_count,
        isLocal: false
      }));

    return NextResponse.json({
      success: true,
      username,
      total: mapped.length,
      projects: mapped
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Erro ao consultar GitHub." },
      { status: 500 }
    );
  }
}
