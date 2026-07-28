/**
 * Derives every icon and the social card.
 *
 *   npm run assets:icons
 *
 * Outputs (committed to git):
 *   public/favicon.ico            16/32/48 multi-size, PNG-compressed
 *   public/apple-touch-icon.png   180x180
 *   public/icon-192.png           manifest icon
 *   public/icon-512.png           manifest icon / Android install splash
 *   public/icon-512-maskable.png  same mark inside the maskable safe zone
 *   public/site.webmanifest
 *   public/og-image.jpg           1200x630 social card
 *
 * Every icon is the "W" mark rasterised from public/favicon.svg, so the tab, the
 * iOS home screen and the Android launcher all show the same thing at any size.
 * The full brand emblem is too detailed to read at 40px, which is why it is not
 * used here — it still appears on the og card, where there is room for it.
 *
 * The og card is laid out so the emblem, wordmark and strapline all sit inside
 * the central 630x630 square. WhatsApp reads only the first og:image and may
 * centre-crop it to a square thumbnail, so the one file has to survive that.
 *
 * Requires public/hero-poster.jpg (scripts/build-media.mjs) and
 * public/logo-mark.webp (scripts/build-logo.ps1).
 */
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'public');
const SVG = resolve(OUT, 'favicon.svg');

const INK = '#0A0C10';
const ICO_SIZES = [16, 32, 48];

const CHROME = [
  `${process.env.ProgramFiles}/Google/Chrome/Application/chrome.exe`.replace(/\\/g, '/'),
  `${process.env['ProgramFiles(x86)']}/Google/Chrome/Application/chrome.exe`.replace(/\\/g, '/'),
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`.replace(/\\/g, '/'),
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p));
if (!CHROME) throw new Error('Could not find an installed Chrome.');

const svgMarkup = readFileSync(SVG, 'utf8');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

/**
 * Renders the mark at `size`, with the artwork occupying `inset` of the frame.
 * Maskable icons need the mark pulled well inside the frame, because Android is
 * free to crop the outer ~20% to whatever shape the launcher uses.
 */
async function render(size, inset) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><meta charset="utf-8">
     <style>
       html,body{margin:0;padding:0;background:${INK}}
       .frame{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${INK}}
       .art{width:${Math.round(size * inset)}px;height:${Math.round(size * inset)}px}
       .art svg{display:block;width:100%;height:100%}
     </style>
     <div class="frame"><div class="art">${svgMarkup}</div></div>`,
    { waitUntil: 'load' },
  );
  const buf = await page.screenshot({ type: 'png', omitBackground: false });
  await page.close();
  return Buffer.from(buf);
}

/** Packs PNG payloads into an ICO container (PNG-in-ICO, universally supported). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;

  entries.forEach(({ size, png }, i) => {
    const p = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, p + 0); // 0 means 256
    dir.writeUInt8(size >= 256 ? 0 : size, p + 1);
    dir.writeUInt8(0, p + 2); // palette size
    dir.writeUInt8(0, p + 3); // reserved
    dir.writeUInt16LE(1, p + 4); // colour planes
    dir.writeUInt16LE(32, p + 6); // bits per pixel
    dir.writeUInt32LE(png.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += png.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;
console.log('\nWrote:');

// favicon.ico — the legacy half of the same slot favicon.svg already fills.
const icoEntries = [];
for (const size of ICO_SIZES) icoEntries.push({ size, png: await render(size, 1) });
const icoPath = resolve(OUT, 'favicon.ico');
writeFileSync(icoPath, buildIco(icoEntries));
console.log(`  favicon.ico            ${ICO_SIZES.join('/')}  ${kb(icoPath)}`);

for (const [name, size, inset] of [
  // iOS rounds the corners itself and never shows transparency, so a full-bleed
  // plate is correct. Same mark as the tab and the launcher.
  ['apple-touch-icon.png', 180, 1],
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  // ~66% keeps the mark inside the circle Android may crop to.
  ['icon-512-maskable.png', 512, 0.66],
]) {
  const path = resolve(OUT, name);
  writeFileSync(path, await render(size, inset));
  console.log(`  ${name.padEnd(22)} ${size}x${size}  ${kb(path)}`);
}

// ---------------------------------------------------------------- og card
const OG_W = 1200;
const OG_H = 630;
/** WhatsApp's worst case: the centred square it may crop the card down to. */
const SAFE = OG_H;

