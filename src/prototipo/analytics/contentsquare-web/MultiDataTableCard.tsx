import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportTable } from "./types";
import type { ChartDatum } from "./dataCardView";
import { DataCardViewSelector } from "./DataCardViewSelector";
import { DataCardBarChart, DataCardDonutChart, DataCardListTable } from "./DataCardChartViews";
import { useDataCardView } from "./useDataCardView";

function tableToChartData(table: ReportTable): ChartDatum[] {
  const labelKey = table.colunas[0]?.key ?? "label";
  const valueKey = table.colunas.find((c) => c.align === "right")?.key ?? table.colunas[1]?.key ?? "value";

  return table.linhas.map((linha, idx) => ({
    id: `${labelKey}-${idx}`,
    label: String(linha[labelKey] ?? "—"),
    value: Number(linha[valueKey]) || 0,
  }));
}

export function MultiDataTableCard({
  table,
  reportKind,
}: {
  table: ReportTable;
  reportKind: string;
}) {
  const cardId = `${reportKind}-table-${table.id}`;
  const { view, setView } = useDataCardView(cardId);
  const valueLabel = table.colunas.find((c) => c.align === "right")?.label ?? "Valor";
  const chartData = useMemo(() => tableToChartData(table), [table]);
  const horizontalBar = table.colunas[0]?.key === "url" || table.colunas[0]?.key === "path";

  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={`cs-table-card-${table.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold text-primaryText">{table.titulo}</CardTitle>
          <p className="mt-1 text-xs text-secondaryText">{table.linhas.length} itens</p>
        </div>
        <DataCardViewSelector
          value={view}
          onChange={setView}
          testId={`cs-view-selector-${table.id}`}
        />
      </CardHeader>
      <CardContent className={view === "list" ? "p-0 sm:p-6 sm:pt-0" : "pt-0"}>
        {view === "list" ? <DataCardListTable table={table} valueLabel={valueLabel} /> : null}
        {view === "donut" ? (
          <DataCardDonutChart data={chartData} testId={`cs-donut-${table.id}`} />
        ) : null}
        {view === "bar" ? (
          <DataCardBarChart
            data={chartData}
            horizontal={horizontalBar}
            testId={`cs-bar-${table.id}`}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
