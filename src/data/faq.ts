// Otázky a odpovědi (sekce FAQ i strukturovaná data FAQPage).
import { fact } from './etfs';
import { site } from '../site';

export interface FaqItem {
  q: string;
  a: string;
  sources?: string[];
}

const priips = fact('priips-kid');
const w8ben = fact('w8ben-withholding');
const irish = fact('irish-ucits-15');
const timeTest = fact('time-test-3y');
const valueTest = fact('value-test-100k');
const cap = fact('cap-40m-abolished');

export const faq: FaqItem[] = [
  {
    q: 'Proč si VOO nebo SPY u svého brokera nekoupím?',
    a: priips.text_cs,
    sources: [priips.sourceUrl],
  },
  {
    q: 'Je evropská (UCITS) verze horší?',
    a: 'Sleduje stejný index, jen je registrovaná v Irsku nebo Lucembursku a splňuje evropská pravidla. Poplatek bývá o pár setin procenta vyšší. Akumulační třída dividendy automaticky reinvestuje, takže je nemusíte danit ani znovu nakupovat.',
  },
  {
    q: 'Jak je to s daní z dividend?',
    a: `${w8ben.text_cs} ${irish.text_cs}`,
    sources: [w8ben.sourceUrl, irish.sourceUrl],
  },
  {
    q: 'Platím daň, když ETF prodám?',
    a: `${timeTest.text_cs} ${valueTest.text_cs} ${cap.text_cs}`,
    sources: [timeTest.sourceUrl, cap.sourceUrl],
  },
  {
    q: 'Co je TER a proč na něm záleží?',
    a: 'TER je celková roční nákladovost fondu. Neplatíte ji fakturou, fond si ji průběžně strhává z majetku, takže ji ve výpisu nevidíte. Na dlouhém horizontu ale ukrojí znatelnou část výnosu, jak ukazuje kalkulačka výše.',
  },
  {
    q: 'Je tahák opravdu zdarma? Co bude s mým e-mailem?',
    a: `Ano, zdarma. E-mail použijeme jen k zaslání taháku a čtvrtletní aktualizace dat. Neprodáváme ho dál a z odběru se odhlásíte jedním kliknutím v každém e-mailu.`,
  },
  {
    q: 'Je to investiční doporučení?',
    a: `Ne. ${site.brand} je informační přehled. Nehodnotí vaši finanční situaci a neříká, co koupit. Investování nese riziko ztráty a minulé výnosy nejsou zárukou budoucích.`,
  },
];

