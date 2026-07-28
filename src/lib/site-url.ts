/**
 * The one place the production domain is written down.
 *
 * Deliberately dependency-free and free of `import.meta`: this module is imported
 * both by the app (src/data/site.ts) and by vite.config.ts, which runs in Node
 * and cannot evaluate browser globals. Anything added here must stay portable
 * between those two worlds.
 */

/** Used whenever VITE_SITE_URL is unset — local dev, and any preview build. */
export const DEFAULT_SITE_URL = 'https://wahlung-garage.vercel.app';

/**
 * Normalises a configured origin: trims it, falls back to the default when blank
 * and strips trailing slashes so callers can always append `/path` safely.
 *
 * On Vercel, set VITE_SITE_URL to the real domain once it is pointed at the
 * project. `VERCEL_PROJECT_PRODUCTION_URL` is also available at build time but
 * arrives without a protocol, so it has to be prefixed before being passed here.
 */
export function resolveSiteUrl(raw?: string | undefined): string {
  const value = (raw ?? '').trim();
  return (value || DEFAULT_SITE_URL).replace(/\/+$/, '');
}
