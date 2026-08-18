import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, CircleCheck, Sparkles } from "lucide-react";
import logoFourmakers from "@/assets/logo-fourmakers.svg";
import { ShowcaseFeatureCard } from "@/prototipo/showcase/ShowcaseFeatureCard";
import { ShowcaseFeatureDetail } from "@/prototipo/showcase/ShowcaseFeatureDetail";
import {
  SHOWCASE_FEATURES,
  SHOWCASE_PLATFORM,
  SHOWCASE_TOTEM_PHRASES,
  SHOWCASE_UMBRELLA,
} from "@/prototipo/showcase/showcaseContent";
import { useScrollReveal } from "@/prototipo/showcase/useScrollReveal";
import "@/prototipo/showcase/showcase.css";

const JOURNEY_STEPS = [
  "Perfil & vaga com IA",
  "Match e aderência",
  "Operação de vagas",
  "Entrevistas e funil",
  "Painel executivo",
];

export function ShowcaseConarhPage() {
  const containerRef = useScrollReveal<HTMLDivElement>(90);
  const [openId, setOpenId] = useState<string | null>(null);

  const openIndex = useMemo(
    () => SHOWCASE_FEATURES.findIndex((f) => f.id === openId),
    [openId],
  );
  const openFeature = openIndex >= 0 ? SHOWCASE_FEATURES[openIndex] : null;

  const goRelative = useCallback((delta: number) => {
    setOpenId((current) => {
      const index = SHOWCASE_FEATURES.findIndex((f) => f.id === current);
      if (index < 0) return current;
      const next = (index + delta + SHOWCASE_FEATURES.length) % SHOWCASE_FEATURES.length;
      return SHOWCASE_FEATURES[next].id;
    });
  }, []);

  const PlatformIcon = SHOWCASE_PLATFORM.icon;

  return (
    <div ref={containerRef} className="showcase-root relative min-h-screen overflow-x-hidden">
      <div className="showcase-brandbar fixed inset-x-0 top-0 z-[60] h-1" aria-hidden />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span
          className="showcase-orb showcase-float"
          style={{
            width: "34rem",
            height: "34rem",
            top: "-8rem",
            left: "-10rem",
            background: "rgba(154, 27, 255, 0.42)",
          }}
        />
        <span
          className="showcase-orb showcase-float-alt"
          style={{
            width: "26rem",
            height: "26rem",
            top: "12rem",
            right: "-8rem",
            background: "rgba(76, 191, 255, 0.3)",
          }}
        />
        <span
          className="showcase-orb showcase-float"
          style={{
            width: "30rem",
            height: "30rem",
            bottom: "-10rem",
            left: "38%",
            background: "rgba(59, 254, 149, 0.16)",
            animationDelay: "1.6s",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0518]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logoFourmakers}
              alt="Fourmakers"
              className="h-8 w-auto shrink-0 brightness-0 invert md:h-9"
            />
            <span className="hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
            <span className="hidden rounded-pillToken border border-white/20 bg-white/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:inline-block">
              ConaRH · Showcase
            </span>
          </div>

          <nav className="flex shrink-0 items-center gap-2">
            <a
              href="#jornada"
              className="hidden rounded-pillToken border border-white/20 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:inline-block"
            >
              Ver a jornada
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-pillToken bg-white px-4 py-2 text-sm font-semibold text-[#0b0518] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0518]"
            >
              <ArrowLeft className="size-4" aria-hidden />
              <span className="hidden sm:inline">Sair do showcase</span>
              <span className="sm:hidden">Sair</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="mx-auto w-full max-w-[1600px] px-5 pb-14 pt-14 md:px-10 md:pb-20 md:pt-24">
          <div className="max-w-4xl">
            <span
              data-reveal
              className="showcase-reveal inline-flex items-center gap-2 rounded-pillToken border border-white/20 bg-white/[0.07] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md"
            >
              <Sparkles className="size-3.5 text-[#3BFE95]" aria-hidden />
              Jornada Inteligente de Atração e Seleção
            </span>

            <h1
              data-reveal
              className="showcase-reveal mt-7 text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[4.25rem]"
            >
              Do briefing ao fill,{" "}
              <span className="showcase-gradient-text">com IA aplicada de ponta a ponta.</span>
            </h1>

            <p
              data-reveal
              className="showcase-reveal mt-7 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              {SHOWCASE_UMBRELLA}
            </p>

            <div data-reveal className="showcase-reveal mt-9 flex flex-wrap items-center gap-2">
              {JOURNEY_STEPS.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span className="text-white/25" aria-hidden>
                      /
                    </span>
                  ) : null}
                  <span className="rounded-pillToken border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/75">
                    {step}
                  </span>
                </span>
              ))}
            </div>

            <div data-reveal className="showcase-reveal mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#jornada"
                className="inline-flex items-center gap-2 rounded-pillToken px-6 py-3 text-sm font-bold text-[#0b0518] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0518]"
                style={{ background: "linear-gradient(100deg, #3BFE95 0%, #4CBFFF 100%)" }}
              >
                Explorar as features
                <ChevronDown className="size-4" aria-hidden />
              </a>
              <button
                type="button"
                onClick={() => setOpenId(SHOWCASE_FEATURES[0].id)}
                className="inline-flex items-center gap-2 rounded-pillToken border border-white/25 bg-white/[0.07] px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Iniciar demonstração
              </button>
            </div>
          </div>
        </section>

        {/* MARQUEE DE FRASES */}
        <section
          className="showcase-marquee-wrap relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-4"
          aria-label="Mensagens do showcase"
        >
          <div className="showcase-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {SHOWCASE_TOTEM_PHRASES.map((phrase) => (
                  <span key={phrase} className="flex items-center whitespace-nowrap px-8">
                    <span className="text-lg font-bold text-white/85 md:text-xl">{phrase}</span>
                    <span
                      className="ml-8 size-1.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #4CBFFF, #9A1BFF, #3BFE95)" }}
                      aria-hidden
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* GRID DE FEATURES */}
        <section
          id="jornada"
          className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-5 py-16 md:px-10 md:py-24"
          aria-labelledby="showcase-jornada-heading"
        >
          <div className="max-w-3xl">
            <h2
              data-reveal
              id="showcase-jornada-heading"
              className="showcase-reveal text-3xl font-bold leading-tight text-white md:text-[2.75rem]"
            >
              A jornada completa, feature a feature
            </h2>
            <p data-reveal className="showcase-reveal mt-4 text-base leading-relaxed text-white/70">
              Passe o mouse para ver a demonstração em movimento. Clique no card para abrir o vídeo
              completo, as capabilities entregues e os benefícios de negócio esperados.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SHOWCASE_FEATURES.map((feature) => (
              <ShowcaseFeatureCard key={feature.id} feature={feature} onOpen={setOpenId} />
            ))}
          </div>
        </section>

        {/* BLOCO TRANSVERSAL — PLATAFORMA E KNOW-HOW */}
        <section className="mx-auto w-full max-w-[1600px] px-5 pb-20 md:px-10 md:pb-28">
          <div
            data-reveal
            className="showcase-reveal rounded-[26px] p-[2px]"
            style={{ background: "linear-gradient(120deg, #4CBFFF 0%, #9A1BFF 52%, #3BFE95 100%)" }}
          >
            <div className="rounded-[24px] bg-[#0b0518] px-6 py-10 md:px-12 md:py-14">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-pillToken border border-white/20 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
                    <PlatformIcon className="size-3.5" aria-hidden />
                    Plataforma e know-how
                  </span>
                  <h2 className="mt-6 text-3xl font-bold leading-tight text-white md:text-[2.5rem]">
                    {SHOWCASE_PLATFORM.title}
                  </h2>
                  <p className="showcase-gradient-text mt-5 text-xl font-bold leading-snug md:text-2xl">
                    {SHOWCASE_PLATFORM.impact}
                  </p>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
                    {SHOWCASE_PLATFORM.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {SHOWCASE_PLATFORM.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pillToken border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-white/75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-lgToken border border-white/12 bg-white/[0.04] p-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                      O que o cliente recebe
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {SHOWCASE_PLATFORM.delivers.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                          <span
                            className="mt-[7px] size-1.5 shrink-0 rounded-full"
                            style={{ background: "linear-gradient(90deg, #4CBFFF, #9A1BFF)" }}
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lgToken border border-white/12 bg-white/[0.04] p-5">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                      Benefícios esperados
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {SHOWCASE_PLATFORM.benefits.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                          <CircleCheck className="mt-0.5 size-4 shrink-0 text-[#3BFE95]" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 md:px-10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            Fourmakers by Foursys · Showcase ConaRH — Jornada de Recrutamento
          </p>
          <p className="text-xs text-white/40">
            Demonstração com dados fictícios · Protótipo de interface
          </p>
        </div>
      </footer>

      {openFeature ? (
        <ShowcaseFeatureDetail
          feature={openFeature}
          total={SHOWCASE_FEATURES.length}
          onClose={() => setOpenId(null)}
          onPrev={() => goRelative(-1)}
          onNext={() => goRelative(1)}
        />
      ) : null}
    </div>
  );
}
