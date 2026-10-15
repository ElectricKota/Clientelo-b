const HOLD_DELAY = 380;
const REPEAT_START = 120;
const REPEAT_MIN = 35;

class NumberStepper extends HTMLElement {
  input!: HTMLInputElement;
  buttons!: HTMLButtonElement[];
  timer = 0;
  pointerStep = false;

  connectedCallback() {
    this.input = this.querySelector('input')!;
    this.buttons = [...this.querySelectorAll<HTMLButtonElement>('button[data-dir]')];

    for (const button of this.buttons) {
      const dir = Number(button.dataset.dir);
      button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        event.preventDefault(); // fokus zůstane v poli, klávesnice dál funguje šipkami
        this.pointerStep = true;
        try {
          button.setPointerCapture(event.pointerId);
        } catch {}
        this.step(dir);
        this.hold(dir, HOLD_DELAY, REPEAT_START);
      });
      for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
        button.addEventListener(type, () => this.stop());
      }
      // Aktivace čtečkou nebo virtuální klik (bez pointerdown).
      button.addEventListener('click', () => {
        if (this.pointerStep) {
          this.pointerStep = false;
          return;
        }
        this.step(dir);
      });
    }

    this.input.addEventListener('input', () => this.sync());
    this.input.addEventListener('change', () => this.clamp());
    this.sync();
  }

  disconnectedCallback() {
    this.stop();
  }

  hold(dir: number, delay: number, interval: number) {
    this.timer = window.setTimeout(() => {
      if (!this.step(dir)) return this.stop();
      this.hold(dir, interval, Math.max(REPEAT_MIN, interval * 0.85));
    }, delay);
  }

  stop() {
    clearTimeout(this.timer);
  }

  /** Posune hodnotu o jeden krok; vrací false, pokud už je na mezi. */
  step(dir: number) {
    const before = this.input.value;
    if (this.input.value === '') this.input.value = this.input.min || '0';
    dir > 0 ? this.input.stepUp() : this.input.stepDown();
    if (this.input.value === before) return false;

    this.input.classList.remove('bump-up', 'bump-down');
    void this.input.offsetWidth; // restart animace
    this.input.classList.add(dir > 0 ? 'bump-up' : 'bump-down');

    this.input.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  clamp() {
    const value = Number(this.input.value);
    if (this.input.value === '' || Number.isNaN(value)) return;
    const min = Number(this.input.min);
    const max = Number(this.input.max);
    if (value < min) this.input.value = String(min);
    if (value > max) this.input.value = String(max);
    this.sync();
  }

  sync() {
    const value = Number(this.input.value);
    const [up, down] = this.buttons;
    up.setAttribute('aria-disabled', String(value >= Number(this.input.max)));
    down.setAttribute('aria-disabled', String(value <= Number(this.input.min)));
  }
}

customElements.define('number-stepper', NumberStepper);
