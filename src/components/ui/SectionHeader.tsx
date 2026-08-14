import { cn } from '../../lib/cn';

/**
 * `photo` is `dark` for a section whose background is a photograph rather than a
 * flat fill. The muted ink (#A8B2C1) needs the surface behind it to sit at or
 * below 0.059 relative luminance to clear 4.5:1, which over a blown-out sky
 * would take a ~76% scrim and flatten the picture to a smear. White needs only
 * ~56%, so on a photo every level of the header is white and the hierarchy is
 * carried by size and tracking instead of by colour.
 */
export type Tone = 'light' | 'dark' | 'photo';

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
  const onPhoto = tone === 'photo';
  const dark = tone === 'dark' || onPhoto;

  return (
    <header
      className={cn(
        'border-t pt-6 sm:pt-8',
        onPhoto
          ? 'border-ink-invert/35'
          : dark
            ? 'border-line-invert-strong'
            : 'border-line-strong',
        className,
      )}
    >
      <p
        className={cn(
          'type-eyebrow',
          onPhoto ? 'text-ink-invert' : dark ? 'text-ink-invert-muted' : 'text-ink-muted',
        )}
      >
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
            onPhoto ? 'text-ink-invert' : dark ? 'text-ink-invert-muted' : 'text-ink-muted',
          )}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
