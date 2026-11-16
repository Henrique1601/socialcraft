// Catálogo real de assets do SocialCraft (sem placeholders ou vídeos genéricos como big_buck_bunny).
// Prioriza MP4s e mockups reais já renderizados no repositório/CDN ou captura ao vivo da URL do projeto.

export interface ProjectAssetBundle {
  videoUrl: string | null;
  hasRealMp4: boolean;
  screenshotUrl: string;
  mockup3DUrl: string;
  thumbnailUrl: string;
}

const BASE_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://socialcraft-eight.vercel.app";

const REAL_VIDEO_ASSETS: Record<string, { videoUrl: string; imageUrl: string; storyUrl: string }> = {
  jmmotorrs: {
    videoUrl: `${BASE_ORIGIN}/samples/jmmotorrs-pov-reels.mp4`,
    imageUrl: `${BASE_ORIGIN}/samples/jmmotorrs-post.png`,
    storyUrl: `${BASE_ORIGIN}/samples/jmmotorrs-story.png`
  },
  "jm-motors": {
    videoUrl: `${BASE_ORIGIN}/samples/jm-motors-pov-reels.mp4`,
    imageUrl: `${BASE_ORIGIN}/samples/jm-motors-post.png`,
    storyUrl: `${BASE_ORIGIN}/samples/jm-motors-story.png`
  },
  promocraft: {
    videoUrl: "https://quick-lavoisier.vercel.app/promocraft_story_1080x1920.mp4",
    imageUrl: "https://quick-lavoisier.vercel.app/promocraft_story_thumb.png",
    storyUrl: "https://quick-lavoisier.vercel.app/promocraft_story_thumb.png"
  },
  devsync: {
    videoUrl: "https://quick-lavoisier.vercel.app/devsync_story_1080x1920.mp4",
    imageUrl: "https://quick-lavoisier.vercel.app/devsync_story_thumb.png",
    storyUrl: "https://quick-lavoisier.vercel.app/devsync_story_thumb.png"
  },
  hackercraft: {
    videoUrl: "https://quick-lavoisier.vercel.app/hackercraft_story_1080x1920.mp4",
    imageUrl: "https://quick-lavoisier.vercel.app/hackercraft_story_thumb.png",
    storyUrl: "https://quick-lavoisier.vercel.app/hackercraft_story_thumb.png"
  },
  fotohidro: {
    videoUrl: "https://quick-lavoisier.vercel.app/fotohidro_story_1080x1920.mp4",
    imageUrl: "https://quick-lavoisier.vercel.app/fotohidro_story_thumb.png",
    storyUrl: "https://quick-lavoisier.vercel.app/fotohidro_story_thumb.png"
  }
};

export function getProjectAssets(
  projectName: string,
  _styleId: string,
  liveUrl?: string | null
): ProjectAssetBundle {
  const normalized = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "");

  for (const [key, bundle] of Object.entries(REAL_VIDEO_ASSETS)) {
    if (normalized.includes(key)) {
      return {
        videoUrl: bundle.videoUrl,
        hasRealMp4: true,
        screenshotUrl: bundle.imageUrl,
        mockup3DUrl: bundle.imageUrl,
        thumbnailUrl: bundle.storyUrl
      };
    }
  }

  // Se o usuário informou uma URL ao vivo (ou o projeto tem URL GitHub/Deploy), gera captura real da tela
  const targetUrl =
    liveUrl && liveUrl.startsWith("http")
      ? liveUrl
      : `https://github.com/Henrique1601/${projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;

  const realShot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1280`;

  return {
    videoUrl: null,
    hasRealMp4: false,
    screenshotUrl: realShot,
    mockup3DUrl: realShot,
    thumbnailUrl: realShot
  };
}
