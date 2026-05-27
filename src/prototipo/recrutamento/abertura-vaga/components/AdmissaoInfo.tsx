import type { ColaboradorRef } from "../types";
import { calcularExperiencia, formatarDataAdmissao } from "../utils/experiencia";

interface AdmissaoInfoProps {
  colaborador: ColaboradorRef | null;
}

export function AdmissaoInfo({ colaborador }: AdmissaoInfoProps) {
  if (!colaborador) return null;

  const { dias, dentro, restantes } = calcularExperiencia(colaborador.data_admissao);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-borderDefault bg-surfaceSubtle px-4 py-3.5 sm:flex-nowrap">
      <div className="flex min-w-[100px] flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">
          Data de admissão
        </span>
        <span className="text-[15px] font-bold text-primaryText">
          {formatarDataAdmissao(colaborador.data_admissao)}
        </span>
      </div>
      <div className="hidden h-9 w-px shrink-0 bg-borderDefault sm:block" aria-hidden />
      <div className="flex min-w-[100px] flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">
          Dias na empresa
        </span>
        <span className="text-[15px] font-bold text-primaryText">{dias} dias</span>
      </div>
      <div className="hidden h-9 w-px shrink-0 bg-borderDefault sm:block" aria-hidden />
      <div className="flex min-w-[120px] flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">
          Período de experiência
        </span>
        <span className="text-[15px] font-bold">
          {dentro ? (
            <span className="text-warning">{restantes} dias restantes</span>
          ) : (
            <span className="text-success">Encerrado</span>
          )}
        </span>
      </div>
    </div>
  );
}
