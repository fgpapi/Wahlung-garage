import { useState } from 'react';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Button } from './ui/Button';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { ADDRESS, HOURS, MAP_EMBED_URL, MAP_LINK_URL, PHONES } from '../data/site';
import { CONTACT, HERO, SECTIONS } from '../data/copy';
import { formatPhone, telHref } from '../lib/whatsapp';

export function Contact() {
  const meta = SECTIONS.contacto;

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      data-surface="dark"
      className="bg-brand-navy py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          tone="dark"
          titleId="contacto-title"
        />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <InfoBlock icon={MapPin} label={CONTACT.addressLabel}>
              <address className="not-italic">
                <span className="block text-ink-invert">{ADDRESS.street}</span>
                <span className="block text-ink-invert-muted">{ADDRESS.reference}</span>
                <span className="block text-ink-invert-muted">
                  {`${ADDRESS.city}, ${ADDRESS.country}`}
                </span>
              </address>
            </InfoBlock>

            <InfoBlock icon={Clock} label={CONTACT.hoursLabel}>
              <p className="text-ink-invert">{HOURS.label}</p>
              <p className="font-mono text-ink-invert-muted">{HOURS.range}</p>
            </InfoBlock>

            <InfoBlock icon={Phone} label={CONTACT.phonesLabel}>
              <ul className="flex flex-col gap-2">
                {PHONES.map((phone) => (
                  <li key={phone.raw}>
                    <a
                      href={telHref(phone.raw)}
                      className="inline-flex min-h-11 flex-col justify-center transition-colors hover:text-brand-primary"
                    >
                      <span className="font-mono text-lg text-ink-invert">
                        {formatPhone(phone.raw)}
                      </span>
                      <span className="type-eyebrow text-[0.5625rem] text-ink-invert-muted">
                        {phone.role}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </InfoBlock>

            <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta size="lg">{HERO.primaryCta}</WhatsAppCta>
              <Button
                href={MAP_LINK_URL}
                target="_blank"
                variant="outline-invert"
                size="lg"
                icon={Navigation}
              >
                {CONTACT.mapCta}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <MapFacade />
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span
        aria-hidden
        className="inline-flex size-11 shrink-0 items-center justify-center border border-ink-invert/25 text-brand-primary"
      >
        <Icon size={19} strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1.5 pt-1">
        <h3 className="type-eyebrow text-[0.625rem] text-ink-invert-muted">{label}</h3>
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/**
 * The Google Maps iframe is third-party, heavy and sets cookies, so it is never
 * on the first paint. It loads only after the visitor asks for it.
 */
function MapFacade() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={MAP_EMBED_URL}
        title={CONTACT.mapIframeTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-4/3 w-full border border-ink-invert/25 lg:aspect-16/10"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      style={{ ['--reg-color' as string]: 'var(--color-brand-primary)' }}
      className="registration-frame texture-diagonal group/map flex aspect-4/3 w-full cursor-pointer flex-col items-center justify-center gap-4 border border-ink-invert/25 bg-ink/40 px-6 text-center lg:aspect-16/10"
    >
      <span
        aria-hidden
        className="inline-flex size-14 items-center justify-center border border-brand-primary text-brand-primary transition-colors group-hover/map:bg-brand-primary group-hover/map:text-ink"
      >
        <MapPin size={24} strokeWidth={1.5} />
      </span>
      <span className="type-heading text-lg text-ink-invert">{CONTACT.mapFacadeTitle}</span>
      <span className="max-w-[38ch] text-sm text-ink-invert-muted">
        {CONTACT.mapFacadeBody}
      </span>
      <span className="type-eyebrow mt-2 text-[0.625rem] text-brand-primary">
        {CONTACT.mapFacadeCta}
      </span>
    </button>
  );
}
