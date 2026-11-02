import test from 'node:test';
import assert from 'node:assert/strict';
import { SPELLS, CLASS_SPELLS } from '../src/data.js';
import { loadRulebook } from '../src/rulebooks.js';
import { toggleSelection } from '../src/rules.js';

test('catalogue identities remain unique after typography normalization', () => {
  const names = Object.keys(SPELLS).map(n => n.normalize('NFKC').replace(/[’‘]/g,"'").toLowerCase().replace(/[^a-z0-9]/g,''));
  assert.equal(new Set(names).size, names.length);
  assert.ok(SPELLS['Create Homunculus']);
  assert.equal(SPELLS['Create Homunculus'].level,6);
  assert.equal(SPELLS['Homunculus Servant'].level,2);
});

test('Forge class grants Mending independently of optional cantrips', () => {
  assert.deepEqual(toggleSelection({},'Mending','Artificer',1),{Mending:true});
  assert.ok(CLASS_SPELLS.Artificer[0].includes('True Strike'));
  assert.ok(CLASS_SPELLS.Artificer[2].includes('Arcane Vigor'));
  assert.ok(CLASS_SPELLS.Artificer[5].includes('Circle of Power'));
});

test('both languages load the new source text and homunculus statblock', async () => {
  for (const language of ['en','da']) {
    const rules = await loadRulebook(language);
    assert.match(rules['Homunculus Servant'], /Magic Bond/);
    assert.match(rules['Homunculus Servant'], /Channel Magic/);
    assert.match(rules['Homunculus Servant'], /\| DEX \| 15/);
    for (const [name, spell] of Object.entries(SPELLS)) {
      assert.ok(rules[name]?.trim(),`${language}: ${name}`);
      if (spell.book === 'Forgotten Realms: Heroes of Faerûn') {
        assert.equal(spell.rulesVersion,'2024');
        assert.equal(spell.publishedYear,2025);
      }
    }
  }
});


test('both requested books are complete without duplicating older identities', () => {
  assert.equal(Object.values(SPELLS).filter(s => s.book === 'Forgotten Realms: Heroes of Faerûn').length,19);
  assert.equal(Object.values(SPELLS).filter(s => s.book === 'Eberron: Forge of the Artificer').length,1);
  assert.equal(Object.keys(SPELLS).length,557);
  assert.equal(SPELLS['Blade of Disaster'].publishedYear,2025);
});
