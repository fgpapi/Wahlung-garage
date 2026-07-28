/**
 * The shop's surveyed pin and the Maps URLs built from it.
 *
 * Split out of data/site.ts for the same reason as site-url.ts: vite.config.ts
 * needs `MAP_LINK_URL` to fill in the JSON-LD `hasMap` in index.html, and it
 * cannot import a module that reaches for `import.meta.env`. Keep this file
 * dependency-free. `data/site.ts` re-exports everything here, so application
 * code should keep importing from there.
 */

/** 14°01'28.8"N 87°12'29.1"W. Also feeds `geo` in the JSON-LD. */
export const GEO = {
  latitude: 14.0246735,
  longitude: -87.2080765,
} as const;

const PIN = `${GEO.latitude},${GEO.longitude}`;

/**
 * Every Maps URL is built from the coordinates rather than copied out of the
 * browser. A pasted place URL carries a session id and a `g_ep` build stamp that
 * both rot; these three are the documented, stable Maps URL APIs.
 */

/** Turn-by-turn from wherever the visitor is. Used by the "Cómo llegar" button. */
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PIN}`;
/** The pin itself. Used by the facade's click-through and by JSON-LD `hasMap`. */
export const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${PIN}`;
/**
 * The embed is still loaded only after the visitor activates the facade — it is
 * third-party, heavy and sets cookies, so it never touches the first paint.
 */
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${PIN}&z=17&hl=es&output=embed`;
