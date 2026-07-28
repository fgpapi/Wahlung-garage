import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolveSiteUrl } from './src/lib/site-url';
import { MAP_LINK_URL } from './src/lib/geo';

/**
 * index.html, robots.txt and sitemap.xml are static files that never reach the
 * React bundle, so they cannot import SITE_URL. This fills them in at build time
 * from the same `resolveSiteUrl` the app uses, which keeps the domain configured
 * in exactly one place instead of nine.
 *
 * robots.txt and sitemap.xml are generated rather than kept in `public/`: files
 * there are copied verbatim, so a copy on disk would just be a second place to
 * forget to update. The dev middleware serves identical bytes, so `npm run dev`
 * and the deployed site agree.
 */
function siteUrls(siteUrl: string): Plugin {
  const tokens: Record<string, string> = {
    '%SITE_URL%': siteUrl,
    '%MAP_LINK_URL%': MAP_LINK_URL,
  };
  const fill = (input: string) =>
    Object.entries(tokens).reduce((acc, [token, value]) => acc.split(token).join(value), input);

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${siteUrl}/</loc>\n` +
    `    <changefreq>monthly</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>\n`;

  return {
    name: 'site-urls',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => fill(html),
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Narrowed locally rather than via @types/node: tsconfig.node.json only
        // pulls in the ES libs, and one extra dependency for one property is a
        // poor trade.
        const url = (req as { url?: string }).url;
        const body = url === '/robots.txt' ? robots : url === '/sitemap.xml' ? sitemap : null;
        if (body === null) return next();
        res.setHeader(
          'Content-Type',
          url === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8',
        );
        res.end(body);
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  // '.' rather than process.cwd() to avoid needing @types/node; Vite resolves
  // envDir relative to the project root either way. Third argument '' so
  // VITE_SITE_URL is readable here, outside the client bundle's prefix filtering.
  const env = loadEnv(mode, '.', '');
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL);

  return {
    plugins: [react(), tailwindcss(), siteUrls(siteUrl)],
    build: {
      target: 'es2022',
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          // Framer Motion is only needed once the page starts revealing sections, so
          // splitting it keeps the critical hero bundle small on mobile connections.
          manualChunks: {
            motion: ['framer-motion'],
          },
        },
      },
    },
  };
});
