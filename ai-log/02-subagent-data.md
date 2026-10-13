# Subagent pro sběr dat

Data o ETF nesměla pocházet z paměti modelu (ta je zastaralá a čísla si vymýšlí). Hlavní agent proto spustil samostatného výzkumného subagenta s přístupem k webu a mezitím stavěl kostru webu.

## Zadání (zkráceně, věcně přesně)

- Sesbírej **skutečná, ověřitelná a aktuální** data pro ETF na NYSE / NYSE Arca: SPY, IVV, VOO, SPLG (*ověř, zda nebyl přejmenován na SPYM*), VTI, VT, SCHD, VEA, VWO, GLD. U QQQ ověř, že je na Nasdaqu (vyřadit).
- Používej **oficiální stránky emitentů** (Vanguard, State Street, iShares, Schwab) a pro UCITS **justETF**.
- Pro každý fond: ticker, název, emitent, burza, index, TER, AUM s datem, výnosy 1/5/10 let z NAV s datem, dividendový výnos (*uveď typ*), `sourceUrl`.
- Pro každý fond nejlepší **UCITS alternativu**: ticker, ISIN, TER, třída Acc/Dist a příznak, zda jde o přesnou obdobu. *Poctivě uveď, když přesná neexistuje.*
- Ověř se zdrojem: PRIIPs/KID, srážkovou daň (W-8BEN, irské fondy) a český časový test včetně limitu (*„myslím, že 40 mil. Kč, ověř“*).
- **„Nevymýšlej čísla. Když hodnotu nenajdeš, dej `null` a vysvětli to v `notes`.“**

## Co subagent vrátil a co jsem ověřil

| Zjištění | Ověření / reakce |
|---|---|
| **Oprava mého zadání:** strop 40 mil. Kč pro cenné papíry platil jen v roce 2025, od 1. 1. 2026 je zrušen (zůstává u kryptoaktiv) | Ověřeno v tiskové zprávě Finanční správy (odkaz v datech). Do FAQ i PDF jde text o zrušení stropu, ne můj původní předpoklad. |
| SPLG byl 31. 10. 2025 přejmenován na **SPYM** | Na stránce je SPYM s poznámkou „dříve SPLG“. |
| VTI se nově jmenuje *Vanguard Morningstar Total Stock Market ETF* | Použit nový název. |
| Všech 10 fondů má primární kotaci na NYSE Arca, QQQ je na Nasdaqu | QQQ vyřazen. |
| Vanguard u VT, VEA, VWO neuvádí SEC yield, subagent ho **dopočítal** z dividend | Na stránce označeno „≈“ a vysvětleno pod porovnáním. |
| Pro VTI, SCHD a GLD neexistuje přesná UCITS obdoba | U karet i v PDF je „Nejbližší obdoba“ s vysvětlením. |
| Dostupnost u konkrétních brokerů **neověřil** | Stránka proto netvrdí, že fond „najdete u XTB“. Radí hledat podle ISIN. |
| Poznámky k UCITS fondům vrátil v angličtině | Hlavní agent je přeložil a zkrátil do češtiny (`note`), originál zůstal v `noteEn`. |

Surová data i všechny výhrady jsou v [`src/data/etfs.json`](../src/data/etfs.json) (pole `notes`).
