# ETF tahák: konverzní landing page

Landing page s porovnáním ETF obchodovaných na NYSE pro české drobné investory. Funguje jako lead magnet: návštěvník získá kalkulačku poplatků, porovnání fondů a výměnou za e-mail PDF tahák „ETF tahák 2026“.

- **Produkce:** https://clientelo-b.vercel.app (varianta A), https://clientelo-b.vercel.app/voo (varianta B)
- **Stack:** Astro 7 (statický výstup, pod kapotou Vite), Tailwind CSS 4, nativní Web Components (bez frameworku), Vercel Function pro příjem leadů

---

## 1. Strategie

### Cílová skupina

Češi a Češky ve věku **25–40 let** s nadprůměrným příjmem, kteří **0–2 roky investují nebo se k tomu chystají**. O ETF slyšeli z podcastů, YouTube a sociálních sítí, kde zaznívají americké tickery (VOO, SPY, VT, SCHD). Mají účet u XTB, Trading 212, Degiro nebo ho právě zakládají.

Přicházejí z reklamy na **mobilu** a stránce dávají pár sekund. Jsou nedůvěřiví, protože finance jsou plné podvodů a „zaručených tipů“.

**Klíčový vhled:** český drobný investor si americké ETF z NYSE kvůli regulaci PRIIPs většinou **nekoupí**. Broker mu je nenabídne, protože nemají evropský dokument KID. Kupuje jejich evropská (UCITS) dvojčata. Většina obsahu na sociálních sítích to nezmiňuje, takže návštěvník pak v aplikaci brokera VOO nenajde. Na tomto napětí stojí celá kampaň.

### Co návštěvník dostane za kontakt

**ETF tahák 2026** (PDF, 8 stran):
1. Převodník NYSE → Evropa: 10 ETF z NYSE a jejich UCITS obdoby (ticker, burza, ISIN, TER, akumulační/distribuční).
2. Jak fond najít u XTB, Trading 212, Degiro, IBKR a Fio (hledání podle ISIN, burza, měna).
3. Daně na jedné straně: časový test, limit 100 000 Kč, W-8BEN, akumulace vs. distribuce.
4. 5 drahých chyb začátečníků.

Navíc **osobní výpočet z kalkulačky** do e-mailu a **čtvrtletní aktualizace dat** (důvod zůstat v seznamu).

**Hodnota je zřejmá před vyplněním formuláře.** Kalkulačka i porovnání včetně názvů evropských obdob jsou veřejné. Pod e-mailem je „akční vrstva“: ISINy, postup u brokera, daně a výpočet do e-mailu.

### Kdy žádáme o kontakt

| Moment | Proč |
|---|---|
| **Po výsledku kalkulačky** (inline formulář přímo pod čísly) | Nejsilnější moment: návštěvník právě viděl své osobní číslo. |
| U každé karty ETF: „Jak ho najít u brokera a jak se daní“ | Navazuje na konkrétní zájem o fond. |
| Hlavní sekce nabídky s náhledem taháku | Pro ty, kdo dočetli a chtějí vše najednou. |
| Sticky lišta na mobilu (po opuštění hero, schová se u formuláře) | Na mobilu je CTA vždy na dosah, ale neruší. |

Žádný pop-up při vstupu. Návštěvník z reklamy by ho zavřel dřív, než pochopí, co nabízíme.

### Formulář

**Jediné pole: e-mail.** Chybové hlášky jsou v češtině a srozumitelné, aplikace hlídá i překlepy v doméně (`gmail.cz` → `gmail.com`, `seznam.com` → `seznam.cz`). Antispam bez CAPTCHA: skryté pole (honeypot) a časová past. Skrytá pole přenášejí UTM parametry, variantu stránky, umístění formuláře a hodnoty z kalkulačky.

### Co přijde po odeslání

1. **Okamžitě** stránka `/dekujeme` se stažením PDF. Návštěvník nečeká na e-mail, takže hodnotu dostane hned. Je tu i shrnutí jeho výpočtu, 3 další kroky a sdílení (WhatsApp, Facebook, nativní sdílení).
2. **Do minuty** e-mail (double opt-in přes Ecomail) s odkazem na tahák a výpočtem.
3. **Navazující sekvence** (doporučení): +2 dny daně, +5 dní chyby začátečníků, +9 dní výběr brokera. Pak čtvrtletní aktualizace.

