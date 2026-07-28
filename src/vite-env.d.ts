/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * The site's public origin, e.g. `https://wahlungarage.com`. Optional: when
   * unset, DEFAULT_SITE_URL in lib/site-url.ts applies. Always read through
   * `resolveSiteUrl` rather than directly, so trailing slashes are stripped.
   */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
