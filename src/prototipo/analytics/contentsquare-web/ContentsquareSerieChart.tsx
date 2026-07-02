import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SerieDia } from "@/prototipo/analytics/types";
import type { ChartDatum } from "./dataCardView";
import { DataCardViewSelector } from "./DataCardViewSelector";
import { DataCardBarChart, DataCardDonutChart, DataCardSeriesList } from "./DataCardChartViews";
import { useDataCardView } from "./useDataCardView";

function formatAxisDate(iso: string): string {
  const [, mm, dd] = iso.split("-");
  return `${dd}/${mm}`;
}

function serieToChartData(serie: SerieDia[]): ChartDatum[] {
  return serie.map((s) => ({
    id: s.data,
    label: formatAxisDate(s.data),
    value: s.valor,
  }));
}

export function ContentsquareSerieChart({
  cardId,
  titulo,
  serie,
  unidade,
  testId,
}: {
  cardId: string;
  titulo: string;
  serie: SerieDia[];
  unidade?: string;
  testId: string;
}) {
  const { view, setView } = useDataCardView(cardId);
  const chartData = useMemo(() => serieToChartData(serie), [serie]);

  if (serie.length === 0) return null;

  const maxValor = Math.max(...serie.map((s) => s.valor), 1);
  const valueLabel = unidade === "%" ? "Taxa" : "Volume";

  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={testId}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold text-primaryText">{titulo}</CardTitle>
          <p className="mt-1 text-xs text-secondaryText">
            {serie.length} dias no período
            {unidade ? ` · ${unidade}` : ""}
            {maxValor === 0 ? " · sem variação registada" : ""}
          </p>
        </div>
        <DataCardViewSelector value={view} onChange={setView} testId={`${testId}-view`} />
      </CardHeader>
      <CardContent className={view === "list" ? "p-0 sm:p-6 sm:pt-0" : "pt-0"}>
        {view === "list" ? (
          <DataCardSeriesList data={chartData} valueLabel={valueLabel} unidade={unidade} />
        ) : null}
        {view === "donut" ? (
          <DataCardDonutChart data={chartData} unidade={unidade} testId={`${testId}-donut`} />
        ) : null}
        {view === "bar" ? (
          <DataCardBarChart data={chartData} unidade={unidade} testId={`${testId}-bar`} />
        ) : null}
      </CardContent>
    </Card>
  );
}
