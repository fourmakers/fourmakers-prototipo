export type DataCardViewMode = "list" | "donut" | "bar";

const STORAGE_PREFIX = "fourmakers-cs-data-view";

export const DATA_CARD_VIEW_LABELS: Record<DataCardViewMode, string> = {
  list: "Lista",
  donut: "Donut",
  bar: "Barras",
};

export function loadDataCardView(cardId: string): DataCardViewMode {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}:${cardId}`);
    if (stored === "list" || stored === "donut" || stored === "bar") return stored;
  } catch {
    /* ignore */
  }
  return "list";
}

export function saveDataCardView(cardId: string, mode: DataCardViewMode): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${cardId}`, mode);
  } catch {
    /* ignore */
  }
}

export const DATA_CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--info))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(262 52% 47%)",
  "hsl(199 89% 48%)",
  "hsl(346 77% 50%)",
];

export interface ChartDatum {
  id: string;
  label: string;
  value: number;
}

export function truncateLabel(label: string, max = 28): string {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}

/** Agrupa fatias pequenas em «Outros» para donut legível. */
export function prepareDonutData(items: ChartDatum[], maxSlices = 8): ChartDatum[] {
  if (items.length <= maxSlices) return items;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, maxSlices - 1);
  const others = sorted.slice(maxSlices - 1).reduce((acc, item) => acc + item.value, 0);
  return [...top, { id: "outros", label: "Outros", value: others }];
}

export function formatDataValue(value: number, unidade?: string): string {
  if (unidade === "%") return `${value.toFixed(1)}%`;
  return value.toLocaleString("pt-BR");
}
