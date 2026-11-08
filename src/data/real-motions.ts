// Catálogo dos Motions em Código Reais já construídos
export const REAL_PROJECT_MOTIONS: Record<string, string> = {
  "job-hunter-ai": "/samples/jobhunter_story_motion.html",
  "devsync": "/samples/devsync_story_motion_v2.html",
  "hackercraft": "/samples/hackercraft_story_motion_v2.html",
  "fotohidro": "/samples/fotohidro_story_motion.html",
  "fotos-hidrometros": "/samples/fotohidro_story_motion.html",
  "omnipdf": "/samples/omnipdf_story_motion.html",
  "omnipdf-studio": "/samples/omnipdf_story_motion.html",
  "prospector": "/samples/prospector_story_motion.html",
  "prospector-crm": "/samples/prospector_story_motion.html",
  "devquest": "/samples/devquest_story_motion.html",
  "devquest-": "/samples/devquest_story_motion.html",
  "promocraft": "/samples/promocraft_launch_motion.html"
};

export function getProjectMotionUrl(projectName: string): string | null {
  const normalized = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "");
  for (const [key, path] of Object.entries(REAL_PROJECT_MOTIONS)) {
    if (normalized.includes(key)) {
      return path;
    }
  }
  return null;
}
