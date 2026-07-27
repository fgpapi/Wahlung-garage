import { useRef, useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Container } from './ui/Container';
import { Logo } from './ui/Logo';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, SERVICE_NAV } from '../data/site';
import { A11Y } from '../data/copy';
import { cn } from '../lib/cn';
import {
  useActiveSection,
  useClickOutside,
  useEscapeKey,
  useScrolledPast,
} from '../lib/hooks';

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1));

/**
 * One menu, sticky, transparent over the hero and solid after ~80px.
 *
 * The solid state is near-black rather than white so the logo lockup always sits
 * on a dark ground and can keep the true sampled orange; a white bar would force
 * a lightened substitute mid-scroll.
 */
export function Header() {
  const scrolled = useScrolledPast(80);
  const activeSection = useActiveSection(SECTION_IDS);

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(servicesRef, servicesOpen, () => setServicesOpen(false));
  useEscapeKey(servicesOpen, () => {
    setServicesOpen(false);
    servicesTriggerRef.current?.focus();
  });

  const closeMenu = () => {
    setMenuOpen(false);
    menuTriggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <header
        data-surface="dark"
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled ? 'border-b border-line-invert bg-surface-invert' : 'border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            <a
              href="#inicio"
              aria-label={A11Y.homeLink}
              className="inline-flex min-h-11 shrink-0 items-center"
            >
              <Logo />
            </a>

            <nav aria-label={A11Y.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => {
                  const id = link.href.slice(1);
                  const isActive = activeSection === id;
                  const isServices = link.href === '#servicios';

                  if (!isServices) {
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'relative flex min-h-11 items-center px-3.5 text-sm font-semibold transition-colors',
                            isActive
                              ? 'text-ink-invert'
                              : 'text-ink-invert-muted hover:text-ink-invert',
                          )}
                        >
                          {link.label}
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute inset-x-3.5 bottom-3 h-0.5 bg-brand-primary"
                            />
                          )}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href} ref={servicesRef} className="relative">
                      <button
                        ref={servicesTriggerRef}
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls="services-menu"
                        aria-haspopup="true"
                        onClick={() => setServicesOpen((open) => !open)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            setServicesOpen(true);
                            // Let the panel render before reaching into it.
                            requestAnimationFrame(() => {
                              document
                                .querySelector<HTMLAnchorElement>('#services-menu a')
                                ?.focus();
                            });
                          }
                        }}
                        className={cn(
                          'relative flex min-h-11 cursor-pointer items-center gap-1.5 px-3.5 text-sm font-semibold transition-colors',
                          isActive || servicesOpen
                            ? 'text-ink-invert'
                            : 'text-ink-invert-muted hover:text-ink-invert',
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          size={15}
                          aria-hidden
                          className={cn(
                            'transition-transform duration-200',
                            servicesOpen && 'rotate-180',
                          )}
                        />
                        {isActive && (
                          <span
                            aria-hidden
                            className="absolute inset-x-3.5 bottom-3 h-0.5 bg-brand-primary"
                          />
                        )}
                      </button>

                      <div
                        id="services-menu"
                        hidden={!servicesOpen}
                        className="absolute top-full left-0 w-72 border border-line-invert bg-surface-invert p-1.5"
                      >
                        <ul>
                          {SERVICE_NAV.map((service) => (
                            <li key={service.href}>
                              <a
                                href={service.href}
                                onClick={() => setServicesOpen(false)}
                                className="flex min-h-11 items-center gap-3 px-3 text-sm text-ink-invert-muted transition-colors hover:bg-surface-raised hover:text-ink-invert"
                              >
                                <span aria-hidden className="h-px w-4 shrink-0 bg-brand-primary" />
                                {service.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {/* Visibility lives on a wrapper, not on the button's className:
                  Button's base classes already set `inline-flex`, and two
                  same-specificity display utilities are resolved by stylesheet
                  order rather than class order, so a `hidden` passed in here
                  would silently lose. */}
              <div className="hidden sm:block">
                <WhatsAppCta size="md" aria-label={A11Y.whatsappCta}>
                  Cotizar
                </WhatsAppCta>
              </div>

              <button
                ref={menuTriggerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={A11Y.openMenu}
                aria-expanded={menuOpen}
                className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center text-ink-invert transition-colors hover:text-brand-primary lg:hidden"
              >
                <Menu size={24} aria-hidden />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
