/**
 * Verifies every foreground/background pair the design actually uses against
 * WCAG 2.1 contrast minimums. Token values are parsed out of src/styles/theme.css
 * so this cannot drift from the palette.
 *
 *   npm run check:contrast
 *
 * Exits non-zero if any required pair fails, so it is safe to gate a build on.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(resolve(root, 'src/styles/theme.css'), 'utf8');

const tokens = {};
for (const [, name, hex] of css.matchAll(/--(color-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  tokens[name] = hex.toLowerCase();
}

const channel = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** [foreground, background, minimum, what it is used for] */
const PAIRS = [
  ['color-ink', 'color-surface', 4.5, 'body copy on white'],
  ['color-ink-muted', 'color-surface', 4.5, 'secondary copy on white'],
  ['color-ink-subtle', 'color-surface', 4.5, 'smallest muted copy on white'],
  ['color-ink', 'color-surface-alt', 4.5, 'body copy on the quiet grey band'],
  ['color-ink-muted', 'color-surface-alt', 4.5, 'secondary copy on the grey band'],
  ['color-brand-navy', 'color-surface', 4.5, 'headings on white'],
  ['color-brand-secondary', 'color-surface', 4.5, 'links on white'],
  ['color-brand-primary-ink', 'color-surface', 4.5, 'the one orange allowed as text'],

  ['color-ink-invert', 'color-surface-invert', 4.5, 'body copy on near-black'],
  ['color-ink-invert-muted', 'color-surface-invert', 4.5, 'secondary copy on near-black'],
  ['color-ink-invert', 'color-surface-raised', 4.5, 'copy on raised dark cards'],
  ['color-brand-bright', 'color-surface-invert', 4.5, 'accent + focus ring on near-black'],
  ['color-brand-primary', 'color-surface-invert', 4.5, 'orange as text on near-black'],
  ['color-ink-invert', 'color-brand-navy', 4.5, 'copy on the navy band'],
  ['color-brand-primary', 'color-brand-navy', 4.5, 'orange as text on navy'],

  // Fills: orange buttons carry INK text, never white. This is the pair that
  // forces the whole design decision, so it is asserted explicitly.
  ['color-ink', 'color-brand-primary', 4.5, 'button label on an orange fill'],
  ['color-ink', 'color-brand-primary-hover', 4.5, 'button label on orange hover'],
  ['color-ink-invert', 'color-brand-secondary', 4.5, 'button label on a blue fill'],

  // Photo placeholders: the icon and caption carry the meaning, so both are held
  // to the text minimum even though the icon is a graphic.
  ['color-ink-invert-muted', 'color-surface-raised', 4.5, 'placeholder caption + icon'],

  // Non-text contrast (SC 1.4.11) needs 3:1, not 4.5:1.
  ['color-brand-secondary', 'color-surface', 3, 'focus ring on white'],
  ['color-brand-bright', 'color-surface-invert', 3, 'focus ring on near-black'],
];

// Deliberately NOT asserted. SC 1.4.11 covers graphics "required to understand
// the content"; hairline rules, borders and the registration marks are purely
// decorative, and every element they frame states its meaning in text. Holding
// them to 3:1 would force ~#767676 hairlines and destroy the quiet precision the
// whole layout depends on. Listed here so the omission is a decision, not a gap.
const DECORATIVE_EXEMPT = ['color-line', 'color-line-strong', 'color-line-invert'];

let failed = 0;
console.log('\n  ratio   min   pair');
console.log('  ------  ----  ' + '-'.repeat(56));

for (const [fg, bg, min, label] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`  MISSING TOKEN: ${!tokens[fg] ? fg : bg}`);
    failed++;
    continue;
  }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `  ${ok ? ' ' : '!'}${r.toFixed(2).padStart(5)}  ${min.toFixed(1)}  ${label}\n` +
      `                ${fg} ${tokens[fg]} on ${bg} ${tokens[bg]}`,
  );
}

// Pairs that MUST fail, documenting why the design avoids them. If a future
// palette edit makes one pass, the constraint is gone and the note is stale.
const FORBIDDEN = [
  ['color-ink-invert', 'color-brand-primary', 'white text on orange - why buttons use ink'],
  ['color-brand-primary', 'color-surface', 'orange text on white - why it is fills only'],
];

console.log('\n  Documented failures (these are expected, and drive the design):');
for (const [fg, bg, label] of FORBIDDEN) {
  const r = ratio(tokens[fg], tokens[bg]);
  const stillFails = r < 4.5;
  if (!stillFails) failed++;
  console.log(`  ${stillFails ? ' ' : '!'}${r.toFixed(2).padStart(5)}        ${label}`);
}

