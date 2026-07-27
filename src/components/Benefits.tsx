import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { BENEFITS } from '../data/benefits';
import { SECTIONS } from '../data/copy';

/**
 * Sits on the inverted surface to break the long light run of the service
 * sections, and because orange only reads as an accent when it has quiet dark
 * space around it.
 */
export function Benefits() {
  const meta = SECTIONS.beneficios;

  return (
    <section
      aria-labelledby="beneficios-title"
      data-surface="dark"
      className="bg-surface-invert py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          tone="dark"
          titleId="beneficios-title"
        />

        <ul className="mt-12 grid gap-px border border-line-invert bg-line-invert sm:mt-16 sm:grid-cols-2">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <li key={benefit.id} className="bg-surface-invert">
                <Reveal delay={index * 0.06} className="h-full">
                  <article className="flex h-full flex-col gap-5 p-7 sm:p-9">
                    <span
                      aria-hidden
                      className="inline-flex size-12 shrink-0 items-center justify-center border border-line-invert-strong text-brand-primary"
                    >
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <h3 className="type-heading text-xl text-ink-invert">{benefit.title}</h3>
                    <p className="max-w-[46ch] text-sm leading-relaxed text-ink-invert-muted sm:text-base">
                      {benefit.body}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
