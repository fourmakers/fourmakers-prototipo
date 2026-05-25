import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Base pública (GitHub Pages project site: `/nome-do-repo/`). Definir via `VITE_BASE_PATH` no CI. */
function viteBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw || raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

const analyticsApiProxyTarget = process.env.VITE_ANALYTICS_API_BASE_URL?.replace(/\/$/, "");

// https://vitejs.dev/config/
export default defineConfig({
  base: viteBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: analyticsApiProxyTarget
      ? {
          "/analytics": {
            target: analyticsApiProxyTarget,
            changeOrigin: true,
            secure: true,
          },
        }
      : undefined,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
