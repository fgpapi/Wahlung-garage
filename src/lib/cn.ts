import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Registers this project's own utilities so they resolve like real Tailwind
 * groups instead of being waved through as unknown strings.
 *
 * `type-*` are the four type ramps in styles/theme.css. Only one can apply to an
 * element, so they belong in a single conflict group — otherwise a caller
 * passing `type-eyebrow` into a component whose base is `type-heading` leaves
 * both in the class list and the stylesheet order silently decides.
 */
const twMerge = extendTailwindMerge<'wg-type'>({
  extend: {
    classGroups: {
      'wg-type': [{ type: ['display', 'title', 'heading', 'eyebrow'] }],
    },
  },
});

/**
 * Joins class names and resolves Tailwind conflicts, last argument wins.
 *
 * This was previously `parts.filter(Boolean).join(' ')`, which meant a
 * caller-supplied utility never actually overrode the component's base utility —
 * both shipped, and whichever Tailwind happened to emit later won. That failed
 * silently: `Photo` set `object-cover`, the lightbox passed `object-contain`,
 * and because the stylesheet emits cover after contain the full-size view was
 * cropped with nothing anywhere reporting a problem.
 */
export function cn(...parts: ClassValue[]): string {
  return twMerge(clsx(parts));
}
