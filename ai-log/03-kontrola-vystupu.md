# Kontrola výstupu

Agentovi jsem nevěřil „na slovo“. U každé větší změny se ověřovalo chování, ne jen to, že kód jde zkompilovat.

## Automatické kontroly

| Kontrola | Nástroj | Výsledek |
|---|---|---|
| Typy a šablony | `npx astro check` | 0 chyb, 0 varování po každém kroku |
| Výkon, přístupnost, SEO | Lighthouse 12 (mobil), lokální build i produkce | produkce: výkon 95–99, přístupnost 100, best practices 100, SEO 100 |
| Produkční smoke test | `curl` na všechny stránky, PDF, sitemap, robots, hlavičky, Brotli | vše 200, `content-encoding: br`, bezpečnostní hlavičky |
| API pro leady | `curl` POST: neplatný e-mail → 422, platný → 200, bez JS → 303 redirect | odpovídá |
| Přetečení PDF | JS v prohlížeči měřil `scrollHeight` každé A4 stránky | našel přetečení na str. 3–4, opraveno |

## Ruční kontroly v prohlížeči (agent ovládal vestavěný prohlížeč)

- **Celá cesta leadu** na mobilním viewportu: příchod s UTM, kalkulačka (posuvník ovládaný šipkami z klávesnice), formulář s překlepem `gmail.con` (nabídl opravu), platný e-mail, `/dekujeme`. Kontrola `dataLayer` (`lp_view → section_view → calc_interact → calc_result → generate_lead`) a záznamu leadu na serveru včetně UTM a výpočtu.
- **Filtr fondů:** klik i šipky na klávesnici, počet oznámený čtečce (`aria-live`), událost `filter_change`.
- **Animace:** měření výšky `<details>` v čase (otevírání i zavírání), stav opacity u reveal prvků, průběh View Transition.
- **Stepper:** klik, přidržení (24 kroků za 1,5 s se zrychlením), zastavení po puštění, vypnutí šipky na minimu.
- **Focus ring a hover:** výřez obrazovky po navigaci klávesnicí.
- **Vizuály reklam a náhledy stránky:** agent si vygenerované PNG prohlédl a opravil ořezy a přetečení.

## Co zůstává na člověku

- **Test na skutečném telefonu** (iOS Safari, Android Chrome) a čtečce VoiceOver. Agent testoval jen emulovaný mobilní viewport.
- **Právní kontrola textů** (marketingové sdělení o investicích) a doplnění provozovatele.
