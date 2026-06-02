import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PreviewEditableSectionProps {
  titulo: string;
  children: React.ReactNode;
  valorTexto?: string;
  onSaveTexto?: (v: string) => void;
  /** Chamado após aplicar edição (ex.: recalcular projeção de aderência). */
  onAfterSave?: () => void;
  multiline?: boolean;
  className?: string;
}

export function PreviewEditableSection({
  titulo,
  children,
  valorTexto,
  onSaveTexto,
  onAfterSave,
  multiline = true,
  className,
}: PreviewEditableSectionProps) {
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(valorTexto ?? "");

  const podeEditar = Boolean(onSaveTexto && valorTexto !== undefined);

  const salvar = () => {
    onSaveTexto?.(rascunho);
    setEditando(false);
    onAfterSave?.();
  };

  return (
    <section
      className={cn(
        "group relative rounded-2xl border border-borderSoft bg-secondaryBackground p-4 transition-colors hover:border-accent/30",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wide text-secondaryText">{titulo}</h4>
        {podeEditar && !editando && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Editar ${titulo}`}
            onClick={() => {
              setRascunho(valorTexto ?? "");
              setEditando(true);
            }}
          >
            <Pencil className="size-3.5" aria-hidden />
          </Button>
        )}
      </div>
      {editando ? (
        <div className="space-y-2">
          {multiline ? (
            <Textarea
              className="min-h-[100px] rounded-xl text-sm"
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
            />
          ) : (
            <input
              className="w-full rounded-xl border border-borderSoft px-3 py-2 text-sm"
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
            />
          )}
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="primary" onClick={salvar}>
              Aplicar
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
