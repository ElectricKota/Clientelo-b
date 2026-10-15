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

export const etfData = raw as unknown as { asOf: string; dataRetrieved: string; etfs: Etf[]; facts: Fact[]; notes: string[] };
export const etfs = etfData.etfs;

export const categories: { id: Category; label: string }[] = [
  { id: 'sp500', label: 'S&P 500' },
  { id: 'us-total', label: 'Celé USA' },
  { id: 'world', label: 'Celý svět' },
  { id: 'developed-ex-us', label: 'Vyspělé mimo USA' },
  { id: 'emerging', label: 'Rozvíjející se' },
  { id: 'dividend', label: 'Dividendy' },
  { id: 'gold', label: 'Zlato' },
];

/** Krátký název emitenta pro zobrazení (State Street, iShares, Vanguard, Schwab). */
export function shortIssuerName(issuer: string) {
  if (/state street/i.test(issuer)) return 'State Street';
  if (/ishares|blackrock/i.test(issuer)) return 'iShares';
  if (/vanguard/i.test(issuer)) return 'Vanguard';
  if (/schwab/i.test(issuer)) return 'Schwab';
  return issuer;
}

export const distributionPolicyLabel = (policy: Ucits['policy']) => ({ accumulating: 'akumulační', distributing: 'distribuční', none: 'bez výplat' })[policy];

export function getFact(id: string) {
  const found = etfData.facts.find((fact) => fact.id === id);
  if (!found) throw new Error(`Chybí fakt "${id}" v etfs.json`);
  return found;
}

/** Výchozí hodnoty kalkulačky (sdílí je hero, reklamy, PDF i kalkulačka). */
export const calculatorDefaults = { initial: 100_000, monthly: 3_000, years: 20, annualReturn: 7, customTer: 1.5 };
