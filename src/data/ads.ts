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
    name: 'Účtenka',
    angle:
      'Averze ke ztrátě. Hook je konkrétní číslo (331 205 Kč) a vyčítavé „A ani o tom nevíte“. Účtenka na tmavém pozadí vizuálně vybočí z feedu a ukazuje skrytý náklad jako něco hmatatelného.',
    primaryText:
      '331 205 Kč. Tolik může za 20 let spolknout poplatek fondu 1,5 % ročně. Ve výpisu ho nevidíte, strhává se potichu z hodnoty fondu.\n\nETF na stejný index (S&P 500) vyjde v tom samém modelu na 7 340 Kč.\n\nSpočítejte si za 30 vteřin svou vlastní účtenku 👇',
    headline: 'Spočítejte si svou účtenku',
    description: 'Kalkulačka poplatků a PDF tahák zdarma',
    cta: 'Zjistit více',
    landingPath: '/',
    utmContent: 'a_uctenka',
    messageMatch: [
      'Nadpis stránky je hook reklamy: „331 205 Kč za 20 let. A ani o tom nevíte.“ (stejná kurzíva i barva).',
      'Hned pod nadpisem je stejná účtenka jako v reklamě (stejné fondy, čísla i zakroužkovaná částka).',
      'Hlavní tlačítko má stejný text jako reklama, „Spočítat svou účtenku“, a vede do kalkulačky.',
      'Pod tlačítky je výčet toho, co návštěvník zdarma dostane.',
    ],
    hypothesis:
      'Silnější u lidí, kteří už mají fond v bance nebo u poradce (30–40 let): číslo je osobní a vyvolá potřebu si ho ověřit. Čekáme vyšší CTR i konverzi stránky, protože kalkulačka přímo plní slib reklamy.',
  },
  {
    id: 'b',
    name: 'Chat',
    angle:
      'Rozpoznání vlastní frustrace. Nativně vypadající konverzace kamarádů začíná otázkou, kterou si začátečník sám položil („Proč mi broker nenajde VOO?“), a hned nabídne řešení. Nevypadá jako reklama, takže ji lidé čtou.',
    primaryText:
      '„Proč mi broker nenajde VOO?“ Není to chyba aplikace.\n\nAmerická ETF jako VOO, SPY nebo VT si drobný investor z EU kvůli regulaci PRIIPs většinou nekoupí. Na stejné indexy ale existují evropská dvojčata.\n\nPřipravili jsme převodník 10 nejpopulárnějších ETF z NYSE na jejich evropské verze. Zdarma 👇',
    headline: 'Co koupit místo VOO',
    description: '10 ETF z NYSE a jejich evropská dvojčata',
    cta: 'Zjistit více',
    landingPath: '/voo',
    utmContent: 'b_chat',
    messageMatch: [
      'Nadpis stránky odpovídá na otázku z chatu: „VOO si z Česka nekoupíte. Tohle ano.“',
      'Pod nadpisem je stejný přechod jako v konverzaci: VOO (nekoupíte) → VUAA (koupíte).',
      'Hlavní tlačítko „Ukázat evropská dvojčata“ vede na porovnání všech 10 fondů, které chat slibuje („tahák na všech 10“).',
      'Pod tlačítky je výčet toho, co návštěvník zdarma dostane.',
    ],
    hypothesis:
      'Silnější u začátečníků (25–32 let), kteří VOO znají ze sociálních sítí. Formát chatu by měl mít nejnižší cenu za kliknutí; konverze stránky může být nižší než u A, protože jde o zvědavost, ne o osobní číslo.',
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
