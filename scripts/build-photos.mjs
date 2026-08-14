/**
 * Derives every shipped photo from the untouched originals in `source-images/`.
 *
 * Run with `npm run assets:photos` after dropping new files in `source-images/`
 * and adding them to PHOTOS below. The outputs are committed to git — Vercel
 * does not run ffmpeg at deploy time.
 *
 *   public/images/<section>/<slug>-<width>.webp   preferred, served via <source>
 *   public/images/<section>/<slug>-<width>.jpg    fallback for anything without WebP
 *
 * Widths are 640 / 1024 / 1600, clamped to the original's own width so nothing
 * is ever upscaled. The largest derivative is what the lightbox loads.
 *
 * Source filenames carry spaces, accents and inconsistent casing, so the mapping
 * from original to slug is explicit rather than derived — a rename upstream
 * should fail loudly here instead of silently dropping a photo.
 *
 * Originals are normally JPEG straight off a phone. One (`carroantes.webp`) only
 * ever reached us as a WebP, so the size reader dispatches on the file's magic
 * bytes rather than assuming a JPEG and throwing on the SOF scan.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = resolve(root, 'source-images');
const OUT_DIR = resolve(root, 'public/images');

const TARGET_WIDTHS = [640, 1024, 1600];

/** original filename in source-images/ -> published section + slug */
const PHOTOS = [
  // One supporting photo per service section.
  ['imagen pintura  1.jpeg', 'servicios', 'pintura-1'],
  ['imagen mecanica general.jpeg', 'servicios', 'mecanica-general'],
  ['Imagen 3 - Polarizado.jpeg', 'servicios', 'polarizado-1'],
  ['Imagen tapiceria 1.jpeg', 'servicios', 'tapiceria-1'],

  // The filterable gallery.
  ['imagen pintura galeria 1.jpeg', 'galeria', 'pintura-1'],
  ['imagen pintura galeria2.jpeg', 'galeria', 'pintura-2'],
  ['imagen pintura galeria4.jpeg', 'galeria', 'pintura-3'],
  ['imagen mecanica galeria 2.jpeg', 'galeria', 'mecanica-1'],
  ['imagen mecanica galeria 3.jpeg', 'galeria', 'mecanica-2'],
  ['imagen polarizado galeria 2.jpeg', 'galeria', 'polarizado-1'],
  ['imagen tapiceria galeria 1.jpeg', 'galeria', 'tapiceria-1'],
  ['imagen tapiceria galeria 2.jpeg', 'galeria', 'tapiceria-2'],
  ['imagen tapiceria galeria 3.jpeg', 'galeria', 'tapiceria-3'],
  ['Imagen tapiceria 2.jpeg', 'galeria', 'tapiceria-4'],

  // The before/after comparator. These two must stay dimensionally identical or
  // the slider reveals a mismatch instead of the repair — see the assert below.
  ['imagen antes.jpeg', 'comparador', 'antes'],
  ['imagen despues.jpeg', 'comparador', 'despues'],

  // The second before/after: one crash shot against three finished angles. These
  // are deliberately NOT dimension-matched — it is a labelled layout, not a
  // slider, so each photo keeps its own shape and nothing is cropped to agree.
  ['carroantes.webp', 'comparador2', 'antes'],
  ['carro1.jpeg', 'comparador2', 'despues-1'],
  ['carro3.jpeg', 'comparador2', 'despues-2'],
  ['carro2.jpeg', 'comparador2', 'despues-3'],

  // The shop itself, in the "Un taller, no una agencia" section. `taller-2` is
  // the section background and `taller-1` the foreground photo.
  ['taller1.jpeg', 'nosotros', 'taller-1'],
  ['taller2.jpeg', 'nosotros', 'taller-2'],
];

/**
 * Slugs that must share one set of dimensions. The comparator stacks the two
 * layers and clips one, so a ratio difference between them shows up as the
 * framing jumping under the handle.
 */
const MUST_MATCH = [['comparador/antes', 'comparador/despues']];

/** Reads intrinsic size straight out of the JPEG SOFn marker. */
function jpegSize(b, file) {
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = b[i + 1];
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`No SOF marker in ${file}`);
}

