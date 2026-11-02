import test from 'node:test';
import assert from 'node:assert/strict';
import { SPELLS } from '../src/data.js';
import { loadRulebook } from '../src/rulebooks.js';
const names=['Antagonize','Spirit of Death','Spray of Cards','Gate Seal','Warp Sense','Flock of Familiars',"Galder's Speedy Courier","Galder's Tower",'Air Bubble','Create Spelljamming Helm','Create Magen','Frost Fingers'];
test('new user sources load full bilingual rules, summaries and legacy labels', async()=>{
 for(const lang of ['en','da']) {
  const rules=await loadRulebook(lang);
  for(const name of names){
   assert.equal(SPELLS[name].rulesVersion,'2014',name);
   assert.ok(SPELLS[name].summary[lang].length>10,name);
   assert.ok(rules[name].length>150,name);
   if(name!=="Galder's Tower") assert.ok(SPELLS[name].source.page>0,name);
  }
 }
});
test('critical edge cases and explicitly incomplete sources remain visible',async()=>{
 const da=await loadRulebook('da');
 assert.match(da['Antagonize'],/Reaction/);
 assert.match(da['Spray of Cards'],/2d10/);
 assert.match(da['Warp Sense'],/15/);
 assert.match(da['Gate Seal'],/niveau 6/);
 assert.match(da["Galder's Tower"],/100/);
 assert.match(da["Galder's Tower"],/et år/);
 assert.match(da['Create Magen'],/Wish/);
 assert.match(da['Create Magen'],/6d8 \+ 24/);
 assert.match(da['Frost Fingers'],/2d8/);
 assert.equal(SPELLS['Spirit of Death'].sourceIncomplete,true);
 for(const lang of ['en','da']) assert.ok(SPELLS['Spirit of Death'].accessNote[lang]);
 assert.equal(SPELLS['Summon Draconic Spirit'],undefined);
 assert.equal(SPELLS['Wither and Bloom'].book,'Arcana Unleashed');
});
