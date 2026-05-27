import { useMemo } from "react";
import type { AberturaVagaFormCompleto } from "../types";
import { buildResumoVaga } from "../utils/buildResumoVaga";
import { ResumoVagaView } from "./ResumoVagaView";

interface EtapaResumoVagaProps {
  dados: AberturaVagaFormCompleto;
}

export function EtapaResumoVaga({ dados }: EtapaResumoVagaProps) {
  const model = useMemo(() => buildResumoVaga(dados), [dados]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-secondaryText">
        Mesma estrutura do modal <strong className="font-medium text-primaryText">Dados sobre a vaga</strong>{" "}
        do kanban de recrutamento (protótipo com dados preenchidos + mocks).
      </p>
      <ResumoVagaView model={model} />
    </div>
  );
}
