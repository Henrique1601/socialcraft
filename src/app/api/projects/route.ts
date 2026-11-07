import { NextResponse } from "next/server";
import allProjectsData from "@/data/projects.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const query = (searchParams.get("q") || "").toLowerCase().trim();

  let projects = [];

  const localList = allProjectsData.local;
  const ghList = allProjectsData.github;

  if (filter === "local") {
    projects = localList;
  } else if (filter === "github") {
    projects = ghList;
  } else {
    projects = [...localList, ...ghList];
  }

  if (query) {
    projects = projects.filter(
      (p: any) =>
        p.name.toLowerCase().includes(query) ||
        (p.desc && p.desc.toLowerCase().includes(query)) ||
        (p.source && p.source.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    total: projects.length,
    localCount: localList.length,
    githubCount: ghList.length,
    projects
  });
}
