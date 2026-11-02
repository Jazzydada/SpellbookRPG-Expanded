// Forge of the Artificer (2025), printed pp. 11–12. Mending is a level-1 feature, not a selectable base cantrip.
export const ARTIFICER_BASE_SPELLS = {
  "0": [
    "Acid Splash",
    "Dancing Lights",
    "Elementalism",
    "Fire Bolt",
    "Guidance",
    "Light",
    "Mage Hand",
    "Message",
    "Poison Spray",
    "Prestidigitation",
    "Ray of Frost",
    "Resistance",
    "Shocking Grasp",
    "Spare the Dying",
    "Thorn Whip",
    "Thunderclap",
    "True Strike"
  ],
  "1": [
    "Alarm",
    "Cure Wounds",
    "Detect Magic",
    "Disguise Self",
    "Expeditious Retreat",
    "Faerie Fire",
    "False Life",
    "Feather Fall",
    "Grease",
    "Identify",
    "Jump",
    "Longstrider",
    "Purify Food and Drink",
    "Sanctuary"
  ],
  "2": [
    "Aid",
    "Alter Self",
    "Arcane Lock",
    "Arcane Vigor",
    "Blur",
    "Continual Flame",
    "Darkvision",
    "Dragon's Breath",
    "Enhance Ability",
    "Enlarge/Reduce",
    "Heat Metal",
    "Homunculus Servant",
    "Invisibility",
    "Lesser Restoration",
    "Levitate",
    "Magic Mouth",
    "Magic Weapon",
    "Protection from Poison",
    "Rope Trick",
    "See Invisibility",
    "Spider Climb",
    "Web"
  ],
  "3": [
    "Blink",
    "Create Food and Water",
    "Dispel Magic",
    "Elemental Weapon",
    "Fly",
    "Glyph of Warding",
    "Haste",
    "Protection from Energy",
    "Revivify",
    "Water Breathing",
    "Water Walk"
  ],
  "4": [
    "Arcane Eye",
    "Fabricate",
    "Freedom of Movement",
    "Leomund's Secret Chest",
    "Mordenkainen's Faithful Hound",
    "Mordenkainen's Private Sanctum",
    "Otiluke's Resilient Sphere",
    "Stone Shape",
    "Stoneskin",
    "Summon Construct"
  ],
  "5": [
    "Animate Objects",
    "Bigby's Hand",
    "Circle of Power",
    "Creation",
    "Greater Restoration",
    "Wall of Stone"
  ]
};

// Tasha p. 12 grants these supplemental spells; retain earlier-book access and saved choices.
export const ARTIFICER_SUPPLEMENT_SPELLS = [
  "Booming Blade",
  "Create Bonfire",
  "Frostbite",
  "Green-Flame Blade",
  "Lightning Lure",
  "Magic Stone",
  "Sword Burst",
  "Absorb Elements",
  "Catapult",
  "Snare",
  "Tasha's Caustic Brew",
  "Pyrotechnics",
  "Skywrite",
  "Catnap",
  "Flame Arrows",
  "Intellect Fortress",
  "Tiny Servant",
  "Elemental Bane",
  "Skill Empowerment",
  "Transmute Rock"
];
const names = new Set([...Object.values(ARTIFICER_BASE_SPELLS).flat(), ...ARTIFICER_SUPPLEMENT_SPELLS, 'Mending']);
export function withArtificer(name, spell) {
  return names.has(name) && !spell.classes.includes('Artificer')
    ? { ...spell, classes: [...spell.classes, 'Artificer'] } : spell;
}

// Printed p. 8. Always-prepared subclass/feat spells are outside this base allowance.
const preparedByLevel = [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];
export function artificerPreparation(level) {
  const n = Math.min(20, Math.max(1, Math.trunc(Number(level)) || 1));
  return { prepared: preparedByLevel[n - 1], cantrips: n >= 14 ? 4 : n >= 10 ? 3 : 2 };
}
