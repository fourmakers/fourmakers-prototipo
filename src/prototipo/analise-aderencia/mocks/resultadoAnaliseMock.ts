import type { ResultadoAnaliseAderencia } from "../types";

/** TODO: integrar API de análise de aderência com IA */
export function buildResultadoMock(vagaId: string): ResultadoAnaliseAderencia {
  return {
    vagaId,
    geradoEm: new Date().toISOString(),
    panorama: {
      contextoMercado:
        "Mercado aquecido para UX sênior em B2B SaaS: demanda por design systems e acessibilidade. Salários CLT na faixa R$ 14–18k em consultorias; PJ até 25% acima.",
      contextoCliente:
        "ONESYS em expansão de produto RH: squads paralelas, pressão por consistência visual e compliance. Gestor valoriza documentação e métricas de usabilidade.",
      insightsTriagem: [
        "Priorize candidatos com cases de design system publicados ou governados",
        "Handoff estruturado reduz risco nos primeiros 60 dias",
        "Acessibilidade não negociável — validar certificações ou auditorias reais",
        "Candidatos de consultoria costumam adaptar-se mais rápido a múltiplos clientes",
      ],
      momentoMercado:
        "Oferta concentrada em profissionais híbridos UX+UI; escassez de perfis com pesquisa qualitativa forte.",
    },
    candidatos: [
      {
        id: "c1",
        nome: "Rafael Mendes",
        cargoAtual: "Senior UX/UI Designer",
        fonte: "arquivo",
        fonteLabel: "CV — rafael-mendes.pdf",
        aderenciaGeral: 88,
        ranking: 1,
        resumo:
          "Perfil sólido em design system e handoff; gap moderado em pesquisa qualitativa contínua.",
        potencial: "alto",
        criterios: [
          c("ds", "Sistemas de Design", 5, "Governar DS multi-squad", "Liderou DS em 3 produtos B2B"),
          c("a11y", "Acessibilidade", 4, "WCAG 2.1 AA", "Auditorias e correções em fluxos críticos", "Testes com leitores de tela", "Certificação IAAG em 60 dias"),
          c("handoff", "Handoff e Documentação", 5, "Reduzir retrabalho dev", "Specs no Figma + Storybook"),
          c("agil", "Integração Ágil", 4, "Ciclo 2 semanas", "Participação ativa em refinamentos"),
          c("ferramentas", "Ferramentas e Tecnologias", 4, "Stack React + tokens", "Figma, tokens CSS, React básico"),
          c("melhoria", "Iniciativas de Melhoria", 3, "UX em recrutamento", "Cases genéricos de produto", "Mapear jornada RH nos primeiros 30 dias", "Agente de IA para síntese de entrevistas"),
        ],
        trajetoria: [
          { fase: "0–90 dias", descricao: "Onboarding DS + quick wins em acessibilidade" },
          { fase: "6 meses", descricao: "Referência de handoff na squad" },
          { fase: "12 meses", descricao: "Lead de design em produto RH" },
        ],
      },
      {
        id: "c2",
        nome: "Marina Costa",
        cargoAtual: "UX Designer Pleno",
        fonte: "linkedin",
        fonteLabel: "linkedin.com/in/marinacosta",
        aderenciaGeral: 76,
        ranking: 2,
        resumo: "Forte em pesquisa e discovery; precisa amadurecer governança de DS.",
        potencial: "medio",
        criterios: [
          c("ds", "Sistemas de Design", 3, "Governar DS", "Uso de DS existente, pouca criação"),
          c("a11y", "Acessibilidade", 4, "WCAG", "Checklist em projetos recentes"),
          c("handoff", "Handoff e Documentação", 4, "Handoff", "Documentação clara"),
          c("agil", "Integração Ágil", 5, "Ágil", "Facilitadora de discovery"),
          c("ferramentas", "Ferramentas", 4, "Stack", "Figma, Miro, básico React"),
          c("melhoria", "Iniciativas de Melhoria", 4, "Melhoria UX", "Projetos de otimização de funil"),
        ],
        trajetoria: [
          { fase: "0–90 dias", descricao: "Pair com sênior em DS" },
          { fase: "6 meses", descricao: "Ownership de fluxos de recrutamento" },
        ],
      },
      {
        id: "c3",
        nome: "Pedro Almeida",
        cargoAtual: "UI Designer",
        fonte: "zip",
        fonteLabel: "lote-cvs-ux.zip (3 arquivos)",
        aderenciaGeral: 62,
        ranking: 3,
        resumo: "Visual forte; gaps em acessibilidade, DS e contexto B2B.",
        potencial: "em_desenvolvimento",
        criterios: [
          c("ds", "Sistemas de Design", 2, "DS", "Componentes isolados"),
          c("a11y", "Acessibilidade", 2, "WCAG", "Conhecimento superficial"),
          c("handoff", "Handoff", 3, "Handoff", "Entregas visuais sem specs"),
          c("agil", "Ágil", 3, "Ágil", "Experiência em agência"),
          c("ferramentas", "Ferramentas", 5, "Figma avançado", "Domínio Figma e motion"),
          c("melhoria", "Melhoria", 3, "Melhoria", "Portfolio de landing pages"),
        ],
        trajetoria: [
          { fase: "0–90 dias", descricao: "PDI estruturado em a11y + DS" },
          { fase: "6 meses", descricao: "Pleno UI com mentoria UX" },
        ],
      },
      ...CANDIDATOS_EXTRAS,
    ],
  };
}

