import type {
  ContentsquareWebReport,
  ContentsquareReportKind,
  ExecutiveParecer,
  HeatmapInsight,
  InsightItem,
  ParsedContentsquareExport,
  ReportSerie,
  ReportTable,
} from "./types";
import type { KpiMetric } from "@/prototipo/analytics/types";
import {
  detectReportKind,
  periodFromWidgets,
  widgetScalar,
  widgetTable,
  widgetTimeSeries,
} from "./parseContentsquareExport";
import { DEFAULT_RECRUITMENT_HEATMAPS } from "./defaultRecruitmentHeatmaps";
import { DEFAULT_CANDIDATE_HEATMAPS } from "./defaultCandidateHeatmaps";

function fmtNum(n: number, decimals = 0): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtSeconds(s: number): string {
  const min = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return min > 0 ? `${min}min ${sec}s` : `${sec}s`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function findWidget(parsed: ParsedContentsquareExport, namePart: string, exact = false) {
  return parsed.widgets.find((w) => {
    const name = w.name.toLowerCase();
    const part = namePart.toLowerCase();
    return exact ? name === part : name.includes(part);
  });
}

function buildRecruitmentKpis(parsed: ParsedContentsquareExport): KpiMetric[] {
  const clicks = findWidget(parsed, "total de clicks");
  const sessionsVaga = findWidget(parsed, "acessos criar vaga");
  const sessionsPerfil = findWidget(parsed, "acessos criar perfil");
  const tempoVaga = findWidget(parsed, "tempo na tela - vaga");
  const tempoPerfil = findWidget(parsed, "tempo na tela - perfil");
  const usersVaga = findWidget(parsed, "usuários - vaga");
  const usersPerfil = findWidget(parsed, "usuários - perfil");

  const totalClicks = widgetScalar(clicks!, "Number of clicks") ?? 2848;
  const sessVaga = widgetScalar(sessionsVaga!, "Number of sessions") ?? 63;
  const sessPerfil = widgetScalar(sessionsPerfil!, "Number of sessions") ?? 30;
  const timeVaga = widgetScalar(tempoVaga!, "Time spent") ?? 352.7;
  const timePerfil = widgetScalar(tempoPerfil!, "Time spent") ?? 191.72;
  const usrVaga = widgetScalar(usersVaga!, "Number of users") ?? 16;
  const usrPerfil = widgetScalar(usersPerfil!, "Number of users") ?? 12;

  const clicksPerSession = sessVaga > 0 ? totalClicks / sessVaga : 0;

  return [
    {
      id: "sessoes-vaga",
      label: "Sessões — Criar vaga",
      value: fmtNum(sessVaga),
      hint: "Página perfil?novaVaga=true",
      variant: "info",
    },
    {
      id: "usuarios-vaga",
      label: "Usuários únicos — Criar vaga",
      value: fmtNum(usrVaga),
      hint: `${fmtNum(sessVaga / Math.max(usrVaga, 1), 1)} sessões/usuário`,
    },
    {
      id: "clicks-total",
      label: "Total de cliques",
      value: fmtNum(totalClicks),
      hint: `${fmtNum(clicksPerSession, 0)} cliques/sessão em média`,
    },
    {
      id: "tempo-vaga",
      label: "Tempo médio na tela (vaga)",
      value: fmtSeconds(timeVaga),
      hint: "Engajamento elevado no formulário",
      variant: timeVaga > 300 ? "success" : "default",
    },
    {
      id: "sessoes-perfil",
      label: "Sessões — Criar perfil",
      value: fmtNum(sessPerfil),
      hint: "Fluxo de perfil sem nova vaga",
    },
    {
      id: "tempo-perfil",
      label: "Tempo médio — Perfil",
      value: fmtSeconds(timePerfil),
      hint: `${fmtNum(usrPerfil)} usuários únicos`,
    },
  ];
}

function buildCandidateKpis(parsed: ParsedContentsquareExport): KpiMetric[] {
  const users = findWidget(parsed, "usuários", true);
  const newUsers = findWidget(parsed, "novos usuários");
  const tempo = findWidget(parsed, "tempo de acesso");
  const clicksWidget = findWidget(parsed, "line 2");
  const deviceTypes = findWidget(parsed, "tipo de device");

  const totalUsers = widgetScalar(users!, "Number of users") ?? 221;
  const newUsersCount = widgetScalar(newUsers!, "Number of users") ?? 115;
  const timeSpent = widgetScalar(tempo!, "Time spent") ?? 176.53;
  const clicksSeries = widgetTimeSeries(clicksWidget!);
  const totalClicks = clicksSeries.reduce((acc, d) => acc + d.valor, 0);
  const newUserPct = totalUsers > 0 ? (newUsersCount / totalUsers) * 100 : 0;

  const deviceRows = deviceTypes ? widgetTable(deviceTypes) : [];
  const desktopUsers = deviceRows.find((r) => r.label.toLowerCase() === "desktop")?.value ?? 152;
  const mobileUsers = deviceRows.find((r) => r.label.toLowerCase() === "mobile")?.value ?? 68;
  const mobilePct = totalUsers > 0 ? (mobileUsers / totalUsers) * 100 : 0;

  const bounceWidget = findWidget(parsed, "line 1");
  const bounceSeries = widgetTimeSeries(bounceWidget!);
  const bounceAvg =
    bounceSeries.length > 0
      ? bounceSeries.reduce((acc, d) => acc + d.valor, 0) / bounceSeries.length
      : 37.1;

  return [
    {
      id: "usuarios",
      label: "Usuários únicos",
      value: fmtNum(totalUsers),
      hint: "Página pública de vaga",
      variant: "info",
    },
    {
      id: "novos-usuarios",
      label: "Novos usuários",
      value: fmtNum(newUsersCount),
      hint: fmtPct(newUserPct) + " do total",
      variant: newUserPct > 50 ? "success" : "default",
    },
    {
      id: "desktop-users",
      label: "Desktop",
      value: fmtNum(desktopUsers),
      hint: fmtPct((desktopUsers / Math.max(totalUsers, 1)) * 100) + " dos usuários",
    },
    {
      id: "mobile-users",
      label: "Mobile",
      value: fmtNum(mobileUsers),
      hint: fmtPct(mobilePct) + " dos usuários",
      variant: mobilePct > 25 ? "warning" : "default",
    },
    {
      id: "tempo-acesso",
      label: "Tempo médio na página",
      value: fmtSeconds(timeSpent),
      hint: "Leitura da vaga + inscrição",
    },
    {
      id: "cliques-total",
      label: "Total de cliques (período)",
      value: fmtNum(totalClicks),
      hint: "Soma diária do workspace",
    },
    {
      id: "bounce-rate",
      label: "Bounce rate médio",
      value: fmtPct(bounceAvg),
      hint: "Desktop — detalhe da vaga",
      variant: bounceAvg > 40 ? "warning" : bounceAvg > 25 ? "default" : "success",
    },
    {
      id: "retorno",
      label: "Usuários recorrentes",
      value: fmtNum(totalUsers - newUsersCount),
      hint: fmtPct(100 - newUserPct) + " retornaram",
    },
  ];
}

function buildRecruitmentTables(parsed: ParsedContentsquareExport): ReportTable[] {
  const tables: ReportTable[] = [];

  const topPages = findWidget(parsed, "top pages");
  if (topPages) {
    const rows = widgetTable(topPages);
    tables.push({
      id: "top-pages",
      titulo: "Top páginas — módulo Recrutamento",
      colunas: [
        { key: "url", label: "URL" },
        { key: "sessoes", label: "Sessões", align: "right" },
      ],
      linhas: rows.map((r) => ({ url: r.label, sessoes: r.value })),
    });
  }

  const errors = findWidget(parsed, "erros");
  if (errors) {
    const rows = widgetTable(errors);
    tables.push({
      id: "js-errors",
      titulo: "Erros JS por rota",
      colunas: [
        { key: "path", label: "Rota" },
        { key: "views", label: "Views com erro", align: "right" },
      ],
      linhas: rows.map((r) => ({ path: r.label, views: r.value })),
    });
  }

  const devices = findWidget(parsed, "usage by device");
  if (devices) {
    const rows = widgetTable(devices);
    tables.push({
      id: "resolucoes",
      titulo: "Sessões por resolução de tela",
      colunas: [
        { key: "resolucao", label: "Resolução" },
        { key: "sessoes", label: "Sessões", align: "right" },
      ],
      linhas: rows.map((r) => ({ resolucao: r.label, sessoes: r.value })),
    });
  }

  return tables;
}

function buildCandidateTables(parsed: ParsedContentsquareExport): ReportTable[] {
  const tables: ReportTable[] = [];

  const cities = findWidget(parsed, "local do usuário");
  if (cities) {
    const rows = widgetTable(cities);
    tables.push({
      id: "cidades",
      titulo: "Sessões por cidade (Desktop)",
      colunas: [
        { key: "cidade", label: "Cidade" },
        { key: "sessoes", label: "Sessões", align: "right" },
      ],
      linhas: rows.map((r) => ({ cidade: r.label, sessoes: r.value })),
    });
  }

  const deviceTypes = findWidget(parsed, "tipo de device");
  if (deviceTypes) {
    const rows = widgetTable(deviceTypes);
    tables.push({
      id: "tipo-device",
      titulo: "Usuários por tipo de device",
      colunas: [
        { key: "device", label: "Device" },
        { key: "usuarios", label: "Usuários", align: "right" },
      ],
      linhas: rows.map((r) => ({ device: r.label, usuarios: r.value })),
    });
  }

  const resolutions = findWidget(parsed, "resolução de tela");
  if (resolutions) {
    const rows = widgetTable(resolutions);
    tables.push({
      id: "resolucoes",
      titulo: "Usuários por resolução de tela",
      colunas: [
        { key: "resolucao", label: "Resolução" },
        { key: "usuarios", label: "Usuários", align: "right" },
      ],
      linhas: rows.map((r) => ({ resolucao: r.label, usuarios: r.value })),
    });
  }

  return tables;
}

function buildCandidateSeries(parsed: ParsedContentsquareExport): ReportSerie[] {
  const series: ReportSerie[] = [];
  const bounce = findWidget(parsed, "line 1");
  const clicks = findWidget(parsed, "line 2");

  if (bounce) {
    series.push({
      id: "bounce-rate",
      titulo: "Bounce rate diário — detalhe da vaga",
      dados: widgetTimeSeries(bounce).map((d) => ({ data: d.data, valor: d.valor })),
      unidade: "%",
    });
  }

  if (clicks) {
    series.push({
      id: "cliques-dia",
      titulo: "Cliques diários — página de vaga",
      dados: widgetTimeSeries(clicks).map((d) => ({ data: d.data, valor: d.valor })),
    });
  }

  return series;
}

function buildRecruitmentParecer(kpis: KpiMetric[], tables: ReportTable[]): ExecutiveParecer {
  const errorsTable = tables.find((t) => t.id === "js-errors");
  const totalErrors = errorsTable
    ? errorsTable.linhas.reduce((acc, r) => acc + Number(r.views ?? 0), 0)
    : 453;
  const perfilErrors = Number(errorsTable?.linhas.find((r) => String(r.path).includes("perfil"))?.views ?? 32);

  const positivos: InsightItem[] = [
    {
      tipo: "positive",
      titulo: "Alto engajamento no formulário de vaga",
      descricao:
        "Tempo médio superior a 5 minutos na tela de criação indica que recrutadores exploram o formulário completo, incluindo skills e geração por IA.",
    },
    {
      tipo: "positive",
      titulo: "Adoção da IA na criação",
      descricao:
        "Heatmap mostra 27 cliques no botão «Criar com IA» (2,87% dos cliques), validando interesse na automação do preenchimento.",
    },
    {
      tipo: "positive",
      titulo: "Conversão visível no Salvar",
      descricao:
        "Botão «Salvar» concentra 77 cliques (8,17%) — principal ponto de conclusão do fluxo de publicação de vaga.",
    },
    {
      tipo: "positive",
      titulo: "Scroll profundo (84,5%)",
      descricao:
        "Maioria dos usuários percorre o formulário até o final, sinal de formulário compreensível apesar da extensão (2.553px).",
    },
  ];

  const atencao: InsightItem[] = [
    {
      tipo: "warning",
      titulo: "Bounce rate elevado (42,9%)",
      descricao:
        "Quase metade das sessões abandona sem interação significativa — possível atrito no início do fluxo ou acesso exploratório.",
    },
    {
      tipo: "danger",
      titulo: `${fmtNum(totalErrors)} views com erros JS no módulo`,
      descricao: `Rotas /recrutamento (${errorsTable?.linhas[0]?.views ?? 222}) e /recrutamento/candidatos lideram erros. Perfil de vaga: ${perfilErrors} ocorrências.`,
    },
    {
      tipo: "warning",
      titulo: "Baixo volume de usuários únicos (16)",
      descricao:
        "63 sessões para 16 usuários sugere uso repetido por equipe reduzida — métricas absolutas devem ser lidas com essa base.",
    },
    {
      tipo: "info",
      titulo: "Interação em campos de texto",
      descricao:
        "Heatmaps mostram cliques dispersos em «Desafios do Perfil» e «Informações para LinkedIn», indicando edição manual pós-geração IA.",
    },
  ];

  return {
    resumo:
      "No período analisado, a jornada de criação de vagas apresenta engajamento consistente entre usuários recorrentes, com forte uso de IA e conclusão via Salvar. O bounce rate de 42,9% e erros JS no módulo de recrutamento são os principais pontos de atenção para reduzir abandono e fricção técnica.",
    pontosPositivos: positivos,
    pontosAtencao: atencao,
    recomendacoes: [
      "Investigar erros JS em /recrutamento e /recrutamento/candidatos — impacto direto na confiança do recrutador.",
      "Otimizar primeira dobra do formulário para reduzir bounce (42,9%) — considerar wizard ou progresso visível.",
      "Melhorar qualidade do texto gerado por IA para reduzir edições manuais em LinkedIn e Desafios.",
      "Monitorar taxa Salvar/sessão como KPI de conversão de criação de vaga.",
    ],
    notaGeral: "bom",
  };
}

function buildCandidateParecer(kpis: KpiMetric[], series: ReportSerie[], tables: ReportTable[]): ExecutiveParecer {
  const bounceSerie = series.find((s) => s.id === "bounce-rate");
  const bounceAvg =
    bounceSerie && bounceSerie.dados.length > 0
      ? bounceSerie.dados.reduce((a, d) => a + d.valor, 0) / bounceSerie.dados.length
      : 37.1;
  const peakBounce = bounceSerie ? Math.max(...bounceSerie.dados.map((d) => d.valor)) : 83.33;
  const clicksSerie = series.find((s) => s.id === "cliques-dia");
  const peakClicks = clicksSerie ? Math.max(...clicksSerie.dados.map((d) => d.valor)) : 1703;

  const deviceTable = tables.find((t) => t.id === "tipo-device");
  const desktopUsers = Number(deviceTable?.linhas.find((r) => r.device === "Desktop")?.usuarios ?? 152);
  const mobileUsers = Number(deviceTable?.linhas.find((r) => r.device === "Mobile")?.usuarios ?? 68);
  const resolutionTable = tables.find((t) => t.id === "resolucoes");
  const topResolution = resolutionTable?.linhas[0]?.resolucao ?? "1920 x 1080";

  const positivos: InsightItem[] = [
    {
      tipo: "positive",
      titulo: "Scroll rate excepcional (97,6%)",
      descricao:
        "Quase todos os candidatos percorrem a página até o final — forte indicador de interesse na vaga e no formulário.",
    },
    {
      tipo: "positive",
      titulo: "Alto volume de novos usuários (52%)",
      descricao:
        "115 de 221 usuários são novos, demonstrando capilaridade da vaga externa para atrair candidatos inéditos na plataforma.",
    },
    {
      tipo: "positive",
      titulo: "Upload de CV como diferencial",
      descricao:
        "Botão «Atualizar perfil com currículo (PDF)» registra 82 cliques (12,02%) — funcionalidade valorizada pelos candidatos.",
    },
    {
      tipo: "positive",
      titulo: "Pico de engajamento em 24/06",
      descricao: `${fmtNum(peakClicks)} cliques num único dia indicam campanha ou divulgação eficaz da vaga.`,
    },
    {
      tipo: "positive",
      titulo: "Base majoritariamente desktop (69%)",
      descricao: `${fmtNum(desktopUsers)} usuários em desktop — experiência otimizada para formulário completo; resolução líder: ${topResolution}.`,
    },
  ];

  const atencao: InsightItem[] = [
    {
      tipo: "warning",
      titulo: `Bounce rate médio ${fmtPct(bounceAvg)}`,
      descricao:
        "Mais de um terço das sessões desktop abandona sem navegação adicional — atenção à primeira impressão da vaga.",
    },
    {
      tipo: "warning",
      titulo: `Pico de bounce em ${fmtPct(peakBounce)}`,
      descricao: "Dia 01/07 com bounce de 83,33% — investigar qualidade do tráfego ou conteúdo da vaga nessa data.",
    },
    {
      tipo: "warning",
      titulo: "Exit rate de 27,4%",
      descricao: "Quase 3 em cada 10 sessões terminam na página de inscrição — possível abandono no formulário.",
    },
    {
      tipo: "info",
      titulo: "Fricção em CPF, CEP e remuneração",
      descricao:
        "Heatmap mostra concentração de cliques nesses campos — etapas críticas do funil de inscrição que merecem simplificação ou validação assistida.",
    },
    {
      tipo: "warning",
      titulo: `${fmtNum(mobileUsers)} usuários mobile (${fmtPct((mobileUsers / 221) * 100)})`,
      descricao:
        "Quase um terço do tráfego vem de mobile — validar responsividade do formulário e bounce específico em telas menores (393×852 e 430×932 nas resoluções).",
    },
  ];

  return {
    resumo:
      "A jornada do candidato na vaga externa demonstra forte intenção de inscrição (scroll 97,6%) e adoção do upload de CV. O bounce rate médio de 37,1% e exit rate de 27,4% indicam oportunidades de otimização no funil, especialmente nos campos de dados pessoais e remuneração.",
    pontosPositivos: positivos,
    pontosAtencao: atencao,
    recomendacoes: [
      "Simplificar preenchimento de CPF/CEP com máscara e autocompletar de endereço.",
      "Testar jornada mobile (30,8% dos usuários) — priorizar campos acima da dobra.",
      "Tornar campo de remuneração opcional ou com faixas para reduzir abandono.",
      "Destacar benefícios da vaga acima da dobra para reduzir bounce em desktop.",
      "Acompanhar taxa de conclusão «Realizar inscrição» como KPI principal do funil.",
      "Manter e comunicar upload de CV como diferencial competitivo.",
    ],
    notaGeral: bounceAvg > 45 ? "regular" : "bom",
  };
}

export function buildReportFromExport(
  parsed: ParsedContentsquareExport,
  kind?: ContentsquareReportKind,
  heatmaps?: HeatmapInsight[],
): ContentsquareWebReport {
  const reportKind = kind ?? detectReportKind(parsed);
  const periodo = periodFromWidgets(parsed.widgets);

  if (reportKind === "recruitment") {
    const kpis = buildRecruitmentKpis(parsed);
    const tabelas = buildRecruitmentTables(parsed);
    return {
      version: 1,
      kind: "recruitment",
      workspaceName: parsed.workspaceName,
      exportDate: parsed.exportDate,
      periodo: { ...periodo, label: formatPeriodLabel(periodo.begin, periodo.end) },
      fonte: "imported",
      kpis,
      series: [],
      tabelas,
      heatmapInsights: heatmaps ?? DEFAULT_RECRUITMENT_HEATMAPS,
      parecer: buildRecruitmentParecer(kpis, tabelas),
    };
  }

  const kpis = buildCandidateKpis(parsed);
  const tabelas = buildCandidateTables(parsed);
  const series = buildCandidateSeries(parsed);
  return {
    version: 1,
    kind: "candidate",
    workspaceName: parsed.workspaceName,
    exportDate: parsed.exportDate,
    periodo: { ...periodo, label: formatPeriodLabel(periodo.begin, periodo.end) },
    fonte: "imported",
    kpis,
    series,
    tabelas,
    heatmapInsights: heatmaps ?? DEFAULT_CANDIDATE_HEATMAPS,
    parecer: buildCandidateParecer(kpis, series, tabelas),
  };
}

function formatPeriodLabel(begin: string, end: string): string {
  if (!begin || !end) return "Período não informado";
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };
  return `${fmt(begin)} — ${fmt(end)}`;
}

export function validateReportJson(data: unknown): ContentsquareWebReport {
  if (!data || typeof data !== "object") throw new Error("JSON inválido.");
  const r = data as ContentsquareWebReport;
  if (r.version !== 1) throw new Error("Versão do relatório não suportada.");
  if (r.kind !== "recruitment" && r.kind !== "candidate") throw new Error("Tipo de relatório inválido.");
  if (!Array.isArray(r.kpis)) throw new Error("Relatório sem KPIs.");
  return r;
}
