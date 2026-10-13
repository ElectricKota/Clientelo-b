// Reveal efekt: prvek s třídou .reveal se plynule zobrazí ve chvíli, kdy dojede do viewportu.
// Prvky, které se objeví současně (např. řada karet), se odstupňují zleva doprava a shora dolů.

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 5;

const root = document.documentElement;

function reveal(el: HTMLElement, delay: number) {
  el.style.setProperty('--reveal-delay', `${delay}ms`);
  el.classList.add('is-revealed');
  // Po dokončení uvolníme delay, aby hover a další přechody nereagovaly se zpožděním.
  el.addEventListener('transitionend', () => el.style.removeProperty('--reveal-delay'), { once: true });
}

/** Okamžitě odkryje prvky bez animace (např. před View Transition filtru). */
export function revealInstantly(elements: Iterable<Element>) {
  for (const el of elements) el.classList.add('is-revealed', 'reveal-instant');
}

if (root.classList.contains('js-reveal')) {
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => ({ el: entry.target as HTMLElement, rect: entry.boundingClientRect }))
        .sort((a, b) => Math.round(a.rect.top - b.rect.top) || a.rect.left - b.rect.left);

      visible.forEach(({ el }, index) => {
        reveal(el, Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS);
        io.unobserve(el);
      });
    },
    // Spustí se, když prvek vyjede ~10 % nad spodní okraj obrazovky.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => io.observe(el));
  window.__revealReady = true;
}
