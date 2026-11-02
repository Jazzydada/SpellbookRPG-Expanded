import { SPELLS as PHB_SPELLS } from './spells2024.js';
import supplements from './supplements.js';
import { mergeCatalog, buildClassSpells } from './catalog.js';

const phb = Object.fromEntries(Object.entries(PHB_SPELLS).map(([name, spell]) => [name, {
  ...spell, book: "Player's Handbook (2024)", rulesVersion: '2024', publishedYear: 2024,
}]));
const merged = mergeCatalog(phb, supplements);
export const SUPPLEMENT_RULE_NAMES = Object.keys(merged).filter(name => merged[name] === supplements[name]);
export const SPELLS = Object.fromEntries(Object.entries(merged).map(([name, {en, da, ...spell}]) => [name, spell]));
export const BOOKS = [...new Set(Object.values(SPELLS).map(spell => spell.book))].sort();
export const CLASS_SPELLS = buildClassSpells(SPELLS,
  ['Wizard', 'Sorcerer', 'Cleric', 'Druid', 'Bard', 'Warlock', 'Paladin', 'Ranger']);
export const ALL_SPELLS_BY_LEVEL = Object.entries(SPELLS).reduce((levels, [name, spell]) => {
  (levels[spell.level] ??= []).push(name);
  return levels;
}, {});

export const CLASS_META = {
  Wizard:   { da:"Troldmand",   caster:"full",    spellAbility:"INT" },
  Sorcerer: { da:"Tryllekunstner", caster:"full",  spellAbility:"CHA" },
  Cleric:   { da:"Præst",       caster:"full",     spellAbility:"WIS" },
  Druid:    { da:"Druide",      caster:"full",     spellAbility:"WIS" },
  Bard:     { da:"Skald",       caster:"full",     spellAbility:"CHA" },
  Warlock:  { da:"Heksemester", caster:"warlock",  spellAbility:"CHA" },
  Paladin:  { da:"Paladin",     caster:"half",     spellAbility:"CHA" },
  Ranger:   { da:"Skovløber",   caster:"half",     spellAbility:"WIS" },
};

export const SCHOOL_COLORS = {
  Evocation:    "#f87171",
  Conjuration:  "#60a5fa",
  Enchantment:  "#c084fc",
  Abjuration:   "#34d399",
  Illusion:     "#818cf8",
  Transmutation:"#fb923c",
  Necromancy:   "#94a3b8",
  Divination:   "#fcd34d",
};

export const T = {
  en: {
    loading: "Loading…",
    sourceFallback: "The rules could not be loaded. Please open the source link above.",
    selectSpell: "Select spell",
    components: "Components",
    chooseOne: "choose one",
    removedSelections: "Removed after level change",
    scopeNote: "Included: Player’s Handbook (2024) and additional spells from Tasha’s Cauldron of Everything (2020) and Elemental Evil Player’s Companion (2015). Some spells from other official books are not yet included. The 2024 version takes precedence; older spells without a replacement are retained. Class lists are for a single-class character. Subclasses, feats, multiclassing and features such as Magical Secrets can add choices. Prepared-spell limits are not enforced. Full spell rules are shown below, including exceptions and scaling. Named monster stat blocks and general rules remain separate references.",
    arcanumNote: "Pact Magic slots stop at level 5. Mystic Arcanum unlocks at character levels 11, 13, 15 and 17: choose one spell of each unlocked level, cast once per Long Rest without a slot. Available arcanum levels",
    rulesDate: "Rules checked 2 November 2026",
    fullRules: "Full rules",
    book: "Book",
    classes: "Classes",
    allBooks: "All included books",
    allClasses: "All classes · catalogue",
    catalogueNote: "Catalogue view shows every included spell, regardless of character level. Choose a class to select spells.",
    rulesVersion: "Rules",
    legacyRulesNote: "Earlier rules (2014): This spell uses the rules from the book shown above. It has not been rewritten as a 2024 spell.",
    errata: "Official errata",

    title: "SpellbookRPG Expanded",
    subtitle: "Your 2024 spellbook, with clearly marked spells from earlier books.",
    by: "by",
    selectClass: "Choose Class",
    charLevel: "Character Level",
    searchPlaceholder: "Search spells…",
    cantrips: "Cantrips",
    level: "Level",
    noSpells: "No spells found.",
    notCaster: "This class has no spells at this level.",
    selected: "Selected Spells",
    clearAll: "Clear all",
    noSelected: "No spells selected yet.",
    castTime: "Cast",
    range: "Range",
    duration: "Duration",
    school: "School",
    allLevels: "All Levels",
    lang: "DA",
  },
  da: {
    loading: "Indlæser…",
    sourceFallback: "Reglerne kunne ikke indlæses. Åbn kildehenvisningen ovenfor.",
    selectSpell: "Vælg formular",
    components: "Komponenter",
    chooseOne: "vælg én",
    removedSelections: "Fjernet efter niveauskift",
    scopeNote: "Medtaget: Player’s Handbook (2024) og yderligere formularer fra Tasha’s Cauldron of Everything (2020) og Elemental Evil Player’s Companion (2015). Der mangler fortsat formularer fra andre officielle bøger. 2024-versionen har forrang; ældre formularer uden en erstatning bevares. Klasselisterne gælder en karakter med én klasse. Underklasser, feats, multiklasser og evner som Magical Secrets kan give flere valg. Antallet af forberedte formularer begrænses ikke her. Her vises formularernes udførlige regler med undtagelser og skalering. Engelske regeltermer bevares i den danske tekst. Navngivne monsterstatblokke og grundregler er særskilte referencer.",
    arcanumNote: "Pact Magic-slots stopper ved niveau 5. Mystic Arcanum åbner ved karakterniveau 11, 13, 15 og 17: vælg én formular pr. åbent niveau, der kan kastes én gang pr. Long Rest uden et slot. Tilgængelige arcanum-niveauer",
    rulesDate: "Regler kontrolleret 2. november 2026",
    fullRules: "Udførlige regler",
    book: "Bog",
    classes: "Klasser",
    allBooks: "Alle medtagne bøger",
    allClasses: "Alle klasser · katalog",
    catalogueNote: "Katalogvisningen viser alle medtagne formularer uanset karakterniveau. Vælg en klasse for at vælge formularer.",
    rulesVersion: "Regler",
    legacyRulesNote: "Ældre regler (2014): Denne formular følger reglerne fra bogen angivet ovenfor. Den er ikke omskrevet til en 2024-formular.",
    errata: "Officiel errata",

    title: "SpellbookRPG Expanded",
    subtitle: "Din 2024-spellbook med tydeligt markerede formularer fra ældre bøger.",
    by: "af",
    selectClass: "Vælg klasse",
    charLevel: "Karakterniveau",
    searchPlaceholder: "Søg formularer…",
    cantrips: "Cantrips",
    level: "Niveau",
    noSpells: "Ingen formularer fundet.",
    notCaster: "Denne klasse har ingen formularer på dette niveau.",
    selected: "Valgte formularer",
    clearAll: "Ryd alt",
    noSelected: "Ingen formularer valgt endnu.",
    castTime: "Kasttid",
    range: "Rækkevidde",
    duration: "Varighed",
    school: "Skole",
    allLevels: "Alle niveauer",
    lang: "EN",
  },
};
