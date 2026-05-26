import type { AnalyticsApiEnvelope } from "./types.js";

export function ok<T>(retorno: T, mensagem: string | null = null): AnalyticsApiEnvelope<T> {
  return { retorno, sucesso: true, mensagem, erros: null };
}

export function fail<T>(mensagem: string, erros?: string[] | string): AnalyticsApiEnvelope<T> {
  return { retorno: null, sucesso: false, mensagem, erros: erros ?? null };
}
