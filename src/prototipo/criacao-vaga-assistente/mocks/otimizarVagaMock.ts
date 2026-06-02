import type { EntradaFormularioVaga, ModoEntradaVaga, VagaOtimizadaResultado } from "../types";

/** TODO: integrar POST otimizar vaga com IA + perfil gestor externo */
export function buildVagaOtimizadaMock(
  modo: ModoEntradaVaga,
  form?: EntradaFormularioVaga,
  prompt?: string,
): VagaOtimizadaResultado {
  const cliente = form?.cliente || extrair(prompt, "ONESYS") || "Cliente B2B SaaS";
  const gestor = form?.gestor || extrair(prompt, "Carlos Mendes") || "Head of Product";
  const titulo =
    form?.tituloVaga || extrair(prompt, "UX") || "Senior UX/UI Designer — Design System & RH";

  return {
    tituloSugerido: titulo.includes("Designer") ? titulo : `Senior UX/UI Designer — ${cliente}`,
    scoreQualidade: modo === "prompt" ? 91 : 86,
    previewMercado: {
      mediaAderenciaPrevista: 78,
      talentosBancoAcima80: 142,
      talentosQualificadosSimilares: 38,
      vagasSimilaresReferencia: "UX Sênior B2B SaaS (últimos 90 dias)",
    },
    contextoCliente: `${cliente} em expansão de produto digital: squads paralelas, pressão por consistência visual e compliance. Gestor ${gestor} valoriza documentação, métricas de usabilidade e retenção de talentos em ciclos longos.`,
    contextoGestor: `${gestor} busca perfil híbrido UX+UI com ownership de design system. Prioriza handoff estruturado e evidências de impacto em produto B2B — alinhado ao histórico de vagas fechadas com baixo churn nos primeiros 12 meses.`,
    momentoMercado:
      "Oferta aquecida para UX sênior em SaaS: escassez de perfis com governança de DS e a11y. Candidatos com consultoria adaptam-se mais rápido; salários CLT R$ 14–18k.",
    desafios: [
      "Evoluir e governar o design system em escala multi-squad",
      "Garantir acessibilidade WCAG 2.1 AA em fluxos críticos de RH",
      "Reduzir retrabalho no handoff com engenharia (Figma → dev)",
      "Integrar pesquisa contínua ao ciclo ágil de 2 semanas",
      "Liderar iniciativas de melhoria de UX em jornadas de recrutamento",
      "Operar stack moderna (React, tokens, documentação viva)",
    ],
    objetivos: [
      "Entregar interfaces consistentes e mensuráveis em 90 dias",
      "Elevar NPS interno das squads de produto",
      "Reduzir taxa de desistência em triagem e primeiros 90 dias",
    ],
    insightsTriagem: [
      "Priorize candidatos com cases de design system publicados ou governados",
      "Handoff estruturado reduz risco nos primeiros 60 dias",
      "Acessibilidade não negociável — validar certificações ou auditorias reais",
      "Alinhar expectativa de permanência com modelo de trabalho híbrido/remoto",
    ],
    antiChurn: [
      "Evitar perfil 100% visual sem experiência em produto B2B — histórico de saída antes de 6 meses",
      "Validar fit cultural com gestor (conexões LinkedIn e feedbacks anteriores na plataforma)",
      "PDI claro nos primeiros 90 dias para gaps de pesquisa qualitativa",
      "Score de aderência mínimo 70% antes de shortlist — usar Análise de aderência",
    ],
    hierarquiaMatch: [
      { label: "Desafio da vaga", peso: 40, descricao: "Critérios derivados dos desafios — maior peso no match" },
      { label: "Contexto & experiências", peso: 35, descricao: "Trajetória B2B, tempo médio de casa, setor" },
      { label: "Skills", peso: 25, descricao: "Hard/soft imprescindíveis vs desejáveis" },
    ],
    criteriosAderencia: [
      c("ds", "Sistemas de Design", 5, "Governar DS multi-squad", "Cases de governança e tokens"),
      c("a11y", "Acessibilidade", 4, "WCAG 2.1 AA", "Auditorias e correções documentadas"),
      c("handoff", "Handoff e Documentação", 5, "Reduzir retrabalho dev", "Specs Figma + Storybook"),
      c("agil", "Integração Ágil", 4, "Ciclo 2 semanas", "Participação em refinamentos"),
      c("ferramentas", "Ferramentas", 4, "Stack React + tokens", "Figma, React básico"),
      c("retencao", "Fit de permanência", 4, "Reduzir churn 6–12m", "Histórico estável + motivação alinhada"),
    ],
    skillsSugeridas: [
      { nome: "Design System", tipo: "hard", relevante: true, nivel: "Avançado" },
      { nome: "Figma", tipo: "hard", relevante: true, nivel: "Avançado" },
      { nome: "Acessibilidade (WCAG)", tipo: "hard", relevante: true, nivel: "Intermediário" },
      { nome: "Colaboração ágil", tipo: "soft", relevante: true, nivel: "Avançado" },
      { nome: "Pesquisa qualitativa", tipo: "soft", relevante: false, nivel: "Intermediário" },
    ],
    textoDesafioConsolidado: `A posição em ${cliente} exige profissional capaz de governar design system, assegurar acessibilidade em jornadas de RH e entregar handoff de alta qualidade para squads ágeis. O gestor ${gestor} espera impacto mensurável em 90 dias com foco em retenção e match sustentável.`,
    pdiOrganizacional:
      "Para candidatos com gap em pesquisa: pairing com UX Research nos primeiros 60 dias + certificação IAAG em a11y.",
  };
}

function c(
  id: string,
  nome: string,
  peso: number,
  desafio: string,
  evidencia: string,
) {
  return { id, nome, peso, desafioVaga: desafio, evidenciaEsperada: evidencia };
}

function extrair(text: string | undefined, fallback: string): string | undefined {
  if (!text?.trim()) return undefined;
  if (text.toLowerCase().includes(fallback.toLowerCase())) return fallback;
  return undefined;
}
