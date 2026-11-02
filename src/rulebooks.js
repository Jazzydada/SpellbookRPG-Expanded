import { SPELLS, SUPPLEMENT_RULE_NAMES } from './data.js';

function selectRules(primary, supplemental) {
  return Object.fromEntries(Object.keys(SPELLS).map(name => [name,
    SUPPLEMENT_RULE_NAMES.includes(name) ? supplemental[name] : primary[name],
  ]));
}
// Load the selected language once, including every PHB spell's full rules.
export async function loadRulebook(language) {
  const { default: supplements } = await import('./supplementRules.js');
  const extraRules = Object.fromEntries(Object.entries(supplements).map(([name, spell]) => [name, spell[language]]));
  if (language === 'da') {
    const [ag, hr, sz] = await Promise.all([
      import('./rules-da-a-g.js'),
      import('./rules-da-h-r.js'),
      import('./rules-da-s-z.js'),
    ]);
    return selectRules({ ...ag.default, ...hr.default, ...sz.default }, extraRules);
  }
  const [srd, extra] = await Promise.all([
    import('./srdRules.js'),
    import('./rules-en-extra.js'),
  ]);
  return selectRules({ ...srd.default, ...extra.default }, extraRules);
}
