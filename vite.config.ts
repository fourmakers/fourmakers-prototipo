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

/** Proxy local para services/analytics-api (porta 3001). */
const analyticsApiProxyTarget =
  process.env.ANALYTICS_API_PROXY_TARGET?.replace(/\/$/, "") ||
  process.env.VITE_ANALYTICS_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const analyticsProxy =
  process.env.VITE_ANALYTICS_PROXY_DISABLED !== "true"
    ? {
        "/analytics": {
          target: analyticsApiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api/analytics": {
          target: analyticsApiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      }
    : undefined;

// https://vitejs.dev/config/
export default defineConfig({
  base: viteBase(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: analyticsProxy,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
