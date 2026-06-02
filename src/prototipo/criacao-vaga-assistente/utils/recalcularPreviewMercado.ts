import type { PreviewMercadoVaga } from "../types";

/** Simula recálculo de aderência após refinamento da vaga (protótipo). */
export function recalcularPreviewMercado(atual: PreviewMercadoVaga): PreviewMercadoVaga {
  const delta = () => Math.floor(Math.random() * 5) - 2;
  return {
    mediaAderenciaPrevista: Math.min(94, Math.max(68, atual.mediaAderenciaPrevista + delta())),
    talentosBancoAcima80: Math.max(80, atual.talentosBancoAcima80 + delta() * 3),
    talentosQualificadosSimilares: Math.max(20, atual.talentosQualificadosSimilares + delta()),
    vagasSimilaresReferencia: atual.vagasSimilaresReferencia,
  };
}
