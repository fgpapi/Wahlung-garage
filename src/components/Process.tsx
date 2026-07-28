import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { PROCESS_STEPS } from '../data/process';
import { A11Y, SECTIONS } from '../data/copy';

/**
 * A real sequence, so the steps are joined by an actual hairline spine rather
 * than left floating as four disconnected cards. The spine alone carries the
 * order — the <ol> carries it for assistive tech.
 */
export function Process() {
  const meta = SECTIONS.proceso;

  return (
    <section aria-labelledby="proceso-title" className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="proceso-title"
        />

        <ol className="relative mt-12 grid gap-10 sm:mt-16 md:grid-cols-4 md:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.title}
              /* The spine itself: a left rule on mobile, a top rule on desktop.
                 It replaces the numerals as the thing that ties the four steps
                 together. */
              className="relative border-l border-line-strong pl-5 md:border-l-0 md:border-t md:pt-6 md:pl-0"
            >
              {/* Bridges the flex gap so the rule reads as one continuous line
                  instead of four detached segments. Vertical on mobile
                  (gap-10 = 40px), horizontal on desktop (gap-8 = 32px).
                  The -px offsets matter: the border sits on the border box but
                  an absolute child anchors to the padding box, so a plain
                  left-0 / top-0 lands the bridge one pixel off the rule. */}
              {index < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-10 -left-px h-10 w-px bg-line-strong md:-top-px md:-right-8 md:bottom-auto md:left-auto md:h-px md:w-8"
                />
              )}
              <Reveal delay={index * 0.08}>
                <h3 className="type-heading text-lg text-ink">
                  <span className="sr-only">{`${A11Y.stepPrefix} ${index + 1}: `}</span>
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
