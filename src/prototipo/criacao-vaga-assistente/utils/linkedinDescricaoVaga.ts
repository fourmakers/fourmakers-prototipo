import type { VagaOtimizadaResultado } from "../types";

/** Formato narrativo alinhado ao template LinkedIn / informações relevantes do Perfil de atuação */
export function buildDescricaoLinkedInVaga(r: VagaOtimizadaResultado): string {
  const impresc = r.skillsSugeridas.filter((s) => s.relevante);
  const desej = r.skillsSugeridas.filter((s) => !s.relevante);

  return [
    "Sobre a oportunidade",
    r.textoDesafioConsolidado,
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
    desej.length ? "Diferenciais desejáveis" : "",
    ...desej.map((s) => `• ${s.nome} — nível ${s.nivel}`),
    "",
    "Contexto",
    r.contextoCliente,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i + 1] === ""))
    .join("\n");
}
