/**
 * Responsive + accessibility audit against a real Chrome at real viewport sizes.
 *
 *   npm run dev                 # in one terminal
 *   npm run audit               # in another
 *   npm run audit -- --shots    # also write full-page screenshots
 *
 * Drives the installed Chrome through puppeteer-core (no bundled Chromium
 * download). Checks, at 360 / 768 / 1440:
 *   - horizontal overflow, and which element causes it
 *   - that the hero <video> is absent below 768px and present above
 *   - touch target sizes below the 44x44 minimum
 *   - images missing alt, and headings that skip a level
 *   - console errors
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHOT_DIR = resolve(root, '.audit');
const URL = process.env.AUDIT_URL ?? 'http://127.0.0.1:5173/';
const WANT_SHOTS = process.argv.includes('--shots');

const CHROME_CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env['ProgramFiles(x86)']}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const executablePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
if (!executablePath) {
  console.error('Could not find an installed Chrome. Set CHROME_PATH.');
  process.exit(1);
}

const VIEWPORTS = [
  { name: '360', width: 360, height: 780, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1440', width: 1440, height: 900, mobile: false },
];

/** Runs in the page. Returns everything we want to assert about this viewport. */
function collect() {
  const de = document.documentElement;

  const overflowing = [];
  if (de.scrollWidth > de.clientWidth) {
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > de.clientWidth + 1 || r.left < -1) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
  }

  // Anything a finger or pointer can hit must clear 44x44.
  const smallTargets = [];
  const interactive = document.querySelectorAll(
    'a[href], button:not([disabled]), [role="slider"], input, select, textarea',
  );
  for (const el of interactive) {
    if (el.closest('[inert]') || el.getAttribute('aria-hidden') === 'true') continue;
    if (el.tabIndex < 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue; // not rendered
    if (r.width < 44 || r.height < 44) {
      smallTargets.push({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent ?? '').trim().slice(0, 34),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  }

  const imagesMissingAlt = [...document.querySelectorAll('img')]
    .filter((img) => !img.hasAttribute('alt'))
    .map((img) => img.getAttribute('src'));

  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: Number(h.tagName[1]),
    text: (h.textContent ?? '').trim().slice(0, 40),
  }));
  const headingSkips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i].level - levels[i - 1].level > 1) {
      headingSkips.push(`h${levels[i - 1].level} -> h${levels[i].level} at "${levels[i].text}"`);
    }
  }

  return {
    scrollWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    overflowing: overflowing.slice(0, 8),
    videoCount: document.querySelectorAll('video').length,
    posterImg: !!document.querySelector('img[src*="hero-poster"]'),
    smallTargets: smallTargets.slice(0, 12),
    imagesMissingAlt,
    headingSkips,
    h1Count: levels.filter((l) => l.level === 1).length,
  };
}

