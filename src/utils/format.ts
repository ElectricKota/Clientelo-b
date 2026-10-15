// Formátování čísel a dat pro české prostředí (sdílené šablonami i klientskými skripty).

const czechNumber = (digits = 2) => new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const format = {
  percent: (value: number | null, digits = 2) => (value === null ? '–' : `${czechNumber(digits).format(value)} %`),
  ter: (value: number) => `${new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value)} %`,
  czk: (value: number) => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(value))} Kč`,
  usdBillions: (value: number | null) =>
    value === null ? '–' : `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: value >= 1e11 ? 0 : 1 }).format(value / 1e9)} mld. USD`,
  date: (iso: string) => new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(iso)),
  /** Délka v letech se správným tvarem: 1 rok, 2–4 roky, 5+ let. */
  years: (count: number) => `${count} ${count === 1 ? 'rok' : count < 5 ? 'roky' : 'let'}`,
};