console.log(
  `\n  Exempt as decorative (SC 1.4.11): ${DECORATIVE_EXEMPT.join(', ')}`,
);

/* ---------------------------------------------------------------------------
   The "Un taller, no una agencia" section is backed by a photograph, so its
   contrast is not a property of the palette and cannot be checked by comparing
   two tokens. These ratios are measured against the real pixels of the shipped
   derivative, composited under the exact scrim and gradient About.tsx applies.

   The worst case is taken from the single lightest pixel in the section — the
   photo contains blown-out cloud at a true rgb(255,255,255) — not from an
   average, so passing here means the section clears AA at its brightest point.
   --------------------------------------------------------------------------- */

const PHOTO = resolve(root, 'public/images/nosotros/taller-2-1600.jpg');
const PHOTO_W = 1600;
const PHOTO_H = 598;

/** Overlay stack in About.tsx: flat scrim, then a vertical gradient over it. */
const OVERLAY_INK = [10, 12, 16]; // --color-surface-invert
const SCRIM_ALPHA = 0.35;
const GRADIENT_STOPS = [
  [0.0, 0.55],
  [0.5, 0.42],
  [1.0, 0.58],
];
/** The stat blocks add `bg-surface-invert/88` on top of the overlay. */
const STAT_PANEL_ALPHA = 0.88;

/** [label, foreground token, minimum, whether the stat panel sits underneath] */
const PHOTO_PAIRS = [
  ['header + body copy over the photo', 'color-ink-invert', 4.5, false],
  ['stat value inside the panel', 'color-ink-invert', 4.5, true],
  ['stat label inside the panel', 'color-ink-invert-muted', 4.5, true],
];

const lerpAlpha = (yf) => {
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const [y0, a0] = GRADIENT_STOPS[i];
    const [y1, a1] = GRADIENT_STOPS[i + 1];
    if (yf >= y0 && yf <= y1) return a0 + ((a1 - a0) * (yf - y0)) / (y1 - y0);
  }
  return GRADIENT_STOPS[GRADIENT_STOPS.length - 1][1];
};

/** Composites `src` under a black-ink layer at `alpha`. */
const over = (src, alpha) => src.map((c, i) => c * (1 - alpha) + OVERLAY_INK[i] * alpha);

const lumRgb = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratioL = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

if (!existsSync(PHOTO)) {
  console.log(
    `\n  SKIPPED photo-backed section: ${PHOTO} not built.` +
      `\n  Run \`npm run assets:photos\` first.\n`,
  );
} else {
  const raw = execFileSync(
    ffmpeg,
    ['-hide_banner', '-loglevel', 'error', '-i', PHOTO, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { maxBuffer: 1 << 28 },
  );

  // `object-fit: cover` on a 2.68:1 panorama always crops horizontally and shows
  // the full height, at every viewport narrower than the image is wide. So every
  // row of the photo reaches the screen, and the row index maps straight to the
  // gradient's vertical position — no viewport simulation is needed to find the
  // worst case.
  let worstPlain = -Infinity;
  let worstPanel = -Infinity;
  let brightest = null;
  for (let y = 0; y < PHOTO_H; y++) {
    const a = 1 - (1 - SCRIM_ALPHA) * (1 - lerpAlpha(y / PHOTO_H));
    for (let x = 0; x < PHOTO_W; x++) {
      const i = (y * PHOTO_W + x) * 3;
      const composited = over([raw[i], raw[i + 1], raw[i + 2]], a);
      const l = lumRgb(composited);
      if (l > worstPlain) {
        worstPlain = l;
        brightest = composited.map(Math.round);
      }
      const panelled = lumRgb(over(composited, STAT_PANEL_ALPHA));
      if (panelled > worstPanel) worstPanel = panelled;
    }
  }

  console.log('\n  Photo-backed section ("Un taller, no una agencia"):');
  console.log(
    `  lightest pixel after the overlay: rgb(${brightest.join(',')})  L=${worstPlain.toFixed(4)}\n` +
      `  the same pixel under the stat panel:                L=${worstPanel.toFixed(4)}`,
  );
  for (const [label, fg, min, panel] of PHOTO_PAIRS) {
    const r = ratioL(luminance(tokens[fg]), panel ? worstPanel : worstPlain);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? ' ' : '!'}${r.toFixed(2).padStart(5)}  ${min.toFixed(1)}  ${label}\n` +
        `                ${fg} ${tokens[fg]} on the overlaid photograph`,
    );
  }
}

console.log(
  failed === 0
    ? `\n  PASS - ${PAIRS.length} pairs meet their minimum.\n`
    : `\n  FAIL - ${failed} problem(s).\n`,
);
process.exit(failed === 0 ? 0 : 1);
