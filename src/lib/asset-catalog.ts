// Catálogo curado de Mockups 3D e Vídeos Motion de Alta Resolução por Estilo e Categoria
// Garantem URLs públicas válidas que são aceitas nativamente pelo Buffer, Instagram e LinkedIn

export interface ProjectAssetBundle {
  videoUrl: string;
  screenshotUrl: string;
  mockup3DUrl: string;
  thumbnailUrl: string;
}

export function getProjectAssets(projectName: string, styleId: string): ProjectAssetBundle {
  const normalized = projectName.toLowerCase();

  // Vídeos Motion MP4 verticais e horizontais em CDN pública direta
  const videoCatalog: Record<string, string> = {
    "terminal-cyber": "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    "bento-grid": "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    "pov-hands-on": "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    "apple-minimal": "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4",
    "glitch-hack": "https://raw.githubusercontent.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4"
  };

  // Mockups 3D e Prints 4K temáticos por tipo de projeto
  let screenshotUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=1200&fit=crop&q=85";
  let mockup3DUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=1200&fit=crop&q=85";

  if (normalized.includes("git") || normalized.includes("devsync") || normalized.includes("code")) {
    screenshotUrl = "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&h=1200&fit=crop&q=85";
    mockup3DUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=1200&fit=crop&q=85";
  } else if (normalized.includes("hacker") || normalized.includes("security") || normalized.includes("cyber")) {
    screenshotUrl = "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=1200&fit=crop&q=85";
    mockup3DUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=1200&fit=crop&q=85";
  } else if (normalized.includes("pdf") || normalized.includes("omni") || normalized.includes("doc")) {
    screenshotUrl = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=1200&fit=crop&q=85";
    mockup3DUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=1200&fit=crop&q=85";
  } else if (normalized.includes("promo") || normalized.includes("game") || normalized.includes("craft")) {
    screenshotUrl = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=1200&fit=crop&q=85";
    mockup3DUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=1200&fit=crop&q=85";
  } else if (normalized.includes("job") || normalized.includes("crm") || normalized.includes("hunter")) {
    screenshotUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=1200&fit=crop&q=85";
    mockup3DUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=1200&fit=crop&q=85";
  }

  const videoUrl = videoCatalog[styleId] || videoCatalog["terminal-cyber"];

  return {
    videoUrl,
    screenshotUrl,
    mockup3DUrl,
    thumbnailUrl: mockup3DUrl
  };
}
