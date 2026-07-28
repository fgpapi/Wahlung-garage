import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Photo } from './ui/Photo';
import type { GalleryItem } from '../data/gallery';
import { GALLERY } from '../data/copy';
import { useEscapeKey, useFocusTrap, useScrollLock } from '../lib/hooks';

interface LightboxProps {
  items: readonly GalleryItem[];
  /** Index into `items`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Accessible image viewer: Escape closes, Left/Right navigate, focus is trapped
 * while open and returned to the thumbnail that opened it.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = index !== null;

  useScrollLock(open);
  useFocusTrap(panelRef, open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (!open || items.length === 0) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate((index + 1) % items.length);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate((index - 1 + items.length) % items.length);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, index, items.length, onNavigate]);

  if (!open) return null;

  const item = items[index];
  if (!item) return null;

  const go = (delta: number) => onNavigate((index + delta + items.length) % items.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={GALLERY.lightbox.label}
      data-surface="dark"
      className="fixed inset-0 z-80 flex flex-col bg-ink/95"
    >
      {/* Backdrop. A button so a pointer click closes, hidden from the a11y tree
          because Escape and the close control already cover keyboard users. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div ref={panelRef} className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <span className="type-eyebrow text-ink-invert-muted">
            {GALLERY.lightbox.counter(index + 1, items.length)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={GALLERY.lightbox.close}
            className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center text-ink-invert transition-colors hover:text-brand-primary"
          >
            <X size={24} aria-hidden />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center gap-2 px-2 pb-4 sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={GALLERY.lightbox.previous}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border border-line-invert-strong text-ink-invert transition-colors hover:border-brand-primary hover:text-brand-primary sm:size-14"
          >
            <ChevronLeft size={24} aria-hidden />
          </button>

          <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
            <div className="flex max-h-full w-full max-w-4xl items-center justify-center">
              {/* fit is a prop, not a class: `cn` has no tailwind-merge and the
                  stylesheet emits object-cover after object-contain, so passing
                  it through className used to lose and crop the full-size view. */}
              <Photo slot={item} priority full fit="contain" className="max-h-[64vh] w-auto" />
            </div>
            {/* Only once a real photo replaces the placeholder — the placeholder
                already prints its own caption inside the frame. */}
            {item.stem && (
              <figcaption className="max-w-[60ch] text-center font-mono text-xs text-ink-invert-muted">
                {item.caption}
              </figcaption>
            )}
          </figure>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label={GALLERY.lightbox.next}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border border-line-invert-strong text-ink-invert transition-colors hover:border-brand-primary hover:text-brand-primary sm:size-14"
          >
            <ChevronRight size={24} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
