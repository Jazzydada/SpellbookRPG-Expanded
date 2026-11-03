# SpellbookRPG Expanded

Separate expanded edition of [SpellbookRPG](https://spellbook-rpg.vercel.app/), version 2.0.0.

A 2024-first spellbook with 593 sourced spells (including two clearly marked Tal’Dorei partner spells), Danish and English descriptions, book filters, and clearly marked older rules. Includes 391 PHB 2024 spells, all 33 Arcana Unleashed spells (2026, using the 2024 rules), plus 11 Tasha, 40 Elemental Evil, 38 Xanathar, 15 Wildemount, 2 Ravnica 7 Acquisitions Incorporated spells, 19 Heroes of Faerûn spells and Homunculus Servant from Forge of the Artificer, plus six Fizban and four Strixhaven spells. Wither and Bloom keeps its newer Arcana text. By explicit user preference, Summon Dragon (2024) is the only dragon-summoning version shown; this is a catalogue choice rather than a claim of an official rename. Artificer uses the revised Forge class list, with automatic Mending and level-based preparation guidance. The later Arcana versions take precedence over older versions of the same spells. Also includes the supplied Planescape, Spelljammer, Lost Laboratory of Kwalish, Book of Many Things and Icewind Dale spells. Includes the complete supplied Reaper Spirit, all three Icewind Dale magen stat blocks, and Spelljamming Helm item rules. This is not yet full coverage of every official book.

## Character spellbooks

Create a separate book for each character, with its own name, class, level and selected spells. “My spellbook” shows the selected spells with full rules. Preparation is saved separately, with a dedicated Prepared view. Removing a spell from the book also removes its prepared status. Existing books retain their spells and start without prepared selections. Cantrips do not need preparation; preparation limits and always-prepared class features are managed manually. Books save automatically in this browser on this device; there is no account or cloud sync. Clearing browser data removes saved books. Deleting a book can be undone until the page is reloaded or another book is deleted.

Dunamancy requires a separate access setting per character: enable it for Chronurgy/Graviturgy wizards or with DM permission. Other classes can use this permission setting while retaining their normal level limits. Removing permission removes affected book and prepared selections. Other subclass/background access is not automatically simulated.

## Development

```sh
npm ci
npm test
npm run dev
npm run build
```

See [rules audit](docs/RULES_AUDIT.md) and [source coverage](docs/SOURCE_COVERAGE.md) for verification and limitations. Private source PDFs and temporary research files are excluded from Git.

The original project and deployment remain separate. This edition is published from the SpellbookRPG-Expanded repository.
