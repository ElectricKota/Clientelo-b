# Kde se agent pletl

Konkrétní případy, kdy výstup agenta nebyl správně. U každého je, jak se chyba projevila, kdo ji našel a čím se opravila.

| # | Chyba | Jak se na ni přišlo | Oprava |
|---|---|---|---|
| 1 | **Neověřené tvrzení v textech:** „VUAA koupíte u českých i evropských brokerů“ a „chyby, které jsme viděli nejčastěji“. Dostupnost u brokerů nikdo neověřil a „viděli jsme“ je vymyšlená zkušenost. | Agent při revizi textů porovnal tvrzení s tím, co subagent skutečně ověřil | Přepsáno na ověřitelné formulace (`c5b65e8`) |
| 2 | **Měření sekcí nefungovalo:** IntersectionObserver s prahem 0,4. Sekce vyšší než obrazovka (kalkulačka na mobilu) 40 % viditelnosti nikdy nedosáhne, takže `section_view` se neodeslal. | Kontrola `dataLayer` v prohlížeči po scrollu | Měření přes středový pás obrazovky (`rootMargin`) (`e922860`) |
| 3 | **Těžký font:** variabilní Newsreader s osou `opsz` měl 132 kB a byl v preloadu, což zhoršilo FCP na mobilu. | Lighthouse: FCP 2,6 s, výkon 92 | Statické řezy (~23 kB), bez preloadu → výkon 98 (`571edb0`) |
| 4 | **Falešné chyby kontrastu:** `content-visibility: auto` zmátlo axe (počítal barvu pozadí z jiné sekce). | Lighthouse přístupnost 93 s nesmyslnými páry barev | Odstraněno `content-visibility` → přístupnost 100 (`571edb0`) |
| 5 | **Rozbité CSS po hromadném nahrazení:** příkaz `sed`, který odstraňoval třídu `defer-render `, smazal i název selektoru v `global.css` a nechal `.{`. | Agent si to všiml až o krok později při čtení souboru | Neplatný blok smazán (`fc0a8d2`) |
| 6 | **Špatné canonical URL:** build ve formátu `file` dával `/index.html` a `/voo.html`, Vercel přitom servíruje čisté URL. | Kontrola vygenerovaného HTML po buildu | Normalizace cesty v layoutu (`85ad21d`) |
| 7 | **Riziko quirks mode:** HTML komentář před `<Base>` by se vyrenderoval před `<!doctype>`. | Agent si všiml při kontrole výstupu buildu (`head -c` souboru) | Komentář přesunut do frontmatteru (`85ad21d`) |
| 8 | **Kanonický odkaz varianty B na homepage** Lighthouse hlásil jako chybu (SEO 92). | Lighthouse na produkci | `/voo` má vlastní canonical a `noindex` (`85ad21d`) |
| 9 | **Přetečení PDF:** převodník NYSE → Evropa se nevešel na A4 (strany 3–4). | Měření `scrollHeight` každé strany v prohlížeči | Kompaktnější tabulky (`571edb0`) |
| 10 | **Mylný závěr z testu:** měření animace FAQ ukázalo, že „zavírání neanimuje“. Ve skutečnosti byl panel prohlížeče skrytý (`visibilityState: hidden`) a animace stály. | Agent ověřil `document.visibilityState` a `getAnimations()` | Test zopakován na viditelné záložce, animace fungovala |
| 11 | **Špatný postup na Vercelu:** agent nejdřív použil „clone“ flow, který by vytvořil **kopii** repozitáře, a pak instaloval GitHub App mimo Vercel flow. | Agent si všiml textu „Create a Git repository…“ a chybové hlášky | Přepnuto na import existujícího repozitáře, instalace jen pro `Clientelo-b` |
| 12 | **Snímky mobilu nebyly mobilní:** headless Chrome nejde zúžit pod ~500 px, takže náhled první obrazovky byl oříznutý. Pak v iframu chyběly prvky s úvodní animací. | Agent si vygenerované PNG prohlédl | Iframe 390 px + ořez a vypnutí animací přes `--force-prefers-reduced-motion` (`f9c40a5`) |
| 13 | **Formulář reálně neukládal leady:** bez Ecomailu skončily jen v logu funkce. README přitom popisovalo double opt-in, jako by fungoval. | Kontrola podle mého checklistu („formulář uloží lead“) | Privátní Vercel Blob + export do CSV, README upraveno na skutečný stav |
| 14 | **Odhad konverze bez zdroje:** README uvádělo „Unbounce kolem 6–7 %“ bez odkazu a odhad 8–12 % byl spíš optimistický. | Kontrola podle checklistu, dohledání reportu | Odkaz na Unbounce CBR 2024 (medián 6,6 %, mobil ~8 % horší) a přepočítaný odhad |
| 15 | **Reklamy bez hooku:** první verze reklam byly zmenšené výřezy z webu (graf, karta fondu, logo nahoře). Technicky v pořádku, ale nic, co by zastavilo scroll. | Moje hodnocení („reklamy jsou o ničem“). Agent to sám nepoznal, protože kontroloval rozměry a texty, ne účinek. | Nové koncepty Účtenka a Chat a hero A přepsané na hook reklamy |
| 16 | **Výkonnostní regrese po nových reklamách:** účtenka v hero na mobilu měla úvodní animaci (skrytá ~1 s) a kreslení kroužku až ve 2,7 s, nadpis navíc tahal kurzívní řezy písma. Výkon klesl z 100 na 94, Speed Index na 4,5 s. | Lighthouse na produkci po nasazení a porovnání s `/voo` (bez účtenky: SI 2,8 s) | Úvodní animace a kreslení kroužku jen na desktopu, kurzíva v H1 až od `sm` → výkon 99–100, SI 1,0–1,5 s (`9750f99`, `bec3259` a následující commit) |

## Ponaučení pro další práci s agenty

- **„Funguje to“ ověřovat chováním,** ne kompilací. Body 2, 9, 10, 13 a 16 by bez kliknutí v prohlížeči nebo testu proti checklistu prošly.
- **Hromadné úpravy textu (`sed`) jsou rizikové.** Po každé je potřeba diff zkontrolovat (bod 5).
- **Tvrzení o světě nechat ověřit samostatným krokem se zdrojem.** Subagent opravil i můj vlastní mylný předpoklad o daňovém stropu.
- **Kvalitu kreativy agent sám neposoudí.** Kontroloval, že reklama „sedí“ (rozměry, texty, data), ne jestli zaujme. Kreativu je potřeba hodnotit člověkem, ideálně proti reálným datům z A/B testu (bod 15).
- **Akce mimo repozitář** (OAuth, úložiště, účty) nechat agenta vždy potvrdit u člověka.
