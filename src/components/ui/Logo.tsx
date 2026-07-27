import { SITE } from '../../data/site';
import { cn } from '../../lib/cn';

interface LogoProps {
  className?: string;
  /** Hides the "Mecánica & Pintura" line, for tight bars. */
  compact?: boolean;
}

/**
 * The emblem paired with a typeset wordmark.
 *
 * The source logo is a raster illustration; at 36px its lettering would be mush,
 * so the wordmark is set in Archivo instead and only the emblem is drawn from the
 * artwork. The mark is decorative here because the words beside it are real text —
 * which also means the business name is in the DOM for search engines.
 *
 * Both surfaces this appears on are dark, so "GARAGE" can use the true sampled
 * #FF6600 (6.67:1 on near-black) rather than a lightened substitute.
 */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 sm:gap-3', className)}>
      <img
        src="/logo-mark.webp"
        alt=""
        aria-hidden
        width={200}
        height={109}
        className="h-8 w-auto shrink-0 sm:h-9"
      />
      <span className="flex min-w-0 flex-col justify-center gap-1">
        <span className="type-title text-sm leading-none text-ink-invert sm:text-base">
          Wahlung <span className="text-brand-primary">Garage</span>
        </span>
        {!compact && (
          <span className="type-eyebrow hidden text-[0.5625rem] leading-none text-ink-invert-muted sm:block">
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
