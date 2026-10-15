class StickyCta extends HTMLElement {
  connectedCallback() {
    const bar = this.querySelector<HTMLElement>('[data-bar]')!;
    const hero = document.querySelector('[data-section="hero"]');
    const forms = document.querySelectorAll('lead-form');
    const state = { pastHero: false, formVisible: new Set<Element>() };

    const render = () => {
      const show = state.pastHero && state.formVisible.size === 0;
      bar.toggleAttribute('data-shown', show);
      bar.inert = !show;
    };

    if (hero) {
      new IntersectionObserver(([entry]) => {
        state.pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        render();
      }).observe(hero);
    }
    const formIo = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.isIntersecting ? state.formVisible.add(entry.target) : state.formVisible.delete(entry.target);
      render();
    });
    forms.forEach((f) => formIo.observe(f));
  }
}
customElements.define('sticky-cta', StickyCta);
