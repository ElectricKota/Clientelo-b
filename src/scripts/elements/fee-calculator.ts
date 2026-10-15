// <fee-calculator>: přepočítá poplatky při změně vstupů. Výchozí výsledek je už vyrenderovaný v HTML.
import { feeCost, futureValue } from '~/utils/finance';
import { format } from '~/utils/format';
import { track } from '~/scripts/composables/useTracking';

const ANNOUNCE_DELAY_MS = 900;

interface FeeRow {
  element: HTMLElement;
  ter: number;
  cost: number;
  isCustom: boolean;
}

class FeeCalculator extends HTMLElement {
  form!: HTMLFormElement;
  hasInteracted = false;
  announceTimer = 0;

  connectedCallback() {
    this.form = this.querySelector('form')!;
    this.form.addEventListener('input', (event) => this.update(event));
    this.form.addEventListener('change', (event) => this.update(event));
  }

  /** Vypíše text do všech výstupů s daným `data-out`. */
  setOutput(name: string, text: string) {
    this.querySelectorAll(`[data-out="${name}"]`).forEach((output) => (output.textContent = text));
  }

  readValues() {
    const formData = new FormData(this.form);
    const readNumber = (key: string) => Number(String(formData.get(key)).replace(',', '.')) || 0;
    return {
      initial: readNumber('initial'),
      monthly: readNumber('monthly'),
      years: readNumber('years'),
      annualReturn: readNumber('annualReturn'),
      customTer: Math.min(Math.max(readNumber('customTer'), 0), 5),
    };
  }

  update(event: Event) {
    if (!this.hasInteracted) {
      this.hasInteracted = true;
      track('calc_interact', { field: (event.target as HTMLInputElement).name });
    }
    const values = this.readValues();

    for (const input of this.form.querySelectorAll<HTMLInputElement>('input[type=range]')) {
      const text = input.dataset.unit === 'Kč' ? format.czk(Number(input.value)) : format.years(Number(input.value));
      input.setAttribute('aria-valuetext', text);
      this.setOutput(input.name, text);
    }

    const rows: FeeRow[] = [...this.querySelectorAll<HTMLElement>('[data-row]')].map((element) => {
      const isCustom = element.dataset.row === 'custom';
      const ter = isCustom ? values.customTer : Number(element.dataset.ter);
      return { element, ter, cost: feeCost({ ...values, ter }), isCustom };
    });
    const maxCost = Math.max(...rows.map((row) => row.cost), 1);
    for (const row of rows) {
      row.element.style.setProperty('--w', `${((row.cost / maxCost) * 100).toFixed(1)}%`);
      row.element.querySelector('[data-cost]')!.textContent = format.czk(row.cost);
      if (row.isCustom) row.element.querySelector('[data-ter-label]')!.textContent = format.ter(row.ter);
    }

    const etfRows = rows.filter((row) => !row.isCustom);
    const cheapest = etfRows.reduce((a, b) => (a.cost <= b.cost ? a : b));
    const mostExpensive = etfRows.reduce((a, b) => (a.cost >= b.cost ? a : b));
    const custom = rows.find((row) => row.isCustom)!;

    this.setOutput('yearsText', format.years(values.years));
    this.setOutput('min', format.czk(cheapest.cost));
    this.setOutput('max', format.czk(mostExpensive.cost));
    this.setOutput('customTer', format.ter(values.customTer));
    this.setOutput('custom', format.czk(custom.cost));
    this.setOutput('final', format.czk(futureValue({ ...values, ter: cheapest.ter })));

    const summary = { amount: values.initial, monthly: values.monthly, years: values.years, diff: Math.round(custom.cost - cheapest.cost) };
    try {
      sessionStorage.setItem('calc', JSON.stringify(summary));
    } catch {}

    clearTimeout(this.announceTimer);
    this.announceTimer = window.setTimeout(() => {
      // Čtečkám oznamujeme výsledek až po ustálení, ne při každém kroku posuvníku.
      this.querySelector('[data-live]')!.textContent =
        `Za ${format.years(values.years)} zaplatíte na poplatcích ETF od ${format.czk(cheapest.cost)} do ${format.czk(mostExpensive.cost)}, ve fondu za ${format.ter(values.customTer)} ${format.czk(custom.cost)}.`;
      track('calc_result', summary);
    }, ANNOUNCE_DELAY_MS);
  }
}

customElements.define('fee-calculator', FeeCalculator);
