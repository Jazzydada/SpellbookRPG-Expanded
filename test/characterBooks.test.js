import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, createBook, emptyLibrary, decodeLibrary } from '../src/characterBooks.js';

function stored(books, activeId = books[0]?.id) {
  return JSON.stringify({ version: 1, activeId, books });
}

test('new character libraries are independent and round-trip without losing names or selections', () => {
  const a = createBook('Mira', 'Wizard', 5);
  const b = createBook('Niels', 'Cleric', 1);
  a.selected.Fireball = true;
  b.selected['Cure Wounds'] = true;
  const saved = { version: 1, activeId: b.id, books: [a, b] };
  const loaded = decodeLibrary(JSON.stringify(saved));
  assert.deepEqual(loaded, saved);
  loaded.books[0].selected['Mage Hand'] = true;
  assert.equal(saved.books[0].selected['Mage Hand'], undefined);
  assert.equal(loaded.books[1].selected['Mage Hand'], undefined);
  assert.notEqual(a.id, b.id);
  assert.match(STORAGE_KEY, /\.v1$/);
});

test('missing storage creates one unnamed Wizard at level five, without sharing state', () => {
  const a = decodeLibrary(null);
  const b = emptyLibrary();
  assert.equal(a.version, 1);
  assert.equal(a.books.length, 1);
  assert.equal(a.activeId, a.books[0].id);
  assert.deepEqual({ ...a.books[0], id: '' }, { id: '', name: '', className: 'Wizard', level: 5, selected: {} });
  assert.notEqual(a.activeId, b.activeId);
  a.books[0].selected.Fireball = true;
  assert.deepEqual(b.books[0].selected, {});
});

test('malformed storage and unknown versions throw instead of replacing saved data', () => {
  for (const raw of ['', '{', 'null', '[]', '{}', '{"version":2,"books":[]}', '{"version":1,"books":{}}', stored([null, false])]) {
    assert.throws(() => decodeLibrary(raw), Error, raw);
  }
  assert.throws(() => decodeLibrary({ version: 1, books: [] }), Error);
});

test('invalid fields and entries are sanitized while valid characters remain intact', () => {
  const books = decodeLibrary(stored([
    null,
    { id: 'same', name: 17, className: 'all', level: 'not a level', selected: [] },
    { id: 'same', name: 'Cleric', className: 'Cleric', level: 200, selected: { 'Cure Wounds': true } },
    { id: 'low', name: 'Low', className: 'Wizard', level: -3, selected: { Fireball: true, 'Mage Hand': true } },
    { id: 'prototype', className: 'constructor', selected: { constructor: true, toString: true } },
  ], 'missing')).books;
  assert.equal(books.length, 4);
  assert.equal(new Set(books.map(b => b.id)).size, 4);
  assert.equal(books[0].id, 'same');
  assert.equal(books[0].name, '');
  assert.equal(books[0].className, 'Wizard');
  assert.equal(books[0].level, 5);
  assert.equal(books[1].level, 20);
  assert.deepEqual(books[1].selected, { 'Cure Wounds': true });
  assert.equal(books[2].level, 1);
  assert.deepEqual(books[2].selected, { 'Mage Hand': true });
  assert.deepEqual(books[3].selected, {});
  assert.equal(decodeLibrary(stored(books, 'missing')).activeId, 'same');
});

test('loading enforces class, level and one Mystic Arcanum per unlocked level', () => {
  const book = { id: 'warlock', name: 'Ada', className: 'Warlock', level: 13, selected: {
    'Circle of Death': true, 'Create Undead': true, 'Finger of Death': true,
    'True Polymorph': true, Wish: true, 'Unknown Spell': true, Hex: true,
    'Mage Hand': 'true', EldritchBlast: false,
  } };
  const loaded = decodeLibrary(stored([book])).books[0];
  assert.deepEqual(loaded.selected, { 'Create Undead': true, 'Finger of Death': true, Hex: true });
  const lower = decodeLibrary(stored([{ ...book, level: 10 }])).books[0];
  assert.deepEqual(lower.selected, { Hex: true });
  assert.equal(book.selected['Circle of Death'], true);
});
