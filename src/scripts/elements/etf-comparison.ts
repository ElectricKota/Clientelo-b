// <etf-comparison>: filtr fondů funguje čistě přes CSS (:has). Element přidává View Transitions,
// oznámení počtu výsledků čtečkám a měření změny filtru.
import { track } from '~/scripts/composables/useTracking';
import { revealInstantly } from '~/scripts/composables/useReveal';

const FILTER_NAME = 'etf-filter';
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const fundsLabel = (count: number) => `${count} ${count === 1 ? 'fond' : count < 5 ? 'fondy' : 'fondů'}`;

class EtfComparison extends HTMLElement {
  isTransitioning = false;

  connectedCallback() {
    this.addEventListener('click', (event) => this.onFilterClick(event));
    this.addEventListener('change', (event) => this.onFilterChange(event));
  }

  /** Změnu výběru zabalí do View Transition, takže karty plynule odjedou, přijedou a přeskupí se. */
  onFilterClick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.name !== FILTER_NAME) return;
    // Karty dosud skryté filtrem ještě neprošly revealem; odkryjeme je hned, animaci obstará View Transition.
    revealInstantly(this.querySelectorAll('.etf-card.reveal:not(.is-revealed)'));
    if (!document.startViewTransition || prefersReducedMotion.matches || this.isTransitioning) return;

    event.preventDefault();
    this.isTransitioning = true;
    const selectFilter = () => {
      if (input.checked) return;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const transition = document.startViewTransition(selectFilter);
    // Přechod může prohlížeč zrušit (např. timeout na neaktivní záložce); filtr se pak přepne bez animace.
    transition.finished
      .catch(selectFilter)
      .finally(() => (this.isTransitioning = false));
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.name !== FILTER_NAME) return;
    const visibleCount = [...this.querySelectorAll<HTMLElement>('.etf-card')].filter((card) => card.offsetParent !== null).length;
    const status = this.querySelector('[data-count]');
    if (status) status.textContent = `Zobrazeno ${fundsLabel(visibleCount)}.`;
    track('filter_change', { category: input.value });
  }
}

customElements.define('etf-comparison', EtfComparison);
