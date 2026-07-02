import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SerieDia } from "@/prototipo/analytics/types";
import type { ChartDatum } from "./dataCardView";
import { DataCardBarChart } from "./DataCardChartViews";

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

/** Séries temporais (bounce/cliques diários) — visualização fixa em barras. */
export function ContentsquareSerieChart({
  titulo,
  serie,
  unidade,
  testId,
}: {
  titulo: string;
  serie: SerieDia[];
  unidade?: string;
  testId: string;
}) {
  const chartData = useMemo(() => serieToChartData(serie), [serie]);

  if (serie.length === 0) return null;

  const maxValor = Math.max(...serie.map((s) => s.valor), 1);

  return (
    <Card className="border-borderSoft bg-surfaceElevated shadow-softToken" data-testid={testId}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-primaryText">{titulo}</CardTitle>
        <p className="mt-1 text-xs text-secondaryText">
          {serie.length} dias no período
          {unidade ? ` · ${unidade}` : ""}
          {maxValor === 0 ? " · sem variação registada" : ""}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <DataCardBarChart data={chartData} unidade={unidade} testId={`${testId}-bar`} />
      </CardContent>
    </Card>
  );
}
