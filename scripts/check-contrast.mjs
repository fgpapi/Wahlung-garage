/**
 * Verifies every foreground/background pair the design actually uses against
 * WCAG 2.1 contrast minimums. Token values are parsed out of src/styles/theme.css
 * so this cannot drift from the palette.
 *
 *   npm run check:contrast
 *
 * Exits non-zero if any required pair fails, so it is safe to gate a build on.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

console.log(
  failed === 0
    ? `\n  PASS - ${PAIRS.length} pairs meet their minimum.\n`
    : `\n  FAIL - ${failed} problem(s).\n`,
);
process.exit(failed === 0 ? 0 : 1);
