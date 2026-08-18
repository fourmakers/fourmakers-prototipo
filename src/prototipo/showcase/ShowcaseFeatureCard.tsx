import { useCallback, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Play } from "lucide-react";
import { showcaseAsset, type ShowcaseFeature } from "@/prototipo/showcase/showcaseContent";

interface ShowcaseFeatureCardProps {
  feature: ShowcaseFeature;
  onOpen: (id: string) => void;
}

export function ShowcaseFeatureCard({ feature, onOpen }: ShowcaseFeatureCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const Icon = feature.icon;

  const startPreview = useCallback(() => {
    setIsPreviewing(true);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, []);

  const stopPreview = useCallback(() => {
    setIsPreviewing(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  return (
    <article
      data-reveal
      className="showcase-reveal h-full"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
    >
      <div
        className="showcase-card h-full"
        style={{ "--sc-card-gradient": feature.gradient } as CSSProperties}
      >
        <div className="showcase-card-inner flex h-full flex-col">
          <button
            type="button"
            onClick={() => onOpen(feature.id)}
            aria-label={`Abrir detalhes de ${feature.title}`}
            className="group/media relative block aspect-[16/9] w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0518]"
          >
            <video
              ref={videoRef}
              className="showcase-card-media h-full w-full object-cover object-top"
              src={showcaseAsset(`videos/${feature.id}.mp4`)}
              poster={showcaseAsset(`posters/${feature.id}.jpg`)}
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
              aria-hidden
            />

            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,5,24,0) 38%, rgba(11,5,24,0.72) 78%, rgba(11,5,24,0.94) 100%)",
              }}
              aria-hidden
            />

            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80"
              style={{ background: feature.gradient }}
              aria-hidden
            />

            <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-pillToken border border-white/25 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
              <Icon className="size-3.5" aria-hidden />
              {feature.journey}
            </span>

            <span
              className="pointer-events-none absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-[13px] font-bold text-white backdrop-blur-md"
              aria-hidden
            >
              {String(feature.step).padStart(2, "0")}
            </span>

            <span
              className={`pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-pillToken bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md transition-opacity duration-300 ${
                isPreviewing ? "opacity-0" : "opacity-100"
              }`}
            >
              <Play className="size-3 fill-current" aria-hidden />
              Preview
            </span>
          </button>

          <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
              <h3 className="text-[1.35rem] font-bold leading-tight text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.summary}</p>
            </div>

            <p
              className="text-[0.95rem] font-semibold leading-snug"
              style={{
                background: feature.gradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {feature.impact}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {feature.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-pillToken border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-white/75"
                >
                  {tag}
                </span>
              ))}
              {feature.tags.length > 4 ? (
                <span className="rounded-pillToken px-2.5 py-1 text-[11px] font-medium text-white/45">
                  +{feature.tags.length - 4}
                </span>
              ) : null}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <span className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                {feature.anchorMetric}
              </span>
              <button
                type="button"
                onClick={() => onOpen(feature.id)}
                className="showcase-pill-cta shrink-0 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0518]"
              >
                <ArrowRight className="size-4 shrink-0" aria-hidden />
                <span className="showcase-pill-cta-label text-sm">Ver detalhes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
