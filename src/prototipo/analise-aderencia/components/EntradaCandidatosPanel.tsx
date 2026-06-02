import { useState } from "react";
import { FileArchive, FileText, Link2, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface EntradaCandidatosState {
  arquivos: File[];
  urlsLinkedin: string[];
}

interface EntradaCandidatosPanelProps {
  value: EntradaCandidatosState;
  onChange: (v: EntradaCandidatosState) => void;
}

export function EntradaCandidatosPanel({ value, onChange }: EntradaCandidatosPanelProps) {
  const [urlInput, setUrlInput] = useState("");

  const addFiles = (files: FileList | null, replace = false) => {
    if (!files?.length) return;
    const next = replace ? Array.from(files) : [...value.arquivos, ...Array.from(files)];
    onChange({ ...value, arquivos: next });
  };

  const removeFile = (index: number) => {
    onChange({ ...value, arquivos: value.arquivos.filter((_, i) => i !== index) });
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u || value.urlsLinkedin.includes(u)) return;
    onChange({ ...value, urlsLinkedin: [...value.urlsLinkedin, u] });
    setUrlInput("");
  };

  const temEntrada = value.arquivos.length > 0 || value.urlsLinkedin.length > 0;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="arquivo" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-surfaceSubtle p-1 sm:grid-cols-4">
          <TabsTrigger value="arquivo" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <FileText className="size-3.5" aria-hidden />
            Arquivo
          </TabsTrigger>
          <TabsTrigger value="lote" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <Upload className="size-3.5" aria-hidden />
            Lote
          </TabsTrigger>
          <TabsTrigger value="zip" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <FileArchive className="size-3.5" aria-hidden />
            ZIP
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            <Link2 className="size-3.5" aria-hidden />
            LinkedIn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arquivo" className="mt-4">
          <DropZone
            label="Um CV ou perfil (PDF, DOCX)"
            multiple={false}
            onFiles={(f) => addFiles(f, true)}
          />
        </TabsContent>
        <TabsContent value="lote" className="mt-4">
          <DropZone label="Vários arquivos de CV" multiple onFiles={(f) => addFiles(f, false)} />
        </TabsContent>
        <TabsContent value="zip" className="mt-4">
          <DropZone
            label="Arquivo ZIP com CVs"
            accept=".zip"
            multiple={false}
            onFiles={(f) => addFiles(f, true)}
          />
        </TabsContent>
        <TabsContent value="linkedin" className="mt-4 space-y-3">
          <Label className="text-xs">URLs de perfil LinkedIn</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://linkedin.com/in/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              className="h-11 rounded-xl"
            />
            <Button type="button" variant="outline" size="icon" className="size-11 shrink-0 rounded-xl" onClick={addUrl}>
              <Plus className="size-4" aria-hidden />
            </Button>
          </div>
          {value.urlsLinkedin.length > 0 && (
            <ul className="space-y-1">
              {value.urlsLinkedin.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-2 rounded-lg border border-borderSoft bg-surfaceSubtle px-3 py-2 text-xs"
                >
                  <span className="truncate text-primaryText">{url}</span>
                  <button
                    type="button"
                    className="text-secondaryText hover:text-error"
                    onClick={() =>
                      onChange({
                        ...value,
                        urlsLinkedin: value.urlsLinkedin.filter((u) => u !== url),
                      })
                    }
                    aria-label="Remover URL"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      {value.arquivos.length > 0 && (
        <div className="rounded-xl border border-borderSoft bg-surfaceSubtle p-3">
          <p className="mb-2 text-xs font-semibold text-primaryText">
            {value.arquivos.length} arquivo(s) selecionado(s)
          </p>
          <ul className="max-h-32 space-y-1 overflow-y-auto">
            {value.arquivos.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between text-xs text-secondaryText">
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-error">
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!temEntrada && (
        <p className="text-center text-xs text-secondaryText">
          Adicione ao menos um arquivo ou URL de LinkedIn para iniciar a análise.
        </p>
      )}
    </div>
  );
}

export function hasEntradaCandidatos(s: EntradaCandidatosState): boolean {
  return s.arquivos.length > 0 || s.urlsLinkedin.length > 0;
}

function DropZone({
  label,
  multiple = false,
  accept,
  onFiles,
}: {
  label: string;
  multiple?: boolean;
  accept?: string;
  onFiles: (files: FileList | null) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-borderDefault",
        "bg-accentSoft/30 px-4 py-8 transition-all duration-300",
        "hover:border-accent hover:bg-accentSoft/50 hover:shadow-[0_0_24px_rgba(154,27,255,0.15)]",
      )}
    >
      <Upload className="size-8 text-accent" aria-hidden />
      <span className="text-center text-sm font-medium text-primaryText">{label}</span>
      <span className="text-xs text-secondaryText">Arraste ou clique para selecionar</span>
      <input
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept ?? ".pdf,.doc,.docx"}
        onChange={(e) => onFiles(e.target.files)}
      />
    </label>
  );
}
