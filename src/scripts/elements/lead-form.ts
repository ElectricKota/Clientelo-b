import { track, getAttribution } from '~/scripts/composables/useTracking';

const TYPOS: Record<string, string> = {
  'gmail.cz': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'seznam.com': 'seznam.cz',
  'seznan.cz': 'seznam.cz',
  'sezam.cz': 'seznam.cz',
  'emai.cz': 'email.cz',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

class LeadForm extends HTMLElement {
  form!: HTMLFormElement;
  input!: HTMLInputElement;
  error!: HTMLElement;
  button!: HTMLButtonElement;
  started = false;

  get placement() {
    return this.dataset.placement ?? 'unknown';
  }

  connectedCallback() {
    this.form = this.querySelector('form')!;
    this.input = this.form.querySelector('input[type=email]')!;
    this.error = this.form.querySelector('[aria-live]')!;
    this.button = this.form.querySelector('button[type=submit]')!;

    // S JS validujeme sami (lepší hlášky), bez JS zůstává nativní validace prohlížeče.
    this.form.noValidate = true;
    this.setHidden('ts', String(Date.now()));
    this.setHidden('variant', document.documentElement.dataset.variant ?? 'a');

    new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          track('form_view', { placement: this.placement });
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    ).observe(this.form);

    this.input.addEventListener('focus', () => {
      if (this.started) return;
      this.started = true;
      track('form_start', { placement: this.placement });
    });
    this.input.addEventListener('input', () => {
      if (this.input.getAttribute('aria-invalid')) this.clearError();
    });
    this.form.addEventListener('submit', (event) => this.submit(event));
  }

  setHidden(name: string, value: string) {
    let field = this.form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!field) {
      field = Object.assign(document.createElement('input'), { type: 'hidden', name });
      this.form.append(field);
    }
    field.value = value;
  }

  showError(message: string, reason: string) {
    this.input.setAttribute('aria-invalid', 'true');
    this.error.textContent = message;
    this.input.focus();
    track('form_error', { placement: this.placement, reason });
  }

  clearError() {
    this.input.removeAttribute('aria-invalid');
    this.error.textContent = '';
  }

  async submit(event: SubmitEvent) {
    event.preventDefault();
    const email = this.input.value.trim();

    if (!EMAIL_RE.test(email)) {
      this.showError(email ? 'Tenhle e-mail nevypadá úplně správně. Zkontrolujte ho prosím.' : 'Vyplňte prosím e-mail, na který tahák pošleme.', email ? 'invalid' : 'empty');
      return;
    }
    const domain = email.split('@')[1].toLowerCase();
    if (TYPOS[domain] && this.input.dataset.typoChecked !== email) {
      this.input.dataset.typoChecked = email;
      this.showError(`Nemysleli jste @${TYPOS[domain]}? Pokud je e-mail správně, odešlete ho znovu.`, 'typo');
      return;
    }

    for (const [key, value] of Object.entries(getAttribution())) this.setHidden(key, value);
    try {
      const calc = JSON.parse(sessionStorage.getItem('calc') ?? 'null');
      if (calc) for (const [key, value] of Object.entries(calc)) this.setHidden(`calc_${key}`, String(value));
    } catch {}

    this.button.disabled = true;
    this.button.setAttribute('aria-busy', 'true');
    this.button.firstChild!.textContent = 'Odesílám… ';

    try {
      const res = await fetch(this.form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(new FormData(this.form) as unknown as Record<string, string>),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? res.status);

      track('form_submit', { placement: this.placement });
      try {
        sessionStorage.setItem('lead', JSON.stringify({ placement: this.placement, at: Date.now() }));
      } catch {}
      location.assign(data.redirect);
    } catch (err) {
      const invalid = String(err).includes('email');
      this.showError(
        invalid ? 'Tenhle e-mail nevypadá úplně správně. Zkontrolujte ho prosím.' : 'Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli.',
        invalid ? 'server_invalid' : 'network',
      );
      this.button.disabled = false;
      this.button.removeAttribute('aria-busy');
      this.button.firstChild!.textContent = `${this.button.dataset.label} `;
    }
  }
}

customElements.define('lead-form', LeadForm);
