import { cn } from '../../lib/cn';

export type Tone = 'light' | 'dark';

interface SectionHeaderProps {
  /** The running section number, 01–09. Carries the spec-sheet spine. */
  number: string;
  eyebrow: string;
  title: string;
  lede?: string;
  tone?: Tone;
  /** Wired to the section's aria-labelledby. */
  titleId?: string;
  className?: string;
}

/**
 * The recurring section head: a hairline rule, the section number and eyebrow in
 * the left gutter, and the title plus lede in the wide column. Asymmetric on
 * purpose — a centred stack is the generic default this design rejects.
 */
export function SectionHeader({
  number,
  eyebrow,
  title,
  lede,
  tone = 'light',
  titleId,
  className,
}: SectionHeaderProps) {
  const dark = tone === 'dark';

  return (
    <header
      className={cn(
        'border-t pt-6 sm:pt-8',
        dark ? 'border-line-invert-strong' : 'border-line-strong',
        className,
      )}
    >
      <div className="grid gap-x-10 gap-y-5 lg:grid-cols-12">
        <div className="flex items-baseline gap-4 lg:col-span-3 lg:flex-col lg:gap-3">
          <span
            aria-hidden
            className={cn(
              'type-display text-2xl sm:text-3xl',
              // Orange as text needs the deep tone on light surfaces (5.88:1);
              // the brand orange itself only clears AA on dark (6.67:1).
              dark ? 'text-brand-primary' : 'text-brand-primary-ink',
            )}
          >
            {number}
          </span>
          <span className={cn('type-eyebrow', dark ? 'text-ink-invert-muted' : 'text-ink-muted')}>
            {eyebrow}
          </span>
        </div>

        <div className="lg:col-span-9">
          <h2
            id={titleId}
            className={cn(
              'type-title text-[clamp(1.75rem,4.6vw,3.25rem)]',
              dark ? 'text-ink-invert' : 'text-ink',
            )}
          >
            {title}
          </h2>
          {lede && (
            <p
              className={cn(
                'mt-4 max-w-[62ch] text-base leading-relaxed sm:text-lg',
                dark ? 'text-ink-invert-muted' : 'text-ink-muted',
              )}
            >
              {lede}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
