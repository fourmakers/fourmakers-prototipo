import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import * as XLSX from "xlsx";
import {
  parseContentsquareXlsx,
  widgetTable,
  widgetTimeSeries,
} from "./parseContentsquareExport";

function rowsToBuffer(rows: string[][]): ArrayBuffer {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Workspace");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

describe("parseContentsquareExport", () => {
  it("exclui metadados das tabelas de cidade", () => {
    const rows = JSON.parse(
      readFileSync(join(__dirname, "defaultRows-candidate.json"), "utf-8"),
    ) as string[][];
    const parsed = parseContentsquareXlsx(rowsToBuffer(rows));
    const cities = parsed.widgets.find((w) => w.name.includes("Local"))!;
    const table = widgetTable(cities);

    expect(table.map((r) => r.label)).toEqual([
      "São Paulo",
      "Mogi das Cruzes",
      "Curitiba",
      "Osasco",
      "Cotia",
      "Salvador",
      "Rio de Janeiro",
    ]);
    expect(table.find((r) => r.label === "Segment")).toBeUndefined();
    expect(table.find((r) => r.label === "City")).toBeUndefined();
  });

  it("parseia séries temporais de bounce e cliques", () => {
    const rows = JSON.parse(
      readFileSync(join(__dirname, "defaultRows-candidate.json"), "utf-8"),
    ) as string[][];
    const parsed = parseContentsquareXlsx(rowsToBuffer(rows));
    const bounce = parsed.widgets.find((w) => w.name.includes("line 1"))!;
    const clicks = parsed.widgets.find((w) => w.name.includes("line 2"))!;

    const bounceSeries = widgetTimeSeries(bounce);
    const clicksSeries = widgetTimeSeries(clicks);

    expect(bounceSeries).toHaveLength(30);
    expect(clicksSeries).toHaveLength(30);
    expect(bounceSeries[0]).toEqual({ data: "2026-06-02", valor: 0 });
    expect(clicksSeries.find((d) => d.data === "2026-06-24")?.valor).toBe(1703);
    expect(clicksSeries.reduce((a, d) => a + d.valor, 0)).toBeGreaterThan(7000);
  });

  it("parseia tipo de device e resolução de tela", () => {
    const rows = JSON.parse(
      readFileSync(join(__dirname, "defaultRows-candidate.json"), "utf-8"),
    ) as string[][];
    const parsed = parseContentsquareXlsx(rowsToBuffer(rows));
    const devices = parsed.widgets.find((w) => w.name.toLowerCase().includes("tipo de device"))!;
    const resolutions = parsed.widgets.find((w) => w.name.toLowerCase().includes("resolução"))!;

    const deviceTable = widgetTable(devices);
    const resolutionTable = widgetTable(resolutions);

    expect(deviceTable.map((r) => r.label)).toEqual(["Desktop", "Mobile", "Unknown", "Tablet"]);
    expect(deviceTable[0].value).toBe(152);
    expect(resolutionTable[0]).toEqual({ label: "1920 x 1080", value: 53 });
  });
});
