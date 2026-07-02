/** URL pública de asset em `public/analytics/heatmaps/`. */
export function heatmapAssetUrl(filename: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}analytics/heatmaps/${filename}`;
}
