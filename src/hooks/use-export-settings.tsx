import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface ExportSettings {
  exportCsv: boolean;
  exportPdf: boolean;
  setExportCsv: (v: boolean) => void;
  setExportPdf: (v: boolean) => void;
}

const ExportSettingsContext = createContext<ExportSettings>({
  exportCsv: false,
  exportPdf: false,
  setExportCsv: () => {},
  setExportPdf: () => {},
});

const STORAGE_KEY = "export-settings";

function loadDefaults(): { exportCsv: boolean; exportPdf: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { exportCsv: false, exportPdf: false };
}

export function ExportSettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadDefaults);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ExportSettingsContext.Provider
      value={{
        exportCsv: state.exportCsv,
        exportPdf: state.exportPdf,
        setExportCsv: (v) => setState((prev) => ({ ...prev, exportCsv: v })),
        setExportPdf: (v) => setState((prev) => ({ ...prev, exportPdf: v })),
      }}
    >
      {children}
    </ExportSettingsContext.Provider>
  );
}

export function useExportSettings() {
  return useContext(ExportSettingsContext);
}