const CANDIDATOS_EXTRAS = [
  extra("c4", "Juliana Ferreira", "Product Designer", "linkedin", "linkedin.com/in/julianaferreira", 71, 4, "medio", 4),
  extra("c5", "Lucas Oliveira", "UX Researcher", "arquivo", "CV — lucas-oliveira.pdf", 68, 5, "medio", 3),
  extra("c6", "Camila Rocha", "UI/UX Designer", "zip", "lote-cvs-ux.zip", 65, 6, "medio", 3),
  extra("c7", "Bruno Santos", "Design Lead", "linkedin", "linkedin.com/in/brunosantos", 59, 7, "em_desenvolvimento", 4),
  extra("c8", "Fernanda Lima", "UX Designer Sênior", "arquivo", "CV — fernanda-lima.pdf", 55, 8, "em_desenvolvimento", 3),
  extra("c9", "Diego Martins", "Visual Designer", "lote", "3 perfis — pasta lote", 52, 9, "em_desenvolvimento", 2),
  extra("c10", "Patrícia Nunes", "Interaction Designer", "linkedin", "linkedin.com/in/patricianunes", 48, 10, "em_desenvolvimento", 2),
];

function extra(
  id: string,
  nome: string,
  cargo: string,
  fonte: "arquivo" | "lote" | "zip" | "linkedin",
  fonteLabel: string,
  aderencia: number,
  ranking: number,
  potencial: "alto" | "medio" | "em_desenvolvimento",
  notaBase: number,
) {
  return {
    id,
    nome,
    cargoAtual: cargo,
    fonte,
    fonteLabel,
    aderenciaGeral: aderencia,
    ranking,
    resumo: `Aderência ${aderencia}% na triagem IA — perfil ${potencial === "alto" ? "competitivo" : potencial === "medio" ? "com gaps pontuais" : "com desenvolvimento necessário"}.`,
    potencial,
    criterios: [
      c("ds", "Sistemas de Design", notaBase, "DS", "Experiência parcial documentada"),
      c("a11y", "Acessibilidade", Math.max(2, notaBase - 1), "WCAG", "Conhecimento em nível intermediário"),
      c("handoff", "Handoff", notaBase, "Handoff", "Entregas com documentação variável"),
      c("agil", "Ágil", notaBase, "Ágil", "Participação em squads ágeis"),
      c("ferramentas", "Ferramentas", Math.min(5, notaBase + 1), "Stack", "Figma e ferramentas de colaboração"),
      c("melhoria", "Melhoria", notaBase, "Melhoria", "Cases de produto digital"),
    ],
    trajetoria: [{ fase: "0–90 dias", descricao: "Onboarding e alinhamento aos desafios da vaga" }],
  };
}

function c(
  id: string,
  nome: string,
  nota: number,
  desafio: string,
  como: string,
  gap?: string,
  pdi?: string,
  complementoIa?: string,
) {
  return {
    id,
    nome,
    nota,
    maxNota: 5,
    desafioVaga: desafio,
    comoCumpre: como,
    gap,
    pdi,
    complementoIa,
  };
}
