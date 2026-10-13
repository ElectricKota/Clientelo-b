# Pokyny agentovi

Pokyny jsou v pořadí, v jakém jsem je zadával (zkráceně, ale věcně přesně). U každého je, co agent udělal.

## 1. Plán

> Připrav plán implementace zadání, stack Vite, styly Tailwind, šablony např. Astro, JS přes web components nebo Stimulus. Vite bude renderovat statické HTML do `public/`, které nahraju na hosting. Design moderní, stylový, vzdušný a hlavně důvěryhodný. Základní SEO, plná přístupnost (čtečka, klávesnice), optimalizace pro tablety a mobily, všechny moderní prvky pro PageSpeed (lazy load, co nejvíc v CSS, minimum JS). *(+ celé původní zadání B)*

**Výstup:** plán v 11 bodech. Obsahoval strategii (cílovka, lead magnet, kdy žádat o kontakt), dvě reklamy, pořadí sekcí, data a zdroje, stack, měření, design, přístupnost, SEO, výkon a otevřené otázky.

**Klíčový přínos:** agent sám upozornil, že **US ETF z NYSE si český drobný investor kvůli PRIIPs/KID většinou nekoupí**, a postavil na tom celou kampaň (UCITS „dvojčata“). Z rozhodnutí o stacku: agent doporučil Astro (pod kapotou Vite) a nativní web components místo Stimulu, protože interaktivní prvky jsou jen tři a Stimulus by přidal ~11 kB.

## 2. Realizace a nasazení

> Commituj postupně. Na vercel.com/new jsem přihlášený, můžeš rovnou nastavit a dělat deploy (Chrome extension mám). Postupně realizuj plán a ověřuj funkčnost lokálním dev serverem, poslední krok bude deploy na Vercel.

**Výstup:**
- Sběr dat delegoval na subagenta (viz [02-subagent-data.md](02-subagent-data.md)) a mezitím stavěl kostru.
- Stránka, PDF tahák (8 stran, generovaný z HTML přes headless Chrome), OG obrázek, měření a API pro leady.
- Ověření v prohlížeči, Lighthouse, nasazení přes GitHub a Vercel.
- Otevřené otázky z plánu agent nevyřešil sám a nepodstrčil za ně nic. Zvolil výchozí varianty a v README je označil jako „před spuštěním doplnit“.

## 3. Mikrointerakce

> Nikde není reveal efekt, focus-visible je základní a ošklivý, FAQ nemá transition, tlačítka nemají hover, filtr mění barvu bez transition a filtrování karet nemá view transition.

**Výstup:** reveal (nejdřív CSS scroll-driven), vlastní focus ring, animované `<details>` přes `::details-content`, hover stavy, View Transitions API pro filtr.

## 4. Stepper, reveal přes IntersectionObserver, reklamy

> Z number inputu udělej web komponentu s hezky nastylovaným spinnerem se šipkami. Reveal trigger napiš s IntersectionObserverem, ať se spustí, když prvek dojede do viewportu. A v zadání je ještě „navrhněte dvě verze reklamy, první obrazovka má navazovat na příslib reklamy“, zapracuj.

**Výstup:**
- `<number-stepper>` s přidržením a zrychlujícím opakováním.
- Reveal přes IntersectionObserver s odstupňováním.
- Vizuály obou reklam (feed 4:5 a stories 9:16) a přehled [`/reklamy`](https://clientelo-b.vercel.app/reklamy).
- Na mobilu kompaktní verze vizuálu z reklamy přímo pod nadpisem.

## 5. Kontrola podle checklistu

> *(vložený checklist: plán, data se zdrojem, PRIIPs, mobile-first, měření, reklamy + README, Vercel + telefon, README o práci s AI, `ai-log/`)* Zkontroluj, zda máme vše.

**Výstup:** agent našel tři skutečné mezery:
- Formulář lead **neukládal** (bez Ecomailu jen log).
- Chyběl `ai-log/`.
- Odhad konverze v README neměl ověřený zdroj.

Opravy: privátní Vercel Blob (po mém souhlasu), tahle složka a ověřený benchmark Unbounce 2024 s přepočtem odhadu.

## 6. Reklamy podruhé

> Ty reklamy jsou o ničem a vůbec nezaujmou. Doporuč nějaký skill na generování reklamy a předělej to podle něj.

**Výstup:** agent nejdřív prohledal katalog skillů a pluginů a doporučil tři:
- „Social Media Skills“ (`hook-writer`, `lead-magnets-and-funnels`, `story-writer`),
- „Marketing“ od Anthropicu,
- „Hyper Marketing“ (`ad-creative-generation`, vyžaduje účet u služby Hyper).

Pluginy se instalují mimo session, takže je nemohl hned spustit. Uvedl to otevřeně a reklamy předělal podle principů, na kterých tyto skilly stojí.

Diagnóza původních reklam podle agenta:
- vypadaly jako výřez z webu, ne jako příspěvek ve feedu,
- nejsilnější číslo bylo schované ve čtvrtém řádku,
- nadpis byl konstatování bez napětí a chyběla emoce.

Nové koncepty: **A „Účtenka“** (hook „331 205 Kč za 20 let. A ani o tom nevíte.“) a **B „Chat“** (nativní konverzace „Proč mi broker nenajde VOO?“). Hero varianty A agent přepsal tak, aby opakovala hook i účtenku z reklamy.
