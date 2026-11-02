# Xanathar-tilføjelse – 2. november 2026

## Resultat

`src/supplements-xanathar.json` indeholder 38 nye poster med komplet selvstændig mekanisk beskrivelse på dansk og engelsk, metadata, bog, sidetal og kilde. Alle er mærket `rulesVersion: 2014` og `publishedYear: 2017`. De 36 kandidater fra den tidligere adgangslog er med; derudover er Summon Greater Demon og Summon Lesser Demons med fra bogens formularafsnit.

## Kildekontrol

Brugerens lokale `Xanathar's Guide to Everything Deluxe.pdf` er læst via tekstudtræk af formularafsnittet samt klasselisterne. Formeltekster over sideskift og tekstkolonner er sammenholdt; trykte sidetal er kontrolleret mod PDF-siderne (PDF-siden er det trykte sidetal + 1). Bogens trykte formularafsnit ligger på s. 150–171, klasselister s. 147–149.

Den officielle [Xanathar-errata fra 2020](https://media.wizards.com/2020/dnd/downloads/XGtE-Errata.pdf) er kontrolleret og anvendt:

- Healing Spirit: samlet antal helbredelser er 1 + spellcasting ability modifier, mindst to; derefter forsvinder ånden.
- Holy Weapon: lysudbruddets mål er inden for 30 ft fra våbnet, ikke kasteren.
- Life Transference: selvskaden kan ikke reduceres.

Mind Spike-rettelsen vedrører en formular, der allerede repræsenteres af PHB 2024, og tilføjes ikke som en ældre dublet.

## Versioner og afgrænsning

Catnap, Enervation, Illusory Dragon, Invulnerability, Negative Energy Flood og Power Word Pain er overladt til de nyere Arcana Unleashed-tekster. Øvrige allerede dækkede PHB/EE-formularer duplikeres ikke her. Klasserne følger de trykte Xanathar-klasselister; subclasses, feats og efterfølgende class-feature-udvidelser må håndteres separat.

Find Greater Steed bevares som særskilt ældre formular, indtil en eksplicit kilde dokumenterer en navneerstatning; lighed med 2024 Find Steed er ikke i sig selv anvendt som en automatisk erstatningsregel.

Tiny Servant indeholder den fulde statblok med ability scores, AC, HP, speeds, immuniteter, sanser og angreb. Navngivne Monster Manual-statblokke (fx Homunculus, Awakened Tree, Zombie, Skeleton, mounts og demons/devils) er markeret som separate referencer, ligesom krydshenviste formularer. Der er ikke opfundet eller indsat nye 2024-statblokke i ældre formularer.

## Kontroller

- Alle 36 navne fra adgangsloggens Xanathar-kandidater er til stede, plus de to demon-formularer.
- Ingen af de 38 navne overlapper det hidtidige aktive katalog.
- Terningudtryk i engelske beskrivelser findes også i dansk.
- Trykte sidetal er matchet mod formularoverskrifter i PDF'en.
- Alle poster er JSON-valideret; integration og samlet app-test udføres af hovedagenten.

Efter hovedagentens gennemgang er Mass Polymorphs halvering af karakterniveau og Create Homunculus’ halvering af Hit Dice præciseret med afrunding nedad, i overensstemmelse med bogens generelle “Round Down”-regel. Create Homunculus’ minimum på 1 er tydeliggjort som et minimum for det reducerede maksimale HP.
