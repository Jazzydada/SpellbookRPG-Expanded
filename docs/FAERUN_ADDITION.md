# Heroes of Faerûn — verified addition

Reviewed 2026-11-03. `src/supplements-faerun.json` contains all 19 spells listed for **Forgotten Realms: Heroes of Faerûn** in the existing source catalogue. All records use the 2024 rules framework and publication year 2025, with full Danish and English mechanical paraphrases.

## Source and pagination

The user supplied `Forgotten Realms - Heroes of Faerun.pdf` in the Rulebooks folder. It is a 218-page image-only print/export of the official D&D Beyond book, dated 28 October 2025. The original source is https://www.dndbeyond.com/sources/dnd/frhof. Spell text was visually read from export pages 167–173; Circle Magic rules from 164–166. The `source.page` values refer explicitly to this **PDF export**, not printed-book pagination (`pageType: pdf-export`). Individual official spell URLs are retained as source links.

The first ten entries were transcribed and checked by the primary data agent; the remaining nine by a second agent. Rendered evidence is available locally in `/tmp/faerun-pages/p-164.jpg` through `p-173.jpg` for review. This temporary evidence is not part of the published app.

## Coverage and mechanical checks

- All 19 catalogue names match, with no missing or additional entries and no same-name record in the other source JSON files at review time.
- Level, school, class lists, casting time, range, components, duration, scaling, saving throws and exceptions were checked against the page images.
- All four special Circle variants are included: Dirge, Doomtide, Songal’s Elemental Suffusion and Spellfire Storm. Each includes the shared eligibility, primary and secondary caster responsibilities, action timing, range, Concentration during casting, reaction triggers, NPC substitution and failed-casting rules. The specific variant replaces other Circle casting options. Group material costs are charged once per casting; secondary slot costs remain per secondary caster.
- Spellfire Storm includes its complete Circle size/duration table and the separate save when a creature casts a spell. Its once-per-turn restriction belongs to the damage save.
- Songal’s feature heading says “Elemental Immunity”, but the operative text grants **Resistance**. Both descriptions follow the operative rule.
- Syluné’s Viper uses the source’s **50-foot** bite attack range; this has not been silently changed to a conventional range.
- Holy Star preserves the reflection restriction to level 7 or lower spells targeting only the caster and creating no area, and the original caster’s own save DC.
- Blade of Disaster is the newer 2025 / 2024-framework version (10d6 Force, critical on 18–20), not the older Tasha version.
- Automated verification passed JSON parsing, exact 19-name catalogue coverage, and matching dice expressions in both languages.

The general optional Circle enhancements from the book are not standalone spells and are not added as catalogue records. The complete shared procedure needed by these four special variants is included directly in their descriptions. No spell text was inferred from an inaccessible online page.
