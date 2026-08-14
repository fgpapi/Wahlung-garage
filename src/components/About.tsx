import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ABOUT_BACKGROUND, ABOUT_PHOTO } from '../data/gallery';
import { SECTIONS } from '../data/copy';

/**
 * The overlay over the background photo, measured rather than eyeballed against
 * the real pixels of taller-2 (scripts/check-contrast.mjs, ABOUT_OVERLAY).
 *
 * The photo contains blown-out cloud at a true rgb(255,255,255), which is the
 * worst case every ratio below is taken from. White text needs the composite to
 * land at or under 0.183 relative luminance for 4.5:1; the flat scrim plus the
 * gradient put the lightest pixel anywhere in the section at 0.135, which is
 * 5.6:1 — so the section clears AA at its single brightest point, not on average.
 *
 * The gradient is heavier top and bottom than through the middle on purpose: the
 * top of a 2.68:1 panorama is sky, which carries no information worth protecting,
 * while the middle band holds the cars and the yard. Spending the opacity where
 * the picture is empty is what keeps it from going flat.
 */
const SCRIM = 'rgb(10 12 16 / 0.35)';
const GRADIENT =
  'linear-gradient(to bottom, rgb(10 12 16 / 0.55) 0%, rgb(10 12 16 / 0.42) 50%, rgb(10 12 16 / 0.58) 100%)';

/**
 * Below `lg` the photo stops covering the section and becomes a band across its
 * top, dissolving into the section's own #0A0C10 floor. The breakpoint tracks
 * the layout, not a round number: the grid only goes 12-column at `lg`, so below
 * that the copy stacks and the section is tall enough for cover to crop hard.
 *
 * The reason is the panorama's 2.68:1 shape. `object-fit: cover` against a tall
 * phone column crops horizontally, and at 360px the section is 1324px tall — so
 * cover showed 10.2% of the picture, blowing 104 source pixels across 720 device
 * pixels (6.9x). As a ~360px band the same viewport shows 37% of the picture at
 * under 2x. Serving a bigger rung would have fixed the blur by forcing a
 * full-resolution download onto exactly the connection that can least afford it.
 *
 * Contrast only improves: this gradient is pure darkening, and everything below
 * the band sits on flat #0A0C10, where the palette's own verified pairs apply.
 */
const BAND_FADE =
  'linear-gradient(to bottom, transparent 38%, rgb(10 12 16 / 0.85) 82%, #0a0c10 100%)';

export function About() {
  const meta = SECTIONS.nosotros;
  const bg = ABOUT_BACKGROUND;
  const widths = bg.widths ?? [];

  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-title"
      data-surface="dark"
      // `isolate` keeps the -z-10 background layer inside this section instead of
      // letting it slide behind the page. `bg-surface-invert` is the floor the
      // photo sits on, so the section is still legibly dark if the image 404s or
      // has not decoded yet.
      className="relative isolate overflow-hidden bg-surface-invert py-20 sm:py-28"
    >
      {/* A real <picture> rather than a CSS background: it carries a srcset and a
          WebP source, so a 360px phone fetches taller-2-640.webp (25 KB) instead
          of being forced into the 1600w file by a background-size rule.
          Hand-rolled instead of <Photo> because that component pins an
          aspect-ratio from the file's own pixels, which is exactly what a
          background that has to stretch to the section's height must not do. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[46vh] max-h-[26rem] min-h-[15rem] lg:h-full lg:max-h-none"
      >
        <picture>
          <source
            type="image/webp"
            sizes="100vw"
            srcSet={widths.map((w) => `${bg.stem}-${w}.webp ${w}w`).join(', ')}
          />
          <img
            src={`${bg.stem}-${widths[widths.length - 1]}.jpg`}
            srcSet={widths.map((w) => `${bg.stem}-${w}.jpg ${w}w`).join(', ')}
            sizes="100vw"
            alt={bg.alt}
            width={bg.width}
            height={bg.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0" style={{ backgroundColor: SCRIM }} />
        <div className="absolute inset-0" style={{ backgroundImage: GRADIENT }} />
        {/* Dissolves the band into the section floor. Never on desktop, where the
            photo runs the full height and a bottom fade would just crush it. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ backgroundImage: BAND_FADE }}
        />
      </div>

      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          tone="photo"
          titleId="nosotros-title"
        />

        <div className="mt-12 grid items-start gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Photo
              slot={ABOUT_PHOTO}
              sizes="(min-width: 1024px) 38vw, calc(100vw - 2.5rem)"
            />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-col gap-5">
                {meta.body.map((paragraph) => (
                  // White, not the muted ink used on flat dark bands: over a
                  // photograph #A8B2C1 would need a ~76% scrim to clear 4.5:1.
                  <p key={paragraph} className="max-w-[62ch] leading-relaxed text-ink-invert">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* The stat blocks were dark-on-light boxes. They are now opaque
                  inspection plates: at 88% they read as solid over the photo, so
                  the pair inside them is the token pair the palette already
                  verifies rather than anything that depends on the picture. */}
              <dl className="mt-10 grid gap-px border border-line-invert-strong bg-line-invert sm:grid-cols-3">
                {meta.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-1.5 bg-surface-invert/88 p-5"
                  >
                    <dt className="type-eyebrow text-[0.625rem] text-ink-invert-muted">
                      {stat.label}
                    </dt>
                    <dd className="type-title text-xl text-ink-invert">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
