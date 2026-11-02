# PHB 2024: datakvalitet og niveauhåndtering

Kontrolleret 2. november 2026. Arbejdet ligger lokalt på `fix/2024-spells-and-levels`.

## Omfang og resultat

Kataloget er udvidet fra 223 til 391 selvstændige formularer fra Player's Handbook (2024). 219 eksisterende navne er bevaret, 172 navne er tilføjet. Af de fire udgåede navne er Branding Smite erstattet af Shining Smite og Feeblemind af Befuddlement. Earth Tremor og Holy Weapon indgår ikke i PHB 2024 og er taget ud af dette regelsæt.

Alle 391 poster har formularniveau, skole, klasseadgang, kasttid, rækkevidde, varighed, komponenter, udførlig dansk regelbeskrivelse, fuld engelsk regeltekst og kilde. De otte grundklassers lister er sammenholdt med særskilt indlæste PHB 2024-klassetabeller:

| Klasse | Formularer inkl. cantrips |
|---|---:|
| Bard | 140 |
| Cleric | 117 |
| Druid | 135 |
| Paladin | 51 |
| Ranger | 61 |
| Sorcerer | 150 |
| Warlock | 91 |
| Wizard | 242 |

Klasselisterne afledes nu af formularernes egne niveauer og klasseadgang. Der er ikke længere to manuelt vedligeholdte sandheder. Den uafhængige testreference ligger i `test/fixtures/phb2024-class-lists.json`.

## Verificerede rettelser

- Cleric og de øvrige fulde kastere har lister til formularniveau 9.
- Paladin og Ranger får adgang til niveau 1-formularer fra karakterniveau 1. Deres efterfølgende grænser er karakterniveau 5, 9, 13 og 17.
- Warlock har Pact Magic-slots på højst niveau 5. Mystic Arcanum giver særskilte valg på formularniveau 6/7/8/9 ved karakterniveau 11/13/15/17. Valg af en anden formular på samme arcanum-niveau erstatter det tidligere valg.
- Ved lavere karakterniveau fjernes utilgængelige formularvalg med en forklaring. Et utilgængeligt niveaufilter nulstilles. Klasseskift rydder valg og filter.
- Enthrall står kun på formularniveau 2. Klasseadgang og manglende formularer er rettet ud fra hele 2024-listen, herunder de nye formularer og Summon-formularerne.
- Blandede 2014/2024-beskrivelser er erstattet. Eksempler: Sleep bruger WIS-redninger og koncentration; Chill Touch er Touch og 1d10; Inflict Wounds bruger CON-redning og 2d10; Counterspell bruger CON-redning og forbruger ikke det afbrudte slot; Spiritual Weapon kræver koncentration. Cure Wounds og Healing Word bruger deres nye terninger og skole.
- Reaktionsbetingelser, ritualmuligheder og kostbare/forbrugte materialer fremgår nu af metadata.
- De tidligere links til en ikke-medfølgende PHB-PDF og ufuldstændige sidetabel er erstattet af virkelige kildehenvisninger. Den private PHB er ikke lagt i projektet.
- Formularvalg er rigtige afkrydsningsfelter, som kan bruges med tastatur. Kontrollerne har tilknyttede labels, og niveauoverskrifter angiver foldet tilstand.

## Kilder og prioritet

