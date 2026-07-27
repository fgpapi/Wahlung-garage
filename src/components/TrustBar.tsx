import { Container } from './ui/Container';
import { CORPORATE_CLIENTS } from '../data/site';
import { TRUST_BAR } from '../data/copy';

/**
 * A credential, not a billboard: one small label and three grayscale wordmarks,
 * sharing the hero's dark surface so the page does not break rhythm before the
 * first white section.
 *
 * TODO: swap the typeset names for the real Hertz and Blintec logo files once the
 * shop supplies them with permission to use the marks. Until then a plain
 * wordmark is the honest placeholder — an approximated logo is brand misuse.
 */
export function TrustBar() {
  return (
    <section
      aria-label={TRUST_BAR.label}
      data-surface="dark"
      className="border-t border-line-invert bg-surface-invert py-7"
    >
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
          <p className="type-eyebrow shrink-0 text-ink-invert-muted">{TRUST_BAR.label}</p>

          <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 sm:gap-x-12">
            {CORPORATE_CLIENTS.map((client) => (
              <li key={client.name} className="flex flex-col gap-0.5">
                <span className="type-title text-lg text-ink-invert-muted sm:text-xl">
                  {client.name}
                </span>
                {/* No opacity modifier: /60 dropped this below 4.5:1. The token
                    itself is verified, an alpha-modified version is not. */}
                <span className="type-eyebrow text-[0.5625rem] text-ink-invert-muted">
                  {client.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
