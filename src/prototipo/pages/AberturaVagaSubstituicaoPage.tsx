import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AberturaVagaProgress } from "@/prototipo/recrutamento/abertura-vaga/components/AberturaVagaProgress";
import { EtapaContexto } from "@/prototipo/recrutamento/abertura-vaga/components/EtapaContexto";
import { EtapaDadosComplementares } from "@/prototipo/recrutamento/abertura-vaga/components/EtapaDadosComplementares";
import { EtapaResumoVaga } from "@/prototipo/recrutamento/abertura-vaga/components/EtapaResumoVaga";
import { FormularioAberturaFooter } from "@/prototipo/recrutamento/abertura-vaga/components/FormularioAberturaFooter";
import { useAberturaVagaWizard } from "@/prototipo/recrutamento/abertura-vaga/hooks/useAberturaVagaWizard";
import { useEtapaContextoForm } from "@/prototipo/recrutamento/abertura-vaga/hooks/useEtapaContextoForm";
import { useEtapaDadosComplementaresForm } from "@/prototipo/recrutamento/abertura-vaga/hooks/useEtapaDadosComplementaresForm";

const TITULOS_ETAPA: Record<number, { titulo: string; descricao: string }> = {
  1: {
    titulo: "Motivos de abertura",
    descricao: "Por que essa vaga está sendo aberta?",
  },
  2: {
    titulo: "Dados complementares",
    descricao:
      "Mesmo formulário da movimentação de vaga no kanban (/recrutamento) — passo 2 do modal.",
  },
  3: {
    titulo: "Resumo da vaga",
    descricao: "Visualização alinhada ao modal Dados sobre a vaga do kanban.",
  },
};

export function AberturaVagaSubstituicaoPage() {
  const wizard = useAberturaVagaWizard();
  const contextoForm = useEtapaContextoForm();
  const dadosForm = useEtapaDadosComplementaresForm();
  const meta = TITULOS_ETAPA[wizard.etapaAtual];

  const handleAvancar = () => {
    if (!wizard.ehUltimaEtapa) {
      wizard.avancar();
    }
  };

  const dadosCompletos = {
    contexto: {
      origem_vaga: contextoForm.origem_vaga,
      motivo_saida: contextoForm.motivo_saida,
      colaborador_substituido: contextoForm.colaborador_substituido,
    },
    dadosComplementares: dadosForm.form,
  };

  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <header className="mb-8">
        <nav
          className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-secondaryText"
          aria-label="Breadcrumb"
        >
          <span>Recrutamento</span>
          <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden />
          <span>Vagas</span>
          <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden />
          <span className="font-medium text-primaryText">Abertura de vaga</span>
        </nav>
        <h1 className="page-title text-[22px]">Abertura de vaga</h1>
        <p className="page-subtitle mt-1 text-[13px]">
          Informe o contexto da vaga antes de iniciar o recrutamento
        </p>
        <p className="mt-2 text-xs text-secondaryText">
          <Link to="/" className="font-medium text-accent hover:underline">
            ← Hub de protótipos
          </Link>
        </p>
      </header>

      <AberturaVagaProgress etapaAtual={wizard.etapaAtual} />

      <Card className="mt-2 border-borderSoft shadow-[var(--elevation-soft)]">
        <CardContent className="flex flex-col gap-6 p-7">
          <div>
            <h2 className="text-sm font-semibold text-primaryText">{meta.titulo}</h2>
            <p className="mt-1 text-xs text-secondaryText">{meta.descricao}</p>
          </div>

          {wizard.etapaAtual === 1 && <EtapaContexto form={contextoForm} />}
          {wizard.etapaAtual === 2 && (
            <EtapaDadosComplementares form={dadosForm} dadosWizard={{ contexto: dadosCompletos.contexto }} />
          )}
          {wizard.etapaAtual === 3 && <EtapaResumoVaga dados={dadosCompletos} />}

          <FormularioAberturaFooter
            podeVoltar={wizard.podeVoltar}
            podeAvancar
            ehUltimaEtapa={wizard.ehUltimaEtapa}
            onVoltar={wizard.voltar}
            onAvancar={handleAvancar}
          />
        </CardContent>
      </Card>
    </div>
  );
}
