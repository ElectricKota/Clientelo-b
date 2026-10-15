// Centrální konfigurace aplikace (obdoba app.config.ts v Nuxtu).
// Před spuštěním kampaně doplňte provozovatele (viz README).
export const appConfig = {
  brand: 'ETF tahák',
  title: 'ETF tahák: 10 ETF z NYSE a co si z nich koupíte z Česka',
  description:
    'Porovnání nejpopulárnějších ETF z NYSE (SPY, VOO, IVV, VT…) s jejich evropskými alternativami, kalkulačka poplatků a PDF tahák zdarma pro české investory.',
  operator: {
    name: 'ETF tahák (provozovatel bude doplněn)',
    email: 'ahoj@etf-tahak.cz',
  },
  pdfPath: '/etf-tahak-2026.pdf',
  analytics: {
    gaId: import.meta.env.PUBLIC_GA_ID as string | undefined,
    metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined,
  },
};
