import type { PerfilExtraido, VagaOtimizadaResultado } from "../types";
import { buildDescricaoLinkedInVaga } from "./linkedinDescricaoVaga";
import { recalcularPreviewMercado } from "./recalcularPreviewMercado";
import { recalcularValidacao } from "./recalcularCompletude";

/** Atualiza resultado após edição do perfil no preview (refinamento em tempo real). */
export function updateResultadoFromPerfil(
  atual: VagaOtimizadaResultado,
  perfil: PerfilExtraido,
  recalcularMercado = true,
): VagaOtimizadaResultado {
  const validacaoInformacoes = recalcularValidacao(perfil);
  const scoreQualidade = Math.round(validacaoInformacoes.completudePercentual);

  const next: VagaOtimizadaResultado = {
    ...atual,
    tituloSugerido: perfil.nomePerfil,
    scoreQualidade,
    textoDesafioConsolidado: perfil.informacoesRelevantes,
    api: {
      ...atual.api,
      perfilExtraido: perfil,
      validacaoInformacoes,
    },
  };

  if (recalcularMercado) {
    next.previewMercado = recalcularPreviewMercado({
      ...atual.previewMercado,
      mediaAderenciaPrevista: Math.min(94, Math.max(68, 68 + Math.round(scoreQualidade / 4))),
    });
  }

  return next;
}

export { buildDescricaoLinkedInVaga };
