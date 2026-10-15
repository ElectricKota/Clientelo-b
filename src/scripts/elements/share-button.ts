// <share-button data-url data-text>: nativní sdílení (Web Share API). Bez podpory zůstane skryté.
import { track } from '~/scripts/composables/useTracking';

class ShareButton extends HTMLElement {
  connectedCallback() {
    if (!navigator.share) return;
    const button = this.querySelector('button')!;
    this.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.share({ url: this.dataset.url, text: this.dataset.text });
        track('share', { label: 'native' });
      } catch {
        /* uživatel sdílení zrušil */
      }
    });
  }
}

customElements.define('share-button', ShareButton);
