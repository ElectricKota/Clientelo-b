// Ovládání reveal efektu z komponent (samotné sledování viewportu je v plugins/reveal.client.ts).

/** Okamžitě odkryje prvky bez animace (např. karty odkryté filtrem, které animuje View Transition). */
export function revealInstantly(elements: Iterable<Element>) {
  for (const element of elements) element.classList.add('is-revealed', 'reveal-instant');
}

export function useReveal() {
  return { revealInstantly };
}
