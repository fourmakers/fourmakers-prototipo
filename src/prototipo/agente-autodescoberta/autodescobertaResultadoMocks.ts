/** Dados mock para o painel pós-conversa (protótipo). */

export interface VagaCardMock {
  id: string;
  codigoVaga: string;
  titulo: string;
  publicadaEm: string;
  local: string;
  modalidade: string;
  habilidades: string[];
  urlPublica: string;
}

export const MOCK_VAGAS_AUTODESCOBERTA: VagaCardMock[] = [
  {
    id: "1",
    codigoVaga: "F1226",
    titulo: "Analista de Sistemas Java",
    publicadaEm: "06/05/2026",
    local: "Brasil",
    modalidade: "100% Remoto",
    habilidades: [
      "Relacionamento interpessoal",
      "Metodologias Ágeis",
      "Trello",
      "Trabalho em equipe",
      "Java",
      "MIRO",
      "AZURE DEVOPS",
    ],
    urlPublica: "app.fourmakers.io/public/vaga?detalhes=1226",
  },
  {
    id: "2",
    codigoVaga: "F1301",
    titulo: "Product Designer (UX/UI)",
    publicadaEm: "10/05/2026",
    local: "Brasil",
    modalidade: "Híbrido — SP",
    habilidades: ["Figma", "Design system", "Pesquisa com usuários", "Prototipação", "Workshop", "HTML/CSS"],
    urlPublica: "app.fourmakers.io/public/vaga?detalhes=1301",
  },
  {
    id: "3",
    codigoVaga: "F0988",
    titulo: "Desenvolvedor Front-end React",
    publicadaEm: "02/05/2026",
    local: "Brasil",
    modalidade: "100% Remoto",
    habilidades: ["React", "TypeScript", "Testes", "Git", "REST", "Acessibilidade"],
    urlPublica: "app.fourmakers.io/public/vaga?detalhes=988",
  },
];

export interface AgentePotencializadorMock {
  nome: string;
  contribuicaoPotencializacao: number;
  parecer: string;
}

export interface CarreiraPotencializadaMock {
  id: string;
  titulo: string;
  resumoAlinhamento: string;
  skillsDestaque: string[];
  aderenciaPerfilAtual: number;
  aderenciaPotencializada: number;
  agentes: AgentePotencializadorMock[];
}

export const MOCK_CARREIRAS_POTENCIALIZADAS: CarreiraPotencializadaMock[] = [
  {
    id: "ux",
    titulo: "Especialista UX",
    resumoAlinhamento:
      "O seu perfil combina escuta ativa, pensamento sistémico e facilitação — base forte para discovery e priorização de problemas reais de usuário.",
    skillsDestaque: ["Facilitação de workshops", "Pensamento sistêmico", "Comunicação empática", "Prototipação"],
    aderenciaPerfilAtual: 64,
    aderenciaPotencializada: 91,
    agentes: [
      {
        nome: "Claude (Sonnet)",
        contribuicaoPotencializacao: 38,
        parecer:
          "Apoia síntese de entrevistas, roteiros de teste de usabilidade e variações de microcopy — reduz tempo em desk research e documentação de insights.",
      },
      {
        nome: "GPT + plugin Figma",
        contribuicaoPotencializacao: 35,
        parecer:
          "Acelera fluxos de wireframe e variações de layout no Figma; útil para explorar alternativas de UI e manter consistência com design system.",
      },
      {
        nome: "Agente de pesquisa (survey)",
        contribuicaoPotencializacao: 27,
        parecer:
          "Gera formulários, consolida respostas quanti/quali e sugere cortes para priorização — tarefas operacionais de research ops.",
      },
    ],
  },
  {
    id: "fe",
    titulo: "Desenvolvedor Front-end",
    resumoAlinhamento:
      "Você já demonstra colaboração multidisciplinar e entrega concreta; stacks modernas e PR reviews são o próximo degrau natural.",
    skillsDestaque: ["TypeScript", "Componentização", "Git", "Colaboração multidisciplinar"],
    aderenciaPerfilAtual: 58,
    aderenciaPotencializada: 88,
    agentes: [
      {
        nome: "GPT Codex / Cursor Agent",
        contribuicaoPotencializacao: 45,
        parecer:
          "Automatiza boilerplate, testes unitários iniciais e refactors seguros em React/TS — libera tempo para arquitetura de feature e UX técnica.",
      },
      {
        nome: "Copilot (IDE)",
        contribuicaoPotencializacao: 32,
        parecer:
          "Completa padrões de hooks, acessibilidade (ARIA) e mensagens de erro — reduz atrito em tarefas repetitivas de UI.",
      },
      {
        nome: "Claude (code review)",
        contribuicaoPotencializacao: 23,
        parecer:
          "Sugere edge cases e legibilidade em PRs; complementa revisão humana sem substituir decisão de merge.",
      },
    ],
  },
  {
    id: "po",
    titulo: "Product Owner / Analista de Negócios",
    resumoAlinhamento:
      "Gestão de backlog, priorização e comunicação com stakeholders alinham-se ao que você descreveu no dia a dia e nas situações de impacto.",
    skillsDestaque: ["Priorização de backlog", "Métricas de produto", "Documentação funcional", "Stakeholder"],
    aderenciaPerfilAtual: 71,
    aderenciaPotencializada: 93,
    agentes: [
      {
        nome: "Claude (Sonnet)",
        contribuicaoPotencializacao: 40,
        parecer:
          "Transforma conversas em épicos/histórias, critérios de aceite e riscos — ideal para refinamento e alinhamento com negócio.",
      },
      {
        nome: "GPT (Excel/Sheets)",
        contribuicaoPotencializacao: 35,
        parecer:
          "Modela cenários de valor, projeções simples e dashboards narrados — tarefas operacionais de análise complementar ao produto.",
      },
      {
        nome: "Agente de reunião (transcrição)",
        contribuicaoPotencializacao: 25,
        parecer:
          "Resume decisões e action items de workshops — mantém rastreabilidade sem ocupar o PO em ata manual.",
      },
    ],
  },
];
