/**
 * Copia documentação de protótipo de `docs/` para `public/docs/`:
 * - `*_DOCUMENTACAO_TECNICA.md`
 * - `ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md` (handoff API)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "docs");
const destDir = path.join(root, "public", "docs");

if (!fs.existsSync(srcDir)) {
  console.warn("sync-prototipo-docs: pasta docs/ não existe — ignorado.");
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

/** Remove cópias antigas — evita servir `.md` duplicados ou fundidos noutro ficheiro. */
const SYNC_PATTERNS = [
  (f) => f.endsWith("_DOCUMENTACAO_TECNICA.md") && !f.startsWith("_"),
  (f) => f === "ANALYTICS_METRICAS_APP_NECESSIDADES_INTEGRACAO_API.md",
  (f) => f === "ANALYTICS_INTEGRACAO_STATUS_REPORT.md",
  (f) => f === "ANALYTICS_HUB_CENARIO_ESTADO_E_PENDENCIAS.md",
  (f) => f === "ANALYTICS_API_SETUP_GCP.md",
  (f) => f === "ANALYTICS_API_CONTRATO_BACKEND.md",
  (f) => f === "ANALYTICS_FRONTEND_BFF_CONFIG.md",
];

function shouldSync(filename) {
  return SYNC_PATTERNS.some((match) => match(filename));
}

for (const f of fs.readdirSync(destDir)) {
  if (shouldSync(f)) fs.unlinkSync(path.join(destDir, f));
}

const files = fs.readdirSync(srcDir).filter(shouldSync);

for (const f of files) {
  fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
}

console.log(`sync-prototipo-docs: ${files.length} ficheiro(s) → public/docs/`);
