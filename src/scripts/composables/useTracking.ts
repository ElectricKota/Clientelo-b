// Měření cesty návštěvníka: dataLayer (GA4/GTM) + Meta Pixel, pokud jsou nasazené.
// Události jsou popsané v README (sekce Měření). Inicializaci po načtení stránky dělá plugins/tracking.client.ts.

export type TrackingParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    track: (event: string, params?: TrackingParams) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
const isDebug = import.meta.env.DEV || new URLSearchParams(location.search).has('debug');

window.dataLayer = window.dataLayer || [];

function currentVariant() {
  return document.documentElement.dataset.variant ?? 'a';
}

export function track(event: string, params: TrackingParams = {}) {
  const payload = { variant: currentVariant(), ...params };
  // S gtag.js jde událost přes gtag (ten ji zapíše do dataLayer sám), jinak čistý push pro GTM.
  if (window.gtag) window.gtag('event', event, payload);
  else window.dataLayer.push({ event, ...payload });
  if (event === 'generate_lead') window.fbq?.('track', 'Lead');
  if (isDebug) console.info('[track]', event, payload);
}

window.track = track;

/** Uloží UTM parametry na dobu návštěvy, aby se dostaly do formuláře i na děkovnou stránku. */
export function storeAttribution() {
  const params = new URLSearchParams(location.search);
  try {
    const stored = JSON.parse(sessionStorage.getItem('attribution') ?? '{}');
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) stored[key] = value.slice(0, 200);
    }
    stored.landing_path ??= location.pathname;
    stored.referrer ??= document.referrer.slice(0, 200);
    sessionStorage.setItem('attribution', JSON.stringify(stored));
  } catch {
    /* sessionStorage nemusí být dostupné (anonymní režim) */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem('attribution') ?? '{}');
  } catch {
    return {};
  }
}


/** Nuxt-like composable: `const { track, getAttribution } = useTracking()`. */
export function useTracking() {
  return { track, getAttribution, storeAttribution };
}