---

## 2. Dvě verze reklamy (Meta / Instagram, 4:5 a 9:16)

### Reklama A: „Poplatky“ (racionální úhel) → `/`

- **Vizuál:** tři sloupce SPY / IVV / VOO se stejným grafem indexu, pod nimi velké číslo rozdílu v poplatcích za 20 let.
- **Primární text:** „SPY, IVV i VOO kopírují úplně stejný index. Přesto vás jeden z nich za 20 let stojí na poplatcích víc. Spočítejte si za 30 vteřin, kolik to dělá u vás, a co z nich si z Česka vůbec koupíte.“
- **Nadpis:** Stejný index, jiný poplatek
- **CTA:** Zjistit více
- **Navázání:** hero „SPY, IVV, nebo VOO? Stejný index, jiný poplatek.“ a hned pod tím kalkulačka.

### Reklama B: „VOO paradox“ (zvědavost) → `/voo`

- **Vizuál:** screenshot vyhledávání „VOO“ v aplikaci brokera s výsledkem „nenalezeno“ a šipka na „VUAA“.
- **Primární text:** „VOO doporučuje skoro každý americký youtuber. Jenže z Česka si ho jako drobný investor nekoupíte. Ukážeme vám, co koupit místo něj, a dalších 9 populárních ETF z NYSE s jejich evropskými dvojčaty.“
- **Nadpis:** VOO si z Česka nekoupíte. Tohle ano.
- **CTA:** Zjistit více
- **Navázání:** hero s přesně tímto nadpisem, vizuál VOO → VUAA a jako první sekce porovnání fondů.

Obě varianty jsou samostatně vygenerované statické stránky, takže nevzniká žádné přepisování obsahu JavaScriptem ani CLS. `/voo` má `noindex` a není v sitemapě, aby nekonkurovala úvodní stránce ve vyhledávání.

---

## 3. Pořadí sekcí a proč

1. **Hero:** doslova navazuje na slib reklamy a hned ukazuje konkrétní čísla (poplatky SPY vs. VOO vs. UCITS vs. dražší fond). Obsahuje 2 CTA: interakce (kalkulačka/porovnání), nebo rovnou tahák.
2. **Pruh důvěry:** emitenti jako zdroje dat a datum aktualizace. Nedůvěřivý návštěvník potřebuje signál „tohle není clickbait“ dřív, než do stránky investuje čas.
3. **Kalkulačka** (A) / **Porovnání** (B): „aha moment“ hned po hero. U A je to osobní číslo, u B odpověď na otázku z reklamy. Inline formulář je přímo pod výsledkem kalkulačky.
4. **Porovnání** (A) / **Kalkulačka** (B): druhý interaktivní prvek pro ty, kdo chtějí víc. Každá karta vede k formuláři.
5. **Nabídka taháku a hlavní formulář:** až ve chvíli, kdy návštěvník viděl dost hodnoty. Obsahuje i náhled PDF a „co se stane po odeslání“ (snižuje obavy).
6. **Metodika:** pro skeptiky, kteří se rozhodují pomaleji. Odpovídá na otázku „proč tomu věřit“.
7. **FAQ:** řeší námitky (spam, daně, je to doporučení?) a zároveň dává data pro FAQPage.
8. **Patička:** rizikové upozornění, zdroje a provozovatel.

---

## 4. Očekávaná konverze

Studený placený provoz z Meta na mobilu, lead magnet zdarma z oblasti financí.

| Krok funnelu | Odhad |
|---|---|
| Návštěva → scroll za hero (`section_view: trust`) | 55–65 % |
| → interakce s kalkulačkou nebo filtrem (`calc_interact`, `filter_change`) | 25–35 % |
| → začátek vyplňování (`form_start`) | 12–18 % |
| → **odeslání formuláře (`generate_lead`)** | **8–12 %**, plánovací hodnota **9 %** |
| → potvrzení double opt-in | 70–80 % leadů |

