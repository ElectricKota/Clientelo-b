// Vygeneruje OG obrázek (static/og.png), ikony (apple-touch-icon.png, favicon.ico),
// vizuály reklam a náhledy první obrazovky stránky (src/assets/reklamy/) pomocí headless Chrome.
// Použití: běžící `npm run dev`, pak `npm run og`.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321';
const root = new URL('../static/', import.meta.url).pathname;
const chrome = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome']
  .find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome nenalezen, nastavte CHROME_PATH.');

const shot = (url, out, w, h, scale = 1) =>
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion', `--force-device-scale-factor=${scale}`,
    '--virtual-time-budget=5000', `--window-size=${w},${h}`, `--screenshot=${out}`, url], { stdio: 'ignore' });

shot(`${base}/og`, join(root, 'og.png'), 1200, 630);

// Reklamní vizuály (rozměry pro Meta: feed 4:5, stories 9:16) a první obrazovka obou variant na mobilu.
const ads = new URL('../src/assets/reklamy/', import.meta.url).pathname;
mkdirSync(ads, { recursive: true });
for (const v of ['a', 'b']) {
  shot(`${base}/reklama/${v}-feed`, join(ads, `${v}-feed.png`), 1080, 1350);
  shot(`${base}/reklama/${v}-story`, join(ads, `${v}-story.png`), 1080, 1920);
}
// Headless Chrome nejde zúžit pod ~500 px, mobil proto simulujeme iframem 390 px uprostřed okna
// a výsledek ořízneme (sips ořezává od středu).
const frameTmp = mkdtempSync(join(tmpdir(), 'lp-'));
for (const [name, path] of [['lp-a', '/'], ['lp-b', '/voo']]) {
  const html = join(frameTmp, `${name}.html`);
  writeFileSync(html, `<html><body style="margin:0"><iframe src="${base}${path}" style="border:0;width:390px;height:844px;display:block;margin-left:105px"></iframe></body></html>`);
  const out = join(ads, `${name}.png`);
  shot(`file://${html}`, out, 600, 844, 2);
  execFileSync('sips', ['-c', '1688', '780', out], { stdio: 'ignore' });
}

const tmp = mkdtempSync(join(tmpdir(), 'icons-'));
const svg = readFileSync(join(root, 'favicon.svg'), 'utf8');
for (const size of [180, 32]) {
  const html = join(tmp, `icon-${size}.html`);
  writeFileSync(html, `<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  shot(`file://${html}`, join(tmp, `icon-${size}.png`), size, size);
}
writeFileSync(join(root, 'apple-touch-icon.png'), readFileSync(join(tmp, 'icon-180.png')));

// ICO s jedním PNG obrázkem 32×32 (podporují všechny současné prohlížeče).
const png = readFileSync(join(tmp, 'icon-32.png'));
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(join(root, 'favicon.ico'), Buffer.concat([header, png]));
console.log('OG obrázek, ikony a vizuály reklam uloženy (static/, src/assets/reklamy/)');
