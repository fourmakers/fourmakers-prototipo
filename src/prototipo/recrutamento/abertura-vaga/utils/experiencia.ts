import { differenceInDays, parseISO } from "date-fns";

export const DIAS_EXPERIENCIA = 90;

export type CorBarraExperiencia = "error" | "warning" | "info";

export interface ExperienciaCalculada {
  dias: number;
  dentro: boolean;
  pct: number;
  restantes: number;
  corBarra: CorBarraExperiencia;
}

export function calcularExperiencia(dataAdmissao: string): ExperienciaCalculada {
  const dias = differenceInDays(new Date(), parseISO(dataAdmissao));
  return {
    dias,
    dentro: dias <= DIAS_EXPERIENCIA,
    pct: Math.min(100, Math.round((dias / DIAS_EXPERIENCIA) * 100)),
    restantes: Math.max(0, DIAS_EXPERIENCIA - dias),
    corBarra: dias >= 70 ? "error" : dias >= 40 ? "warning" : "info",
  };
}

export function formatarDataAdmissao(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
