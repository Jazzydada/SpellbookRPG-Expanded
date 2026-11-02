import { SPELLS, CLASS_SPELLS, CLASS_META } from './data.js';

export function normalizeLevel(level) {
  const value = Number(level);
  return Number.isFinite(value) ? Math.min(20, Math.max(1, Math.trunc(value))) : 1;
}

// Single-class 2024 progression. Pact Magic slots never exceed level 5.
export function maxSlotLevel(className, level) {
  const caster = CLASS_META[className]?.caster;
  if (!caster) return 0;
  const l = normalizeLevel(level);
  if (caster === 'half') return Math.min(5, Math.floor((l + 3) / 4));
  return Math.min(caster === 'warlock' ? 5 : 9, Math.ceil(l / 2));
}

export function arcanumLevels(className, level) {
  if (className !== 'Warlock') return [];
  const l = normalizeLevel(level);
  return [6, 7, 8, 9].filter(spellLevel => l >= spellLevel * 2 - 1);
}

export function availableLevels(className, level) {
  const max = maxSlotLevel(className, level);
  const arcana = arcanumLevels(className, level);
  return Object.keys(CLASS_SPELLS[className] || {}).map(Number)
    .filter(l => l <= max || arcana.includes(l)).sort((a, b) => a - b);
}

export function isAvailable(name, className, level) {
  const spell = SPELLS[name];
  return !!spell && spell.classes.includes(className)
    && availableLevels(className, level).includes(spell.level);
}

export function reconcileSelection(selected, className, level) {
  return Object.fromEntries(Object.entries(selected)
    .filter(([name, checked]) => checked && isAvailable(name, className, level)));
}

export function validLevelFilter(filter, className, level) {
  return filter === 'all' || availableLevels(className, level).includes(Number(filter))
    ? filter : 'all';
}

export function toggleSelection(selected, name, className, level) {
  const next = reconcileSelection(selected, className, level);
  if (!isAvailable(name, className, level)) return next;
  if (next[name]) { delete next[name]; return next; }
  const spellLevel = SPELLS[name].level;
  // Mystic Arcanum grants one choice of each unlocked level, not spell slots.
  if (className === 'Warlock' && spellLevel >= 6) {
    for (const old of Object.keys(next)) {
      if (SPELLS[old].level === spellLevel) delete next[old];
    }
  }
  return { ...next, [name]: true };
}
