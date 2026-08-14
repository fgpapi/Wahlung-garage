import { useState } from 'react';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Button } from './ui/Button';
import { WhatsAppCta } from './ui/WhatsAppCta';
import {
  ADDRESS,
  EMAIL,
  HOURS,
  MAP_DIRECTIONS_URL,
  MAP_EMBED_URL,
  MAP_LINK_URL,
  PHONES,
  mailtoHref,
} from '../data/site';
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

            {/* Same row shape as a phone: one tap target, the address in mono at
                the same optical size. Steps down a notch below `sm` because
                wahlunggarage@gmail.com is 23 characters and would otherwise run
                past the 44px icon gutter on a 360px screen. */}
            <InfoBlock icon={Mail} label={CONTACT.emailLabel}>
              <a
                href={mailtoHref()}
                className="inline-flex min-h-11 flex-col justify-center transition-colors hover:text-brand-primary"
              >
                <span className="font-mono text-[0.9375rem] break-all text-ink-invert sm:text-lg">
                  {EMAIL}
                </span>
              </a>
            </InfoBlock>

            <div className="flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta size="lg">{HERO.primaryCta}</WhatsAppCta>
              {/* Directions, not just the pin: from a phone this opens Maps
                  already routing from wherever the visitor is standing. */}
              <Button
                href={MAP_DIRECTIONS_URL}
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
      <div className="flex flex-col gap-3">
        <iframe
          src={MAP_EMBED_URL}
          title={CONTACT.mapIframeTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-4/3 w-full border border-ink-invert/25 lg:aspect-16/10"
        />
        {/* An embedded map is awkward to pan on a phone, so give the pin its own
            way out to the real Maps app. */}
        <a
          href={MAP_LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="type-eyebrow inline-flex min-h-11 items-center text-[0.625rem] text-brand-primary underline-offset-4 hover:underline"
        >
          {CONTACT.mapOpenExternal}
        </a>
      </div>
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
