import type { VagaAnalise } from "../types";

export const VAGAS_ANALISE_MOCK: VagaAnalise[] = [
  {
    id: "v692",
    codigo: "692",
    titulo: "Designer UX/UI Sênior",
    cliente: "ONESYS",
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
      "Mentorar 1–2 designers plenos no time",
    ],
  },
  {
    id: "v213",
    codigo: "213",
    titulo: "Analista de Recrutamento e Seleção",
    cliente: "Foursys",
    desafios: [
      "Triagem de alto volume com qualidade e SLA",
      "Uso de IA para pré-qualificação sem perder critério humano",
      "Alinhamento com gestores em perfis técnicos",
    ],
    objetivos: ["Reduzir time-to-fill em 20%", "Padronizar pareceres de aderência"],
  },
  {
    id: "v801",
    codigo: "801",
    titulo: "Desenvolvedor Full Stack Pleno",
    cliente: "Cliente Financeiro",
    desafios: [
      "APIs .NET 8 com alta disponibilidade",
      "Front React + design system interno",
      "Observabilidade e segurança LGPD",
    ],
    objetivos: ["Sustentar squad de produto digital", "Participar de code review"],
  },
];
