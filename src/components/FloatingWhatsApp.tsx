import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { FLOATING_CTA } from '../data/copy';
import { cn } from '../lib/cn';

/**
 * Persistent quote button. It appears once the hero has scrolled away, and hides
 * again over the contact section and footer so it never covers the CTAs that
 * already live there.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('inicio');
    const contact = document.getElementById('contacto');
    const footer = document.getElementById('pie');

    let heroVisible = true;
    let tailVisible = false;

    const sync = () => setVisible(!heroVisible && !tailVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0 },
    );

    // Tracks the contact section and footer together: if either is on screen the
    // floating button would duplicate or overlap an existing CTA.
    const tailTargets = new Set<Element>();
    const tailObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) tailTargets.add(entry.target);
          else tailTargets.delete(entry.target);
        }
        tailVisible = tailTargets.size > 0;
        sync();
      },
      { threshold: 0 },
    );

    if (hero) heroObserver.observe(hero);
    if (contact) tailObserver.observe(contact);
    if (footer) tailObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      tailObserver.disconnect();
    };
  }, []);

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={FLOATING_CTA.label}
      // Hidden from the tab order while off-screen so keyboard users do not land
      // on an invisible control.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'fixed right-4 bottom-4 z-40 inline-flex min-h-14 items-center gap-3 border-2 border-ink',
        'bg-brand-primary px-5 text-ink shadow-lg transition-all duration-300 sm:right-6 sm:bottom-6',
        'hover:bg-brand-primary-hover',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <MessageCircle size={22} strokeWidth={2} aria-hidden />
      <span className="hidden text-sm font-semibold sm:inline">{FLOATING_CTA.label}</span>
    </a>
  );
}
