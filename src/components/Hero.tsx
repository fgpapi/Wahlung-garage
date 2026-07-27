import { ArrowRight } from 'lucide-react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { HERO } from '../data/copy';
import { DESKTOP_QUERY, useMediaQuery, usePrefersReducedMotion } from '../lib/hooks';

export function Hero() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = usePrefersReducedMotion();

  /**
   * Hard requirement, not an optimisation: below 768px and whenever reduced
   * motion is requested, the <video> is never rendered, so the browser never
   * requests the 456 KB file. Honduran mobile data is expensive. `useMediaQuery`
   * reads matchMedia during the initial state, so a phone never briefly mounts it.
   */
  const showVideo = isDesktop && !reducedMotion;

  return (
    <section id="inicio" className="relative isolate min-h-[100svh] overflow-hidden bg-surface-invert">
      <div className="absolute inset-0 -z-10">
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-hidden
            tabIndex={-1}
            className="size-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/hero-poster-800.jpg"
            srcSet="/hero-poster-800.jpg 800w, /hero-poster.jpg 1600w"
            sizes="100vw"
            alt={HERO.posterAlt}
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover"
          />
        )}

        {/* Left-weighted scrim: the painter sits right of frame, so darkening the
            left keeps the subject visible while guaranteeing legible copy. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-ink/95 via-ink/80 to-ink/35"
        />
        {/* Floor and ceiling: the ceiling keeps the transparent header readable
            over the bright booth walls. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 via-45% to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink/85 to-transparent"
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-end pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl">
          <p className="type-eyebrow text-brand-primary">{HERO.eyebrow}</p>

          {/* Capped well below the viewport-derived maximum on purpose: at 8.5vw
              the headline pushed the primary CTA below the fold at 1440x900. */}
          <h1 className="type-display mt-5 text-[clamp(2.25rem,5.2vw,4.5rem)] text-ink-invert">
            {HERO.headline}
          </h1>

          <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-ink-invert-muted sm:text-lg">
            {HERO.support}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <WhatsAppCta size="lg" className="w-full sm:w-auto">
              {HERO.primaryCta}
            </WhatsAppCta>
            <Button
              href="#servicios"
              variant="outline-invert"
              size="lg"
              icon={ArrowRight}
              iconTrailing
              className="w-full sm:w-auto"
            >
              {HERO.secondaryCta}
            </Button>
          </div>
        </div>

        <div
          aria-hidden
          className="mt-10 hidden items-center gap-3 text-ink-invert-muted lg:flex"
        >
          <span className="type-eyebrow text-[0.625rem]">{HERO.scrollHint}</span>
          <span className="h-px w-16 bg-line-invert-strong" />
        </div>
      </Container>
    </section>
  );
}