Zdůvodnění: medián konverze landing pages napříč obory je podle Unbounce Conversion Benchmark Report kolem 6–7 % a lead magnety zdarma s jedním polem mají výrazně vyšší konverzi než formuláře s více poli. Finance mají kvůli nedůvěře konverzi spíš nižší, mobilní provoz z reklamy také. Interaktivní prvek a jediné pole to kompenzují. Po prvních ~500 návštěvách se odhad nahradí skutečnými daty z funnelu.

---

## 5. Hypotézy pro A/B test (seřazené podle očekávaného dopadu)

1. **E-mail přímo v hero vs. až po kalkulačce.** Dřívější nabídka zachytí netrpělivé návštěvníky (velká část odchází do 10 s). *Hypotéza:* +15–25 % leadů, ale nižší kvalita. Proto se měří i potvrzení double opt-in a open rate prvního e-mailu.
2. **Rámování nabídky: „PDF tahák“ vs. „Osobní výpočet a seznam ETF pro vás“.** Personalizace zvyšuje vnímanou hodnotu. *Hypotéza:* +10–20 % konverze formuláře.
3. **Tvář a jméno autora + počet stažení vs. anonymní značka.** Sociální důkaz a lidský autor snižují nedůvěru. *Hypotéza:* +5–10 % konverze, větší efekt u varianty B.

Technicky jde o další statickou variantu stránky (`data-variant`). Rozdělení provozu řeší reklamní systém (různé URL) nebo Vercel Edge Config. Varianta se ukládá do každé události i do leadu.

---

## 6. Data a zdroje

Data jsou v [`src/data/etfs.json`](src/data/etfs.json). Ke každému fondu je uvedený zdroj (`sourceUrl`) a datum (`asOf`), na stránce jsou zdroje vidět u karet i v patičce.

