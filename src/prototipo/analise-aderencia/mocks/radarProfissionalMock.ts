import type { CandidatoAnalise, RadarProfissional } from "../types";

/** TODO: integrar API de radar profissional (LinkedIn, histórico Fourmakers, gamificação) */
export function getRadarProfissionalMock(candidato: CandidatoAnalise): RadarProfissional {
  const porId: Record<string, Omit<RadarProfissional, "candidatoId">> = {
    c1: baseRafael(),
    c2: baseMarina(),
    c3: basePedro(),
  };
  const data = porId[candidato.id] ?? baseGenerico(candidato);
  return { candidatoId: candidato.id, ...data };
}

function basePedro(): Omit<RadarProfissional, "candidatoId"> {
  return {
    perfil: {
      headline: "UI Designer · agências e produto digital",
      skills: ["Figma", "Motion", "Design visual", "Prototipação", "Landing pages"],
      localizacao: "São Paulo, BR",
      timezone: "UTC−3",
      modalidades: ["Remoto", "Híbrido"],
      linkedinUrl: "linkedin.com/in/pedroalmeida-ui",
      verificadoPlataforma: true,
    },
    kpis: [
      { label: "Disponibilidade", valor: 82, suffix: "%" },
      { label: "Média avaliações", valor: 3.4, suffix: "/5" },
      { label: "Engajamento", valor: 71, suffix: "%" },
    ],
    scorePlataforma: 68,
    rankingGlobal: 1240,
    rankingTotal: 8500,
    merits: [
      { id: "m1", titulo: "Portfolio destacado", descricao: "Top 15% em avaliações visuais na plataforma", tipo: "medal" },
      { id: "m2", titulo: "Indicações ativas", descricao: "2 indicações aceitas em 2025", tipo: "referral" },
    ],
    tempoMedioCasaMeses: 14,
    historicoEmpresas: [
      { empresa: "Studio Pixel", cargo: "UI Designer", meses: 11 },
      { empresa: "Agência Wave", cargo: "Designer visual", meses: 18 },
      { empresa: "Freelance", cargo: "UI / Motion", meses: 9 },
    ],
    inscricoes: [
      {
        codigo: "V-2401",
        titulo: "Senior UX/UI Designer",
        cliente: "ONESYS",
        status: "Em triagem IA",
        score: 62,
        data: "2026-05-20",
      },
      {
        codigo: "V-2288",
        titulo: "UI Designer Pleno",
        cliente: "FinTech Hub",
        status: "Desclassificado",
        score: 48,
        data: "2026-03-12",
      },
      {
        codigo: "V-2190",
        titulo: "Product Designer",
        cliente: "Retail Co",
        status: "Entrevista RH",
        score: 55,
        data: "2026-01-08",
      },
    ],
    relacoesOrg: [
      {
        nome: "Carlos Mendes",
        cargo: "Head of Product — gestor da vaga",
        grau: 1,
        fonte: "LinkedIn",
        contexto: "Conexão em 1º grau · 3 interações na plataforma",
      },
      {
        nome: "Ana Ribeiro",
        cargo: "UX Lead — ONESYS",
        grau: 2,
        fonte: "LinkedIn",
        contexto: "Conexão em 2º grau via Carlos Mendes",
      },
    ],
    agendas: [
      { tipo: "Triagem", titulo: "Análise de aderência — V-2401", data: "2026-05-27 14:00", status: "Agendado" },
      { tipo: "Feedback", titulo: "Devolutiva portfolio", data: "2026-05-15 10:30", status: "Concluído" },
    ],
    vagasMatch: [
      { codigo: "V-2410", titulo: "UI Designer — Design System", cliente: "SaaSify", match: 91 },
      { codigo: "V-2395", titulo: "Visual Designer B2B", cliente: "CloudOps", match: 84 },
      { codigo: "V-2382", titulo: "Motion Designer", cliente: "Media Labs", match: 79 },
    ],
    avaliacoes: [
      { dimensao: "Qualidade visual", media: 4.6, amostra: 3 },
      { dimensao: "Colaboração", media: 3.2, amostra: 2 },
      { dimensao: "Acessibilidade", media: 2.1, amostra: 2 },
      { dimensao: "Documentação", media: 2.8, amostra: 2 },
    ],
    alertas: [
      {
        severidade: "warning",
        titulo: "Gap crítico em acessibilidade",
        descricao: "Histórico de notas baixas em vagas com requisito WCAG.",
      },
      {
        severidade: "info",
        titulo: "Tempo médio de casa abaixo do benchmark",
        descricao: "Média de 14 meses vs. 22 meses do perfil sênior UX na base.",
      },
    ],
    naoRecomendacoes: [
      "Não recomendado para vagas com ownership de design system sem PDI estruturado.",
      "Evitar posições com pesquisa qualitativa como entregável principal nos primeiros 90 dias.",
    ],
    gamificacao: {
      nivel: "Explorador",
      xp: 1840,
      xpProximoNivel: 2500,
      badges: ["Portfolio verificado", "3 inscrições ativas"],
      bloqueios: [{ motivo: "Documentação pendente", detalhe: "Comprovante PJ — libera indicações premium" }],
    },
  };
}

