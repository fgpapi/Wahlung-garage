import { cn } from '../../lib/cn';

export type Tone = 'light' | 'dark';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  lede?: string;
  tone?: Tone;
  /** Wired to the section's aria-labelledby. */
  titleId?: string;
  className?: string;
}

/**
 * The recurring section head: a hairline rule, then the eyebrow, title and lede
 * stacked flush left. Left-aligned rather than centred — a centred stack is the
 * generic default this design rejects.
 */
export function SectionHeader({
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
      <p className={cn('type-eyebrow', dark ? 'text-ink-invert-muted' : 'text-ink-muted')}>
        {eyebrow}
      </p>

      {/* Tight to the eyebrow so the two read as one unit under the rule; the
          title carries the weight on its own now that no numeral anchors it. */}
      <h2
        id={titleId}
        className={cn(
          'type-title mt-3 max-w-[24ch] text-[clamp(1.75rem,4.6vw,3.25rem)]',
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
    </header>
  );
}
