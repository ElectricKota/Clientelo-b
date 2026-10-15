// <consent-bar data-ga-id data-meta-pixel-id>: lišta souhlasu s cookies (Google Consent Mode v2).
// GA se načte vždy po vykreslení (bez souhlasu jen cookieless pingy), Meta Pixel až po souhlasu.
import { track } from '~/scripts/composables/useTracking';

type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'consent';

function loadScript(src: string, marker: string) {
  if (document.querySelector(`script[data-${marker}]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.dataset[marker] = '';
  script.src = src;
  document.head.append(script);
}

/** Oficiální Meta Pixel snippet, spouští se až po souhlasu. */
function loadMetaPixel(pixelId: string) {
  const globalWindow = window as any;
  if (globalWindow.fbq) return;
  const fbq: any = function (...args: unknown[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  globalWindow.fbq = globalWindow._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  loadScript('https://connect.facebook.net/en_US/fbevents.js', 'metaPixel');
  fbq('init', pixelId);
  fbq('track', 'PageView');
}

function readStoredConsent(): ConsentValue | null {
  try {
    return localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
  } catch {
    return null;
  }
}

function storeConsent(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

class ConsentBar extends HTMLElement {
  get gaId() {
    return this.dataset.gaId;
  }

  get metaPixelId() {
    return this.dataset.metaPixelId;
  }

  connectedCallback() {
    if (this.gaId) {
      const whenIdle = (window as any).requestIdleCallback ?? ((callback: () => void) => setTimeout(callback, 1500));
      addEventListener('load', () => whenIdle(() => loadScript(`https://www.googletagmanager.com/gtag/js?id=${this.gaId}`, 'ga')), { once: true });
    }

    const stored = readStoredConsent();
    if (stored) {
      this.applyConsent(stored);
      return;
    }

    this.hidden = false;
    this.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-consent]');
      if (!button) return;
      const value = button.dataset.consent as ConsentValue;
      storeConsent(value);
      this.applyConsent(value);
      track('consent', { value });
      this.hidden = true;
    });
  }

  applyConsent(value: ConsentValue) {
    const state = value === 'granted' ? 'granted' : 'denied';
    window.gtag?.('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    if (value === 'granted' && this.metaPixelId) loadMetaPixel(this.metaPixelId);
  }
}

customElements.define('consent-bar', ConsentBar);
