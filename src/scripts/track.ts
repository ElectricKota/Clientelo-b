// Jednotné měření cesty návštěvníka: dataLayer (GA4/GTM) + Meta Pixel, pokud jsou nasazené.
// Události jsou popsané v README (sekce Měření).

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    track: (event: string, params?: Params) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
const debug = import.meta.env.DEV || new URLSearchParams(location.search).has('debug');

window.dataLayer = window.dataLayer || [];

function variant() {
  return document.documentElement.dataset.variant ?? 'a';
}

export function track(event: string, params: Params = {}) {
  const payload = { variant: variant(), ...params };
  // S gtag.js jde událost přes gtag (ten ji zapíše do dataLayer sám), jinak čistý push pro GTM.
  if (window.gtag) window.gtag('event', event, payload);
  else window.dataLayer.push({ event, ...payload });
  if (event === 'generate_lead') window.fbq?.('track', 'Lead');
  if (debug) console.info('[track]', event, payload);
}

window.track = track;

// UTM parametry si pamatujeme po dobu návštěvy, aby se dostaly do formuláře i na děkovnou stránku.
function storeAttribution() {
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

function observeSections() {
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.section!;
        if (entry.isIntersecting && !seen.has(id)) {
          seen.add(id);
          track('section_view', { section: id });
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => io.observe(el));
}

function observeScrollDepth() {
  const marks = [25, 50, 75, 100];
  const reached = new Set<number>();
  let ticking = false;
  const check = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 100;
    for (const mark of marks) {
      if (pct >= mark - 1 && !reached.has(mark)) {
        reached.add(mark);
        track('scroll_depth', { percent: mark });
      }
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    },
    { passive: true },
  );
}

function observeClicks() {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { placement: el.dataset.placement, label: el.dataset.label });
  });
}

storeAttribution();
track('lp_view', { path: location.pathname, ...getAttribution() });
observeSections();
observeScrollDepth();
observeClicks();
