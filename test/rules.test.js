import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPELLS, SCHOOL_COLORS, T } from '../src/data.js';
import { normalizeLevel, maxSlotLevel, arcanumLevels, availableLevels, isAvailable, reconcileSelection, validLevelFilter, toggleSelection } from '../src/rules.js';

import { SPELLS as PHB_SPELLS } from '../src/spells2024.js';
import { buildClassSpells } from '../src/catalog.js';

// Independent transcription of the PHB 2024 class tables, retrieved via Roll20.
const expected = JSON.parse(readFileSync(new URL('./fixtures/phb2024-class-lists.json', import.meta.url)));
test('all 391 PHB spells match the independently sourced class tables', () => {
  assert.equal(Object.keys(PHB_SPELLS).length, 391);
  const CLASS_SPELLS = buildClassSpells(PHB_SPELLS, Object.keys(expected));
  const counts = { Bard:140, Cleric:117, Druid:135, Paladin:51, Ranger:61, Sorcerer:150, Warlock:91, Wizard:242 };
  for (const [className, levels] of Object.entries(expected)) {
    assert.equal(Object.values(CLASS_SPELLS[className]).flat().length, counts[className]);
    assert.deepEqual(Object.keys(CLASS_SPELLS[className]).sort(), Object.keys(levels).sort());
    for (const [level,names] of Object.entries(levels)) {
      assert.deepEqual([...CLASS_SPELLS[className][level]].sort(), [...names].sort(), `${className} level ${level}`);
    }
  }
});
test('every record has usable, reviewed metadata and a source', () => {
  for (const [name,spell] of Object.entries(SPELLS)) {
    assert.ok(Number.isInteger(spell.level) && spell.level>=0 && spell.level<=9, name);
    assert.ok(SCHOOL_COLORS[spell.school], name);
    for (const key of ['cast','range','components','dur']) assert.ok(typeof spell[key]==='string' && spell[key].trim(), `${name}: ${key}`);
    assert.ok(spell.classes.length && new Set(spell.classes).size===spell.classes.length, name);
    assert.match(spell.reviewed,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(spell.book && ['2014','2024'].includes(spell.rulesVersion), name);
    assert.equal(new URL(spell.source.url).protocol,'https:');
  }
  for (const key of Object.keys(T.en)) assert.equal(typeof T.da[key],'string', key);
});
test('2024 single-class slot progression at all twenty character levels', () => {
  const full=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9];
  const half=[1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5];
  const pact=[1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5];
  for (const c of ['Wizard','Sorcerer','Cleric','Druid','Bard']) assert.deepEqual(full.map((_,i)=>maxSlotLevel(c,i+1)),full);
  for (const c of ['Paladin','Ranger']) assert.deepEqual(half.map((_,i)=>maxSlotLevel(c,i+1)),half);
  assert.deepEqual(pact.map((_,i)=>maxSlotLevel('Warlock',i+1)),pact);
  assert.equal(maxSlotLevel('Unknown',20),0);
  assert.equal(normalizeLevel(NaN),1);assert.equal(normalizeLevel(99),20);assert.equal(normalizeLevel(-1),1);
});
test('Mystic Arcanum unlocks separately and allows one choice per unlocked level', () => {
  for (const [level,arcana] of [[10,[]],[11,[6]],[12,[6]],[13,[6,7]],[15,[6,7,8]],[17,[6,7,8,9]]]) {
    assert.deepEqual(arcanumLevels('Warlock',level),arcana);
    assert.deepEqual(availableLevels('Warlock',level).filter(l=>l>=6),arcana);
  }
  assert.deepEqual(arcanumLevels('Wizard',20),[]);
  let s=toggleSelection({},'Circle of Death','Warlock',11);
  s=toggleSelection(s,'Create Undead','Warlock',11);
  assert.deepEqual(s,{'Create Undead':true});
  s=toggleSelection(s,'Finger of Death','Warlock',13);
  assert.deepEqual(s,{'Create Undead':true,'Finger of Death':true});
  assert.deepEqual(toggleSelection(s,'Wish','Warlock',20),s);
});
test('lowering level removes unavailable selections and resets a stale filter', () => {
  const selected={'Wish':true,'Fireball':true,'Mage Hand':true};
  assert.deepEqual(reconcileSelection(selected,'Wizard',1),{'Mage Hand':true});
  assert.equal(validLevelFilter('9','Wizard',1),'all');
  assert.equal(validLevelFilter('0','Wizard',1),'0');
  assert.deepEqual(reconcileSelection({'Create Undead':true,'Hex':true},'Warlock',10),{'Hex':true});
  assert.ok(isAvailable('Cure Wounds','Paladin',1));
  assert.ok(isAvailable("Hunter's Mark",'Ranger',1));
  assert.ok(isAvailable('True Resurrection','Cleric',17));
  assert.ok(!isAvailable('Silence','Wizard',20));
});
test('corrected levels, schools and obsolete names stay corrected', () => {
  assert.equal(SPELLS.Enthrall.level,2);
  assert.equal(SPELLS['Flaming Sphere'].school,'Evocation');
  assert.equal(SPELLS["Crusader's Mantle"].school,'Evocation');
  assert.equal(SPELLS['Cure Wounds'].school,'Abjuration');
  for (const n of ['Branding Smite','Feeblemind','Earth Tremor','Holy Weapon']) assert.equal(PHB_SPELLS[n],undefined);
  for (const n of ['Branding Smite','Feeblemind']) assert.equal(SPELLS[n],undefined);
  for (const n of ['Shining Smite','Befuddlement','Power Word Fortify']) assert.ok(SPELLS[n]);
  assert.equal(SPELLS['Chill Touch'].range,'Touch');
  assert.match(SPELLS['Spiritual Weapon'].dur,/Concentration/);
  assert.match(SPELLS.Sleep.dur,/Concentration/);
});

test('SRD mechanics retain the 2024 revisions and official errata', async () => {
  const {default:rules}=await import('../src/srdRules.js');
  assert.equal(Object.keys(rules).length,339);
  assert.match(rules.Sleep,/Wisdom saving throw/);
  assert.doesNotMatch(rules.Sleep,/5d8/);
  assert.match(rules.Counterspell,/Constitution saving throw/);
  assert.match(rules.Counterspell,/isn't expended/);
  assert.match(rules['Inflict Wounds'],/2d10/);
  for (const name of ['Conjure Elemental','Conjure Minor Elementals','Conjure Woodland Beings']) assert.match(rules[name],/increases by 1d8/);
  assert.match(rules['Conjure Fey'],/increases by 1d12/);
  assert.match(rules['Giant Insect'],/HP 30 \+ 10 for each spell level above 4/);
  for (const name of ['Animal Shapes','Polymorph','Shapechange','True Polymorph']) assert.match(rules[name],/Temporary Hit Points vanish/);
  assert.match(rules.Shapechange,/first form/);
});
