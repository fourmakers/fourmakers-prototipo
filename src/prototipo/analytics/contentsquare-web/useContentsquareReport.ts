import { useCallback, useState } from "react";
import type { ContentsquareReportKind, ContentsquareWebReport } from "./types";
import { buildReportFromExport } from "./buildReport";
import { parseContentsquareXlsx, detectReportKind } from "./parseContentsquareExport";
import {
  clearStoredReport,
  exportReportJson,
  getActiveReport,
  saveReport,
} from "./reportStorage";

export function useContentsquareReport(kind: ContentsquareReportKind) {
  const [report, setReport] = useState<ContentsquareWebReport>(() => getActiveReport(kind));
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const refresh = useCallback(() => {
    setReport(getActiveReport(kind));
  }, [kind]);

  const handleImportFile = useCallback(
    async (file: File) => {
      setImporting(true);
      setImportError(null);
      try {
        const buffer = await file.arrayBuffer();
        let next: ContentsquareWebReport;

        if (file.name.endsWith(".json")) {
          const text = new TextDecoder().decode(buffer);
          const parsed = JSON.parse(text) as ContentsquareWebReport;
          if (parsed.kind !== kind) {
            throw new Error(
              `Este ficheiro é de «${parsed.kind === "recruitment" ? "Recrutamento" : "Candidatos"}». Use o dashboard correspondente.`,
            );
          }
          next = { ...parsed, fonte: "imported", importadoEm: new Date().toISOString() };
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const parsed = parseContentsquareXlsx(buffer);
          const detected = detectReportKind(parsed);
          if (detected !== kind) {
            throw new Error(
              `A planilha parece ser de «${detected === "recruitment" ? "Recrutamento" : "Candidatos"}». Importe no dashboard correcto.`,
            );
          }
          next = {
            ...buildReportFromExport(parsed, kind),
            fonte: "imported",
            importadoEm: new Date().toISOString(),
          };
        } else {
          throw new Error("Formato não suportado. Use .xlsx (Contentsquare) ou .json (exportado deste dashboard).");
        }

        saveReport(next);
        setReport(next);
      } catch (e) {
        setImportError(e instanceof Error ? e.message : "Erro ao importar ficheiro.");
      } finally {
        setImporting(false);
      }
    },
    [kind],
  );

  const handleExport = useCallback(() => {
    exportReportJson(report);
  }, [report]);

  const handleReset = useCallback(() => {
    clearStoredReport(kind);
    setReport(getActiveReport(kind));
    setImportError(null);
  }, [kind]);

  return {
    report,
    importError,
    importing,
    handleImportFile,
    handleExport,
    handleReset,
    refresh,
  };
}
