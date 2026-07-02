import type { ContentsquareWebReport } from "./types";
import { buildReportFromExport } from "./buildReport";
import { parseContentsquareXlsx } from "./parseContentsquareExport";
import recruitmentRows from "./defaultRows-recruitment.json";
import candidateRows from "./defaultRows-candidate.json";
import * as XLSX from "xlsx";

function rowsToBuffer(rows: string[][]): ArrayBuffer {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Workspace");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return buf;
}

function buildDefault(kind: "recruitment" | "candidate"): ContentsquareWebReport {
  const rows = (kind === "recruitment" ? recruitmentRows : candidateRows) as string[][];
  const parsed = parseContentsquareXlsx(rowsToBuffer(rows));
  const report = buildReportFromExport(parsed, kind);
  return { ...report, fonte: "default" };
}

export const DEFAULT_RECRUITMENT_REPORT: ContentsquareWebReport = buildDefault("recruitment");
export const DEFAULT_CANDIDATE_REPORT: ContentsquareWebReport = buildDefault("candidate");

export function getDefaultReport(kind: "recruitment" | "candidate"): ContentsquareWebReport {
  return kind === "recruitment" ? DEFAULT_RECRUITMENT_REPORT : DEFAULT_CANDIDATE_REPORT;
}
