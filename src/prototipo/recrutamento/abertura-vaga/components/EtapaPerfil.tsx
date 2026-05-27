import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { NivelExperiencia, Permanencia, TipoEmprego } from "../types";
import type { UseEtapaPerfilFormReturn } from "../hooks/useEtapaPerfilForm";
import {
  HARD_SKILLS_SUGERIDAS,
  MODELOS_TRABALHO,
  NIVEIS_EXPERIENCIA,
  PERMANENCIAS,
  TIPOS_EMPREGO,
} from "../mocks/perfilCatalogos";
import { FormSection } from "./FormSection";
import { OptionCard } from "./OptionCard";

interface EtapaPerfilProps {
  form: UseEtapaPerfilFormReturn;
}

export function EtapaPerfil({ form }: EtapaPerfilProps) {
  const { form: data, setField, toggleSkill, handleModeloChange, setNivel, setTipoEmprego, setPermanencia } =
    form;

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-secondaryText">
        Simulação alinhada ao fluxo <strong className="font-medium text-primaryText">Perfil de atuação</strong>{" "}
        (fourmakers-v2): identificação, modelo de trabalho, skills e atribuições para divulgação.
      </p>

      <FormSection
        title="Identificação do perfil"
        description="Nome exibido na vaga e no funil de recrutamento."
      >
        <div className="space-y-2">
          <Label htmlFor="nome-perfil" className="text-xs">
            Nome do perfil <span className="text-error">*</span>
          </Label>
          <Input
            id="nome-perfil"
            value={data.nome_perfil}
            onChange={(e) => setField("nome_perfil", e.target.value)}
            placeholder="Ex.: Desenvolvedor Full Stack Pleno"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custo-perfil" className="text-xs">
            Custo mensal alvo (R$)
          </Label>
          <Input
            id="custo-perfil"
            type="number"
            min={0}
            value={data.custo_mensal}
            onChange={(e) => setField("custo_mensal", e.target.value)}
            placeholder="15000"
            className="h-11"
          />
        </div>
      </FormSection>

      <FormSection
        title="Modelo de trabalho"
        description="Define localidade e dias híbridos quando aplicável."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Modelo de trabalho">
          {MODELOS_TRABALHO.map((m) => (
            <OptionCard
              key={m.value}
              name="modelo_trabalho"
              value={m.value}
              title={m.title}
              subtitle={m.subtitle}
              selected={data.modelo_trabalho === m.value}
              onSelect={() => handleModeloChange(m.value)}
            />
          ))}
        </div>
        {data.modelo_trabalho === "hibrido" && (
          <div className="space-y-2 pt-1">
            <Label htmlFor="dias-hibridos" className="text-xs">
              Dias presenciais por semana <span className="text-error">*</span>
            </Label>
            <Select
              value={String(data.dias_hibridos)}
              onValueChange={(v) => setField("dias_hibridos", Number(v))}
            >
              <SelectTrigger id="dias-hibridos" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} {d === 1 ? "dia" : "dias"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </FormSection>

      <FormSection title="Remuneração e contratação">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">
              Nível de experiência <span className="text-error">*</span>
            </Label>
            <Select
              value={data.nivel_experiencia ?? ""}
              onValueChange={(v) => setNivel(v as NivelExperiencia)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {NIVEIS_EXPERIENCIA.map((n) => (
                  <SelectItem key={n.value} value={n.value}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">
              Tipo de emprego <span className="text-error">*</span>
            </Label>
            <Select
              value={data.tipo_emprego ?? ""}
              onValueChange={(v) => setTipoEmprego(v as TipoEmprego)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_EMPREGO.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">
              Permanência <span className="text-error">*</span>
            </Label>
            <Select
              value={data.permanencia ?? ""}
              onValueChange={(v) => setPermanencia(v as Permanencia)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {PERMANENCIAS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Hard skills"
        description="Selecione ao menos uma competência técnica (mínimo modo vaga: 1 no protótipo)."
      >
        <div className="flex flex-wrap gap-2">
          {HARD_SKILLS_SUGERIDAS.map((skill) => {
            const selected = data.hard_skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  selected
                    ? "border-accent bg-accentSoft text-primaryText"
                    : "border-borderDefault bg-secondaryBackground text-secondaryText hover:border-accent",
                )}
                aria-pressed={selected}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </FormSection>

      <FormSection
        title="Atribuições e divulgação"
        description="Resumo para LinkedIn e briefing do recrutador (mín. 20 caracteres)."
      >
        <Textarea
          value={data.atribuicoes}
          onChange={(e) => setField("atribuicoes", e.target.value)}
          placeholder="Descreva responsabilidades, stack e contexto do time..."
          rows={4}
          className="resize-y text-sm"
        />
      </FormSection>
    </div>
  );
}
