/**
 * Copia ficheiros `docs/*_DOCUMENTACAO_TECNICA.md` para `public/docs/`
 * para o Vite servir em `/docs/...` (download a partir da home).
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
for (const f of fs.readdirSync(destDir)) {
  if (f.endsWith("_DOCUMENTACAO_TECNICA.md") && !f.startsWith("_")) {
    fs.unlinkSync(path.join(destDir, f));
  }
}

/** Exclui modelos internos (ex.: `_MODELO_...`) — só features em maiúsculas. */
const files = fs.readdirSync(srcDir).filter(
  (f) => f.endsWith("_DOCUMENTACAO_TECNICA.md") && !f.startsWith("_"),
);

for (const f of files) {
  fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
}

console.log(`sync-prototipo-docs: ${files.length} ficheiro(s) → public/docs/`);
