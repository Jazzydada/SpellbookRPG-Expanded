import { CLASS_META, SPELLS } from './data.js';
import { normalizeLevel, reconcileSelection, toggleSelection } from './rules.js';

export const STORAGE_KEY = 'spellbook-rpg.character-books.v1';

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validClass = value => typeof value === 'string' && Object.hasOwn(CLASS_META, value) ? value : 'Wizard';
const validLevel = value => (typeof value === 'number' || (typeof value === 'string' && value.trim())) && Number.isFinite(Number(value))
  ? normalizeLevel(value) : 5;
const newId = () => globalThis.crypto?.randomUUID?.()
  ?? `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createBook(name = '', className = 'Wizard', level = 5) {
  return {
    id: newId(),
    name: typeof name === 'string' ? name : '',
    className: validClass(className),
    level: validLevel(level),
    selected: {},
  };
}

export function emptyLibrary() {
  const book = createBook();
  return { version: 1, activeId: book.id, books: [book] };
}

// Missing storage is a fresh library. Invalid storage must be surfaced before any write.
export function decodeLibrary(raw) {
  if (raw === null || raw === undefined) return emptyLibrary();
  if (typeof raw !== 'string') throw new Error('Spellbook storage must be JSON text.');
  let saved;
  try { saved = JSON.parse(raw); }
  catch { throw new Error('Spellbook storage contains invalid JSON.'); }
  if (!isRecord(saved) || saved.version !== 1 || !Array.isArray(saved.books)) {
    throw new Error('Unsupported spellbook library format.');
  }
  if (saved.books.length === 0) return emptyLibrary();

  const ids = new Set();
  const books = saved.books.filter(isRecord).map(entry => {
    const book = createBook(entry.name, entry.className, entry.level);
    if (typeof entry.id === 'string' && entry.id.trim() && !ids.has(entry.id)) book.id = entry.id;
    ids.add(book.id);

    // Only catalog-owned names and actual booleans are selections. This also rejects
    // inherited object-property names before calling the gameplay helpers.
    const selected = Object.fromEntries(Object.entries(isRecord(entry.selected) ? entry.selected : {})
      .filter(([name, checked]) => checked === true && Object.hasOwn(SPELLS, name)));
    const available = reconcileSelection(selected, book.className, book.level);
    book.selected = Object.keys(available).reduce((result, name) =>
      toggleSelection(result, name, book.className, book.level), {});
    return book;
  });
  if (books.length === 0) throw new Error('Spellbook library contains no readable character entries.');
  const activeId = books.some(book => book.id === saved.activeId) ? saved.activeId : books[0].id;
  return { version: 1, activeId, books };
}
