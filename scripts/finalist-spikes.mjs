import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {demoMatter,analyzeMatter,makeReview,stateFor} from '../src/core.ts';
const m=demoMatter();m.claims=[m.claims[2]];const a=(await analyzeMatter(m))[0];const r=makeReview(a,'reviewed','Spike reviewer','Compared full text against the claim.',true);m.documents[2].text+='\nRevised context.';const changed=(await analyzeMatter(m))[0];assert.equal(stateFor(changed,r),'stale');
// C02: metadata index change detector only, not PDF ingestion/export.
const bundle=[{id:'A',pages:2},{id:'B',pages:3}];const index=docs=>{let start=1;return docs.map(d=>{const row={id:d.id,start,end:start+d.pages-1};start+=d.pages;return row;});};const initial=index(bundle);const reordered=index([...bundle].reverse());assert.notEqual(initial.find(d=>d.id==='A').start,reordered.find(d=>d.id==='A').start);
// C03: explicit received/completeness/reviewer approval predicate; no legal completeness inference.
const canClose=x=>x.received&&x.requirementsSatisfied&&x.reviewed;assert.equal(canClose({received:true,requirementsSatisfied:false,reviewed:true}),false);assert.equal(canClose({received:true,requirementsSatisfied:true,reviewed:true}),true);
const rows=[{candidate:'C01',test:'Source edit revokes previous review',result:'PASS',scope:'Actual SHA-256 engine; demand and entry burden untested.'},{candidate:'C02',test:'Reordering pages changes computed index targets',result:'PASS—METADATA ONLY',scope:'No PDF ingestion/export implemented; core browser PDF dependency remains blocked.'},{candidate:'C03',test:'Received-but-incomplete cannot close; explicit complete+reviewed can',result:'PASS—STATE PREDICATE ONLY',scope:'No real legal checklist, collaboration, persistence or adoption test.'}];
await writeFile('docs/finalist-spike-results.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows));
