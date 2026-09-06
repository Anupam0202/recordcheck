import test from 'node:test';import assert from 'node:assert/strict';import {amounts,demoMatter,analyzeClaim} from '../src/core.ts';
test('regression: sentence-ending punctuation must not truncate thousands',()=>assert.deepEqual(amounts('The price is SGD 18,000.'),['SGD 18000']));
test('regression: sentence-ending punctuation must not truncate decimals',()=>assert.deepEqual(amounts('The price is SGD 18,000.50.'),['SGD 18000.50']));
test('regression: different amounts with same thousands prefix remain distinct',()=>assert.notDeepEqual(amounts('SGD 18,000.'),amounts('SGD 18,500.')));
test('regression: malformed decimal does not become a shorter amount',()=>assert.deepEqual(amounts('SGD 18,000.500'),[]));
test('regression: ungrouped sentence amount keeps all digits',()=>assert.deepEqual(amounts('It costs SGD 18000.'),['SGD 18000']));
test('regression: actual issue message shows complete canonical amounts',async()=>{const m=demoMatter();const a=await analyzeClaim(m,m.claims[0]);const issue=a.signals.find(s=>s.code==='AMOUNT_NOT_IN_PASSAGE');assert(issue.message.includes('SGD 18000'));assert(issue.message.includes('SGD 8000'));});
