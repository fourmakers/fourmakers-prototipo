import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { ReportTable } from "./types";
import type { ChartDatum } from "./dataCardView";
import {
  DATA_CHART_COLORS,
  formatDataValue,
  prepareDonutData,
  truncateLabel,
} from "./dataCardView";

function buildChartConfig(data: ChartDatum[]) {
  const config: Record<string, { label: string; color: string }> = {
    value: { label: "Valor", color: DATA_CHART_COLORS[0] },
  };
  data.forEach((d, i) => {
    config[d.id] = { label: d.label, color: DATA_CHART_COLORS[i % DATA_CHART_COLORS.length] };
  });
  return config;
}

export function DataCardListTable({
  table,
  valueLabel,
}: {
  table: ReportTable;
  valueLabel: string;
}) {
  const labelKey = table.colunas[0]?.key ?? "label";
  const valueKey = table.colunas.find((c) => c.align === "right")?.key ?? table.colunas[1]?.key ?? "value";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{table.colunas[0]?.label ?? "Item"}</TableHead>
          <TableHead className="text-right">{valueLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.linhas.map((linha, idx) => (
          <TableRow key={idx}>
            <TableCell
              className={cn(
                labelKey === "url" || labelKey === "path" ? "font-mono text-xs" : "",
              )}
            >
              {String(linha[labelKey] ?? "—")}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {typeof linha[valueKey] === "number"
                ? Number(linha[valueKey]).toLocaleString("pt-BR")
                : String(linha[valueKey] ?? "—")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DataCardSeriesList({
  data,
  valueLabel,
  unidade,
}: {
  data: ChartDatum[];
  valueLabel: string;
  unidade?: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">{valueLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="tabular-nums">{row.label}</TableCell>
            <TableCell className="text-right tabular-nums">{formatDataValue(row.value, unidade)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function DataCardDonutChart({
  data,
  unidade,
  testId,
}: {
  data: ChartDatum[];
  unidade?: string;
  testId?: string;
}) {
  const slices = prepareDonutData(data);
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const config = buildChartConfig(slices);

  return (
    <div className="relative mx-auto w-full max-w-[320px]" data-testid={testId}>
      <ChartContainer config={config} className="aspect-square min-h-[220px] w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [formatDataValue(Number(value), unidade), String(name)]}
              />
            }
          />
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            strokeWidth={2}
          >
            {slices.map((entry, i) => (
              <Cell key={entry.id} fill={DATA_CHART_COLORS[i % DATA_CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-secondaryText">Total</p>
          <p className="text-xl font-bold tabular-nums text-primaryText">{formatDataValue(total, unidade)}</p>
        </div>
      </div>
      <ul className="mt-2 grid gap-1 sm:grid-cols-2">
        {slices.map((entry, i) => (
          <li key={entry.id} className="flex items-center gap-2 text-xs text-secondaryText">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: DATA_CHART_COLORS[i % DATA_CHART_COLORS.length] }}
            />
            <span className="truncate">{truncateLabel(entry.label, 22)}</span>
            <span className="ml-auto tabular-nums font-medium text-primaryText">
              {formatDataValue(entry.value, unidade)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DataCardBarChart({
  data,
  horizontal,
  unidade,
  testId,
}: {
  data: ChartDatum[];
  horizontal?: boolean;
  unidade?: string;
  testId?: string;
}) {
  const chartData = data.map((d) => ({ ...d, shortLabel: truncateLabel(d.label, horizontal ? 36 : 14) }));
  const config = buildChartConfig(chartData);

  return (
    <ChartContainer
      config={config}
      className={cn(
        "w-full",
        horizontal ? "min-h-[220px] max-h-[360px]" : "aspect-[2.2/1] min-h-[200px] max-h-[280px]",
      )}
      data-testid={testId}
    >
      <BarChart
        data={chartData}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={horizontal ? { top: 4, right: 12, left: 4, bottom: 4 } : { top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={!horizontal} horizontal={horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="shortLabel"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 10 }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="shortLabel"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={chartData.length > 6 ? -35 : 0}
              textAnchor={chartData.length > 6 ? "end" : "middle"}
              height={chartData.length > 6 ? 56 : 32}
              tick={{ fontSize: 10 }}
            />
            <YAxis tickLine={false} axisLine={false} width={44} tick={{ fontSize: 10 }} />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
              formatter={(value) => formatDataValue(Number(value), unidade)}
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[3, 3, 0, 0]} maxBarSize={horizontal ? 20 : 32} />
      </BarChart>
    </ChartContainer>
  );
}
