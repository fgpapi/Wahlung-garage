import { Container } from './ui/Container';
import { Logo } from './ui/Logo';
import { ADDRESS, HOURS, NAV_LINKS, PHONES, SERVICE_NAV, SITE } from '../data/site';
import { FOOTER } from '../data/copy';
import { formatPhone, telHref } from '../lib/whatsapp';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="pie"
      data-surface="dark"
      className="border-t border-line-invert bg-surface-invert py-14 sm:py-16"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-ink-invert-muted">
              {FOOTER.description}
            </p>
          </div>

          <nav aria-label={FOOTER.servicesTitle} className="lg:col-span-3">
            <h2 className="type-eyebrow text-[0.625rem] text-ink-invert-muted">
              {FOOTER.servicesTitle}
            </h2>
            <ul className="mt-4 flex flex-col">
              {SERVICE_NAV.map((service) => (
                <li key={service.href}>
                  <a
                    href={service.href}
                    className="flex min-h-11 items-center text-sm text-ink-invert transition-colors hover:text-brand-primary"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="type-eyebrow text-[0.625rem] text-ink-invert-muted">
              {FOOTER.contactTitle}
            </h2>
            <address className="mt-4 flex flex-col gap-3 not-italic">
              <span className="text-sm leading-relaxed text-ink-invert-muted">
                {`${ADDRESS.street}, ${ADDRESS.reference}, ${ADDRESS.city}`}
              </span>
              <ul className="flex flex-col">
                {PHONES.map((phone) => (
                  <li key={phone.raw}>
                    <a
                      href={telHref(phone.raw)}
                      className="flex min-h-11 items-center font-mono text-sm text-ink-invert transition-colors hover:text-brand-primary"
                    >
                      {formatPhone(phone.raw)}
                    </a>
                  </li>
                ))}
              </ul>
              <span className="text-sm text-ink-invert-muted">
                {`${HOURS.label}, ${HOURS.range}`}
              </span>
            </address>
          </div>

          <nav aria-label={FOOTER.followTitle} className="lg:col-span-2">
            <h2 className="type-eyebrow text-[0.625rem] text-ink-invert-muted">
              {FOOTER.followTitle}
            </h2>
            <ul className="mt-4 flex flex-col">
              {FOOTER.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center text-sm text-ink-invert transition-colors hover:text-brand-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line-invert pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-ink-invert-muted">
            {`© ${year} ${SITE.name}. ${FOOTER.rights}`}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="type-eyebrow inline-flex min-h-11 min-w-11 items-center justify-center text-[0.5625rem] text-ink-invert-muted transition-colors hover:text-brand-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
