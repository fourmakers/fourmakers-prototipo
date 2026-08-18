import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PrototipoHomePage } from "@/prototipo/pages/PrototipoHomePage";
import { getLegacyRouteRedirects } from "@/prototipo/legacyRoutes";
import { registryByLayout } from "@/prototipo/registry";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

/** GitHub Pages em subpasta: `import.meta.env.BASE_URL` é `/repo/`; RR prefere basename sem barra final. */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "") return undefined;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          {registryByLayout("fullscreen").map((entry) => (
            <Route key={entry.id} path={entry.path} element={<entry.Component />} />
          ))}
          <Route element={<MainLayout />}>
            <Route path="/" element={<PrototipoHomePage />} />
            {registryByLayout("app").map((entry) => (
              <Route key={entry.id} path={entry.path} element={<entry.Component />} />
            ))}
            {getLegacyRouteRedirects().map(({ from, to }) => (
              <Route key={`legacy-${from}`} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
