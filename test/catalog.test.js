import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeCatalog, buildClassSpells } from '../src/catalog.js';

test('current rules win same-name and explicitly renamed replacements', () => {
  const current = { 'Shining Smite': 'new name', Sleep: '2024', 'Summon Dragon': '2024 dragon' };
  const older = { 'Branding Smite': 'old name', Sleep: '2014', 'Summon Draconic Spirit': 'old dragon', 'Holy Weapon': 'retained' };
  assert.deepEqual(mergeCatalog(current, older), {
    'Holy Weapon': 'retained', 'Shining Smite': 'new name', Sleep: '2024', 'Summon Dragon': '2024 dragon',
  });
  assert.equal(older.Sleep, '2014');
  assert.equal(mergeCatalog({}, { Sleep: '2014' }).Sleep, '2014');
});

test('class lists use each spell’s own level and classes', () => {
  assert.deepEqual(buildClassSpells({ A:{level:1,classes:['Wizard']}, B:{level:2,classes:['Wizard','Bard']} }, ['Wizard','Bard','Cleric']), {
    Wizard:{1:['A'],2:['B']}, Bard:{2:['B']}, Cleric:{},
  });
});

test('a documented later 2024 revision can supersede PHB without confusing publication and rules versions', () => {
  const old = { rulesVersion:'2024', publishedYear:2024 };
  const newer = { rulesVersion:'2024', publishedYear:2026, supersedes:'Sleep' };
  assert.equal(mergeCatalog({ Sleep:old }, { Sleep:newer }).Sleep, newer);
  assert.equal(mergeCatalog({ Sleep:old }, { Sleep:{...newer, supersedes:undefined} }).Sleep, old);
  assert.equal(mergeCatalog({ Sleep:old }, { Sleep:{...newer, rulesVersion:'2014'} }).Sleep, old);
  assert.deepEqual(Object.keys(mergeCatalog({ Sleep:old }, { 'New Sleep':newer })), ['New Sleep']);
});
