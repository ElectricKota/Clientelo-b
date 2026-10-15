// Plugin měření: po načtení stránky uloží atribuci, odešle lp_view a začne sledovat sekce, scroll a kliky.
import { getAttribution, storeAttribution, track } from '~/scripts/composables/useTracking';

function observeSections() {
  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.section!;
        if (entry.isIntersecting && !seen.has(id)) {
          seen.add(id);
          track('section_view', { section: id });
          observer.unobserve(entry.target);
        }
      }
    },
    // Sekce delší než obrazovka nikdy nedosáhnou vysokého prahu, proto měříme vstup do středového pásu obrazovky.
    { rootMargin: '-35% 0px -35% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-section]').forEach((element) => observer.observe(element));
}

function observeScrollDepth() {
  const marks = [25, 50, 75, 100];
  const reached = new Set<number>();
  let ticking = false;
  const check = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max > 0 ? (scrollY / max) * 100 : 100;
    for (const mark of marks) {
      if (percent >= mark - 1 && !reached.has(mark)) {
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
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (!target) return;
    track(target.dataset.track!, { placement: target.dataset.placement, label: target.dataset.label });
  });
}

storeAttribution();
track('lp_view', { path: location.pathname, ...getAttribution() });
observeSections();
observeScrollDepth();
observeClicks();
