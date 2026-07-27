import { useRef } from 'react';
import { X } from 'lucide-react';
import { Logo } from './ui/Logo';
import { WhatsAppCta } from './ui/WhatsAppCta';
import { NAV_LINKS, PHONES, SERVICE_NAV } from '../data/site';
import { A11Y, HERO } from '../data/copy';
import { formatPhone, telHref } from '../lib/whatsapp';
import { useEscapeKey, useFocusTrap, useScrollLock } from '../lib/hooks';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen menu for narrow viewports. Escape closes it, focus is trapped
 * inside while it is open and returned to the toggle on close, and the page
 * behind it cannot scroll.
 *
 * "Servicios" is expanded inline rather than nested behind another tap — on a
 * phone the four services are the point, so hiding them costs conversions.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscapeKey(open, onClose);

  return (
    <div
      // Kept mounted so the slide transition can run in both directions; hidden
      // from assistive tech and taken out of the tab order when closed.
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-60 lg:hidden ${open ? '' : 'pointer-events-none'}`}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-ink/70 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={A11Y.mobileNav}
        data-surface="dark"
        className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto
          bg-surface-invert shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line-invert px-5 py-4">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label={A11Y.closeMenu}
            className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center text-ink-invert transition-colors hover:text-brand-primary"
          >
            <X size={24} aria-hidden />
          </button>
        </div>

        <nav aria-label={A11Y.mobileNav} className="flex-1 px-5 py-6">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="type-title flex min-h-14 items-center border-b border-line-invert text-xl text-ink-invert transition-colors hover:text-brand-primary"
                >
                  {link.label}
                </a>

                {link.href === '#servicios' && (
                  <ul className="border-b border-line-invert py-2">
                    {SERVICE_NAV.map((service) => (
                      <li key={service.href}>
                        <a
                          href={service.href}
                          onClick={onClose}
                          className="flex min-h-11 items-center gap-3 py-1 pl-4 text-sm text-ink-invert-muted transition-colors hover:text-ink-invert"
                        >
                          <span aria-hidden className="h-px w-4 bg-brand-primary" />
                          {service.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-line-invert px-5 py-6 pb-safe">
          <WhatsAppCta size="lg" className="w-full" onClick={onClose}>
            {HERO.primaryCta}
          </WhatsAppCta>
          <ul className="flex flex-col gap-1">
            {PHONES.map((phone) => (
              <li key={phone.raw}>
                <a
                  href={telHref(phone.raw)}
                  className="flex min-h-11 items-center justify-between gap-4 font-mono text-sm text-ink-invert-muted transition-colors hover:text-ink-invert"
                >
                  <span>{formatPhone(phone.raw)}</span>
                  <span className="type-eyebrow text-[0.625rem]">{phone.role}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
