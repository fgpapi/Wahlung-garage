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
   * Skips the srcset and loads the largest derivative outright. The lightbox
   * needs this: with a srcset the browser is free to reuse the thumbnail it
   * already has in cache, which is exactly what "ver la imagen completa" is not.
   */
  full?: boolean;
  /**
   * How the image sits in its box. Passed as a prop rather than through
   * `className` on purpose: `cn` is a plain join with no tailwind-merge, and
   * `object-cover` is emitted after `object-contain` in the stylesheet, so a
   * caller-supplied `object-contain` silently lost and the image was cropped.
   * Exactly one object-fit utility is emitted here.
   */
  fit?: 'cover' | 'contain';
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

const FIT_CLASS = { cover: 'object-cover', contain: 'object-contain' } as const;

/**
 * Renders a photo slot: a real <picture> once `slot.stem` is set, and until then
 * a placeholder that names the shot that belongs there.
 *
 * The box is reserved from the photo's own intrinsic pixel size, never from a
 * hand-written ratio, so `object-cover` has nothing left to crop and the layout
 * cannot move when the file lands (Core Web Vitals: CLS).
 */
export function Photo({
  slot,
  className,
  priority = false,
  sizes,
  full = false,
  fit = 'cover',
  align = 'center',
}: PhotoProps) {
  if (slot.stem && slot.widths?.length && slot.width && slot.height) {
    const { stem, widths, width, height } = slot;
    const largest = widths[widths.length - 1];
    const rungs = full ? [largest] : widths;

    return (
      <picture className="contents">
        <source
          type="image/webp"
          sizes={full ? undefined : sizes}
          srcSet={rungs.map((w) => `${stem}-${w}.webp ${w}w`).join(', ')}
        />
        <img
          src={`${stem}-${largest}.jpg`}
          srcSet={rungs.map((w) => `${stem}-${w}.jpg ${w}w`).join(', ')}
          sizes={full ? undefined : sizes}
          alt={slot.alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // fetchPriority is a real attribute; React 19 passes it through lowercase.
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn('h-full w-full bg-surface-raised', FIT_CLASS[fit], className)}
          // Straight from the file's own pixels — the tile is whatever shape the
          // photo is, rather than the photo being cut to fit the tile.
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      </picture>
    );
  }

  // No file yet: the placeholder still has to reserve a box, and the only ratio
  // available is the one the brief asks the photographer for.
  const ratio = slot.placeholderRatio ?? '4/3';

  return (
    <div
      style={{ aspectRatio: RATIO_CSS[ratio] }}
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
        {ratio}
      </span>
    </div>
  );
}
