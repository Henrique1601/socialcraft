import { SocialPost } from "@/types/social";

export function generateSmartCopy(projectTitle: string, style: 'technical' | 'storytelling' | 'direct') {
  const cleanTitle = projectTitle.trim() || "Projeto Sem Título";

  if (style === 'technical') {
    return {
      caption: `${cleanTitle} — Arquitetura de alta performance com zero-latency e interface intuitiva. Projetado para eliminar tarefas manuais e automatizar seu fluxo operacional.`,
      hashtags: ["#softwareengineering", "#architecture", "#performance", "#typescript", "#buildinpublic"]
    };
  }

  if (style === 'storytelling') {
    return {
      caption: `Quantas horas você já perdeu lidando com processos fragmentados? Criamos o ${cleanTitle} para resolver exatamente esse gargalo: simples, elegante e focado em produtividade real.`,
      hashtags: ["#productivity", "#developerlife", "#saas", "#tech", "#innovation"]
    };
  }

  // Direct
  return {
    caption: `${cleanTitle} disponível agora! Assista à demonstração em ação e confira o código open-source no GitHub.`,
    hashtags: ["#tech", "#coding", "#launch", "#tools"]
  };
}
