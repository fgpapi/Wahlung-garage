import { useMemo, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { Lightbox } from './Lightbox';
import {
  GALLERY_CATEGORIES,
  GALLERY_ITEMS,
  type GalleryCategoryId,
} from '../data/gallery';
import { GALLERY, SECTIONS } from '../data/copy';
import { cn } from '../lib/cn';

export function Gallery() {
  const meta = SECTIONS.galeria;
  const [filter, setFilter] = useState<GalleryCategoryId>('todos');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () =>
      filter === 'todos'
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.category === filter),
    [filter],
  );

  const changeFilter = (next: GalleryCategoryId) => {
    setOpenIndex(null); // indices refer to the filtered list, so reset on change
    setFilter(next);
  };

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-title"
      className="bg-surface-alt py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          number={meta.number}
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          titleId="galeria-title"
        />

        <div
          role="group"
          aria-label={GALLERY.filterLabel}
          className="mt-10 flex flex-wrap gap-2 sm:mt-12"
        >
          {GALLERY_CATEGORIES.map((category) => {
            const active = filter === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(category.id)}
                className={cn(
                  'type-eyebrow inline-flex min-h-11 cursor-pointer items-center border px-4 text-[0.6875rem] transition-colors',
                  active
                    ? 'border-brand-primary bg-brand-primary text-ink'
                    : 'border-line-strong text-ink-muted hover:border-ink hover:text-ink',
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="mt-12 text-ink-muted">{GALLERY.empty}</p>
        ) : (
          /* True masonry via CSS columns: every tile keeps its own aspect ratio
             with no gaps and no row-height maths. Reading order runs down each
             column, which is the accepted trade for a photo grid. */
          <div className="mt-10 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group/tile relative mb-4 block w-full cursor-pointer break-inside-avoid"
              >
                {/* The rest of the accessible name comes from the tile's own
                    visible caption and alt, so the name contains the visible
                    text (WCAG 2.5.3) instead of replacing it. */}
                <span className="sr-only">{`${GALLERY.enlargePrefix}: `}</span>
                <Photo slot={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />

                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover/tile:bg-ink/45 group-hover/tile:opacity-100 group-focus-visible/tile:bg-ink/45 group-focus-visible/tile:opacity-100"
                >
                  <span className="inline-flex size-12 items-center justify-center border border-brand-primary text-brand-primary">
                    <Maximize2 size={20} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </Container>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
