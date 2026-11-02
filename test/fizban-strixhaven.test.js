import test from 'node:test';
import assert from 'node:assert/strict';
import { SPELLS, BOOKS, CLASS_SPELLS } from '../src/data.js';
import { loadRulebook } from '../src/rulebooks.js';
import { mergeCatalog } from '../src/catalog.js';

const added = {
  "Fizban's Treasury of Dragons": ["Nathair's Mischief", "Rime's Binding Ice", "Ashardalon's Stride", "Raulothim's Psychic Lance", "Fizban's Platinum Shield", 'Draconic Transformation'],
  'Strixhaven: A Curriculum of Chaos': ['Silvery Barbs', 'Borrowed Knowledge', 'Vortex Warp', 'Kinetic Jaunt'],
};
test('both supplied books have complete bilingual entries and no duplicate spell identities', async () => {
  const en = await loadRulebook('en');
  const da = await loadRulebook('da');
  for (const [book, names] of Object.entries(added)) {
    assert.ok(BOOKS.includes(book));
    for (const name of names) {
      const spell = SPELLS[name];
      assert.equal(spell.book, book);
      assert.equal(spell.rulesVersion, '2014');
      assert.equal(spell.publishedYear, 2021);
      assert.ok(spell.source.page > 0);
      assert.ok(en[name].length > 200, name);
      assert.ok(da[name].length > 200, name);
      assert.equal(new Set(spell.classes).size, spell.classes.length);
    }
  }
  const normalized = Object.keys(SPELLS).map(n => n.toLowerCase().replaceAll('’', "'"));
  assert.equal(normalized.length, new Set(normalized).size);
  for (const name of ["Ashardalon's Stride", 'Kinetic Jaunt', 'Vortex Warp']) {
    assert.ok(CLASS_SPELLS.Artificer[SPELLS[name].level].includes(name));
  }
});
test('newer Wither and Bloom and user-preferred Summon Dragon are the sole selected versions', () => {
  assert.equal(SPELLS['Wither and Bloom'].book, 'Arcana Unleashed');
  assert.equal(SPELLS['Wither and Bloom'].rulesVersion, '2024');
  assert.equal(SPELLS['Summon Dragon'].rulesVersion, '2024');
  assert.equal(SPELLS['Summon Draconic Spirit'], undefined);
  const merged = mergeCatalog(SPELLS, {
    'Wither and Bloom': {rulesVersion:'2014'},
    'Summon Draconic Spirit': {rulesVersion:'2014'},
  });
  assert.equal(merged['Wither and Bloom'], SPELLS['Wither and Bloom']);
  assert.equal(merged['Summon Draconic Spirit'], undefined);
});
test('complex supplied mechanics survive both translations', async () => {
  for (const language of ['en','da']) {
    const rules = await loadRulebook(language);
    for (const face of [1,2,3,4]) assert.ok(rules["Nathair's Mischief"].includes(`| ${face} |`));
    assert.match(rules["Rime's Binding Ice"], /3d8/);
    assert.match(rules["Ashardalon's Stride"], /1d6/);
    assert.match(rules["Raulothim's Psychic Lance"], /7d6/);
    assert.match(rules["Fizban's Platinum Shield"], /Evasion/);
    assert.match(rules['Draconic Transformation'], /6d8/);
    assert.match(rules['Kinetic Jaunt'], /1d8/);
    assert.match(rules['Silvery Barbs'], /d20/);
    assert.match(rules['Summon Dragon'], /Multiattack/);
  }
});