function baseRafael(): Omit<RadarProfissional, "candidatoId"> {
  return {
    perfil: {
      headline: "Senior UX/UI · design systems B2B",
      skills: ["Design System", "Figma", "A11y", "Handoff", "Storybook", "React tokens"],
      localizacao: "Curitiba, BR",
      timezone: "UTC−3",
      modalidades: ["Remoto", "CLT"],
      linkedinUrl: "linkedin.com/in/rafaelmendes",
      verificadoPlataforma: true,
    },
    kpis: [
      { label: "Disponibilidade", valor: 94, suffix: "%" },
      { label: "Média avaliações", valor: 4.7, suffix: "/5" },
      { label: "Engajamento", valor: 88, suffix: "%" },
    ],
    scorePlataforma: 92,
    rankingGlobal: 89,
    rankingTotal: 8500,
    merits: [
      { id: "m1", titulo: "Top da turma", descricao: "Ranking top 1% em DS na plataforma", tipo: "medal" },
      { id: "m2", titulo: "Liderança", descricao: "Mentor de 2 designers júnior", tipo: "leadership" },
      { id: "m3", titulo: "Pontualidade", descricao: "100% presença em entrevistas", tipo: "punctual" },
    ],
    tempoMedioCasaMeses: 28,
    historicoEmpresas: [
      { empresa: "B2B SaaS Co", cargo: "Senior UX/UI", meses: 34 },
      { empresa: "Consultoria UX", cargo: "UX Designer", meses: 22 },
    ],
    inscricoes: [
      {
        codigo: "V-2401",
        titulo: "Senior UX/UI Designer",
        cliente: "ONESYS",
        status: "Shortlist",
        score: 88,
        data: "2026-05-18",
      },
    ],
    relacoesOrg: [
      {
        nome: "Carlos Mendes",
        cargo: "Head of Product",
        grau: 2,
        fonte: "LinkedIn",
        contexto: "2º grau · 12 conexões em comum",
      },
    ],
    agendas: [
      { tipo: "Entrevista", titulo: "Técnica com UX Lead", data: "2026-05-28 16:00", status: "Confirmado" },
    ],
    vagasMatch: [
      { codigo: "V-2405", titulo: "Lead Product Design", cliente: "ONESYS", match: 96 },
      { codigo: "V-2390", titulo: "Design System Architect", cliente: "Enterprise RH", match: 93 },
    ],
    avaliacoes: [
      { dimensao: "Design System", media: 4.9, amostra: 5 },
      { dimensao: "Handoff", media: 4.8, amostra: 4 },
      { dimensao: "Acessibilidade", media: 4.5, amostra: 3 },
    ],
    alertas: [],
    naoRecomendacoes: [],
    gamificacao: {
      nivel: "Especialista",
      xp: 6200,
      xpProximoNivel: 8000,
      badges: ["Top 1%", "Mentor ativo", "Indicador ouro"],
      bloqueios: [],
    },
  };
}

function baseMarina(): Omit<RadarProfissional, "candidatoId"> {
  return {
    perfil: {
      headline: "UX Designer pleno · discovery e pesquisa",
      skills: ["Pesquisa qualitativa", "Figma", "Miro", "Discovery", "Jornada"],
      localizacao: "Belo Horizonte, BR",
      timezone: "UTC−3",
      modalidades: ["Remoto"],
      linkedinUrl: "linkedin.com/in/marinacosta",
      verificadoPlataforma: true,
    },
    kpis: [
      { label: "Disponibilidade", valor: 88, suffix: "%" },
      { label: "Média avaliações", valor: 4.1, suffix: "/5" },
      { label: "Engajamento", valor: 79, suffix: "%" },
    ],
    scorePlataforma: 81,
    rankingGlobal: 412,
    rankingTotal: 8500,
    merits: [
      { id: "m1", titulo: "Discovery champion", descricao: "Destaque em pesquisa na plataforma", tipo: "medal" },
    ],
    tempoMedioCasaMeses: 20,
    historicoEmpresas: [
      { empresa: "Startup Health", cargo: "UX Designer", meses: 24 },
      { empresa: "Agência Digital", cargo: "UX Researcher", meses: 16 },
    ],
    inscricoes: [
      {
        codigo: "V-2401",
        titulo: "Senior UX/UI Designer",
        cliente: "ONESYS",
        status: "Em avaliação",
        score: 76,
        data: "2026-05-19",
      },
    ],
    relacoesOrg: [
      {
        nome: "Ana Ribeiro",
        cargo: "UX Lead — ONESYS",
        grau: 1,
        fonte: "LinkedIn",
        contexto: "1º grau · colegas em projeto anterior",
      },
    ],
    agendas: [{ tipo: "Triagem", titulo: "Fit cultural", data: "2026-05-29 11:00", status: "Pendente confirmação" }],
    vagasMatch: [
      { codigo: "V-2408", titulo: "UX Researcher", cliente: "HealthTech", match: 89 },
      { codigo: "V-2392", titulo: "Product Designer Discovery", cliente: "ONESYS", match: 85 },
    ],
    avaliacoes: [
      { dimensao: "Pesquisa", media: 4.7, amostra: 4 },
      { dimensao: "Design System", media: 3.5, amostra: 2 },
    ],
    alertas: [
      {
        severidade: "info",
        titulo: "DS em desenvolvimento",
        descricao: "Recomendado pairing com sênior nos primeiros 90 dias.",
      },
    ],
    naoRecomendacoes: ["Evitar vagas 100% UI sem componente de pesquisa."],
    gamificacao: {
      nivel: "Profissional",
      xp: 3100,
      xpProximoNivel: 4500,
      badges: ["Pesquisa verificada"],
      bloqueios: [],
    },
  };
}

function baseGenerico(c: CandidatoAnalise): Omit<RadarProfissional, "candidatoId"> {
  return {
    ...basePedro(),
    perfil: { ...basePedro().perfil, headline: c.cargoAtual },
  };
}
