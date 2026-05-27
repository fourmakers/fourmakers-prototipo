import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormularioAberturaFooterProps {
  podeVoltar: boolean;
  podeAvancar: boolean;
  ehUltimaEtapa: boolean;
  onVoltar: () => void;
  onAvancar: () => void;
}

export function FormularioAberturaFooter({
  podeVoltar,
  podeAvancar,
  ehUltimaEtapa,
  onVoltar,
  onAvancar,
}: FormularioAberturaFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-borderSoft pt-6">
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={!podeVoltar}
        onClick={onVoltar}
      >
        ← Voltar
      </Button>
      <Button
        type="button"
        disabled={!podeAvancar}
        className="gap-2 rounded-full"
        onClick={onAvancar}
      >
        {ehUltimaEtapa ? "Concluir abertura" : "Avançar"}
        {!ehUltimaEtapa && <ArrowRight className="size-3.5" aria-hidden />}
      </Button>
    </div>
  );
}
