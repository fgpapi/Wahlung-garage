import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { HERO } from '../data/copy';
import { usePrefersReducedMotion } from '../lib/hooks';
import { cn } from '../lib/cn';

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  /**
   * The video now plays on phones too, on a 397 KB 720p variant picked by the
   * <source media> query below. Reduced motion is still an absolute veto: the
   * <video> is never rendered, so the browser never requests the file at all.
   */
  const showVideo = !reducedMotion;

  return (
    <section id="inicio" className="relative isolate min-h-[100svh] overflow-hidden bg-surface-invert">
      <div className="absolute inset-0 -z-10">
        {/* Painted first and always: the poster owns the first frame, so the
            video can never flash black while it negotiates its first bytes.
            The <video> fades in on top of it once it can actually play.
            object-position holds the technician in frame at 9:16, where a
            centred crop of this landscape footage would cut him out entirely. */}
        <img
          src="/hero-poster-800.jpg"
          srcSet="/hero-poster-800.jpg 800w, /hero-poster.jpg 1600w"
          sizes="100vw"
          alt={HERO.posterAlt}
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover object-[68%_50%] md:object-center"
        />

        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            // Deliberately the 800px still, not the 1600px one: the <img> below
            // already picked the 800 on a phone, so pointing the poster at the
            // same file makes it one download instead of two (-95 KB on mobile).
            // It is only ever on screen for the moment before canplay fires.
            poster="/hero-poster-800.jpg"
            aria-hidden
            tabIndex={-1}
            onCanPlay={() => setVideoReady(true)}
            className={cn(
              'absolute inset-0 size-full object-cover object-[68%_50%] md:object-center',
              'transition-opacity duration-700 ease-out',
              videoReady ? 'opacity-100' : 'opacity-0',
            )}
          >
            {/* 720p, H.264 baseline, no audio track — 397 KB against the
                456 KB desktop file, so a phone downloads less, not more. */}
            <source media="(max-width: 767px)" src="/hero-mobile.mp4" type="video/mp4" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Left-weighted scrim: the painter sits right of frame, so darkening the
            left keeps the subject visible while guaranteeing legible copy. Held
            flatter in portrait, where the crop puts mid-frame content on the left. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-ink/95 via-ink/78 to-ink/55 md:via-ink/80 md:to-ink/35"
        />
        {/* Floor and ceiling: the ceiling keeps the transparent header readable
            over the bright booth walls. The floor runs deeper in portrait, where
            the copy stack is taller and sits over more of the frame. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/65 via-55% to-transparent md:via-ink/55 md:via-45%"
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
      </Container>
    </section>
  );
}
