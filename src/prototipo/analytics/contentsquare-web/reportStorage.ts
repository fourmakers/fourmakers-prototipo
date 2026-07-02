import type { ContentsquareReportKind, ContentsquareWebReport } from "./types";
import { getDefaultReport } from "./defaultReports";
import { validateReportJson } from "./buildReport";

const STORAGE_PREFIX = "fourmakers-cs-web-report";

function storageKey(kind: ContentsquareReportKind): string {
  return `${STORAGE_PREFIX}-${kind}`;
}

export function loadStoredReport(kind: ContentsquareReportKind): ContentsquareWebReport | null {
  try {
    const raw = localStorage.getItem(storageKey(kind));
    if (!raw) return null;
    return validateReportJson(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveReport(report: ContentsquareWebReport): void {
  localStorage.setItem(storageKey(report.kind), JSON.stringify(report));
}

export function clearStoredReport(kind: ContentsquareReportKind): void {
  localStorage.removeItem(storageKey(kind));
}

export function getActiveReport(kind: ContentsquareReportKind): ContentsquareWebReport {
  return loadStoredReport(kind) ?? getDefaultReport(kind);
}

export function exportReportJson(report: ContentsquareWebReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = report.kind === "recruitment" ? "metricas-recrutamento" : "metricas-candidatos";
  a.href = url;
  a.download = `contentsquare-${slug}-${report.periodo.end || "export"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
