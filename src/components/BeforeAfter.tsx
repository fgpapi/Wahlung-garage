import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { Container } from './ui/Container';
import { SectionHeader } from './ui/SectionHeader';
import { Photo } from './ui/Photo';
import { COMPARISON } from '../data/gallery';
import { SECTIONS } from '../data/copy';

const STEP = 2;
const STEP_LARGE = 10;

/**
 * The page's signature element. For a body shop the before/after is the strongest
 * proof available, so it gets a full dark band and a frame built like an
 * inspection panel: registration marks at the corners and a live readout.
 *
 * Interaction is deliberately split so it never fights the page on a phone:
 * dragging starts only on the handle, while a tap or click anywhere on the frame
 * jumps the split to that point. A drag-from-anywhere implementation would
 * hijack vertical scrolling on touch.
 */
export function BeforeAfter() {
  const meta = SECTIONS.comparador;
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const onHandlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleRef.current?.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onHandlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(event.clientX);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    handleRef.current?.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const large = event.shiftKey;
    const delta = large ? STEP_LARGE : STEP;
    let next: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = position - delta;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = position + delta;
        break;
      case 'PageDown':
        next = position - STEP_LARGE;
        break;
      case 'PageUp':
        next = position + STEP_LARGE;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const rounded = Math.round(position);

  return (
    <section
      aria-labelledby="comparador-title"
      data-surface="dark"
      className="bg-surface-invert py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          eyebrow={meta.eyebrow}
          title={meta.title}
          lede={meta.lede}
          tone="dark"
          titleId="comparador-title"
        />

        <div className="mt-12 sm:mt-16">
          <div
            ref={frameRef}
            onClick={(event) => {
              // A drag ends with a click event; ignore it so the handle does not
              // jump twice.
              if (dragging) return;
              setFromClientX(event.clientX);
            }}
            style={{ ['--reg-color' as string]: 'var(--color-brand-primary)' }}
            className="registration-frame relative w-full cursor-ew-resize touch-pan-y overflow-hidden border border-line-invert-strong select-none"
          >
            {/* Base layer: the finished repair. Captions are pushed to opposite
                sides so the clip never slices through one of them. */}
            <Photo
              slot={COMPARISON.after}
              align="right"
              sizes="(min-width: 1024px) 78vw, 100vw"
            />

            {/* Clipped layer: the damage. clip-path avoids rescaling the image,
                which a width-based reveal would do. */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Photo
                slot={COMPARISON.before}
                align="left"
                sizes="(min-width: 1024px) 78vw, 100vw"
              />
            </div>

            <span className="type-eyebrow pointer-events-none absolute top-4 left-4 border border-line-invert-strong bg-ink/80 px-2.5 py-1.5 text-[0.625rem] text-ink-invert">
              {meta.beforeLabel}
            </span>
            <span className="type-eyebrow pointer-events-none absolute top-4 right-4 border border-line-invert-strong bg-ink/80 px-2.5 py-1.5 text-[0.625rem] text-ink-invert">
              {meta.afterLabel}
            </span>

            <div
              className="pointer-events-none absolute inset-y-0"
              style={{
                left: `${position}%`,
                transition: dragging ? 'none' : 'left 180ms var(--ease-out-firm)',
              }}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 -left-px w-0.5 bg-brand-primary"
              />

              <div
                ref={handleRef}
                role="slider"
                tabIndex={0}
                aria-label={meta.sliderLabel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={rounded}
                aria-valuetext={`${rounded}% ${meta.afterLabel}`}
                aria-orientation="horizontal"
                onPointerDown={onHandlePointerDown}
                onPointerMove={onHandlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
                className="pointer-events-auto absolute top-1/2 left-0 flex size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center border-2 border-brand-primary bg-ink text-brand-primary sm:size-14"
              >
                <MoveHorizontal size={22} aria-hidden />
              </div>
            </div>

            <span
              aria-hidden
              className="type-eyebrow pointer-events-none absolute right-4 bottom-4 border border-line-invert-strong bg-ink/80 px-2.5 py-1.5 text-[0.625rem] text-brand-primary"
            >
              {`${String(rounded).padStart(3, '0')}%`}
            </span>
          </div>

          <p className="type-eyebrow mt-5 text-ink-invert-muted">{meta.instructions}</p>
        </div>
      </Container>
    </section>
  );
}
