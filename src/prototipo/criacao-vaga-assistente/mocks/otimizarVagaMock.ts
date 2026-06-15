import type {
  CriarPerfilVagaApiResponse,
  EntradaFormularioVaga,
  GestorExternoPerfilSkill,
  ModoEntradaVaga,
  PerfilExtraido,
  SkillSugerida,
  VagaOtimizadaResultado,
} from "../types";
import { recalcularValidacao } from "../utils/recalcularCompletude";

const MODELO_REMOTO_ID = "18a53d58-b3cd-11ef-9eb3-0e1e12942759";

function skillTipo(itemPerfilDescricao: string): SkillSugerida["tipo"] {
  const map: Record<string, SkillSugerida["tipo"]> = {
    COMPETENCIA: "competencia",
    SOFTSKILL: "softskill",
    DOMINIONEGOCIO: "dominio",
    METODOLOGIA: "metodologia",
    IDIOMA: "idioma",
  };
  return map[itemPerfilDescricao.toUpperCase()] ?? "competencia";
}

function mapSkills(
  items: GestorExternoPerfilSkill[],
  origem: "extraida" | "proposta",
): SkillSugerida[] {
  return items.map((s) => ({
    nome: s.skill.descricao,
    tipo: skillTipo(s.itemPerfil.descricao),
    relevante: s.relevante,
    nivel: s.nivel.descricao,
    origem,
  }));
}

function extrairTitulo(prompt: string | undefined, form?: EntradaFormularioVaga): string {
  if (form?.tituloVaga?.trim()) return form.tituloVaga.trim();
  if (prompt?.toLowerCase().includes("tech lead")) return "Tech Lead Frontend Senior";
  if (prompt?.toLowerCase().includes("flutter")) return "Tech Lead Frontend Senior";
  if (prompt?.toLowerCase().includes("ux")) return "Senior UX/UI Designer";
  return "Tech Lead Frontend Senior";
}

function extrairInformacoes(prompt: string | undefined, form?: EntradaFormularioVaga): string {
  if (form?.contextoBreve?.trim()) return form.contextoBreve.trim();
  if (prompt?.trim()) {
    return prompt.trim().slice(0, 280);
  }
  return "Desenvolver e manter aplicações web e mobile no FlutterFlow, integrando o front-end com APIs e serviços back-end, colaborando com equipes e propondo otimizações contínuas.";
}

function modeloFromForm(form?: EntradaFormularioVaga): { id: string | null; descricao: string | null } {
  const map: Record<string, { id: string; descricao: string }> = {
    remoto: { id: MODELO_REMOTO_ID, descricao: "Remoto" },
    hibrido: { id: "hibrido-mock-id", descricao: "Híbrido" },
    presencial: { id: "presencial-mock-id", descricao: "Presencial" },
  };
  return map[form?.modeloTrabalho ?? ""] ?? { id: MODELO_REMOTO_ID, descricao: "Remoto" };
}

/** Mock alinhado ao contrato POST criar perfil/vaga com prompt */
export function buildCriarPerfilVagaApiMock(
  modo: ModoEntradaVaga,
  form?: EntradaFormularioVaga,
  prompt?: string,
): CriarPerfilVagaApiResponse {
  const modelo = modeloFromForm(form);
  const nomePerfil = extrairTitulo(prompt, form);
  const informacoesRelevantes = extrairInformacoes(prompt, form);

  const skillsExtraidas: GestorExternoPerfilSkill[] = [
    sk("COMPETENCIA", 1, "FLUTTER FLOW", 599, "Senior", 4),
    sk("COMPETENCIA", 1, "Design System", 3405, "Senior", 4),
    sk("COMPETENCIA", 1, "CURSOR", 37472, "Senior", 4),
    sk("COMPETENCIA", 1, "React", 2133, "Senior", 4),
    sk("COMPETENCIA", 1, "DART FLUTTER", 196451, "Pleno", 3),
    sk("COMPETENCIA", 1, "FLUTTER", 559, "Pleno", 3),
    sk("SOFTSKILL", 8, "Proatividade", 22, "Avançado", 21),
  ];

  const skillsPropostas: GestorExternoPerfilSkill[] = [
    sk("COMPETENCIA", 1, "TypeScript", 331, "Senior", 4),
    sk("COMPETENCIA", 1, "Redux", 558, "Pleno", 3),
    sk("SOFTSKILL", 8, "Resiliência", 16, "Avançado", 21),
    sk("DOMINIONEGOCIO", 4, "E-commerce", 3753, "Intermediário", 15),
    sk("METODOLOGIA", 3, "Extreme Programming", 5091, "Intermediário", 12),
    sk("IDIOMA", 9, "Inglês", 2, "Fluente", 27),
  ];

  const perfilExtraido: PerfilExtraido = {
    codGestorExterno: null,
    nomePerfil,
    custoPerfil: 0,
    ratecardPerfil: 0,
    informacoesRelevantes,
    permanenciaId: null,
    modeloTrabalhoId: modelo.id,
    modeloTrabalhoDescricao: modelo.descricao,
    profissionalLocalidadeId: null,
    cidade: null,
    estado: null,
    hibridoDias: 0,
    cep: null,
    origem: modo === "prompt" ? "prompt_ia" : "formulario",
    gestorExternoPerfilSkills: skillsExtraidas,
  };

  const validacaoInformacoes = recalcularValidacao(perfilExtraido);

  return {
    perfilExtraido,
    skillsPropostas: { gestorExternoPerfilSkills: skillsPropostas },
    validacaoInformacoes,
    metadadosConsulta: {
      tempoProcessamento: modo === "prompt" ? 28.34 : 18.2,
      numeroTokens: modo === "prompt" ? 5897 : 3200,
      modeloUsado: "gpt-4o-mini",
      provedor: "openai",
    },
  };
}

