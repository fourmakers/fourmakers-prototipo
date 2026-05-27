import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseEtapaDadosComplementaresFormReturn } from "../hooks/useEtapaDadosComplementaresForm";
import {
  COLABORADORES_INTERNO_MOCK,
  EMAIL_ONEPAGE_PADRAO,
  MAQUINAS_MOCK,
  TIPOS_CONTRATACAO_MOCK,
  TIPOS_VAGA_MOCK,
  UNIDADES_MOCK,
} from "../mocks/dadosComplementaresCatalogos";
import { subtituloMotivoContexto, tituloVagaPrototipo } from "../utils/buildResumoVaga";
import type { AberturaVagaFormCompleto } from "../types";

interface EtapaDadosComplementaresProps {
  form: UseEtapaDadosComplementaresFormReturn;
  dadosWizard: Pick<AberturaVagaFormCompleto, "contexto">;
}

export function EtapaDadosComplementares({ form, dadosWizard }: EtapaDadosComplementaresProps) {
  const { form: data, setField, setGestor, setRecrutador, addEmail, removeEmail } = form;
  const [emailInput, setEmailInput] = useState("");

  const dadosParciais: AberturaVagaFormCompleto = {
    contexto: dadosWizard.contexto,
    dadosComplementares: data,
  };
  const titulo = tituloVagaPrototipo(dadosParciais);
  const subtituloMotivo = subtituloMotivoContexto(dadosParciais);

  const handleAddEmail = () => {
    addEmail(emailInput);
    setEmailInput("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-borderSoft bg-surfaceSubtle/60 px-4 py-3">
        <p className="text-sm font-semibold text-primaryText">Movimentação — {titulo}</p>
        <p className="mt-1 text-xs leading-relaxed text-secondaryText">
          Confirme os dados adicionais para realizar a movimentação da vaga.
          {subtituloMotivo ? ` ${subtituloMotivo}` : ""}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">
              Gestor Interno <span className="text-error">*</span>
            </Label>
            <Select
              value={data.gestor_interno_id || undefined}
              onValueChange={(id) => {
                const c = COLABORADORES_INTERNO_MOCK.find((x) => x.id === id);
                if (c) setGestor(c.id, c.nome);
              }}
            >
              <SelectTrigger className="h-11 font-normal">
                <SelectValue placeholder="Pesquise o nome do gestor interno" />
              </SelectTrigger>
              <SelectContent>
                {COLABORADORES_INTERNO_MOCK.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="block font-medium">{c.nome}</span>
                    <span className="block text-xs text-secondaryText">{c.email}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Proposta / Oportunidade CRM</Label>
            <Input
              className="h-11"
              placeholder="Digite aqui e pressione enter..."
              value={data.proposta_crm}
              onChange={(e) => setField("proposta_crm", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Tipo de Vaga</Label>
            <Select value={data.tipo_vaga_id || undefined} onValueChange={(v) => setField("tipo_vaga_id", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_VAGA_MOCK.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Modelo de contratação</Label>
            <Select
              value={data.tipo_contratacao_id || undefined}
              onValueChange={(v) => setField("tipo_contratacao_id", v)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CONTRATACAO_MOCK.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Unidade</Label>
            <Select value={data.unidade_id || undefined} onValueChange={(v) => setField("unidade_id", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES_MOCK.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Máquina</Label>
            <Select value={data.maquina || undefined} onValueChange={(v) => setField("maquina", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {MAQUINAS_MOCK.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Qtd de Vagas</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => setField("numero_de_vagas", Math.max(1, data.numero_de_vagas - 1))}
                aria-label="Diminuir quantidade"
              >
                —
              </Button>
              <Input
                type="number"
                min={1}
                value={data.numero_de_vagas}
                onChange={(e) =>
                  setField("numero_de_vagas", Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="h-9 w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                onClick={() => setField("numero_de_vagas", data.numero_de_vagas + 1)}
                aria-label="Aumentar quantidade"
              >
                +
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Recrutador Responsável</Label>
            <Select
              value={data.recrutador_id || undefined}
              onValueChange={(id) => {
                const c = COLABORADORES_INTERNO_MOCK.find((x) => x.id === id);
                if (c) setRecrutador(c.id, c.nome);
              }}
            >
              <SelectTrigger className="h-11 font-normal">
                <SelectValue placeholder="Pesquise o nome do responsável" />
              </SelectTrigger>
              <SelectContent>
                {COLABORADORES_INTERNO_MOCK.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Envio de Onepage aos Cliente</Label>
          <p className="text-[11px] text-secondaryText">
            Será enviado para {EMAIL_ONEPAGE_PADRAO}. Informe acima e-mails adicionais.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              className="h-11 flex-1"
              placeholder="Adicionar e-mail para envio ao cliente"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 shrink-0"
              onClick={handleAddEmail}
              aria-label="Adicionar e-mail"
            >
              <Plus className="size-4" aria-hidden />
            </Button>
          </div>
          {data.emails_adicionais.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1">
              {data.emails_adicionais.map((email) => (
                <li key={email}>
                  <span className="inline-flex items-center rounded-md bg-surfaceSubtle px-2 py-0.5 text-xs">
                    {email}
                    <button
                      type="button"
                      className="ml-1 text-secondaryText hover:text-error"
                      onClick={() => removeEmail(email)}
                      aria-label={`Remover ${email}`}
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Observações Internas</Label>
          <Textarea
            placeholder="Inserir observações internas"
            value={data.observacoes_internas}
            onChange={(e) => setField("observacoes_internas", e.target.value)}
            rows={3}
            className="resize-y text-sm"
          />
        </div>
      </div>
    </div>
  );
}
