import { ImageIcon } from 'lucide-react';
import { RATIO_CSS, type PhotoSlot } from '../../data/gallery';
import { cn } from '../../lib/cn';

interface PhotoProps {
  slot: PhotoSlot;
  className?: string | undefined;
  /** Above-the-fold photos load eagerly; everything else stays lazy. */
  priority?: boolean;
  /** Responsive hint for the real <img>. */
  sizes?: string | undefined;
  /**
   * Where the placeholder's caption sits. The comparator stacks two placeholders
   * and clips one of them, so centring both would slice a caption in half and
   * read as broken. Has no effect once a real photo is set.
   */
  align?: 'center' | 'left' | 'right';
}

const ALIGN_CLASS: Record<'center' | 'left' | 'right', string> = {
  center: 'items-center text-center',
  left: 'items-start text-left',
  right: 'items-end text-right',
};

/**
 * Renders a photo slot: a real <img> once `slot.src` is set, and until then a
 * placeholder that names the shot that belongs there.
 *
 * Both branches reserve the same `aspect-ratio`, so dropping in a real photo
 * cannot shift the layout (Core Web Vitals: CLS).
 */
export function Photo({
  slot,
  className,
  priority = false,
  sizes,
  align = 'center',
}: PhotoProps) {
  const aspectRatio = RATIO_CSS[slot.ratio];

  if (slot.src) {
    return (
      <img
        src={slot.src}
        alt={slot.alt}
        width={slot.width}
        height={slot.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // fetchPriority is a real attribute; React 19 passes it through lowercase.
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full bg-surface-raised object-cover', className)}
        style={{ aspectRatio }}
      />
    );
  }

  return (
    <div
      style={{ aspectRatio }}
      className={cn(
        'registration-frame texture-diagonal relative flex w-full flex-col',
        'justify-center gap-4 overflow-hidden bg-surface-raised px-6 py-8',
        'ring-1 ring-inset ring-line-invert',
        ALIGN_CLASS[align],
        className,
      )}
    >
      <ImageIcon
        size={30}
        strokeWidth={1.25}
        aria-hidden
        className="shrink-0 text-ink-invert-muted"
      />
      {/* Deliberately announced rather than aria-hidden behind a container
          aria-label. The gallery wraps this in a button, and WCAG 2.5.3 (Label
          in Name) requires that button's accessible name to contain its visible
          text — an aria-label that ignored the caption failed that. For an empty
          slot the caption is also the most useful thing a screen reader can say. */}
      <p className="max-w-[34ch] font-mono text-xs leading-relaxed text-ink-invert-muted sm:text-[0.8125rem]">
        {slot.caption}
      </p>
      {/* The descriptive alt the real photo will carry, kept available to
          assistive tech without cluttering the visual placeholder. */}
      <span className="sr-only">{slot.alt}</span>
      <span className="type-eyebrow absolute right-4 bottom-3 text-[0.625rem] text-ink-invert-muted">
        {slot.ratio}
      </span>
    </div>
  );
}
