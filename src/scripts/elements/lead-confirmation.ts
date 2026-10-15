// <lead-confirmation>: na děkovné stránce odešle konverzi (jen jednou a jen po skutečném odeslání
// formuláře, ne při ručním otevření URL) a zobrazí shrnutí výpočtu z kalkulačky.
import { track } from '~/scripts/composables/useTracking';
import { format } from '~/utils/format';

interface CalculatorSummary {
  amount: number;
  monthly: number;
  years: number;
  diff: number;
}

function readSession<T>(key: string): T | null {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

class LeadConfirmation extends HTMLElement {
  connectedCallback() {
    this.trackConversion();
    this.renderSummary();
  }

  trackConversion() {
    const lead = readSession<{ placement: string }>('lead');
    if (!lead || readSession('lead_tracked')) return;
    track('generate_lead', { placement: lead.placement });
    try {
      sessionStorage.setItem('lead_tracked', '1');
    } catch {}
  }

  renderSummary() {
    const summary = readSession<CalculatorSummary>('calc');
    if (!summary) return;
    this.querySelector('[data-summary-text]')!.textContent =
      `Při vkladu ${format.czk(summary.amount)} a ${format.czk(summary.monthly)} měsíčně za ${format.years(summary.years)} ušetří nejlevnější ETF oproti dražšímu fondu zhruba ${format.czk(summary.diff)} na poplatcích (modelový výpočet).`;
    this.hidden = false;
  }
}

customElements.define('lead-confirmation', LeadConfirmation);
