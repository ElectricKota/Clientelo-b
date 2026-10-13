# AI log: jak vznikla landing page ETF tahák

Projekt jsem dělal s AI agentem **Claude Code** (model Claude Opus 5.5) v desktopové aplikaci Claude. Agent měl přístup k terminálu, k repozitáři, k vestavěnému prohlížeči (lokální dev server) a k mému Chromu přes rozšíření Claude in Chrome (nasazení na Vercel). Na sběr dat spustil samostatného výzkumného subagenta.

Tahle složka dokumentuje, **jak jsem agenta vedl, jak jsem kontroloval jeho výstup a kde se pletl**.

| Soubor | Obsah |
|---|---|
| [01-zadani-a-pokyny.md](01-zadani-a-pokyny.md) | Moje pokyny agentovi v pořadí, jak šly, a co z nich vzniklo |
| [02-subagent-data.md](02-subagent-data.md) | Zadání pro výzkumného subagenta (sběr dat o ETF) a jak jsem jeho výstup ověřil |
| [03-kontrola-vystupu.md](03-kontrola-vystupu.md) | Jak se ověřovala funkčnost, data, přístupnost a výkon |
| [04-chyby-agenta.md](04-chyby-agenta.md) | Konkrétní chyby agenta, jak se na ně přišlo a jak se opravily (s commity) |

## Princip spolupráce

1. **Nejdřív plán, pak kód.** První pokyn byl jen „připrav plán implementace“. Plán jsem si přečetl, teprve pak jsem řekl „realizuj“.
2. **Agent navrhuje, já rozhoduji o věcech mimo repozitář.** Propojení GitHubu s Vercelem, vytvoření úložiště pro leady a schválení přístupu v GitHub Mobile šlo přese mě. Agent se vždy zeptal.
3. **Každé tvrzení musí mít zdroj.** Čísla o ETF nesměla být z paměti modelu. Sbíral je subagent ze stránek emitentů a každý údaj nese `sourceUrl` a datum.
4. **Ověřovat v prohlížeči, ne jen v kódu.** Agent po každé větší změně spustil dev server, prošel stránku jako uživatel (klik, klávesnice, mobilní viewport) a kontroloval `dataLayer` i odeslání leadu.
5. **Průběžné commity.** Historie v gitu odpovídá krokům práce, viz `git log`.
