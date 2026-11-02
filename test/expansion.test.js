import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPELLS, CLASS_SPELLS } from '../src/data.js';
import { isAvailable, reconcileSelection } from '../src/rules.js';
import { createBook, decodeLibrary } from '../src/characterBooks.js';
import { loadRulebook } from '../src/rulebooks.js';
const expected = JSON.parse(readFileSync(new URL('./fixtures/added-book-spells.json', import.meta.url)));
const canonical = name => name.replaceAll('’', "'");

test('every newly sourced book spell is present with correct source and rule generation', () => {
  const byName = Object.fromEntries(Object.entries(SPELLS).map(([name, spell]) => [canonical(name), spell]));
  for (const [book, names] of Object.entries(expected)) for (const name of names) {
    const spell = byName[canonical(name)];
    assert.ok(spell, `${book}: ${name}`);
    assert.equal(canonical(spell.book), canonical(book), name);
    assert.equal(spell.rulesVersion, book === 'Arcana Unleashed' ? '2024' : '2014', name);
    assert.ok(spell.source.page > 0, `${name}: printed page`);
  }
});

test('dunamancy is opt-in for each character, preserves level limits and persists preparation', () => {
  const name = 'Gravity Sinkhole';
  assert.ok(SPELLS[name].restricted);
  assert.equal(Object.values(CLASS_SPELLS.Wizard).flat().includes(name), false);
  assert.equal(isAvailable(name, 'Wizard', 7), false);
  assert.equal(isAvailable(name, 'Wizard', 7, true), true);
  assert.equal(isAvailable(name, 'Wizard', 6, true), false);
  assert.equal(isAvailable(name, 'Cleric', 7, true), true);
  assert.equal(isAvailable(name, 'Paladin', 7, true), false);
  const a = {...createBook('A', 'Wizard', 7), allowDunamancy:true, selected:{[name]:true}, prepared:{[name]:true}};
  const b = createBook('B', 'Wizard', 7);
  const saved = decodeLibrary(JSON.stringify({version:1,activeId:a.id,books:[a,b]}));
  assert.deepEqual(saved.books[0], a);
  assert.equal(saved.books[1].allowDunamancy, false);
  assert.deepEqual(reconcileSelection(a.selected, a.className, a.level, false), {});
});

test('AU summoned creatures include full stat blocks in both languages', async () => {
  for (const language of ['en','da']) {
    const rules = await loadRulebook(language);
    for (const name of ['Battle Familiar','Summon Dinosaur','Summon Plant']) {
      assert.ok(rules[name]?.length > 1000, `${language}: ${name}`);
      for (const field of ['AC','HP','STR','DEX','CON','INT','WIS','CHA']) {
        assert.match(rules[name], new RegExp(`\\b${field}\\b`), `${language}: ${name} ${field}`);
      }
    }
  }
});

test('published errata and complex edge cases remain present in both languages', async () => {
  const en = await loadRulebook('en');
  const da = await loadRulebook('da');
  assert.match(en['Healing Spirit'], /minimum of two/);
  assert.match(en['Life Transference'], /cannot be reduced/);
  assert.match(en['Holy Weapon'], /within 30 feet of the weapon/);
  assert.match(en['Mass Polymorph'], /round(?:ed)? down/);
  for (const rules of [en, da]) {
    assert.match(rules['Tiny Servant'], /Blindsight 60/);
    assert.match(rules['Tiny Servant'], /4d4/);
    assert.match(rules['Reality Break'], /10d12/);
    assert.match(rules['Time Ravage'], /Greater Restoration/);
    assert.match(rules["Jim's Magic Missile"], /5d4/);
    assert.match(rules['Summon Lesser Demons'], /CR (?:højst )?1\/4/);
  }
});
