import * as XLSX from "xlsx";
import type { ContentsquareReportKind, ParsedContentsquareExport, ContentsquareWidget } from "./types";

function normalizeCell(cell: XLSX.CellObject | undefined): string {
  if (!cell) return "";
  if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
  if (cell.v == null) return "";
  if (cell.v instanceof Date) {
    const d = cell.v;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  return String(cell.v).trim();
}

/** Chaves de metadados do export Contentsquare — nunca são linhas de dados. */
const METADATA_KEYS = new Set([
  "Workspace name",
  "Export date",
  "Group",
  "Widget name",
  "Analysis level",
  "Page",
  "Metric name",
  "Metric display",
  "Group by",
  "Segment",
  "Device",
  "Beginning date",
  "End date",
  "Time spent",
  "Number of sessions",
  "Number of users",
  "Number of clicks",
  "Bounce rate",
  "Number of page views with errors",
]);

const METRIC_COLUMN_PATTERNS = [
  /^number of /i,
  /^time spent$/i,
  /bounce rate/i,
  /page views with errors/i,
];

function rowsFromSheet(sheet: XLSX.WorkSheet): string[][] {
  const ref = sheet["!ref"];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const rows: string[][] = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      row.push(normalizeCell(cell));
    }
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  return rows;
}

function isDateLike(raw: string): boolean {
  return /^\d{1,2}\/\d{1,2}\/\d{4}/.test(raw.trim());
}

function parseDateCell(raw: string): string | null {
  const trimmed = raw.trim();
  if (isDateLike(trimmed)) return parseContentsquareDate(trimmed);

  const serial = Number(trimmed);
  if (Number.isFinite(serial) && serial > 30_000 && serial < 80_000) {
    const parts = XLSX.SSF.parse_date_code(serial);
    if (parts) {
      return `${parts.y}-${String(parts.m).padStart(2, "0")}-${String(parts.d).padStart(2, "0")}`;
    }
  }
  return null;
}

function isTableHeaderRow(row: string[]): boolean {
  const c0 = (row[0] ?? "").trim();
  const c1 = (row[1] ?? "").trim();
  const c2 = (row[2] ?? "").trim();

  // Tabela dimensão × métrica: City | Number of sessions, Device | Number of users
  if (c0 && c1 && METRIC_COLUMN_PATTERNS.some((p) => p.test(c1))) return true;

  // Série temporal: | Bounce rate | Date
  if (!c0 && c1 && c2.toLowerCase() === "date") return true;

  // Metadados do widget (Segment | All users) — não é cabeçalho de dados
  if (METADATA_KEYS.has(c0)) return false;

  return false;
}

function isDataRow(row: string[], headers: string[]): boolean {
  const label = (row[0] ?? "").trim();
  const valueRaw = (row[1] ?? "").trim();

  if (METADATA_KEYS.has(label)) return false;

  const headerLabels = new Set(headers.map((h) => h.toLowerCase()).filter(Boolean));
  if (label && headerLabels.has(label.toLowerCase())) return false;

  const dateColIdx = headers.findIndex((h) => h.toLowerCase() === "date");
  if (dateColIdx >= 0) {
    return parseDateCell(row[dateColIdx] ?? "") !== null;
  }

  if (!label || !valueRaw) return false;

  const n = Number(String(valueRaw).replace(",", "."));
  return Number.isFinite(n);
}

function parseWidgets(rows: string[][]): ContentsquareWidget[] {
  const widgets: ContentsquareWidget[] = [];
  let current: ContentsquareWidget | null = null;
  let inTable = false;

  for (const row of rows) {
    const key = row[0] ?? "";
    const val = row[1] ?? "";

    if (key === "Widget name") {
      if (current) widgets.push(current);
      current = { name: val, meta: {}, headers: [], rows: [] };
      inTable = false;
      continue;
    }

    if (!current) continue;

    if (isTableHeaderRow(row)) {
      current.headers = [...row];
      inTable = true;
      continue;
    }

    if (!inTable) {
      if (key && val && !key.startsWith("Widget")) {
        current.meta[key] = val;
        if (row[2]) current.meta[`${key} (2)`] = row[2];
      }
      continue;
    }

    if (row.every((c) => !c)) {
      inTable = false;
      continue;
    }

    if (isDataRow(row, current.headers)) {
      current.rows.push(row);
    }
  }

  if (current) widgets.push(current);
  return widgets;
}

export function parseContentsquareXlsx(buffer: ArrayBuffer): ParsedContentsquareExport {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = rowsFromSheet(sheet);

  const workspaceName = rows.find((r) => r[0] === "Workspace name")?.[1] ?? "Contentsquare";
  const exportDate = rows.find((r) => r[0] === "Export date")?.[1] ?? "";
  const widgets = parseWidgets(rows);

  return { workspaceName, exportDate, widgets };
}

export function detectReportKind(parsed: ParsedContentsquareExport): ContentsquareReportKind {
  const name = parsed.workspaceName.toLowerCase();
  if (name.includes("candidato") || name.includes("vaga externa") || name.includes("externa")) {
    return "candidate";
  }
  return "recruitment";
}

export function widgetScalar(widget: ContentsquareWidget, metricKey: string): number | null {
  const direct = widget.meta[metricKey];
  if (direct) {
    const n = Number(String(direct).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  const row = widget.rows.find((r) => r[0] === metricKey);
  if (row?.[1] != null && row[1] !== "") {
    const n = Number(String(row[1]).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function widgetTable(
  widget: ContentsquareWidget,
): { label: string; value: number; extra?: string }[] {
  if (widget.headers.length < 2) return [];

  const dateColIdx = widget.headers.findIndex((h) => h.toLowerCase() === "date");
  if (dateColIdx >= 0) return [];

  return widget.rows
    .filter((r) => isDataRow(r, widget.headers) && (r[0] ?? "").trim().length > 0)
    .map((r) => ({
      label: r[0],
      value: Number(String(r[1]).replace(",", ".")) || 0,
      extra: r[2] || undefined,
    }));
}

export function widgetTimeSeries(widget: ContentsquareWidget): { data: string; valor: number }[] {
  const dateColIdx = widget.headers.findIndex((h) => h.toLowerCase() === "date");
  const valueColIdx = dateColIdx > 0 ? dateColIdx - 1 : 1;

  if (dateColIdx < 0) return [];

  return widget.rows
    .map((r) => {
      const parsedDate = parseDateCell(r[dateColIdx] ?? "");
      if (!parsedDate) return null;
      return {
        data: parsedDate,
        valor: Number(String(r[valueColIdx]).replace(",", ".")) || 0,
      };
    })
    .filter((row): row is { data: string; valor: number } => row !== null)
    .sort((a, b) => a.data.localeCompare(b.data));
}

function parseContentsquareDate(raw: string): string {
  const parts = raw.trim().split("/");
  if (parts.length === 3) {
    const [mm, dd, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return raw;
}

export function periodFromWidgets(widgets: ContentsquareWidget[]): { begin: string; end: string; label: string } {
  const first = widgets[0];
  const beginRaw = first?.meta["Beginning date"] ?? "";
  const endRaw = first?.meta["End date"] ?? "";
  const begin = beginRaw.split(" ")[0] ?? "";
  const end = endRaw.split(" ")[0] ?? "";
  return {
    begin: parseContentsquareDate(begin),
    end: parseContentsquareDate(end),
    label: begin && end ? `${begin} — ${end}` : "Período não informado",
  };
}
