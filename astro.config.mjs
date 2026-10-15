// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { leadDevApi } from './integrations/lead-dev-api.mjs';

const site = process.env.SITE_URL ?? 'https://clientelo-b.vercel.app';

// https://astro.build/config
export default defineConfig({
  site,
  // Zdrojová statická aktiva jsou ve `static/`, hotový web se generuje do `public/`
  // (tu složku lze rovnou nahrát na libovolný hosting).
  publicDir: './static',
  outDir: './public',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !/\/(dekujeme|voo|og|tahak|reklamy)$|\/reklama\//.test(page),
    }),
    leadDevApi(),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      // Statické řezy jsou výrazně menší než variabilní soubor s osou opsz.
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
