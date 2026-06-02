import { FileText, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EntradaFormularioVaga, ModoEntradaVaga } from "../types";

const CLIENTES_MOCK = ["ONESYS", "Foursys", "FinTech Hub", "Retail Co"];
const GESTORES_MOCK = ["Carlos Mendes — Head of Product", "Ana Ribeiro — UX Lead", "Paula Costa — RH"];

interface EntradaCriacaoVagaPanelProps {
  modo: ModoEntradaVaga;
  onModoChange: (m: ModoEntradaVaga) => void;
  form: EntradaFormularioVaga;
  onFormChange: (f: EntradaFormularioVaga) => void;
  prompt: string;
  onPromptChange: (p: string) => void;
}

function SeletoresClienteGestor({
  form,
  onFormChange,
}: Pick<EntradaCriacaoVagaPanelProps, "form" | "onFormChange">) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="cv-cliente">Cliente</Label>
        <Select value={form.cliente} onValueChange={(v) => onFormChange({ ...form, cliente: v })}>
          <SelectTrigger id="cv-cliente" className="h-11 rounded-xl">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {CLIENTES_MOCK.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cv-gestor">Gestor da vaga</Label>
        <Select value={form.gestor} onValueChange={(v) => onFormChange({ ...form, gestor: v })}>
          <SelectTrigger id="cv-gestor" className="h-11 rounded-xl">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {GESTORES_MOCK.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function EntradaCriacaoVagaPanel({
  modo,
  onModoChange,
  form,
  onFormChange,
  prompt,
  onPromptChange,
}: EntradaCriacaoVagaPanelProps) {
  return (
    <Tabs
      value={modo}
      onValueChange={(v) => onModoChange(v as ModoEntradaVaga)}
      className="w-full space-y-4"
    >
      <SeletoresClienteGestor form={form} onFormChange={onFormChange} />

      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-surfaceSubtle p-1">
        <TabsTrigger value="prompt" className="gap-1.5 rounded-lg text-sm">
          <Sparkles className="size-3.5" aria-hidden />
          Prompt com IA
        </TabsTrigger>
        <TabsTrigger value="formulario" className="gap-1.5 rounded-lg text-sm">
          <FileText className="size-3.5" aria-hidden />
          Formulário guiado
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prompt" className="mt-0 space-y-3">
        <p className="text-xs text-secondaryText">
          Descreva em linguagem natural o perfil desejado, dores e objetivo de longo prazo. A IA estrutura desafios,
          critérios de aderência e recomendações anti-churn (como na Análise de aderência).
        </p>
        <Textarea
          className="min-h-[200px] rounded-xl font-normal"
          placeholder="Ex.: Vaga UX sênior na ONESYS para o Carlos Mendes. Precisamos de alguém com design system e a11y em produto RH. Queremos reduzir churn nos primeiros 12 meses e melhorar match na triagem..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </TabsContent>

      <TabsContent value="formulario" className="mt-0 space-y-4">
        <p className="text-xs text-secondaryText">
          Alinhado ao fluxo <strong className="text-primaryText">Perfil de atuação / Criar vaga</strong> — preencha
          título, modelo e contexto para gerar desafios e critérios de match.
        </p>
        <div className="space-y-2">
          <Label htmlFor="cv-titulo">Título da vaga (rascunho)</Label>
          <Input
            id="cv-titulo"
            className="rounded-xl"
            placeholder="Ex.: Senior UX/UI Designer"
            value={form.tituloVaga}
            onChange={(e) => onFormChange({ ...form, tituloVaga: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cv-modelo">Modelo de trabalho</Label>
          <Select
            value={form.modeloTrabalho}
            onValueChange={(v) => onFormChange({ ...form, modeloTrabalho: v })}
          >
            <SelectTrigger id="cv-modelo" className="h-11 rounded-xl">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remoto">Remoto</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cv-contexto">Contexto breve</Label>
          <Textarea
            id="cv-contexto"
            className="min-h-[80px] rounded-xl"
            placeholder="Squads, pressões, substituição, habilidades, metas de retenção..."
            value={form.contextoBreve}
            onChange={(e) => onFormChange({ ...form, contextoBreve: e.target.value })}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export function podeOtimizarVaga(
  modo: ModoEntradaVaga,
  form: EntradaFormularioVaga,
  prompt: string,
): boolean {
  const clienteGestorOk = Boolean(form.cliente && form.gestor);
  if (modo === "prompt") return clienteGestorOk && prompt.trim().length >= 40;
  return clienteGestorOk && Boolean(form.tituloVaga.trim() && form.modeloTrabalho);
}