const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString('base64')}`;
const poster = dataUri(resolve(OUT, 'hero-poster.jpg'), 'image/jpeg');
const emblem = dataUri(resolve(OUT, 'logo-mark.webp'), 'image/webp');
const archivo = dataUri(
  resolve(root, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2'),
  'font/woff2',
);
const plex = dataUri(
  resolve(root, 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2'),
  'font/woff2',
);

const ogPage = await browser.newPage();
await ogPage.setViewport({ width: OG_W, height: OG_H, deviceScaleFactor: 1 });
await ogPage.setContent(
  `<!doctype html><meta charset="utf-8">
  <style>
    @font-face{font-family:Archivo;src:url(${archivo}) format('woff2');font-weight:100 900;font-display:block}
    @font-face{font-family:Plex;src:url(${plex}) format('woff2');font-weight:600;font-display:block}
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:${OG_W}px;height:${OG_H}px;overflow:hidden;background:${INK}}
    .card{position:relative;width:${OG_W}px;height:${OG_H}px;overflow:hidden}
    .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    /* Darken everything, then darken the middle harder: the whole composition
       now lives in the centre and has to hold contrast there. */
    .scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,12,16,.92),rgba(10,12,16,.82) 30%,rgba(10,12,16,.86) 50%,rgba(10,12,16,.72))}
    .vig{position:absolute;inset:0;background:radial-gradient(ellipse 46% 78% at 50% 50%,rgba(10,12,16,.86),rgba(10,12,16,0) 70%)}
    .bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:#FF6600}
    .safe{position:absolute;left:50%;top:0;width:${SAFE}px;height:${OG_H}px;transform:translateX(-50%);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;padding:0 26px}
    .emblem{width:196px;height:auto;display:block}
    .name{font-family:Archivo,sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.02em;
          line-height:.92;color:#fff;white-space:nowrap;margin-top:22px}
    .rule{width:96px;height:4px;background:#FF6600;margin-top:20px}
    .svc{font-family:Plex,sans-serif;font-weight:600;color:#E8ECF1;text-align:center;
         line-height:1.45;margin-top:20px;max-width:540px}
    .city{font-family:Plex,sans-serif;font-weight:600;color:#FF8A33;letter-spacing:.1em;
          text-transform:uppercase;margin-top:14px}
  </style>
  <div class="card">
    <img class="bg" src="${poster}">
    <div class="scrim"></div><div class="vig"></div><div class="bar"></div>
    <div class="safe">
      <img class="emblem" src="${emblem}">
      <div class="name" id="name" style="font-size:64px">Wahlung Garage</div>
      <div class="rule"></div>
      <div class="svc" style="font-size:21px">Enderezado y pintura · Mecánica<br>Polarizado · Tapicería</div>
      <div class="city" style="font-size:17px">Tegucigalpa, Honduras</div>
    </div>
  </div>`,
  { waitUntil: 'load' },
);
await ogPage.evaluate(() => document.fonts.ready);

// Shrink the wordmark until it fits the safe square with a real margin. Measured
// rather than guessed, so a longer name can never silently overflow the crop.
const fit = await ogPage.evaluate((limit) => {
  const el = document.getElementById('name');
  let size = parseFloat(el.style.fontSize);
  while (el.getBoundingClientRect().width > limit && size > 20) {
    size -= 1;
    el.style.fontSize = `${size}px`;
  }
  return { size, width: Math.round(el.getBoundingClientRect().width) };
}, SAFE - 72);
await new Promise((r) => setTimeout(r, 250));

const ogPath = resolve(OUT, 'og-image.jpg');
writeFileSync(ogPath, Buffer.from(await ogPage.screenshot({ type: 'jpeg', quality: 88 })));
await ogPage.close();
console.log(`  og-image.jpg           ${OG_W}x${OG_H}  ${kb(ogPath)}  (wordmark ${fit.width}px @ ${fit.size}px, safe zone ${SAFE - 72}px)`);

await browser.close();

const manifest = {
  name: 'Wahlung Garage',
  short_name: 'Wahlung',
  description:
    'Taller de enderezado y pintura, mecánica general, polarizado y tapicería en Tegucigalpa.',
  lang: 'es-HN',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: INK,
  theme_color: INK,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
const manifestPath = resolve(OUT, 'site.webmanifest');
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`  site.webmanifest       ${kb(manifestPath)}\n`);
