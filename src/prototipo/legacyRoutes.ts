import { PROTOTIPO_REGISTRY } from "./registry";

/** URLs antigas → path actual (bookmarks e links partilhados). */
const EXTRA_LEGACY: Record<string, string> = {
  "/recrutamento/analise-aderencia": "/analise-aderencia",
  "/prototipo/recrutamento/analise-aderencia": "/analise-aderencia",
  "/recrutamento/abertura-vaga-substituicao": "/abertura-vaga-substituicao",
  "/prototipo/recrutamento/abertura-vaga-substituicao": "/abertura-vaga-substituicao",
  "/analytics/metricas-app": "/metricas-app",
  "/prototipo/analytics/metricas-app": "/metricas-app",
};

export function getLegacyRouteRedirects(): { from: string; to: string }[] {
  const fromRegistry = PROTOTIPO_REGISTRY.map((entry) => ({
    from: `/prototipo${entry.path}`,
    to: entry.path,
  }));

  const fromExtra = Object.entries(EXTRA_LEGACY).map(([from, to]) => ({ from, to }));

  const seen = new Set<string>();
  return [...fromRegistry, ...fromExtra].filter(({ from }) => {
    if (seen.has(from)) return false;
    seen.add(from);
    return true;
  });
}
