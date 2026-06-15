import type { VagaOtimizadaResultado } from "../types";

/** Formato narrativo alinhado ao template LinkedIn / informações relevantes do Perfil de atuação */
export function buildDescricaoLinkedInVaga(r: VagaOtimizadaResultado): string {
  const perfil = r.api.perfilExtraido;
  const impresc = r.skillsSugeridas.filter((s) => s.relevante && s.origem === "extraida");
  const propostas = r.skillsSugeridas.filter((s) => s.origem === "proposta");

  return [
    "Sobre a oportunidade",
    perfil.informacoesRelevantes || r.textoDesafioConsolidado,
    "",
    "O que você vai fazer",
    ...r.desafios.map((d) => `• ${d}`),
    "",
    "Objetivos da posição",
    ...r.objetivos.map((o) => `• ${o}`),
    "",
    "Requisitos (imprescindíveis)",
    ...impresc.map((s) => `• ${s.nome} — nível ${s.nivel}`),
    "",
    propostas.length ? "Diferenciais sugeridos pela IA" : "",
    ...propostas.map((s) => `• ${s.nome} — nível ${s.nivel}`),
    "",
    "Modelo de trabalho",
    perfil.modeloTrabalhoDescricao ?? "A combinar",
    "",
    "Contexto",
    r.contextoCliente,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i + 1] === ""))
    .join("\n");
}
