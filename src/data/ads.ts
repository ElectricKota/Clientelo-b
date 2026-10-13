// Dvě verze reklamy (Meta: Facebook + Instagram). Texty, cílení a URL s UTM parametry.
// Vizuály se renderují ze stránek /reklama/[id] skriptem `npm run og` do src/assets/reklamy/.

export interface Ad {
  id: 'a' | 'b';
  name: string;
  angle: string;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  landingPath: string;
  utmContent: string;
  /** Co přesně z reklamy se opakuje na první obrazovce stránky. */
  messageMatch: string[];
  hypothesis: string;
}

export const targeting = {
  platform: 'Meta (Facebook + Instagram), umístění Feed, Stories a Reels',
  geo: 'Česko, jazyk čeština',
  age: '25–40 let',
  interests: 'Investování, ETF, burzovní obchodování, osobní finance; publikum podobné brokerům (XTB, Trading 212, Degiro, Portu)',
  device: 'primárně mobil',
  objective: 'Leady (konverze na webu: událost Lead)',
};

export const campaign = { source: 'meta', medium: 'paid_social', name: 'etf_tahak_2026' };

export const ads: Ad[] = [
  {
    id: 'a',
    name: 'Poplatky',
    angle: 'Racionální: konkrétní číslo a osobní výpočet za 30 vteřin.',
    primaryText:
      'SPY, IVV i VOO kopírují úplně stejný index. Přesto vás jeden z nich za 20 let stojí na poplatcích víc. Spočítejte si za 30 vteřin, kolik to dělá u vás, a co z nich si z Česka vůbec koupíte.',
    headline: 'Stejný index, jiný poplatek',
    description: 'Kalkulačka a PDF tahák zdarma',
    cta: 'Zjistit více',
    landingPath: '/',
    utmContent: 'a_poplatky',
    messageMatch: [
      'Nadpis stránky opakuje slib reklamy: „SPY, IVV, nebo VOO? Stejný index, jiný poplatek.“',
      'Vedle nadpisu je stejný graf poplatků jako v reklamě (stejné fondy, stejná čísla).',
      'Hlavní tlačítko „Spočítat můj rozdíl“ vede rovnou do kalkulačky, kterou reklama slibuje.',
      'Pod tlačítky je výčet toho, co návštěvník zdarma dostane.',
    ],
    hypothesis: 'Osloví lidi, kteří už investují a chtějí si ověřit, že neplatí zbytečně. Čekáme vyšší CTR u věku 30–40 let.',
  },
  {
    id: 'b',
    name: 'VOO paradox',
    angle: 'Zvědavost: řeší problém, na který začátečník narazí v aplikaci brokera.',
    primaryText:
      'VOO doporučuje skoro každý americký youtuber. Jenže jako drobný investor z Česka ho u brokera nekoupíte. Ukážeme vám, co si koupit místo něj, a dalších 9 populárních ETF z NYSE s jejich evropskými dvojčaty.',
    headline: 'VOO si z Česka nekoupíte. Tohle ano.',
    description: 'Porovnání 10 ETF a PDF tahák zdarma',
    cta: 'Zjistit více',
    landingPath: '/voo',
    utmContent: 'b_voo',
    messageMatch: [
      'Nadpis stránky je doslova nadpis reklamy: „VOO si z Česka nekoupíte. Tohle ano.“',
      'Vedle nadpisu je stejný vizuál VOO → VUAA jako v reklamě.',
      'Hlavní tlačítko „Ukázat evropská dvojčata“ vede na porovnání, které je na této variantě hned pod hero.',
      'Pod tlačítky je výčet toho, co návštěvník zdarma dostane.',
    ],
    hypothesis: 'Osloví začátečníky, kteří VOO znají ze sociálních sítí. Čekáme nižší cenu za lead u věku 25–32 let.',
  },
];

export function adUrl(ad: Ad, site: URL | string) {
  const url = new URL(ad.landingPath, site);
  url.searchParams.set('utm_source', campaign.source);
  url.searchParams.set('utm_medium', campaign.medium);
  url.searchParams.set('utm_campaign', campaign.name);
  url.searchParams.set('utm_content', ad.utmContent);
  return url.href;
}
