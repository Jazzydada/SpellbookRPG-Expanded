// Explicit renamed replacements; same-name revisions are resolved by primary priority.
export const REPLACEMENTS = {
  'Branding Smite': 'Shining Smite',
  Feeblemind: 'Befuddlement',
};

export function mergeCatalog(primary, supplements, replacements = REPLACEMENTS) {
  const result = { ...primary };
  for (const [name, spell] of Object.entries(supplements)) {
    const replacedName = spell?.supersedes;
    const previous = replacedName && primary[replacedName];
    // A later publication is not automatically a revision. Require explicit provenance.
    const newerRevision = previous && spell.rulesVersion === '2024'
      && Number(spell.publishedYear) > Number(previous.publishedYear || 2024);
    if (newerRevision) {
      delete result[replacedName];
      result[name] = spell;
      continue;
    }
    if (primary[name] || (replacements[name] && primary[replacements[name]])) continue;
    result[name] = spell;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

export function buildClassSpells(spells, classes, allowDunamancy = false) {
  return Object.fromEntries(classes.map(className => {
    const levels = {};
    for (const [name, spell] of Object.entries(spells)) {
      if (spell.restricted ? allowDunamancy : spell.classes.includes(className)) (levels[spell.level] ??= []).push(name);
    }
    return [className, levels];
  }));
}
