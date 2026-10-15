// Otázky a odpovědi (sekce FAQ i strukturovaná data FAQPage).
import { getFact } from '~/data/etfs';
import { appConfig } from '~/app.config';

export interface FaqItem {
  question: string;
  answer: string;
  sources?: string[];
}

const priips = getFact('priips-kid');
const w8ben = getFact('w8ben-withholding');
const irish = getFact('irish-ucits-15');
const timeTest = getFact('time-test-3y');
const valueTest = getFact('value-test-100k');
const cap = getFact('cap-40m-abolished');

export const faq: FaqItem[] = [
  {
    question: 'Proč si VOO nebo SPY u svého brokera nekoupím?',
    answer: priips.text_cs,
    sources: [priips.sourceUrl],
  },
  {
    question: 'Je evropská (UCITS) verze horší?',
    answer: 'Sleduje stejný index, jen je registrovaná v Irsku nebo Lucembursku a splňuje evropská pravidla. Poplatek bývá o pár setin procenta vyšší. Akumulační třída dividendy automaticky reinvestuje, takže je nemusíte danit ani znovu nakupovat.',
  },
  {
    question: 'Jak je to s daní z dividend?',
    answer: `${w8ben.text_cs} ${irish.text_cs}`,
    sources: [w8ben.sourceUrl, irish.sourceUrl],
  },
  {
    question: 'Platím daň, když ETF prodám?',
    answer: `${timeTest.text_cs} ${valueTest.text_cs} ${cap.text_cs}`,
    sources: [timeTest.sourceUrl, cap.sourceUrl],
  },
  {
    question: 'Co je TER a proč na něm záleží?',
    answer: 'TER je celková roční nákladovost fondu. Neplatíte ji fakturou, fond si ji průběžně strhává z majetku, takže ji ve výpisu nevidíte. Na dlouhém horizontu ale ukrojí znatelnou část výnosu, jak ukazuje kalkulačka výše.',
  },
  {
    question: 'Je tahák opravdu zdarma? Co bude s mým e-mailem?',
    answer: `Ano, zdarma. E-mail použijeme jen k zaslání taháku a čtvrtletní aktualizace dat. Neprodáváme ho dál a z odběru se odhlásíte jedním kliknutím v každém e-mailu.`,
  },
  {
    question: 'Je to investiční doporučení?',
    answer: `Ne. ${appConfig.brand} je informační přehled. Nehodnotí vaši finanční situaci a neříká, co koupit. Investování nese riziko ztráty a minulé výnosy nejsou zárukou budoucích.`,
  },
];

