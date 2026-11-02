import { SPELLS } from './data.js';
import ag from './summaries-a-g.json' with { type: 'json' };
import hr from './summaries-h-r.json' with { type: 'json' };
import sz from './summaries-s-z.json' with { type: 'json' };

// Purpose-written quick descriptions; full mechanics live in the rulebooks.
const existing = { ...ag, ...hr, ...sz };
export const SPELL_SUMMARIES = Object.fromEntries(Object.entries(SPELLS).map(
  ([name, spell]) => [name, spell.summary || existing[name]],
));
