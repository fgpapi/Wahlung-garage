import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ABOUT_PHOTO } from '../data/gallery';
import { SECTIONS } from '../data/copy';

export function About() {
  const meta = SECTIONS.nosotros;

  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-title"
      className="bg-surface py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="nosotros-title"
        />

        <div className="mt-12 grid items-start gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Photo slot={ABOUT_PHOTO} sizes="(min-width: 1024px) 38vw, 100vw" />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-col gap-5">
                {meta.body.map((paragraph) => (
                  <p key={paragraph} className="max-w-[62ch] leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
                {meta.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1.5 bg-surface p-5">
                    <dt className="type-eyebrow text-[0.625rem] text-ink-subtle">{stat.label}</dt>
                    <dd className="type-title text-xl text-brand-navy">{stat.value}</dd>
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
