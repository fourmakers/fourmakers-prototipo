import { Link } from "react-router-dom";
import { Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ContentsquareWebDashboard } from "@/prototipo/analytics/contentsquare-web/ContentsquareWebDashboard";
import { ContentsquareReportToolbar } from "@/prototipo/analytics/contentsquare-web/ContentsquareReportToolbar";
import { useContentsquareReport } from "@/prototipo/analytics/contentsquare-web/useContentsquareReport";

export function AnalyticsMetricasRecrutamentoPage() {
  const { report, importError, importing, handleImportFile, handleExport, handleReset } =
    useContentsquareReport("recruitment");

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10" data-testid="analytics-metricas-recrutamento-page">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-secondaryText" aria-label="Breadcrumb">
        <Link to="/" className="font-medium text-primary hover:underline">
          Início
        </Link>
        <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
        <span className="text-primaryText">Métricas Recrutamento</span>
      </nav>

      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Briefcase className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="page-title text-2xl">Métricas Recrutamento</h1>
            <Badge
              variant={report.fonte === "imported" ? "default" : "outline"}
              className={cn("font-normal", report.fonte === "default" && "border-warningBorder text-warning")}
            >
              {report.fonte === "imported" ? "Contentsquare importado" : "Demo — planilha Jul/2026"}
            </Badge>
          </div>
          <p className="page-subtitle mt-0.5 max-w-3xl">
            Dashboard executivo da jornada de criação de vagas — dados Contentsquare, heatmaps e parecer de uso,
            churn e fricções no período.
          </p>
        </div>
      </div>

      <Card className="border-borderSoft bg-surfaceElevated shadow-softToken">
        <CardHeader className="pb-2 pt-6">
          <p className="text-sm font-semibold text-primaryText">Importar / exportar relatório</p>
        </CardHeader>
        <CardContent>
          <ContentsquareReportToolbar
            report={report}
            importing={importing}
            importError={importError}
            onImport={handleImportFile}
            onExport={handleExport}
            onReset={handleReset}
          />
        </CardContent>
      </Card>

      <ContentsquareWebDashboard report={report} />
    </div>
  );
}
