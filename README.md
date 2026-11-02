# SpellbookRPG Expanded

Separate expanded edition of [SpellbookRPG](https://spellbook-rpg.vercel.app/), version 2.0.0.

A 2024-first spellbook with 442 sourced spells, Danish and English descriptions, book filters, and clearly marked older rules. Includes 391 PHB 2024 spells, 11 additional Tasha spells, and 40 additional Elemental Evil spells. Other books are not yet fully covered.

## Character spellbooks

Create a separate book for each character, with its own name, class, level and selected spells. “My spellbook” shows the selected spells with full rules. Preparation is saved separately, with a dedicated Prepared view. Removing a spell from the book also removes its prepared status. Existing books retain their spells and start without prepared selections. Cantrips do not need preparation; preparation limits and always-prepared class features are managed manually. Books save automatically in this browser on this device; there is no account or cloud sync. Clearing browser data removes saved books. Deleting a book can be undone until the page is reloaded or another book is deleted.

## Development

```sh
npm ci
npm test
npm run dev
npm run build
```

See [rules audit](docs/RULES_AUDIT.md) and [source coverage](docs/SOURCE_COVERAGE.md) for verification and limitations. Private source PDFs and temporary research files are excluded from Git.

The original project and deployment remain separate. This edition is published from the SpellbookRPG-Expanded repository.
