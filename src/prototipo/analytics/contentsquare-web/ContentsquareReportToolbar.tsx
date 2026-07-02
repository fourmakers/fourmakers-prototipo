import { useRef } from "react";
import { Download, FileUp, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContentsquareWebReport } from "./types";

export function ContentsquareReportToolbar({
  report,
  importing,
  importError,
  onImport,
  onExport,
  onReset,
}: {
  report: ContentsquareWebReport;
  importing: boolean;
  importError: string | null;
  onImport: (file: File) => void;
  onExport: () => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3" data-testid="cs-report-toolbar">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={report.fonte === "imported" ? "default" : "outline"}
          className={cn(report.fonte === "default" && "text-secondaryText")}
        >
          {report.fonte === "imported" ? "Dados importados" : "Dados de demonstração"}
        </Badge>
        {report.importadoEm ? (
          <span className="text-xs text-secondaryText">
            Importado em {new Date(report.importadoEm).toLocaleString("pt-BR")}
          </span>
        ) : null}
        <span className="text-xs text-secondaryText">
          Export Contentsquare: {report.exportDate || "—"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={importing}
          onClick={() => inputRef.current?.click()}
          data-testid="cs-import-btn"
        >
          {importing ? <RefreshCw className="size-4 animate-spin" /> : <FileUp className="size-4" />}
          Importar (.xlsx / .json)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onExport}
          data-testid="cs-export-btn"
        >
          <Download className="size-4" />
          Exportar relatório
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-secondaryText"
          onClick={onReset}
          data-testid="cs-reset-btn"
        >
          <RotateCcw className="size-4" />
          Restaurar dados demo
        </Button>
      </div>

      {importError ? (
        <p className="text-sm text-destructive" data-testid="cs-import-error">
          {importError}
        </p>
      ) : (
        <p className="text-xs text-secondaryText">
          Importe exportações do Contentsquare (.xlsx) ou relatórios JSON gerados aqui. No futuro, estes dados virão
          via API.
        </p>
      )}
    </div>
  );
}