const browser = await puppeteer.launch({
  executablePath,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

if (WANT_SHOTS) mkdirSync(SHOT_DIR, { recursive: true });

let failures = 0;
const note = (ok, message) => {
  if (!ok) failures++;
  console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${message}`);
};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));

  await page.setViewport({
    width: vp.width,
    height: vp.height,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    deviceScaleFactor: 1,
  });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 600));

  // Scroll the whole page so every whileInView reveal fires. Without this the
  // full-page screenshots capture un-revealed sections as blank, and the touch
  // target check would miss controls inside them.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });

  const videoRequested = [];
  page.on('request', (req) => {
    if (req.url().endsWith('.mp4')) videoRequested.push(req.url());
  });

  const result = await page.evaluate(collect);

  console.log(`\n  ${vp.width}x${vp.height}`);
  note(
    result.scrollWidth <= result.clientWidth,
    `no horizontal scroll (scrollWidth ${result.scrollWidth} vs client ${result.clientWidth})`,
  );
  if (result.overflowing.length) {
    for (const o of result.overflowing) {
      console.log(`            overflow: <${o.tag}> ${o.left}..${o.right}  ${o.cls}`);
    }
  }

  if (vp.width < 768) {
    note(result.videoCount === 0, 'hero video NOT rendered below 768px');
    note(result.posterImg, 'hero poster image rendered instead');
  } else {
    note(result.videoCount === 1, 'hero video rendered at >=768px');
  }

  note(result.smallTargets.length === 0, `all touch targets >= 44x44`);
  for (const t of result.smallTargets) {
    console.log(`            small: <${t.tag}> ${t.w}x${t.h}  "${t.text}"`);
  }

  note(result.imagesMissingAlt.length === 0, 'every <img> has alt');
  for (const s of result.imagesMissingAlt) console.log(`            no alt: ${s}`);

  note(result.h1Count === 1, `exactly one <h1> (found ${result.h1Count})`);
  note(result.headingSkips.length === 0, 'no heading level skipped');
  for (const s of result.headingSkips) console.log(`            ${s}`);

  note(consoleErrors.length === 0, 'no console errors');
  for (const e of consoleErrors.slice(0, 5)) console.log(`            ${e.slice(0, 160)}`);

  if (WANT_SHOTS) {
    const path = resolve(SHOT_DIR, `${vp.name}.png`);
    await page.screenshot({ path, fullPage: true });
    console.log(`            screenshot -> .audit/${vp.name}.png`);
  }

  await page.close();
}

// ---------------------------------------------------------------------------
// Interaction and link integrity
// ---------------------------------------------------------------------------

const open = async (width, height = 900) => {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: width < 768, hasTouch: width < 768 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 400));
  return page;
};

console.log('\n  Links and anchors');
{
  const page = await open(1440);

  const links = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll('a[href]')];
    return {
      whatsapp: anchors
        .map((a) => a.getAttribute('href'))
        .filter((h) => h?.includes('wa.me')),
      tel: [...new Set(anchors.map((a) => a.getAttribute('href')).filter((h) => h?.startsWith('tel:')))],
      brokenAnchors: anchors
        .map((a) => a.getAttribute('href'))
        .filter((h) => h?.startsWith('#') && h.length > 1)
        .filter((h) => !document.getElementById(h.slice(1))),
      blankWithoutNoopener: anchors
        .filter((a) => a.target === '_blank' && !a.rel.includes('noopener'))
        .map((a) => a.getAttribute('href')),
      placeholderHrefs: anchors
        .filter((a) => a.getAttribute('href') === '#')
        .map((a) => a.textContent?.trim()),
    };
  });

  note(links.whatsapp.length > 0, `${links.whatsapp.length} WhatsApp CTAs found`);
  note(
    links.whatsapp.every((h) => /^https:\/\/wa\.me\/504(88250870|33669984)\?text=/.test(h)),
    'every WhatsApp link targets a real shop number with a pre-filled message',
  );
  const services = ['Enderezado%20y%20Pintura', 'Mec%C3%A1nica%20General', 'Polarizado', 'Tapicer%C3%ADa'];
  note(
    services.every((s) => links.whatsapp.some((h) => h.endsWith(s))),
    'each service section passes its own name into the message',
  );
  note(links.brokenAnchors.length === 0, 'every #anchor resolves to an element');
  for (const a of links.brokenAnchors) console.log(`            dead anchor: ${a}`);
  note(links.tel.length === 2, `both phones are tappable (${links.tel.join(', ')})`);
  note(links.blankWithoutNoopener.length === 0, 'every _blank link has rel=noopener');
  // The social slots are intentionally unset until the shop supplies real URLs.
  console.log(`    note  ${links.placeholderHrefs.length} placeholder href="#" (social slots)`);

  await page.close();
}

console.log('\n  Mobile menu (360)');
{
  const page = await open(360, 780);
  const burger = 'button[aria-label="Abrir el menú"]';
  const dialog = 'div[role="dialog"][aria-label="Menú"]';

  await page.click(burger);
  await new Promise((r) => setTimeout(r, 450));

  const opened = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const panel = el?.closest('[inert]');
    return {
      onScreen: el ? el.getBoundingClientRect().left < window.innerWidth - 10 : false,
      inert: !!panel,
      focusInside: !!(el && el.contains(document.activeElement)),
      bodyLocked: getComputedStyle(document.body).overflow === 'hidden',
      serviceLinks: el ? el.querySelectorAll('a[href^="#"]').length : 0,
    };
  }, dialog);

  note(opened.onScreen, 'menu slides in on tap');
  note(!opened.inert, 'menu is not inert while open');
  note(opened.focusInside, 'focus moves into the menu');
  note(opened.bodyLocked, 'page behind the menu cannot scroll');
  note(opened.serviceLinks >= 9, `menu exposes all nav + service links (${opened.serviceLinks})`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 450));
  const closed = await page.evaluate(
    (sel) => ({
      offScreen: document.querySelector(sel).getBoundingClientRect().left >= window.innerWidth - 10,
      focusRestored: document.activeElement?.getAttribute('aria-label') === 'Abrir el menú',
      bodyUnlocked: getComputedStyle(document.body).overflow !== 'hidden',
    }),
    dialog,
  );
  note(closed.offScreen, 'Escape closes the menu');
  note(closed.focusRestored, 'focus returns to the menu button');
  note(closed.bodyUnlocked, 'scrolling is restored');

  await page.close();
}

console.log('\n  Servicios dropdown (1440)');
{
  const page = await open(1440);
  const trigger = 'button[aria-controls="services-menu"]';

  await page.click(trigger);
  await new Promise((r) => setTimeout(r, 200));
  let state = await page.evaluate((sel) => ({
    expanded: document.querySelector(sel).getAttribute('aria-expanded'),
    itemCount: document.querySelectorAll('#services-menu a').length,
    visible: !document.getElementById('services-menu').hidden,
  }), trigger);
  note(state.expanded === 'true', 'dropdown reports aria-expanded=true');
  note(state.visible && state.itemCount === 4, `dropdown lists the four services (${state.itemCount})`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));
  state = await page.evaluate((sel) => ({
    expanded: document.querySelector(sel).getAttribute('aria-expanded'),
    focused: document.activeElement === document.querySelector(sel),
  }), trigger);
  note(state.expanded === 'false', 'Escape closes the dropdown');
  note(state.focused, 'focus returns to the Servicios trigger');

  await page.close();
}

console.log('\n  FAQ accordion (1440)');
{
  const page = await open(1440);
  const first = 'button[id^="faq-button-"]';

  const before = await page.$eval(first, (b) => b.getAttribute('aria-expanded'));
  await page.click(first);
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate((sel) => {
    const btn = document.querySelector(sel);
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    return {
      expanded: btn.getAttribute('aria-expanded'),
      panelExists: !!panel,
      panelInert: panel?.hasAttribute('inert'),
      panelHeight: panel?.getBoundingClientRect().height ?? 0,
    };
  }, first);

  note(before === 'false', 'answers start collapsed');
  note(after.expanded === 'true', 'clicking sets aria-expanded=true');
  note(after.panelExists, 'aria-controls points at a real panel');
  note(!after.panelInert, 'open panel is not inert');
  note(after.panelHeight > 20, `open panel has height (${Math.round(after.panelHeight)}px)`);

  await page.click(first);
  await new Promise((r) => setTimeout(r, 400));
  const reclosed = await page.evaluate((sel) => {
    const btn = document.querySelector(sel);
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    return { expanded: btn.getAttribute('aria-expanded'), inert: panel.hasAttribute('inert') };
  }, first);
  note(reclosed.expanded === 'false' && reclosed.inert, 'closing re-collapses and re-inerts the panel');

  await page.close();
}

console.log('\n  Gallery lightbox (1440)');
{
  const page = await open(1440);
  // Tiles are the only buttons in the gallery without aria-pressed; the filter
  // chips carry it. Selecting on that rather than on a label keeps this stable
  // when the tiles' accessible name changes.
  const tile = '#galeria button:not([aria-pressed])';
  const dialog = 'div[role="dialog"][aria-label="Visor de imágenes"]';

  await page.click(tile);
  await new Promise((r) => setTimeout(r, 400));
  const first = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      present: !!el,
      modal: el?.getAttribute('aria-modal'),
      counter: el?.querySelector('span')?.textContent?.trim(),
      focusInside: !!(el && el.contains(document.activeElement)),
    };
  }, dialog);
  note(first.present && first.modal === 'true', 'lightbox opens as a modal dialog');
  note(first.focusInside, 'focus is moved into the lightbox');

  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 250));
  const next = await page.$eval(dialog, (el) => el.querySelector('span')?.textContent?.trim());
  note(next !== first.counter, `ArrowRight navigates (${first.counter} -> ${next})`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const gone = await page.evaluate((sel) => !document.querySelector(sel), dialog);
  note(gone, 'Escape closes the lightbox');

  await page.close();
}

console.log('\n  Comparator keyboard (1440)');
{
  const page = await open(1440);
  const slider = '[role="slider"]';

  await page.focus(slider);
  const start = await page.$eval(slider, (el) => Number(el.getAttribute('aria-valuenow')));

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  const stepped = await page.$eval(slider, (el) => Number(el.getAttribute('aria-valuenow')));
  note(stepped === start + 4, `arrow keys step by 2 (${start} -> ${stepped})`);

  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.up('Shift');
  const shifted = await page.$eval(slider, (el) => Number(el.getAttribute('aria-valuenow')));
  note(shifted === stepped - 10, `Shift+arrow steps by 10 (${stepped} -> ${shifted})`);

  await page.keyboard.press('Home');
  const home = await page.$eval(slider, (el) => Number(el.getAttribute('aria-valuenow')));
  await page.keyboard.press('End');
  const end = await page.$eval(slider, (el) => Number(el.getAttribute('aria-valuenow')));
  note(home === 0 && end === 100, `Home/End jump to the extremes (${home} / ${end})`);

  const labelled = await page.$eval(slider, (el) => ({
    label: el.getAttribute('aria-label'),
    text: el.getAttribute('aria-valuetext'),
    min: el.getAttribute('aria-valuemin'),
    max: el.getAttribute('aria-valuemax'),
  }));
  note(
    !!labelled.label && labelled.min === '0' && labelled.max === '100' && !!labelled.text,
    'slider exposes a name, range and value text',
  );

  await page.close();
}

await browser.close();

console.log(
  failures === 0 ? '\n  AUDIT PASSED\n' : `\n  AUDIT FAILED - ${failures} check(s)\n`,
);
process.exit(failures === 0 ? 0 : 1);
