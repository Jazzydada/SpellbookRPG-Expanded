# Wildemount, Ravnica og Acquisitions Incorporated

Tilføjet 2. november 2026: 24 formularer i `src/supplements-other-books.json`, med fulde mekaniske beskrivelser på dansk og engelsk. Alle er markeret `rulesVersion: "2014"`; ingen af disse 24 havde en nyere version i det kontrollerede kildeindeks. Hovedkatalogets 2024-prioritet skal fortsat anvendes ved integration.

## Kilder og dækning

- Brugerens lokale Explorer's Guide to Wildemount, trykte sider 186–190: alle 15 dunamancy-formularer. Teksten er læst komplet, inklusive fortsættelser på efterfølgende sider og Reality Break-tabellen. Side 189 er også renderet og visuelt kontrolleret.
- Brugerens lokale Guildmasters' Guide to Ravnica, s. 47 og 67: Encode Thoughts og Chaos Bolt. Side 67 er renderet og visuelt kontrolleret, inklusive tabellen og højere slots i højre spalte.
- Brugerens lokale Acquisitions Incorporated, s. 75–77: alle 7 formularer. Klasser fra bogens Spells by Class-boks s. 75. Royalty-komponentens særregler fra s. 76 er indarbejdet i alle tre relevante formularer; siden er renderet og visuelt kontrolleret.

Alle individuelle kildelinks er genbrugt fra den tidligere verificerede D&D Beyond-kildeliste. Disse links kan kræve bogadgang; beskrivelserne er skrevet ud fra de lokale brugerleverede PDF'er, ikke fra købssiderne. PDF'er og udtræk skal ikke publiceres.

## Adgang og integration

Wildemount s. 186 gør formularerne tilgængelige for både Chronurgy og Graviturgy Wizards. Listen bruger stjerner til tematiske kategorier, men teksten gør ikke disse kategorier eksklusive for hver sin subclass. Andre formularbrugere kræver DM-tilladelse; bogen siger udtrykkeligt, at formularerne ikke blot skal føjes til de almindelige lister.

De 15 poster bruger derfor `classes: ["Wizard"]`, `restricted: true` og et tosproget `accessNote`-objekt. De må ikke vises som automatisk almindelig Wizard-adgang. Root-agenten implementerer særskilt adgangsvalg pr. karakter. Et DM-adgangsvalg kan give adgang til andre klasser; deres normale niveaugrænser gælder stadig.

Encode Thoughts har `classes: ["Wizard"]`, uden restricted. Denne klassifikation er verificeret i [D&D Beyonds officielle Wizard-indeks](https://www.dndbeyond.com/spells/class/8-wizard) og understøttes af [Wizards' officielle Narset-karakter](https://media.wizards.com/2021/magic/afr/character_sheets/mbQt91_Narset_CharacterSheet.pdf). Ravnicas Dimir Operative-baggrund kan desuden føje den til andre klassers formularlister; dette fremgår af accessNote. Chaos Bolt er almindelig Sorcerer-adgang; Izzet-baggrunden kan give yderligere adgang. Baggrundsadgang er ikke automatisk simuleret her.

## Kontrol

- 24 gyldige JSON-poster: 15 Wildemount, 2 Ravnica, 7 Acquisitions Incorporated.
- Alle engelske terningudtryk findes også i den danske beskrivelse.
- Begge tabeller har ens kolonneantal i alle rækker.
- Betalte komponenter, koncentration, ritual, reaktionstriggere, opskalering, bevægelse, gentagne redninger, ophørsbetingelser og undtagelser er medtaget.
- Særlig kontrol: Gravity Fissures eksterne mål undgår al effekt ved succes; Dark Star-stilhed og disintegration; Ravenous Voids restrain/check/annihilation; Reality Break fire tabeludfald; Tether Essences dobbelte redning og ophør; Time Ravages præcise kur; Jim's Magic Missile naturlig 1 og 5d4-critical; royalty-komponenten.
- Målrettet søgning efter officielle bogerrata fandt ingen anvendelig erratafil for disse tre bøgers formularer. Det er ikke en påstand om, at ingen rettelser nogensinde kan findes. Ingen uverificerede rettelser er indført.
