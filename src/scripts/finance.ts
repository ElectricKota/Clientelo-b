// Čistá matematika kalkulačky, sdílená mezi buildem (výchozí výsledek v HTML) a prohlížečem.

/**
 * Budoucí hodnota pravidelného investování s měsíčním úročením.
 * Poplatek (TER) se odečítá z ročního výnosu, stejně jako ho fond strhává z majetku.
 */
export function futureValue(opts: { initial: number; monthly: number; years: number; annualReturn: number; ter: number }) {
  const net = (opts.annualReturn - opts.ter) / 100;
  const m = Math.pow(1 + net, 1 / 12) - 1;
  const n = Math.round(opts.years * 12);
  if (Math.abs(m) < 1e-12) return opts.initial + opts.monthly * n;
  const growth = Math.pow(1 + m, n);
  return opts.initial * growth + opts.monthly * ((growth - 1) / m);
}

/** Kolik vás poplatky stojí oproti hypotetickému fondu bez poplatků. */
export function feeCost(opts: { initial: number; monthly: number; years: number; annualReturn: number; ter: number }) {
  return futureValue({ ...opts, ter: 0 }) - futureValue(opts);
}