/**
 * Reads intrinsic size out of a RIFF/WEBP container. All three bitstream
 * flavours are handled because we do not control what a phone or a messaging app
 * hands us: VP8 (lossy), VP8L (lossless) and VP8X (extended (animation, alpha)).
 */
function webpSize(b, file) {
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  if (chunk === 'VP8 ') {
    // The 3-byte start code precedes the 14-bit width and height.
    const o = b.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (o < 0) throw new Error(`No VP8 start code in ${file}`);
    return { width: b.readUInt16LE(o + 3) & 0x3fff, height: b.readUInt16LE(o + 5) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`Unrecognised WebP chunk "${chunk}" in ${file}`);
}

/** Intrinsic size of an original, dispatched on magic bytes rather than suffix. */
function imageSize(file) {
  const b = readFileSync(file);
  if (b[0] === 0xff && b[1] === 0xd8) return jpegSize(b, file);
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    return webpSize(b, file);
  }
  throw new Error(`Unsupported original (not JPEG or WebP): ${file}`);
}

const run = (args) =>
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });

for (const name of PHOTOS.map(([n]) => n)) {
  if (!existsSync(resolve(SOURCE_DIR, name))) {
    throw new Error(`Missing source image: source-images/${name}`);
  }
}

const manifest = [];
/** `section/slug` -> the numbers the data file in src/data/gallery.ts needs. */
const published = new Map();

for (const [name, section, slug] of PHOTOS) {
  const input = resolve(SOURCE_DIR, name);
  const { width: w0, height: h0 } = imageSize(input);
  const outDir = resolve(OUT_DIR, section);
  mkdirSync(outDir, { recursive: true });

  // Never upscale: clamp the ladder to the original, and always emit the
  // original width as the top rung so the lightbox gets full resolution.
  const widths = [...new Set([...TARGET_WIDTHS.filter((w) => w < w0), Math.min(w0, 1600)])].sort(
    (a, b) => a - b,
  );

  let bytes = 0;
  for (const w of widths) {
    const h = Math.round((w * h0) / w0);
    const scale = `scale=${w}:-1:flags=lanczos`;
    const webp = resolve(outDir, `${slug}-${w}.webp`);
    const jpg = resolve(outDir, `${slug}-${w}.jpg`);
    // These are phone photos with real sensor noise, which compresses badly.
    // 75/5 measured ~22% smaller than 82/4 with no visible loss at display size.
    run(['-i', input, '-vf', scale, '-c:v', 'libwebp', '-quality', '75', '-compression_level', '6', webp]);
    run(['-i', input, '-vf', scale, '-q:v', '5', jpg]);
    bytes += statSync(webp).size + statSync(jpg).size;
    manifest.push({ section, slug, w, h });
  }

  const top = widths[widths.length - 1];
  const topH = Math.round((top * h0) / w0);
  published.set(`${section}/${slug}`, { widths, width: top, height: topH });
  console.log(
    `${section}/${slug}  src ${w0}x${h0}  widths [${widths.join(', ')}]  ` +
      `largest ${top}x${topH}  ${(bytes / 1024).toFixed(0)} KB total`,
  );
}

// A comparator whose two halves do not line up is worse than no comparator, so
// fail the build rather than ship a slider that shifts framing as it moves.
for (const group of MUST_MATCH) {
  const sizes = group.map((key) => {
    const p = published.get(key);
    if (!p) throw new Error(`MUST_MATCH references an unpublished slug: ${key}`);
    return `${p.width}x${p.height}`;
  });
  if (new Set(sizes).size !== 1) {
    throw new Error(
      `These must share one size but do not:\n  ` +
        group.map((k, i) => `${k} = ${sizes[i]}`).join('\n  '),
    );
  }
  console.log(`\nmatched: ${group.join(' == ')} at ${sizes[0]}`);
}

console.log(`\n${manifest.length} derivatives written to public/images/`);
console.log('\nPaste into src/data/gallery.ts:');
for (const [key, p] of published) {
  console.log(
    `  ${key.padEnd(28)} stem:'/images/${key}' widths:[${p.widths.join(', ')}] ` +
      `width:${p.width} height:${p.height}`,
  );
}
