import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { PROCESS_STEPS } from '../data/process';
import { A11Y, SECTIONS } from '../data/copy';

/**
 * Numbering is earned here because this is a real sequence, not a list of
 * features. The steps are joined by an actual hairline spine rather than left
 * floating as four disconnected cards.
 */
export function Process() {
  const meta = SECTIONS.proceso;

  return (
    <section aria-labelledby="proceso-title" className="bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="proceso-title"
        />

        <ol className="relative mt-12 grid gap-10 sm:mt-16 md:grid-cols-4 md:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              {/* The spine, drawn per step rather than as one line across the
                  row: it runs from this numeral's edge to the next numeral's
                  edge exactly, so it never dangles past the last step. Vertical
                  on mobile (gap-10 = 40px), horizontal on desktop (gap-8 = 32px). */}
              {index < PROCESS_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-12 -bottom-10 left-6 w-px bg-line-strong md:top-6 md:-right-8 md:bottom-auto md:left-12 md:h-px md:w-auto"
                />
              )}
              <Reveal delay={index * 0.08}>
                <div className="flex gap-5 md:flex-col md:gap-6">
                  <span
                    aria-hidden
                    className="type-display relative z-10 flex size-12 shrink-0 items-center justify-center border border-line-strong bg-surface text-lg text-brand-primary-ink"
                  >
                    {step.number}
                  </span>
                  <div className="pt-1 md:pt-0">
                    <h3 className="type-heading text-lg text-ink">
                      <span className="sr-only">{`${A11Y.stepPrefix} ${step.number}: `}</span>
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
