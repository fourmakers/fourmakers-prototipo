import { useEffect, useRef, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, CircleCheck, Sparkle, Target, X } from "lucide-react";
import { showcaseAsset, type ShowcaseFeature } from "@/prototipo/showcase/showcaseContent";

interface ShowcaseFeatureDetailProps {
  feature: ShowcaseFeature;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Target; children: string }) {
  return (
    <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </h4>
  );
}

export function ShowcaseFeatureDetail({
  feature,
  total,
  onClose,
  onPrev,
  onNext,
}: ShowcaseFeatureDetailProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const Icon = feature.icon;

  useEffect(() => {
    closeRef.current?.focus();
  }, [feature.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={feature.title}
    >
      <div
        className="absolute inset-0 bg-[#05010d]/85 backdrop-blur-xl"
        onClick={onClose}
        role="presentation"
      />

      <div
        className="showcase-detail-enter relative flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-[26px] p-[2px]"
        style={{ "--sc-card-gradient": feature.gradient, background: feature.gradient } as CSSProperties}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-[#0b0518]">
          <header className="flex shrink-0 items-start gap-4 border-b border-white/10 px-5 py-4 md:px-8 md:py-5">
            <span
              className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-mdToken text-[#0b0518]"
              style={{ background: feature.gradient }}
              aria-hidden
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                Etapa {String(feature.step).padStart(2, "0")} de {String(total).padStart(2, "0")} ·{" "}
                {feature.journey}
              </p>
              <h3 className="mt-1 text-xl font-bold leading-tight text-white md:text-[1.75rem]">
                {feature.title}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Feature anterior"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/80 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Próxima feature"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/80 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar detalhes"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white/80 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
          </header>

          <div className="showcase-scroll-area grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto p-5 md:p-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:overflow-hidden">
            <div className="flex min-w-0 flex-col gap-5 xl:overflow-hidden">
              <div
                className="relative overflow-hidden rounded-lgToken border border-white/12"
                style={{ boxShadow: "0 30px 80px rgba(154,27,255,0.28)" }}
              >
                <video
                  key={feature.id}
                  className="aspect-[1.87/1] w-full bg-black object-cover"
                  src={showcaseAsset(`videos/${feature.id}.mp4`)}
                  poster={showcaseAsset(`posters/${feature.id}.jpg`)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  aria-label={`Demonstração em vídeo — ${feature.title}`}
                />
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-1"
                  style={{ background: feature.gradient }}
                  aria-hidden
                />
              </div>

              <div className="rounded-lgToken border border-white/12 bg-white/[0.04] p-5 md:p-6">
                <SectionTitle icon={Sparkle}>Impacto</SectionTitle>
                <p
                  className="mt-3 text-2xl font-bold leading-tight md:text-[2rem]"
                  style={{
                    background: feature.gradient,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {feature.impact}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{feature.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pillToken border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-white/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="showcase-scroll-area flex min-w-0 flex-col gap-5 xl:overflow-y-auto xl:pr-1">
              <div className="rounded-lgToken border border-white/12 bg-white/[0.04] p-5 md:p-6">
                <SectionTitle icon={CircleCheck}>O que o cliente recebe</SectionTitle>
                <ul className="mt-4 space-y-3">
                  {feature.delivers.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                      <span
                        className="mt-[7px] size-1.5 shrink-0 rounded-full"
                        style={{ background: feature.gradient }}
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lgToken border border-white/12 bg-white/[0.04] p-5 md:p-6">
                <SectionTitle icon={Target}>Benefícios esperados</SectionTitle>
                <ul className="mt-4 space-y-3">
                  {feature.benefits.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/85">
                      <CircleCheck
                        className="mt-0.5 size-4 shrink-0 text-[color:var(--sc-green,#3BFE95)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-lgToken p-[1.5px]"
                style={{ background: feature.gradient }}
              >
                <div className="rounded-[calc(var(--radius-lg)-1.5px)] bg-[#0b0518] px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                    Benefício âncora
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-white">{feature.anchorMetric}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
