import test from 'node:test';
import assert from 'node:assert/strict';
import { SPELLS } from '../src/data.js';
import { SPELL_SUMMARIES } from '../src/summaries.js';

test('every displayed spell has a concise standalone summary in both languages', () => {
  assert.deepEqual(Object.keys(SPELL_SUMMARIES).sort(),Object.keys(SPELLS).sort());
  for (const [name, summary] of Object.entries(SPELL_SUMMARIES)) {
    for (const lang of ['en','da']) {
      assert.ok(summary[lang]?.trim(),`${name}: ${lang}`);
      assert.ok(summary[lang].length <= 240,`${name}: ${lang} must remain brief`);
      assert.ok(!summary[lang].endsWith('…'),`${name}: not a clipped excerpt`);
    }
  }
});
