import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  Brain,
  Calendar,
  Clock,
  Heart,
  Linkedin,
  MapPin,
  Medal,
  Radar,
  Share2,
  ShieldAlert,
  Star,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CandidatoAnalise } from "../types";
import { getRadarProfissionalMock } from "../mocks/radarProfissionalMock";

interface RadarProfissionalDrawerProps {
  candidato: CandidatoAnalise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MERIT_ICON = {
  medal: Medal,
  leadership: Brain,
  punctual: Clock,
  referral: Share2,
};

const STATUS_INSCRICAO: Record<string, string> = {
  Shortlist: "bg-successSoft text-success border-successBorder",
  "Em triagem IA": "bg-infoSoft text-info border-infoBorder",
  "Em avaliação": "bg-infoSoft text-info border-infoBorder",
  Desclassificado: "bg-errorSoft text-error border-errorBorder",
  "Entrevista RH": "bg-accentSoft text-accent border-accent/30",
};

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative mx-auto size-28">
      <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border-soft)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#radarGaugeGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="radarGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4cbfff" />
            <stop offset="50%" stopColor="#9a1bff" />
            <stop offset="100%" stopColor="#3bfe95" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primaryText">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-secondaryText">Score</span>
      </div>
    </div>
  );
}

export function RadarProfissionalDrawer({ candidato, open, onOpenChange }: RadarProfissionalDrawerProps) {
  const radar = useMemo(() => getRadarProfissionalMock(candidato), [candidato]);
  const [favorito, setFavorito] = useState(false);

  const iniciais = candidato.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-borderSoft bg-secondaryBackground p-0 sm:max-w-xl md:max-w-2xl"
      >
        <ScrollArea className="h-full flex-1">
          <div className="space-y-6 p-6 pb-10">
            <SheetHeader className="space-y-1 text-left">
              <div className="flex items-start justify-between gap-3 pr-8">
                <div className="flex gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full analise-brand-gradient text-lg font-bold text-white">
                    {iniciais}
                  </span>
                  <div>
                    <SheetTitle className="flex flex-wrap items-center gap-2 text-xl text-primaryText">
                      <Radar className="size-5 text-accent" aria-hidden />
                      Radar profissional
                    </SheetTitle>
                    <p className="font-semibold text-primaryText">{candidato.nome}</p>
                    <SheetDescription className="text-left text-secondaryText">
                      {radar.perfil.headline}
                    </SheetDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("shrink-0", favorito && "text-error")}
                  aria-pressed={favorito}
                  aria-label={favorito ? "Remover dos favoritos" : "Favoritar candidato"}
                  onClick={() => setFavorito((f) => !f)}
                >
                  <Heart className={cn("size-5", favorito && "fill-current")} />
                </Button>
              </div>
              {radar.perfil.verificadoPlataforma && (
                <Badge variant="outline" className="w-fit border-successBorder bg-successSoft text-success">
                  Verificado na plataforma
                </Badge>
              )}
            </SheetHeader>

            <div className="grid grid-cols-3 gap-2">
              {radar.kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl border border-borderSoft bg-surfaceSubtle/80 px-3 py-3 text-center analise-glow-card"
                >
                  <p className="text-lg font-bold text-primaryText">
                    {k.valor}
                    {k.suffix ?? ""}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-secondaryText">{k.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-borderSoft bg-surfaceSubtle/60 p-4">
                <ScoreGauge score={radar.scorePlataforma} />
                <p className="mt-2 text-center text-xs text-secondaryText">
                  Ranking global #{radar.rankingGlobal.toLocaleString("pt-BR")} de{" "}
                  {radar.rankingTotal.toLocaleString("pt-BR")}
                </p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-accent">
                  <TrendingUp className="size-3.5" aria-hidden />
                  Aderência nesta vaga: <strong>{candidato.aderenciaGeral}%</strong>
                </div>
              </div>
              <div className="space-y-2 rounded-2xl border border-borderSoft p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-secondaryText">Méritos</h4>
                <ul className="space-y-2">
                  {radar.merits.map((m) => {
                    const Icon = MERIT_ICON[m.tipo];
                    return (
                      <li key={m.id} className="flex gap-2 rounded-lg bg-accentSoft/40 px-2 py-2">
                        <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                        <div>
                          <p className="text-xs font-semibold text-primaryText">{m.titulo}</p>
                          <p className="text-[11px] text-secondaryText">{m.descricao}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 rounded-lg border border-borderSoft bg-secondaryBackground p-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-primaryText">Nível {radar.gamificacao.nivel}</span>
                    <span className="text-secondaryText">
                      {radar.gamificacao.xp} / {radar.gamificacao.xpProximoNivel} XP
                    </span>
                  </div>
                  <Progress
                    value={(radar.gamificacao.xp / radar.gamificacao.xpProximoNivel) * 100}
                    className="mt-2 h-2"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {radar.gamificacao.badges.map((b) => (
                      <Badge key={b} variant="secondary" className="text-[10px]">
                        <Award className="mr-1 size-3" aria-hidden />
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-borderSoft p-4">
              <h4 className="mb-3 text-sm font-semibold text-primaryText">Perfil profissional</h4>
              <div className="flex flex-wrap gap-1.5">
                {radar.perfil.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg bg-surfaceSubtle px-3 py-2 text-xs text-secondaryText">
                  <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden />
                  {radar.perfil.localizacao} · {radar.perfil.timezone}
                </div>
                <div className="flex flex-wrap gap-1">
                  {radar.perfil.modalidades.map((m) => (
                    <Badge key={m} variant="secondary" className="text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
              {radar.perfil.linkedinUrl && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-info">
                  <Linkedin className="size-3.5" aria-hidden />
                  {radar.perfil.linkedinUrl}
                </p>
              )}
              <p className="mt-3 text-xs text-secondaryText">
                <strong className="text-primaryText">Tempo médio de casa:</strong>{" "}
                {radar.tempoMedioCasaMeses} meses
              </p>
              <ul className="mt-2 space-y-1">
                {radar.historicoEmpresas.map((e) => (
                  <li key={`${e.empresa}-${e.cargo}`} className="flex justify-between text-xs text-secondaryText">
                    <span>
                      {e.empresa} — {e.cargo}
                    </span>
                    <span className="font-medium text-primaryText">{e.meses}m</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-borderSoft p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
                <Users className="size-4 text-accent" aria-hidden />
                Relações na organização
              </h4>
              <ul className="space-y-2">
                {radar.relacoesOrg.map((r) => (
                  <li
                    key={r.nome}
                    className="rounded-xl border border-borderSoft bg-surfaceSubtle/80 px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-primaryText">{r.nome}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {r.grau}º grau · {r.fonte}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondaryText">{r.cargo}</p>
                    <p className="mt-1 text-[11px] text-accent">{r.contexto}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-borderSoft p-4">
              <h4 className="mb-2 text-sm font-semibold text-primaryText">Histórico de inscrições</h4>
              <ul className="space-y-2">
                {radar.inscricoes.map((i) => (
                  <li
                    key={`${i.codigo}-${i.data}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-borderSoft px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-accent">{i.codigo}</p>
                      <p className="truncate text-sm font-medium text-primaryText">{i.titulo}</p>
                      <p className="text-[11px] text-secondaryText">
                        {i.cliente} · {i.data}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", STATUS_INSCRICAO[i.status] ?? "")}
                      >
                        {i.status}
                      </Badge>
                      {i.score != null && (
                        <span className="text-xs font-bold text-primaryText">Score {i.score}%</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-borderSoft p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
                <Calendar className="size-4 text-accentSecondary" aria-hidden />
                Últimas agendas na plataforma
              </h4>
              <ul className="space-y-2">
                {radar.agendas.map((a) => (
                  <li key={a.titulo} className="flex justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-primaryText">{a.tipo}</span>
                      <p className="text-secondaryText">{a.titulo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-secondaryText">{a.data}</p>
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">
                        {a.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-accent/25 bg-accentSoft/20 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primaryText">
                <Star className="size-4 text-accent" aria-hidden />
                Vagas com maior match na plataforma
              </h4>
              <ul className="space-y-2">
                {radar.vagasMatch.map((v) => (
                  <li
                    key={v.codigo}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-borderSoft bg-secondaryBackground px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-accent">{v.codigo}</p>
                      <p className="text-sm font-medium text-primaryText">{v.titulo}</p>
                      <p className="text-[11px] text-secondaryText">{v.cliente}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold analise-brand-gradient-text">{v.match}%</span>
                      <Button type="button" size="sm" variant="secondary" className="h-8 text-xs">
                        <UserPlus className="size-3.5" aria-hidden />
                        Indicar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-borderSoft p-4">
              <h4 className="mb-3 text-sm font-semibold text-primaryText">Scores de avaliações (outras vagas)</h4>
              <ul className="space-y-2">
                {radar.avaliacoes.map((a) => (
                  <li key={a.dimensao}>
                    <div className="flex justify-between text-xs">
                      <span className="text-secondaryText">
                        {a.dimensao}{" "}
                        <span className="text-[10px]">({a.amostra} avaliações)</span>
                      </span>
                      <span className="font-bold text-primaryText">
                        {a.media.toFixed(1)}/5
                      </span>
                    </div>
                    <Progress value={(a.media / 5) * 100} className="mt-1 h-1.5" />
                  </li>
                ))}
              </ul>
            </section>

            {(radar.alertas.length > 0 || radar.naoRecomendacoes.length > 0 || radar.gamificacao.bloqueios.length > 0) && (
              <section className="space-y-3 rounded-2xl border border-warningBorder bg-warningSoft/30 p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-primaryText">
                  <ShieldAlert className="size-4 text-warning" aria-hidden />
                  Alertas, bloqueios e não recomendações
                </h4>
                {radar.alertas.map((al) => (
                  <div
                    key={al.titulo}
                    className={cn(
                      "flex gap-2 rounded-lg px-3 py-2 text-xs",
                      al.severidade === "error" && "bg-errorSoft text-error",
                      al.severidade === "warning" && "bg-warningSoft/80 text-warning",
                      al.severidade === "info" && "bg-infoSoft text-info",
                    )}
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    <div>
                      <p className="font-semibold">{al.titulo}</p>
                      <p>{al.descricao}</p>
                    </div>
                  </div>
                ))}
                {radar.gamificacao.bloqueios.map((b) => (
                  <div key={b.motivo} className="rounded-lg border border-borderSoft bg-secondaryBackground px-3 py-2 text-xs">
                    <p className="font-semibold text-primaryText">Bloqueio: {b.motivo}</p>
                    {b.detalhe && <p className="text-secondaryText">{b.detalhe}</p>}
                  </div>
                ))}
                {radar.naoRecomendacoes.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-xs text-secondaryText">
                    {radar.naoRecomendacoes.map((nr) => (
                      <li key={nr}>{nr}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <div className="flex flex-wrap gap-2 border-t border-borderSoft pt-4">
              <Button type="button" variant="primary" size="sm" className="analise-brand-gradient border-0 text-white hover:opacity-90">
                <UserPlus className="size-4" aria-hidden />
                Indicar para outra vaga
              </Button>
              <Button type="button" variant="outline" size="sm">
                Compartilhar radar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
