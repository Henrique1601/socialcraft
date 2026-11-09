export interface BentoSlide {
  badge: string;
  title: string;
  subtitle: string;
  highlights: string[];
  terminalSnippet?: string;
  ctaText?: string;
}

export function generateBentoCarouselData(projectName: string, projectDesc: string): BentoSlide[] {
  const name = projectName.trim() || "Projeto";
  const desc = projectDesc.trim() || "Arquitetura escalável e alta performance";

  return [
    {
      badge: "SLIDE 1 // O PROBLEMA",
      title: `Por que construímos o ${name}?`,
      subtitle: desc,
      highlights: [
        "Gargalos em fluxos manuais e lentos",
        "Falta de visibilidade e automação moderna",
        "Necessidade de arquitetura resiliente e zero-latency"
      ],
      terminalSnippet: `git clone https://github.com/Henrique1601/${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.git`
    },
    {
      badge: "SLIDE 2 // ARQUITETURA & STACK",
      title: "Construído com Engenharia de Ponta",
      subtitle: "Full-Stack moderno projetado para operar com confiabilidade máxima.",
      highlights: [
        "Next.js 16 + React 19 + Turbopack",
        "API Contracts tipados com Zod & TypeScript estrito",
        "Design System em tokens Tailwind CSS v4"
      ],
      terminalSnippet: `npm run build\n✓ Compiled successfully in 800ms\n✓ 100% type safety verified`
    },
    {
      badge: "SLIDE 3 // FUNCIONALIDADES CHAVE",
      title: "Recursos que aceleram seu dia",
      subtitle: "Focado em usabilidade limpa e produtividade instantânea.",
      highlights: [
        "Integração contínua e processamento em tempo real",
        "Suporte completo a Mobile (PWA nativo) e Desktop",
        "Operação offline resiliente com sincronização inteligente"
      ]
    },
    {
      badge: "SLIDE 4 // CÓDIGO ABERTO & PRÓXIMOS PASSOS",
      title: `Experimente o ${name} hoje mesmo`,
      subtitle: "Código disponível e pronto para uso ou contribuição.",
      highlights: [
        "Repositório público no GitHub com documentação Padrão Ouro",
        "Deploy ativo com CDN global de baixa latência",
        "Comunidade e atualizações contínuas"
      ],
      ctaText: "Confira o link na bio / comentários e deixe sua estrela no repositório! ⭐"
    }
  ];
}
