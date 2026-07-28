import { Quote } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Reveal } from './ui/Reveal';
import { TESTIMONIALS } from '../data/testimonials';
import { SECTIONS } from '../data/copy';

export function Testimonials() {
  const meta = SECTIONS.testimonios;

  return (
    <section
      aria-labelledby="testimonios-title"
      className="bg-surface-alt py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="testimonios-title"
        />

        <ul className="mt-12 grid gap-px border border-line bg-line sm:mt-16 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <li key={testimonial.id} className="bg-surface-alt">
              <Reveal delay={index * 0.06} className="h-full">
                <figure className="flex h-full flex-col gap-6 p-7 sm:p-8">
                  <Quote
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden
                    className="shrink-0 text-brand-primary-ink"
                  />

                  <blockquote className="flex-1 text-base leading-relaxed text-ink">
                    {testimonial.quote}
                  </blockquote>

                  <figcaption className="flex flex-col gap-1 border-t border-line pt-5">
                    <span className="type-heading text-base text-ink">{testimonial.name}</span>
                    <span className="font-mono text-xs text-ink-muted">
                      {testimonial.vehicle}
                    </span>
                    <span className="type-eyebrow mt-1 text-[0.625rem] text-ink-subtle">
                      {testimonial.service}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
