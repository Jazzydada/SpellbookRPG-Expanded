import test from 'node:test';
import assert from 'node:assert/strict';
import { ARTIFICER_BASE_SPELLS } from '../src/artificer.js';
import { CLASS_SPELLS, CLASS_META, SPELLS } from '../src/data.js';
import { maxSlotLevel, isAvailable, reconcileSelection } from '../src/rules.js';
import { mergeCatalog } from '../src/catalog.js';

test('Tasha Artificer list resolves to current catalogue entries with no duplicates', () => {
  assert.equal(Object.values(ARTIFICER_BASE_SPELLS).flat().length, 95);
  for (const [level, names] of Object.entries(ARTIFICER_BASE_SPELLS)) {
    for (const name of names) {
      assert.equal(SPELLS[name].level, Number(level), name);
      assert.ok(CLASS_SPELLS.Artificer[level].includes(name), name);
    }
  }
  const all = Object.values(CLASS_SPELLS.Artificer).flat();
  assert.equal(all.length, new Set(all).size);
  assert.equal(CLASS_META.Artificer.rulesVersion, '2014');
  assert.equal(SPELLS['Cure Wounds'].rulesVersion, '2024');
});

test('Artificer unlocks half-caster spells from level 1 and retains cantrips', () => {
  for (const [level, expected] of [[1,1],[4,1],[5,2],[8,2],[9,3],[12,3],[13,4],[16,4],[17,5],[20,5]]) {
    assert.equal(maxSlotLevel('Artificer', level), expected);
  }
  assert.ok(isAvailable('Mending', 'Artificer', 1));
  assert.ok(isAvailable('Cure Wounds', 'Artificer', 1));
  assert.equal(isAvailable('Fireball', 'Artificer', 20), false);
  assert.deepEqual(reconcileSelection({'Web':true,'Mending':true}, 'Artificer', 4), {Mending:true});
});

test('unverified replacement pairs are preserved rather than guessed', () => {
  const current = {'Summon Dragon':{},'Find Steed':{},'Homunculus Servant':{}};
  const older = {'Summon Draconic Spirit':{},'Find Greater Steed':{},'Create Homunculus':{}};
  assert.equal(Object.keys(mergeCatalog(current,older)).length,6);
});