| Co | Zdroj |
|---|---|
| SPY, SPYM (dříve SPLG), GLD | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs) (State Street) |
| IVV | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) |
| VOO, VTI, VT, VEA, VWO | [investor.vanguard.com](https://investor.vanguard.com/investment-products/etfs/profile/voo) |
| SCHD | [schwabassetmanagement.com](https://www.schwabassetmanagement.com/products/schd) |
| UCITS alternativy (TER, ISIN, velikost, třída) | [justETF](https://www.justetf.com/cz/) |
| PRIIPs / KID | [justETF: US-domiciled ETFs](https://www.justetf.com/en/news/etf/us-domiciled-etfs.html), nařízení EU 1286/2014 |
| W-8BEN, srážková daň 15 % | [finex.cz](https://finex.cz/w-8ben-formular/), IRS |
| Irské fondy a srážka 15 % | [justETF Academy](https://www.justetf.com/en/academy/synthetic-etfs-in-us-dominated-markets.html) |
| Časový test 3 roky, limit 100 000 Kč | [zákon č. 586/1992 Sb., § 4 odst. 1 písm. t) a u)](https://www.zakonyprolidi.cz/cs/1992-586) |
| Zrušení stropu 40 mil. Kč od 2026 | [Finanční správa, Daňové novinky 2026](https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2026/danove-novinky-pro-rok-2026) |

- **Stav dat:** výnosy (NAV, průměrné roční celkové) k **30. 9. 2026**, TER podle prospektu, AUM k 30. 9.–9. 10. 2026, data stažena 12. 10. 2026.
- Všech 10 ETF má primární kotaci na **NYSE Arca**. QQQ (Nasdaq) jsme proto vyřadili.
- Vanguard u VT, VEA a VWO neuvádí SEC yield. Dividendový výnos je u nich náš odhad z vyplacených dividend za 12 měsíců, na stránce označený „≈“.
- Přesná UCITS obdoba neexistuje pro VTI, SCHD a GLD (zlato v UCITS držet nejde, jde o ETC). VT, VEA a VWO mají jen blízké obdoby. Na stránce i v PDF je to u fondu uvedené.
- Dostupnost jednotlivých fondů u konkrétních brokerů jsme neověřovali, proto ji stránka netvrdí a radí hledat podle ISIN.
- Kompletní poznámky ke sběru dat jsou v poli `notes` v `etfs.json`.

**Aktualizace:** jednou za čtvrtletí upravit `etfs.json` (TER, AUM, výnosy, `asOf`), spustit build a nasadit.

---

## 7. Měření celé cesty

Všechny události jdou přes [`src/scripts/track.ts`](src/scripts/track.ts) do `dataLayer`/GA4 (a `Lead` do Meta Pixelu). Každá nese `variant`. V dev režimu nebo s `?debug` se vypisují do konzole.

| Událost | Kdy | Parametry |
|---|---|---|
| `lp_view` | načtení stránky | `path`, UTM, `fbclid`/`gclid` |
| `section_view` | sekce dorazí do středu obrazovky | `section` (hero, trust, calculator, compare, offer, method, faq) |
| `scroll_depth` | 25 / 50 / 75 / 100 % | `percent` |
| `cta_click` | jakékoli CTA | `placement` (hero, header, card, sticky), `label` |
| `calc_interact` | první změna v kalkulačce | `field` |
| `calc_result` | výsledek po ustálení | `amount`, `monthly`, `years`, `diff` |
| `filter_change` | filtr porovnání | `category` |
| `form_view` | formulář na obrazovce | `placement` (calculator, offer) |
| `form_start` | fokus do pole | `placement` |
| `form_error` | chyba validace | `placement`, `reason` |
| `form_submit` | úspěšné odeslání | `placement` |
| `generate_lead` | děkovná stránka po odeslání (1×) | `placement` (+ Meta `Lead`) |
| `pdf_download` | stažení PDF | |
| `share`, `consent` | sdílení, volba cookies | |

**Funnel v GA4 (Explore → Funnel exploration):** `lp_view` → `section_view (calculator|compare)` → `calc_interact | filter_change` → `form_start` → `form_submit` → `generate_lead`, rozpad podle `variant` a `placement`.

**Server-side záloha:** každý lead se v `api/lead` zapíše s UTM a variantou (do Ecomailu, případně do logu funkce). Konverze se tak dá spárovat i bez souhlasu s cookies.

**Cookies:** Google Consent Mode v2. Do souhlasu GA běží bez cookies, Meta Pixel se načte až po souhlasu. Lišta se souhlasem se zobrazí jen tehdy, když je nastavené `PUBLIC_GA_ID` nebo `PUBLIC_META_PIXEL_ID`.

---

## 8. Technické řešení

### Výsledky Lighthouse (mobil, lokální build bez komprese)

Produkce (https://clientelo-b.vercel.app, Lighthouse 12, mobil): **Výkon 99 · Přístupnost 100 · Best practices 100 · SEO 100**. FCP 1,5 s, LCP 1,7 s, CLS 0, TBT 0 ms, celkem 171 kB (HTML 22 kB s Brotli).

### Výkon
- Statické HTML, CSS vložené přímo do stránky (~15 kB), JS jen pro kalkulačku, formulář a měření.
- Filtr porovnání je čisté CSS (`:has()`), FAQ přes `<details>`, plynulý scroll přes CSS.
- Fonty (Newsreader, Geist) jsou self-hosted přes Astro Fonts API s preloadem latin subsetu a metrickým fallbackem proti CLS.
- Hashovaná aktiva s `immutable` cache, serif ve statických řezech (~23 kB) a bez preloadu, aby neblokoval první vykreslení.
- Žádné obrázky v hero; vizuály jsou HTML/CSS a inline SVG.

### Animace a mikrointerakce (bez knihoven, převážně čisté CSS)
- **Reveal při scrollu:** CSS scroll-driven animace (`animation-timeline: view()`) s odstupňováním přes `--i`. Prohlížeče bez podpory zobrazí obsah rovnou. Nadpis v hero se neanimuje, aby se neoddálil LCP.
- **Filtrování fondů:** filtr je čisté CSS (`:has()`), změnu zabaluje View Transitions API (`view-transition-class: etf-card`). Karty plynule odjedou, přijedou a přeskupí se.
- **FAQ:** plynulé otevírání i zavírání `<details>` přes `::details-content` a `interpolate-size: allow-keywords`.
- **Tlačítka:** primární se zvedne a přejede přes něj lesk, sekundární se zespodu vyplní, šipky popojedou, při stisku se tlačítko zmáčkne. Hover je jen na zařízeních s myší (`@media (hover: hover)`).
- **Volby (chips):** plynulý přechod barvy, stínu a pozice při hoveru i výběru.
- **Focus ring:** značková barva, kopíruje zaoblení prvku a nabíhá krátkou animací. V tmavých sekcích (`.on-dark`) se přepne na světlou variantu.
- Vše respektuje `prefers-reduced-motion`.

### Přístupnost (WCAG 2.2 AA)
- Odkaz pro přeskočení na obsah, landmarky, jedna `h1`, logická hierarchie nadpisů.
- Vše ovladatelné klávesnicí, výrazný `:focus-visible`, cíle alespoň 44 × 44 px.
- Formulář: viditelný `label`, `autocomplete="email"`, chyby přes `aria-invalid` a `aria-describedby`, fokus na chybu.
- Kalkulačka: `aria-valuetext` v korunách, výsledek se čtečce oznámí až po ustálení (ne při každém kroku posuvníku).
- Respektuje `prefers-reduced-motion`, kontrast textu ≥ 4,5 : 1.

### SEO
`title`/`description`, canonical, Open Graph, JSON-LD (`WebPage`, `Dataset`, `FAQPage`), sitemap, `robots.txt`, `noindex` na děkovné stránce.

### Struktura

```
api/                 Vercel Function pro leady (+ sdílená logika pro dev server)
scripts/             Astro integrace: /api/lead v lokálním dev serveru
src/components/      sekce stránky (Hero, FeeCalculator, EtfCompare, LeadForm…)
src/data/            etfs.json (data + zdroje), faq.ts
src/scripts/         track.ts (měření), finance.ts (výpočty)
src/pages/           / (A), /voo (B), /dekujeme, /ochrana-udaju, /tahak (zdroj PDF)
static/              favicony, OG obrázek, PDF tahák (Astro publicDir)
public/              ← hotový build (Astro outDir), dá se nahrát na libovolný hosting
```

---

## 9. Spuštění

```bash
npm install
npm run dev        # http://localhost:4321, formulář funguje i lokálně
npm run build      # výstup do ./public
npm run preview
npm run pdf        # (při běžícím dev serveru) vygeneruje static/etf-tahak-2026.pdf ze stránky /tahak
npm run og         # (při běžícím dev serveru) vygeneruje og.png, apple-touch-icon.png, favicon.ico
```

### Proměnné prostředí (Vercel → Settings → Environment Variables)

| Proměnná | Účel |
|---|---|
| `ECOMAIL_API_KEY`, `ECOMAIL_LIST_ID` | zápis leadu do Ecomailu (double opt-in, autoresponder s PDF) |
| `LEAD_WEBHOOK_URL` | volitelně: kopie leadu do Make/Zapier/Google Sheets |
| `PUBLIC_GA_ID` | GA4 Measurement ID (`G-…`) |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `SITE_URL` | produkční URL (canonical, sitemap, OG) |

Bez `ECOMAIL_*` i `LEAD_WEBHOOK_URL` se leady zapisují jen do logu funkce (Vercel → Logs), aby se žádný neztratil.

---

## 10. Před spuštěním reklamy (checklist)

- [ ] Doplnit provozovatele (správce údajů) v `src/site.ts` a e-mail.
- [ ] Nastavit `ECOMAIL_*` (nebo webhook) a autoresponder s PDF a výpočtem.
- [ ] Nastavit `PUBLIC_GA_ID` a `PUBLIC_META_PIXEL_ID`, ověřit události v GA4 DebugView a Meta Events Manager.
- [ ] Vlastní doména (`SITE_URL`) a ověření domény v Meta Business.
- [ ] Právní kontrola textů (marketingové sdělení o investicích).
