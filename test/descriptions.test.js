import test from 'node:test';
import assert from 'node:assert/strict';
import { SPELLS } from '../src/data.js';
import { loadRulebook } from '../src/rulebooks.js';
import { parseRuleText } from '../src/ruleText.js';

const en = await loadRulebook('en');
const da = await loadRulebook('da');

test('all included spells have full descriptions in both languages, without fallback summaries', () => {
  const names = Object.keys(SPELLS).sort();
  for (const [language, book] of Object.entries({en, da})) {
    assert.deepEqual(Object.keys(book).sort(), names, language);
    for (const name of names) {
      assert.equal(typeof book[name], 'string', `${language}: ${name}`);
      assert.ok(book[name].trim().length > 40, `${language}: ${name}`);
      assert.doesNotMatch(book[name], /Roll20 Note:|drag and drop|TODO|Dansk resumé:/i, name);
    }
  }
});

test('every damage/healing/random-table die in the English rules is present in Danish', () => {
  for (const name of Object.keys(en)) {
    const expected = new Set(en[name].match(/\b\d+d\d+\b/g) || []);
    const actual = new Set(da[name].match(/\b\d+d\d+\b/g) || []);
    for (const die of expected) assert.ok(actual.has(die), `${name}: missing ${die}`);
  }
});

test('Summon forms include complete stat blocks in both languages', () => {
  const names = ['Aberration','Beast','Celestial','Construct','Dragon','Elemental','Fey','Fiend','Undead'].map(n=>`Summon ${n}`);
  for (const name of names) for (const [language,book] of Object.entries({en,da})) {
    assert.ok(book[name].length > 1400, `${language}: ${name}`);
    for (const field of ['AC','HP','STR','DEX','CON','INT','WIS','CHA']) assert.match(book[name].toUpperCase(),new RegExp(`\\b${field}\\b`),`${language}: ${name} ${field}`);
  }
  assert.match(en['Summon Fiend'],/2d10 \+ L Fire/);
  assert.match(da['Summon Fiend'],/2d10/);
});

test('PHB-specific details omitted by the original SRD extract are restored', () => {
  for (const book of [en,da]) {
    assert.match(book.Wish,/Sigil/);
    assert.match(book.Wish,/Lady of Pain/);
    assert.match(book.Reincarnate,/Aasimar/);
  }
  assert.match(en.Telekinesis,/pouring the contents from a vial/);
  assert.match(da.Telekinesis,/hælde/);
  assert.match(en["Tasha's Bubbling Cauldron"],/disappear when you cast this spell again/);
  assert.match(da["Tasha's Bubbling Cauldron"],/igen/);
  assert.match(da["Tasha's Bubbling Cauldron"],/endnu ikke forbrugt.*forsvinder.*igen/);
});

test('rule text preserves paragraphs, bullets, headings and all table cells as text', () => {
  const blocks = parseRuleText('## Effect\n\nA rule.\n\n• First\n• Second\n\n| Die | Effect |\n| --- | --- |\n| 1 | <script>literal</script> |');
  assert.deepEqual(blocks.map(b=>b.type),['heading','paragraph','list','table']);
  assert.deepEqual(blocks[3].rows,[['Die','Effect'],['1','<script>literal</script>']]);
  for (const [language,book] of Object.entries({en,da})) for (const [name,text] of Object.entries(book)) {
    for (const block of parseRuleText(text)) if (block.type==='table') {
      assert.ok(block.rows.length >= 2, `${language}: ${name}`);
      for (const row of block.rows) assert.equal(row.length,block.rows[0].length,`${language}: ${name}`);
    }
  }
  const teleport = parseRuleText(en.Teleport).find(b=>b.type==='table');
  assert.equal(teleport.rows.length,7);
  assert.deepEqual(teleport.rows[3],['Very familiar','01–05','06–13','14–24','25–00']);
});

test('complex Elemental Evil rules preserve corrected duration, escape rules and size limits', () => {
  assert.equal(SPELLS['Transmute Rock'].dur, 'Until Dispelled');
  for (const book of [en, da]) {
    assert.match(book['Transmute Rock'], /DC 20/);
    assert.match(book['Transmute Rock'], /AC 15/);
    assert.match(book['Transmute Rock'], /HP 25/);
    assert.match(book['Watery Sphere'], /Huge/);
    assert.match(book['Watery Sphere'], /Large/);
    assert.match(book.Whirlwind, /10d6/);
    assert.match(book.Whirlwind, /3d6 × 10/);
    assert.match(book['Bones of the Earth'], /1 minut/);
  }
  assert.match(en['Control Winds'], /entering, leaving or crossing/);
  assert.match(da['Control Winds'], /ind i, ud af eller gennem/);
  assert.match(en['Watery Sphere'], /end of each of their turns/);
  assert.match(da['Watery Sphere'], /slutningen af hver af deres ture/);
});
