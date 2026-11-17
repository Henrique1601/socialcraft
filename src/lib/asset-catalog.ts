// Catálogo real de assets do SocialCraft (zero URLs mortas, zero placeholders).
// Prioriza MP4s reais no próprio domínio ou captura via proxy same-origin sem CORS.

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

  const targetUrl =
    liveUrl && liveUrl.startsWith("http")
      ? liveUrl
      : `https://github.com/Henrique1601/${projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;

  // Proxy same-origin evita bloqueio de CORS no HTML5 Canvas
  const proxyShot = `/api/capture-screenshot?url=${encodeURIComponent(targetUrl)}&proxy=1`;
  // URL pública absoluta para envio externo ao Buffer quando não houver MP4
  const publicShot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1280`;

  return {
    videoUrl: null,
    hasRealMp4: false,
    screenshotUrl: proxyShot,
    mockup3DUrl: publicShot,
    thumbnailUrl: publicShot
  };
}
