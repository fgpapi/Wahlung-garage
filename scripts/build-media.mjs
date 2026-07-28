/**
 * Derives the shipped hero media from the master file in `media/`.
 *
 * Run with `npm run assets:poster` after replacing media/hero.source.mp4. The
 * outputs are committed to git — Vercel does not run ffmpeg at deploy time.
 *
 *   public/hero.mp4          H.264 high, served at 768px and up
 *   public/hero-mobile.mp4   H.264 baseline 720p, served below 768px
 *   public/hero-poster.jpg   frame 0, used as the <video poster> and desktop still
 *   public/hero-poster-800.jpg  the same frame for mobile, where the video never loads
 *
 * No WebM: VP9 was measured at 590 KB against H.264's 456 KB for this clip, so the
 * extra <source> would have cost bandwidth rather than saved it.
 *
 * The poster is deliberately frame 0 rather than a "nicer" frame further in: the
 * video autoplays from the start, so any other frame produces a visible jump.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'media/hero.source.mp4');
const OUT = resolve(root, 'public');

/** Long edge of the shipped video. The hero is heavily overlaid, so 1600 is ample. */
const VIDEO_WIDTH = 1600;
const VIDEO_HEIGHT = 900;

mkdirSync(OUT, { recursive: true });

const run = (label, args) => {
  process.stdout.write(`  ${label} ... `);
  const started = Date.now();
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  process.stdout.write(`${((Date.now() - started) / 1000).toFixed(1)}s\n`);
};

const scale = `scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:flags=lanczos`;

console.log(`\nSource: ${SOURCE}\n`);

run('hero.mp4  (H.264 crf 30)', [
  '-i', SOURCE,
  '-an',
  '-vf', scale,
  '-c:v', 'libx264',
  '-profile:v', 'high',
  '-crf', '30',
  '-preset', 'slow',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  resolve(OUT, 'hero.mp4'),
]);

/**
 * The phone variant, picked by `<source media="(max-width: 767px)">` in Hero.
 * Baseline profile for the widest possible decoder support, and a tighter crf
 * because a 9:16 crop of this footage is heavily overlaid anyway. crf 30 lands
 * it below the desktop file — a "mobile" variant that weighed more would be
 * pointless. Audio was already absent from the source; `-an` keeps it that way.
 */
run('hero-mobile.mp4  (720p H.264 baseline)', [
  '-i', SOURCE,
  '-an',
  '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease:flags=lanczos',
  '-c:v', 'libx264',
  '-profile:v', 'baseline',
  '-level', '3.1',
  '-crf', '30',
  '-maxrate', '800k',
  '-bufsize', '1600k',
  '-preset', 'slow',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  resolve(OUT, 'hero-mobile.mp4'),
]);

run('hero-poster.jpg', [
  '-i', SOURCE,
  '-vf', `select=eq(n\\,0),${scale}`,
  '-frames:v', '1',
  '-q:v', '5',
  resolve(OUT, 'hero-poster.jpg'),
]);

run('hero-poster-800.jpg', [
  '-i', SOURCE,
  '-vf', 'select=eq(n\\,0),scale=800:450:flags=lanczos',
  '-frames:v', '1',
  '-q:v', '6',
  resolve(OUT, 'hero-poster-800.jpg'),
]);

const kb = (p) => `${(statSync(resolve(OUT, p)).size / 1024).toFixed(0)} KB`;
console.log('\nWrote:');
for (const f of ['hero.mp4', 'hero-mobile.mp4', 'hero-poster.jpg', 'hero-poster-800.jpg']) {
  console.log(`  public/${f.padEnd(22)} ${kb(f)}`);
}
console.log(`  (source was ${(statSync(SOURCE).size / 1024).toFixed(0)} KB)\n`);