1. [Wizards' officielle PHB-errata](https://www.dndbeyond.com/sources/dnd/sae/players-handbook) har forrang ved dokumenterede ændringer. Datoen ovenfor er kontroldato, ikke errataens udgivelsesdato.
2. [SRD 5.2.1 fra Wizards](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf) leverer metadata og engelske regeltekster til 339 formularer. Generiske SRD-navne er knyttet til deres PHB-navne, fx Acid Arrow → Melf's Acid Arrow. SRD-teksten er indlæst kolonnevis for at undgå sammenblandede PDF-spalter.
3. De resterende 52 formularer er kontrolleret via PHB 2024-teksterne i [Roll20s licenserede kompendium](https://roll20.net/compendium/dnd5e/Spells?expansion=32231). Hver post linker til sin egen side med `expansion=32231`. Alle 52 har nu fulde regelbeskrivelser, og deres otte tilkaldelsesstatblokke er kontrolleret mod brugerens PHB.
4. De otte klasselister er kontrolleret separat mod Roll20s PHB 2024-klassetabeller, fx [Wizard](https://roll20.net/compendium/dnd5e/Classes:Wizard?expansion=32231) og [Paladin](https://roll20.net/compendium/dnd5e/Classes:Paladin?expansion=32231).
5. Brugerens lokale `Dungeons_and_Dragons_Players_Handbook_2024.pdf` er brugt til kontrol af de komplette beskrivelser, tabeller, statblokke og en kildekonflikt. Den behandles som privat reference og distribueres ikke.

D&D Beyonds gratis [2024-beskrivelser](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions) er også sammenholdt med SRD. De gratis klasselister gav ikke i sig selv fuld dækning og er derfor ikke brugt som eneste reference for katalogets omfang.

### Errata indarbejdet

Animal Shapes og Shapechange giver kun midlertidige HP fra den første form. Resterende midlertidige HP fra Animal Shapes, Polymorph, Shapechange og True Polymorph forsvinder ved ophør. Conjure Elemental og Conjure Minor Elementals skalerer med +1d8, Conjure Fey med +1d12. Conjure Woodland Beings skalerer fra slotniveau over 4. Giant Insect har 30 HP + 10 pr. slotniveau over 4. Flaming Sphere er Evocation. De berørte kort linker også til errataen.

### Dokumenteret kildekonflikt

Crusader's Mantle står som Transmutation i Paladins PHB 2024-klassetabel, men selve beskrivelsen siger **Level 3 Evocation (Paladin)** i både brugerens PHB og Roll20. Kataloget følger den specifikke formularbeskrivelse og bruger Evocation. Dette er et dokumenteret valg ved modstridende kilder; der er ikke fundet en udtrykkelig errata for konflikten.

Roll20s klassetabel har desuden stavefejlen “Transmuation” for Shillelagh; skoleværdien er Transmutation som i beskrivelsen og SRD.

## Udførlige beskrivelser og afgrænsning

Alle 391 formularer har udførlige danske beskrivelser og fulde engelske regeltekster. Den danske tekst er en selvstændig formulering af mekanikken, ikke en autoriseret oversættelse. Engelske regeltermer bevares for entydighed. Beskrivelserne dækker mål, redningskast, skade, varighed, ophør, undtagelser og skalering, hvor de indgår i originalen. Tabeller og statblokke, som er del af selve formularen, er med; henvisninger til eksterne monsterstatblokke og generelle regler forbliver henvisninger.

De danske beskrivelser er fordelt mellem tre forfattere og semantisk gennemlæst af en anden agent end forfatteren. Kontrollen fandt blandt andet præciseringer af afsluttet Long Rest, hjemplans-undtagelser, kontrol over undead, Levitate, Plane Shift, Transport via Plants, Wish og Tasha's Bubbling Cauldron; disse er indarbejdet. De 52 engelske beskrivelser og deres otte Summon-statblokke er kontrolleret separat mod den lokale PHB.

Tre forskelle mellem SRD og PHB er rettet: Telekinesis har igen sin fulde afslutning om håndtering af genstande; Reincarnates tabel har Aasimar; Wish har undtagelsen om Sigil og Lady of Pain. Disse poster henviser til PHB. Summon Fiends Death Throes er visuelt kontrolleret i PDF'en: 2d10 + slotniveau.

Korte resuméer er fjernet fra kataloget, så de ikke kan vises som erstatning for komplette regler. Det valgte sprog indlæses samlet efter behov, og søgningen omfatter også den fulde regeltekst. Tabeller vises som HTML-tabeller, med vandret rulning ved behov. Læsning og tekstmarkering ændrer ikke formularvalget; afkrydsningsfelt og formularnavn styrer valget.

Appen viser valg fra grundklassernes lister for én klasse. Den håndhæver ikke antal forberedte formularer, antal cantrips, Wizards spellbook-regler, slots pr. dag, komponentbeholdning eller hvileforbrug. Underklasser, feats, multiclassing, Magical Secrets og andre udvidede valg er ikke modelleret. Disse begrænsninger er nu også synlige i brugerfladen. Mystic Arcanums begrænsning på ét valg pr. niveau håndhæves særskilt.

Der er ikke påstået fuld dækning af andre regelbøger eller senere udvidelser.

## Kontrol

`npm test`: 16 testgrupper består. De kontrollerer alle klasselisters indhold og niveauer, posternes felter/kilder, alle 20 karakterniveauers progression, arcanum-grænser og udskiftning, niveaufald, tidligere forkerte metadata og udvalgte ændrede regelmekanikker/errata.

Yderligere kontroller dækker alle 442 beskrivelser på begge sprog, terningudtryk, tilkaldelsesstatblokke, de tre PHB-tilføjelser og tabelstruktur. Automatiske kontroller supplerer den manuelle regelgennemgang; de beviser ikke alene semantisk korrekthed.

`npm run build`: består. Regelteksterne ligger i separate, behovsindlæste filer; hovedfilen er under Vites størrelsesadvarsel.

Browserkontrol mod lokal Vite-visning: Paladin niveau 1 viser niveau 1-formularer; Wizard niveau 20 → 1 fjerner Wish, viser forklaring og nulstiller niveau 9-filteret; Warlock niveau 11 viser niveau 6 som Mystic Arcanum og tillader kun ét valg på dette niveau. Den afsluttende browserkontrol verificerer Witch Bolt på begge sprog, bevaret valg ved sprogskift, tekstklik uden ændret valg, Summon Fiends komplette danske statblok og Teleports engelske tabel. En fejl med dynamisk JSON-indlæsning i udviklingsvisningen blev fundet og rettet med modulindgange. Ingen browserfejl blev observeret i disse forløb.

Ingen ændringer er skubbet til GitHub eller udgivet på Vercel.

## SRD-attribution

This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

Appens katalog anvender udvalgte SRD-tekster, egne danske regelbeskrivelser, PHB-navne og den dokumenterede skolekorrektion fra officiel errata. Attribution vises også i appens footer.

## Udvidelse til øvrige officielle bøger

Brugeren har godkendt alle officielle D&D 5e-bøger med nyere 2024-regler som standard og ældre formularer uden dokumenteret erstatning bevaret. Arbejdet er i gang; PHB-katalogets tidligere komplette status må ikke læses som fuld dækning af alle bøger. Se `SOURCE_COVERAGE.md` for den særskilte kildeinventering og åbne adgangs-/versionskontroller.

Kataloget har nu bog-/regelversionsmetadata, bogfilter og en læsevisning for alle klasser. De 391 PHB-poster testes fortsat særskilt mod deres uafhængige fixture. Supplementer kontrolleres mod samme krav om fuld dansk og engelsk beskrivelse. Artificer-medlemskab bevares i metadata og vises på kortene; en komplet Artificer-karakterprofil afventer kildekontrol.

Tasha bidrager med 11 ekstra formularer efter PHB-prioritering. Blade of Disaster fra den ældre bog er ikke tilføjet, fordi en nyere udgave er identificeret i Heroes of Faerûn og skal kontrolleres først. Summon Draconic Spirit slettes ikke automatisk som alias til Summon Dragon: en udtrykkelig officiel erstatning er endnu ikke dokumenteret.

Elemental Evil-kilden bidrager med 40 verificerede ekstra formularer. De sidste fem komplekse beskrivelser er færdiggjort og uafhængigt gennemgået mod de individuelle regeltekster samt officiel PDF/errata. Alle 43 EE-indeksnavne er dermed dækket: 40 ekstra plus tre nyere PHB-versioner. Katalogets samlede aktuelle omfang er 442 formularer (391 PHB + 11 Tasha + 40 EE). De øvrige identificerede kilder er ikke færdige: 150 resterende indeksposter blev undersøgt enkeltvis, hvor 138 henviste til køb og 12 til abonnement. Dette er adgangskontrol, ikke en global totaloptælling.

Brugeren har afgrænset næste trin til de tilgængelige ressourcer, fortsat med 2024 som grundlag. Alle aktive poster med ældre regler får nu en synlig note på både dansk og engelsk om, at den angivne bogs 2014-regler gælder, og at teksten ikke er konverteret til 2024. Bogfilteret giver fortsat adgang til både PHB og supplementer.
