import type { AberturaVagaFormCompleto, EtapaContextoForm } from "../types";
import { MOTIVOS_EXIGEM_COLABORADOR } from "../types";
import {
  MODELOS_TRABALHO,
  NIVEIS_EXPERIENCIA,
  PERMANENCIAS,
  PRIORIDADES,
  TIPOS_EMPREGO,
} from "../mocks/perfilCatalogos";

const LABEL_ORIGEM: Record<NonNullable<EtapaContextoForm["origem_vaga"]>, string> = {
  substituicao: "Substituição",
  nova_posicao: "Nova posição",
  cobertura_temporaria: "Cobertura temporária",
  reativacao: "Reativação",
};

const LABEL_MOTIVO: Record<NonNullable<EtapaContextoForm["motivo_saida"]>, string> = {
  demissao_voluntaria: "Pedido de demissão",
  desligamento: "Desligamento pela empresa",
  movimentacao_positiva: "Movimentação interna ou externa positiva",
  aposentadoria: "Aposentadoria",
  desalinhamento_cultural: "Não se adaptou à cultura",
};

function labelFrom<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | null,
): string {
  if (!value) return "—";
  return options.find((o) => o.value === value)?.label ?? value;
}

interface EtapaRevisaoProps {
  dados: AberturaVagaFormCompleto;
}

function RevisaoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs font-medium text-secondaryText">{label}</dt>
      <dd className="font-semibold text-primaryText sm:text-right">{value}</dd>
    </div>
  );
}

export function EtapaRevisao({ dados }: EtapaRevisaoProps) {
  const { contexto, perfil, urgencia } = dados;
  const { origem_vaga, motivo_saida, colaborador_substituido } = contexto;

  const modeloLabel =
    MODELOS_TRABALHO.find((m) => m.value === perfil.modelo_trabalho)?.title ?? "—";
  const prioridadeLabel = PRIORIDADES.find((p) => p.value === urgencia.prioridade)?.label ?? "—";

  const prazoFmt = urgencia.prazo_contratacao
    ? new Date(urgencia.prazo_contratacao + "T12:00:00").toLocaleDateString("pt-BR")
    : "—";

  return (
    <div className="space-y-4">
      <p className="text-xs text-secondaryText">
        Revise todas as etapas antes de concluir. No produto, o perfil completo dispara a criação da
        vaga no backend.
      </p>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-secondaryText">Contexto</h3>
        <dl className="divide-y divide-borderSoft rounded-md border border-borderDefault bg-surfaceSubtle text-sm">
          <RevisaoRow
            label="Origem da vaga"
            value={origem_vaga ? LABEL_ORIGEM[origem_vaga] : "—"}
          />
          {origem_vaga === "substituicao" && motivo_saida && (
            <RevisaoRow label="Motivo de saída" value={LABEL_MOTIVO[motivo_saida]} />
          )}
          {motivo_saida && MOTIVOS_EXIGEM_COLABORADOR.includes(motivo_saida) && (
            <RevisaoRow
              label="Colaborador substituído"
              value={
                colaborador_substituido
                  ? `${colaborador_substituido.nome} · ${colaborador_substituido.cargo}`
                  : "—"
              }
            />
          )}
        </dl>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-secondaryText">Perfil</h3>
        <dl className="divide-y divide-borderSoft rounded-md border border-borderDefault bg-surfaceSubtle text-sm">
          <RevisaoRow label="Nome do perfil" value={perfil.nome_perfil || "—"} />
          <RevisaoRow label="Modelo de trabalho" value={modeloLabel} />
          {perfil.modelo_trabalho === "hibrido" && (
            <RevisaoRow label="Dias híbridos" value={`${perfil.dias_hibridos} dias/semana`} />
          )}
          <RevisaoRow
            label="Nível"
            value={labelFrom(NIVEIS_EXPERIENCIA, perfil.nivel_experiencia)}
          />
          <RevisaoRow
            label="Tipo de emprego"
            value={labelFrom(TIPOS_EMPREGO, perfil.tipo_emprego)}
          />
          <RevisaoRow
            label="Permanência"
            value={labelFrom(PERMANENCIAS, perfil.permanencia)}
          />
          <RevisaoRow
            label="Hard skills"
            value={perfil.hard_skills.length ? perfil.hard_skills.join(", ") : "—"}
          />
          {perfil.custo_mensal && (
            <RevisaoRow
              label="Custo mensal"
              value={`R$ ${Number(perfil.custo_mensal).toLocaleString("pt-BR")}`}
            />
          )}
        </dl>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-secondaryText">Urgência</h3>
        <dl className="divide-y divide-borderSoft rounded-md border border-borderDefault bg-surfaceSubtle text-sm">
          <RevisaoRow label="Prioridade" value={prioridadeLabel} />
          <RevisaoRow label="Prazo para contratação" value={prazoFmt} />
          <RevisaoRow label="Posições" value={String(urgencia.quantidade_posicoes)} />
          {urgencia.observacoes_recrutador.trim() && (
            <RevisaoRow label="Observações" value={urgencia.observacoes_recrutador} />
          )}
        </dl>
      </div>
    </div>
  );
}