function sk(
  itemDesc: string,
  itemId: number,
  skillDesc: string,
  skillId: number,
  nivelDesc: string,
  nivelId: number,
): GestorExternoPerfilSkill {
  return {
    itemPerfil: { descricao: itemDesc, id: itemId },
    skill: { descricao: skillDesc, id: skillId },
    nivel: { descricao: nivelDesc, id: nivelId },
    relevante: true,
  };
}

/** Deriva campos de UI a partir da resposta API + contexto de entrada */
export function mapApiToResultado(
  api: CriarPerfilVagaApiResponse,
  modo: ModoEntradaVaga,
  form?: EntradaFormularioVaga,
  prompt?: string,
): VagaOtimizadaResultado {
  const cliente = form?.cliente || "Cliente B2B SaaS";
  const gestor = form?.gestor || "Head of Product";
  const { perfilExtraido, skillsPropostas, validacaoInformacoes } = api;

  const skillsExtraidas = mapSkills(perfilExtraido.gestorExternoPerfilSkills, "extraida");
  const skillsPropostasMapped = mapSkills(skillsPropostas.gestorExternoPerfilSkills, "proposta");
  const todasSkills = [...skillsExtraidas, ...skillsPropostasMapped];

  const desafios = [
    `Liderar evolução técnica do front-end (${perfilExtraido.modeloTrabalhoDescricao ?? "Remoto"})`,
    "Integrar FlutterFlow com APIs e serviços back-end de forma escalável",
    "Garantir consistência visual via Design System e boas práticas de UX",
    "Colaborar com Product Managers e UX Designers em entregas ágeis",
    "Propor otimizações contínuas de performance e DX (Cursor, React, Flutter)",
  ];

  return {
    api,
    promptOriginal: modo === "prompt" ? prompt : undefined,
    tituloSugerido: perfilExtraido.nomePerfil,
    scoreQualidade: Math.round(validacaoInformacoes.completudePercentual),
    previewMercado: {
      mediaAderenciaPrevista: Math.min(92, 68 + Math.round(validacaoInformacoes.completudePercentual / 4)),
      talentosBancoAcima80: 142,
      talentosQualificadosSimilares: 38,
      vagasSimilaresReferencia: "Tech Lead Frontend (últimos 90 dias)",
    },
    contextoCliente: `${cliente} busca perfil ${perfilExtraido.nomePerfil} para acelerar entregas digitais. Modelo ${perfilExtraido.modeloTrabalhoDescricao ?? "a definir"}.`,
    contextoGestor: `${gestor} prioriza fit técnico em React/Flutter e colaboração cross-funcional — foco em match sustentável nos primeiros 90 dias.`,
    momentoMercado:
      "Oferta aquecida para Tech Lead Frontend: escassez de perfis com FlutterFlow + Design System. Candidatos full-stack front-end adaptam-se mais rápido.",
    desafios,
    objetivos: [
      "Entregar evoluções de produto em 90 dias com qualidade e previsibilidade",
      "Elevar aderência do banco de talentos acima de 80%",
      "Reduzir retrabalho entre design e engenharia",
    ],
    insightsTriagem: [
      "Priorize candidatos com experiência comprovada em FlutterFlow ou Flutter/Dart",
      "Design System e React são imprescindíveis para o match",
      "Validar inglês fluente para squads com stakeholders internacionais",
    ],
    antiChurn: [
      "Alinhar expectativa de remuneração antes da shortlist",
      "Confirmar modelo de trabalho e localidade com candidato",
      "PDI claro nos primeiros 60 dias para gaps de metodologia",
    ],
    hierarquiaMatch: [
      { label: "Desafio da vaga", peso: 40, descricao: "Critérios derivados dos desafios — maior peso no match" },
      { label: "Contexto & experiências", peso: 35, descricao: "Trajetória, tempo médio de casa, setor" },
      { label: "Skills", peso: 25, descricao: "Hard/soft imprescindíveis vs desejáveis" },
    ],
    criteriosAderencia: [
      c("flutter", "Flutter / FlutterFlow", 5, "Entregas mobile e low-code", "Cases publicados"),
      c("react", "React", 5, "Front-end escalável", "Projetos B2B"),
      c("ds", "Design System", 4, "Consistência visual", "Governança de tokens"),
      c("lideranca", "Liderança técnica", 4, "Mentoria e decisões", "Squads anteriores"),
      c("agil", "Metodologias ágeis", 3, "Entregas iterativas", "XP ou Scrum"),
      c("idioma", "Inglês", 4, "Comunicação internacional", "Fluente"),
    ],
    skillsSugeridas: todasSkills,
    textoDesafioConsolidado: perfilExtraido.informacoesRelevantes,
    pdiOrganizacional: "Para gaps em metodologia: pairing com Chapter Lead + certificação XP nos primeiros 60 dias.",
  };
}

/** TODO: integrar POST criar perfil/vaga com prompt */
export function buildVagaOtimizadaMock(
  modo: ModoEntradaVaga,
  form?: EntradaFormularioVaga,
  prompt?: string,
): VagaOtimizadaResultado {
  const api = buildCriarPerfilVagaApiMock(modo, form, prompt);
  return mapApiToResultado(api, modo, form, prompt);
}

function c(id: string, nome: string, peso: number, desafio: string, evidencia: string) {
  return { id, nome, peso, desafioVaga: desafio, evidenciaEsperada: evidencia };
}
