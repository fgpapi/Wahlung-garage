import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { COMPARISON_SET, type PhotoSlot } from '../data/gallery';
import { SECTIONS } from '../data/copy';

/**
 * The second before/after, and deliberately not a second slider.
 *
 * A drag comparator needs two frames of the same subject from the same point at
 * the same size — the first one asserts exactly that in MUST_MATCH. This set is
 * one 640x853 portrait taken on the street the day the car arrived against three
 * 1600x1204 landscapes from three different angles. There is no handle position
 * that makes those line up, so the comparison is carried by labels instead: the
 * damage set apart on its own, the finished work grouped beside it, and every
 * frame carrying the word "Antes" or "Después" on the photo itself.
 *
 * Every photo keeps its own intrinsic ratio. Nothing here is cropped to make the
 * two groups agree.
 */
export function BeforeAfterSet() {
  const meta = SECTIONS.comparador2;
  const [lead, ...rest] = COMPARISON_SET.after;

  return (
    <section
      aria-labelledby="comparador2-title"
      className="bg-surface py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="comparador2-title"
        />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <GroupLabel>{meta.beforeLabel}</GroupLabel>
            <Reveal className="mt-4">
              {/* Capped at the original's own 640px so the one small file in the
                  set is never upscaled past its real resolution. */}
              <div className="max-w-[40rem]">
                <Shot
                  slot={COMPARISON_SET.before}
                  label={meta.beforeLabel}
                  sizes="(min-width: 1024px) 40vw, calc(100vw - 2.5rem)"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <GroupLabel>{meta.afterLabel}</GroupLabel>
            <Reveal className="mt-4">
              {/* The first finished angle leads at full width; the other two sit
                  under it as a pair. Three equal thirds would drop each landscape
                  to roughly 216px on a desktop and lose the panel work entirely. */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Shot
                    slot={lead}
                    label={meta.afterLabel}
                    sizes="(min-width: 1024px) 56vw, calc(100vw - 2.5rem)"
                  />
                </div>
                {rest.map((slot) => (
                  <Shot
                    key={slot.id}
                    slot={slot}
                    label={meta.afterLabel}
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, calc(100vw - 2.5rem)"
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The hairline-and-eyebrow head the section headers already use, one level down. */
function GroupLabel({ children }: { children: string }) {
  return (
    <h3 className="type-eyebrow border-t border-line-strong pt-3 text-ink-muted">
      {children}
    </h3>
  );
}

/**
 * One photo with its state stamped on it. The chip repeats on every frame rather
 * than sitting once over each group: at a glance, or halfway down the page on a
 * phone, nobody should have to work out which pile they are looking at.
 */
function Shot({
  slot,
  label,
  sizes,
}: {
  slot: PhotoSlot;
  label: string;
  sizes: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative">
        <Photo slot={slot} sizes={sizes} />
        {/* Same dark chip as the slider's own labels: at 80% ink it lands under
            0.05 relative luminance over even a blown-out sky, so the white label
            holds above 11:1 on any photo it is dropped onto. */}
        <span className="type-eyebrow pointer-events-none absolute top-3 left-3 border border-line-invert-strong bg-ink/80 px-2.5 py-1.5 text-[0.625rem] text-ink-invert">
          {label}
        </span>
      </div>
      <figcaption className="text-sm leading-relaxed text-ink-muted">
        {slot.caption}
      </figcaption>
    </figure>
  );
}
