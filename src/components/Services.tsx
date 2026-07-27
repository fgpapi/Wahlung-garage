import { ArrowRight, Check } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { SERVICES, type Service } from '../data/services';
import { SERVICE_PHOTOS } from '../data/gallery';
import { SECTIONS, SERVICE_SECTION } from '../data/copy';
import { cn } from '../lib/cn';

/**
 * The overview grid. Deliberately not an accordion — the four services are the
 * page's main offer, and hiding them behind a tap costs quotes. Accordions are
 * reserved for the FAQ, where collapsing is genuinely useful.
 */
export function ServicesOverview() {
  const meta = SECTIONS.servicios;

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="bg-surface py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="servicios-title"
        />

        <ul className="mt-12 grid gap-px border border-line bg-line sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <li key={service.id} className="bg-surface">
              <Reveal delay={index * 0.06} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <a
      href={`#${service.id}`}
      className="group/card relative flex h-full flex-col gap-5 bg-surface p-6 transition-colors hover:bg-surface-alt sm:p-7"
    >
      {/* The orange marker is an accent, not a decoration: it only appears on the
          card you are pointing at. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-primary transition-transform duration-300 group-hover/card:scale-x-100 group-focus-visible/card:scale-x-100"
      />

      <span
        aria-hidden
        className="inline-flex size-12 shrink-0 items-center justify-center border border-line-strong text-brand-navy transition-colors group-hover/card:border-brand-navy"
      >
        <Icon size={22} strokeWidth={1.5} />
      </span>

      <div className="flex flex-col gap-2">
        <span className="type-eyebrow text-[0.625rem] text-ink-subtle">{service.code}</span>
        <h3 className="type-heading text-xl text-ink">{service.name}</h3>
      </div>

      <p className="text-sm leading-relaxed text-ink-muted">{service.summary}</p>

      <span className="type-eyebrow mt-auto inline-flex items-center gap-2 pt-2 text-[0.625rem] text-brand-primary-ink">
        {SERVICE_SECTION.detailLink}
        <ArrowRight
          size={13}
          aria-hidden
          className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/card:translate-x-1"
        />
      </span>
    </a>
  );
}

/**
 * The four full service sections, alternating image and text. Each one carries
 * its own WhatsApp CTA with the service name already written into the message.
 */
export function ServiceSections() {
  return (
    <>
      {SERVICES.map((service, index) => (
        <ServiceDetail key={service.id} service={service} index={index} />
      ))}
    </>
  );
}

function ServiceDetail({ service, index }: { service: Service; index: number }) {
  const reversed = index % 2 === 1;
  const photo = SERVICE_PHOTOS[service.id];
  const titleId = `${service.id}-title`;

  return (
    <section
      id={service.id}
      aria-labelledby={titleId}
      className={cn('py-16 sm:py-20', reversed ? 'bg-surface-alt' : 'bg-surface')}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal
            className={cn('lg:col-span-6', reversed && 'lg:order-2')}
          >
            {photo ? (
              <Photo slot={photo} sizes="(min-width: 1024px) 46vw, 100vw" />
            ) : null}
          </Reveal>

          <div className={cn('lg:col-span-6', reversed && 'lg:order-1')}>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="type-eyebrow text-brand-primary-ink">{service.code}</span>
                <span aria-hidden className="h-px flex-1 bg-line-strong" />
              </div>

              <h2 id={titleId} className="type-title mt-5 text-[clamp(1.6rem,3.4vw,2.5rem)] text-ink">
                {service.name}
              </h2>

              <p className="mt-5 max-w-[58ch] leading-relaxed text-ink-muted">{service.body}</p>

              <h3 className="type-eyebrow mt-9 text-ink-subtle">{SERVICE_SECTION.includes}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-ink sm:text-base">
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      aria-hidden
                      className="mt-1 shrink-0 text-brand-primary-ink"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppCta service={service.whatsappLabel} size="lg" className="mt-9">
                {`${SERVICE_SECTION.ctaPrefix} ${service.name}`}
              </WhatsAppCta>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
