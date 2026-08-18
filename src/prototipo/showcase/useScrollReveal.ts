import { useEffect, useRef } from "react";

/**
 * Revela elementos `[data-reveal]` ao entrarem na viewport, com stagger por
 * ordem de aparição dentro do container (mesmo padrão do site institucional).
 */
export function useScrollReveal<T extends HTMLElement>(staggerMs = 90) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    let batch: HTMLElement[] = [];
    let flushHandle = 0;

    const flush = () => {
      batch.forEach((el, i) => {
        el.style.animationDelay = `${i * staggerMs}ms`;
        el.classList.add("is-visible");
      });
      batch = [];
      flushHandle = 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          batch.push(el);
          if (!flushHandle) flushHandle = window.requestAnimationFrame(flush);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (flushHandle) window.cancelAnimationFrame(flushHandle);
    };
  }, [staggerMs]);

  return containerRef;
}
