import tasha from './supplements-tasha.json' with { type: 'json' };
import elementalEvil from './supplements-eepc.json' with { type: 'json' };

// Explicitly resolve any future overlap instead of silently replacing a reviewed text.
const supplements = {};
for (const book of [tasha, elementalEvil]) {
  for (const [name, spell] of Object.entries(book)) {
    if (supplements[name]) throw new Error(`Duplicate supplement spell: ${name}`);
    supplements[name] = spell;
  }
}
export default supplements;
