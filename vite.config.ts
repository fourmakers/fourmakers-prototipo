import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Base pública (GitHub Pages: `VITE_BASE_PATH`). Raiz do site: `VITE_BASE_PATH=/`. Sem variável: `/prototipo/` (alinhado às rotas e ao proxy do Fourflow em dev). */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (raw === "/") return "/";
  if (!raw) return "/prototipo/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: viteBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
