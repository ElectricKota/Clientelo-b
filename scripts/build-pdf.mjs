// Vygeneruje static/etf-tahak-2026.pdf ze stránky /tahak pomocí headless Chrome.
// Použití: spusťte `npm run dev` (nebo `npm run preview`) a pak `npm run pdf [url]`.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/tahak';
const out = new URL('../static/etf-tahak-2026.pdf', import.meta.url).pathname;
const chrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));

if (!chrome) throw new Error('Chrome nenalezen, nastavte CHROME_PATH.');

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=5000',
  `--print-to-pdf=${out}`,
  url,
], { stdio: 'inherit' });
console.log(`PDF uloženo: ${out}`);
