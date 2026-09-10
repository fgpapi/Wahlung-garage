import { ArrowRight, Check } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { SERVICES, type Service } from '../data/services';
import { SERVICE_AFTER_PHOTOS, SERVICE_PHOTOS, type PhotoSlot } from '../data/gallery';
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

      <h3 className="type-heading text-xl text-ink">{service.name}</h3>

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
  const afterPhotos = SERVICE_AFTER_PHOTOS[service.id];
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
            {/* Not 100vw: Container takes 1.25rem of padding a side on phones,
                so declaring the full viewport over-asks for a rung. */}
            {photo && afterPhotos?.length ? (
              <ServiceComparison before={photo} after={afterPhotos} />
            ) : photo ? (
              <Photo slot={photo} sizes="(min-width: 1024px) 46vw, calc(100vw - 2.5rem)" />
            ) : null}
          </Reveal>

          <div className={cn('lg:col-span-6', reversed && 'lg:order-1')}>
            <Reveal>
              {/* The rule stays as the section's opening mark now that the
                  numeric code that sat beside it is gone. */}
              <span aria-hidden className="block h-px w-full bg-line-strong" />

              <h2 id={titleId} className="type-title mt-6 text-[clamp(1.6rem,3.4vw,2.5rem)] text-ink">
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

/**
 * A service section's own antes/después: the shot of the work in progress on
 * top, the finished frames under it as a pair.
 *
 * Deliberately not the drag comparator. That one needs both halves shot from the
 * same point at the same size, and these are a masked front end inside the shop
 * against two finished angles out on the street — no handle position lines those
 * up. The comparison is carried by the labels instead, one stamped on every
 * frame so it reads the same on a phone as on a desktop, where the two "después"
 * sit side by side under the "antes".
 */
function ServiceComparison({
  before,
  after,
}: {
  before: PhotoSlot;
  after: readonly PhotoSlot[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <Stamped
        slot={before}
        label={SERVICE_SECTION.beforeLabel}
        sizes="(min-width: 1024px) 46vw, calc(100vw - 2.5rem)"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {after.map((slot) => (
          <Stamped
            key={slot.id}
            slot={slot}
            label={SERVICE_SECTION.afterLabel}
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, calc(100vw - 2.5rem)"
          />
        ))}
      </div>
    </div>
  );
}

/** One frame with its state stamped on it, in the comparators' own dark chip. */
function Stamped({
  slot,
  label,
  sizes,
}: {
  slot: PhotoSlot;
  label: string;
  sizes: string;
}) {
  return (
    <div className="relative">
      <Photo slot={slot} sizes={sizes} />
      {/* At 80% ink the chip lands under 0.05 relative luminance over even a
          blown-out sky, so the white label holds above 11:1 on any photo. */}
      <span className="type-eyebrow pointer-events-none absolute top-3 left-3 border border-line-invert-strong bg-ink/80 px-2.5 py-1.5 text-[0.625rem] text-ink-invert">
        {label}
      </span>
    </div>
  );
}
