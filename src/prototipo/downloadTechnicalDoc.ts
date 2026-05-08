/** Dispara download do Markdown servido em `public/docs/` (URL `/docs/...`). */
export function downloadTechnicalDoc(filename: string): void {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const url = `${normalizedBase}/docs/${encodeURIComponent(filename)}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
