import tasha from './supplements-tasha.json' with { type: 'json' };
import elementalEvil from './supplements-eepc.json' with { type: 'json' };
import otherBooks from './supplements-other-books.json' with { type: 'json' };
import xanathar from './supplements-xanathar.json' with { type: 'json' };
import arcana from './supplements-arcana.json' with { type: 'json' };
import forge from './supplements-forge.json' with { type: 'json' };
import faerun from './supplements-faerun.json' with { type: 'json' };

import fizban from './supplements-fizban.json' with { type: 'json' };
import strixhaven from './supplements-strixhaven.json' with { type: 'json' };

import planar from './supplements-planar.json' with { type: 'json' };
import kwalish from './supplements-kwalish.json' with { type: 'json' };
import manyThings from './supplements-many-things.json' with { type: 'json' };
import icewind from './supplements-icewind.json' with { type: 'json' };

import dropsA from './supplements-drops-a.json' with { type: 'json' };
import dropsC from './supplements-drops-c.json' with { type: 'json' };

import dropsB from './supplements-drops-b.json' with { type: 'json' };

// Explicitly resolve any future overlap instead of silently replacing a reviewed text.
const supplements = {};
for (const book of [tasha, elementalEvil, otherBooks, xanathar, arcana, forge, faerun, fizban, strixhaven, planar, kwalish, manyThings, icewind, dropsA, dropsB, dropsC]) {
  for (const [name, spell] of Object.entries(book)) {
    if (supplements[name]) throw new Error(`Duplicate supplement spell: ${name}`);
    supplements[name] = spell;
  }
}
export default supplements;
