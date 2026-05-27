import { useMemo } from "react";
import type { ColaboradorRef } from "../types";
import { COLABORADORES_ATIVOS_MOCK } from "../mocks/colaboradoresAtivos";

function filtrarColaboradores(lista: ColaboradorRef[], query: string): ColaboradorRef[] {
  const q = query.trim().toLowerCase();
  if (!q) return lista;
  return lista.filter(
    (c) =>
      c.nome.toLowerCase().includes(q) ||
      c.cargo.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q),
  );
}

/** Mock local — TODO: integrar API com cliente_id e debounce */
export function useColaboradoresAtivos(query: string) {
  const colaboradores = useMemo(
    () => filtrarColaboradores(COLABORADORES_ATIVOS_MOCK, query),
    [query],
  );

  return {
    colaboradores,
    isLoading: false,
    isError: false,
  };
}
