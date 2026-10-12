import raw from './etfs.json';

export type Category = 'sp500' | 'us-total' | 'world' | 'developed-ex-us' | 'emerging' | 'dividend' | 'gold';

export interface Ucits {
  /** Všechny tickery napříč burzami, např. „CSPX (LSE, USD) / SXR8 (Xetra, EUR)“. */
  ticker: string;
  /** Hlavní ticker pro krátké zobrazení. */
  primary: string;
  exchange: string;
  isin: string;
  name: string;
  ter: number;
  policy: 'accumulating' | 'distributing' | 'none';
  domicile: string;
  sizeEur: number | null;
  url: string;
  exactMatch: boolean;
  note: string;
}

export interface Etf {
  ticker: string;
  name: string;
  issuer: string;
  exchange: string;
  index: string;
  inception: string;
  ter: number;
  aumUsd: number | null;
  aumAsOf: string | null;
  returns: { y1: number | null; y5: number | null; y10: number | null; asOf: string; basis: string };
  yield: { value: number | null; type: string; estimate: boolean };
  formerTicker?: string | null;
  distribution: string;
  domicile: string;
  category: Category;
  sourceUrl: string;
  ucits: Ucits[];
}

export interface Fact {
  id: string;
  text_cs: string;
  sourceUrl: string;
}

export const data = raw as unknown as { asOf: string; dataRetrieved: string; etfs: Etf[]; facts: Fact[]; notes: string[] };
export const etfs = data.etfs;

export const categories: { id: Category; label: string }[] = [
  { id: 'sp500', label: 'S&P 500' },
  { id: 'us-total', label: 'Celé USA' },
  { id: 'world', label: 'Celý svět' },
  { id: 'developed-ex-us', label: 'Vyspělé mimo USA' },
  { id: 'emerging', label: 'Rozvíjející se' },
  { id: 'dividend', label: 'Dividendy' },
  { id: 'gold', label: 'Zlato' },
];

const czNumber = (digits = 2) => new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmt = {
  pct: (value: number | null, digits = 2) => (value === null ? '–' : `${czNumber(digits).format(value)} %`),
  ter: (value: number) => `${new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value)} %`,
  czk: (value: number) => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(value))} Kč`,
  usdBn: (value: number | null) =>
    value === null ? '–' : `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: value >= 1e11 ? 0 : 1 }).format(value / 1e9)} mld. USD`,
  date: (iso: string) => new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(iso)),
};

export const policyLabel = (p: Ucits['policy']) => ({ accumulating: 'akumulační', distributing: 'distribuční', none: 'bez výplat' })[p];

export function fact(id: string) {
  const found = data.facts.find((f) => f.id === id);
  if (!found) throw new Error(`Chybí fakt "${id}" v etfs.json`);
  return found;
}

export { futureValue, feeCost } from '../scripts/finance';

export const calcDefaults = { initial: 100_000, monthly: 3_000, years: 20, annualReturn: 7, customTer: 1.5 };
