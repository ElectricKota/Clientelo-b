// Plugin reveal efektu: prvek s třídou .reveal se plynule zobrazí ve chvíli, kdy dojede do viewportu.
// Prvky, které se objeví současně (např. řada karet), se odstupňují zleva doprava a shora dolů.

export {};

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 5;

const root = document.documentElement;

function reveal(element: HTMLElement, delay: number) {
  element.style.setProperty('--reveal-delay', `${delay}ms`);
  element.classList.add('is-revealed');
  // Po dokončení uvolníme delay, aby hover a další přechody nereagovaly se zpožděním.
  element.addEventListener('transitionend', () => element.style.removeProperty('--reveal-delay'), { once: true });
}

if (root.classList.contains('js-reveal')) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => ({ element: entry.target as HTMLElement, rect: entry.boundingClientRect }))
        .sort((a, b) => Math.round(a.rect.top - b.rect.top) || a.rect.left - b.rect.left);

      visible.forEach(({ element }, index) => {
        reveal(element, Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS);
        observer.unobserve(element);
      });
    },
    // Spustí se, když prvek vyjede ~10 % nad spodní okraj obrazovky.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => observer.observe(element));
  window.__revealReady = true;
}
