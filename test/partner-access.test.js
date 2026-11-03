import test from 'node:test';
import assert from 'node:assert/strict';
import { isAvailable, toggleSelection } from '../src/rules.js';
test('partner permission does not bypass class or level restrictions', () => {
  const n = 'Freedom of the Waves';
  assert.equal(isAvailable(n, 'Druid', 5), false);
  assert.equal(isAvailable(n, 'Druid', 5, false, true), true);
  assert.equal(isAvailable(n, 'Druid', 1, false, true), false);
  assert.equal(isAvailable(n, 'Wizard', 20, false, true), false);
  assert.deepEqual(toggleSelection({}, n, 'Druid', 5), {});
  assert.equal(toggleSelection({}, n, 'Druid', 5, false, true)[n], true);
});
