/**
 * The shop's email address, defined once.
 *
 * It lives in `lib/` rather than in `data/site.ts` for the same reason the map
 * URLs do: `vite.config.ts` has to read it to fill the `%EMAIL%` token in the
 * JSON-LD inside index.html, and it cannot import `data/site.ts` because that
 * module reaches for `import.meta.env`, which does not exist while the config is
 * being loaded. `data/site.ts` re-exports both names, so application code still
 * has one import site for business facts.
 */

export const EMAIL = 'wahlunggarage@gmail.com';

/** Formats the address as a mailto: href. */
export function mailtoHref(address: string = EMAIL): string {
  return `mailto:${address}`;
}
