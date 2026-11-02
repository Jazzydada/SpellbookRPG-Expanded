import ag from './summaries-a-g.json' with { type: 'json' };
import hr from './summaries-h-r.json' with { type: 'json' };
import sz from './summaries-s-z.json' with { type: 'json' };

// Purpose-written quick descriptions; full mechanics live in the rulebooks.
export const SPELL_SUMMARIES = { ...ag, ...hr, ...sz };
