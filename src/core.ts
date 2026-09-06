export type Document = { id: string; title: string; text: string };
export type Claim = { id: string; text: string; kind: 'fact' | 'legal'; sourceId: string; lineStart: number; lineEnd: number; quote: string };
export type Matter = { schemaVersion: 1; id: string; title: string; jurisdiction: string; synthetic: boolean; documents: Document[]; claims: Claim[] };
export type Signal = { code: string; message: string };
export type Analysis = { claimId: string; fingerprint: string; sourceHash: string | null; passage: string; signals: Signal[]; mechanicallyClear: boolean };
export type Review = { claimId: string; fingerprint: string; disposition: 'reviewed' | 'excluded'; reviewer: string; reason: string; at: string };
export type ReviewState = 'blocked' | 'needs-review' | 'reviewed' | 'excluded' | 'stale';
export const LIMITS = { bytes: 204800, documents: 12, claims: 30, sourceChars: 100000, docChars: 30000, lines: 1000, claimChars: 1500, quoteChars: 1200 } as const;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
function obj(v: unknown, name: string, keys: string[]): Record<string, unknown> {
  if (!isObj(v)) throw new Error(`${name} must be an object.`);
  if (Object.keys(v).some(k => !keys.includes(k))) throw new Error(`${name} contains unsupported fields. Import working-matter JSON, not a review report.`);
  return v;
}
function str(v: unknown, name: string, max: number, empty = false): string {
  if (typeof v !== 'string' || (!empty && !v.trim()) || v.length > max || /\u0000/.test(v)) throw new Error(`${name} must be ${empty ? 'text' : 'nonempty text'} of at most ${max} characters.`);
  return v;
}
function id(v: unknown, name: string): string {
  const s = str(v, name, 40); if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(s)) throw new Error(`${name} must use letters, numbers, hyphens or underscores.`); return s;
}
export function lines(text: string): string[] { return text.replace(/\r\n?/g, '\n').split('\n'); }
export function validateMatter(input: unknown): Matter {
  const m = obj(input, 'Matter', ['schemaVersion','id','title','jurisdiction','synthetic','documents','claims']);
  if (m.schemaVersion !== 1 || typeof m.synthetic !== 'boolean') throw new Error('Expected schemaVersion 1 and a synthetic boolean.');
  if (!Array.isArray(m.documents) || m.documents.length > LIMITS.documents) throw new Error('Use at most 12 documents.');
  if (!Array.isArray(m.claims) || m.claims.length > LIMITS.claims) throw new Error('Use at most 30 claims.');
  const documents: Document[] = m.documents.map((v, i) => {
    const d = obj(v, `Document ${i+1}`, ['id','title','text']);
    const text = str(d.text, 'Document text', LIMITS.docChars, true);
    if (lines(text).length > LIMITS.lines) throw new Error('Use at most 1,000 lines per document.');
    return { id: id(d.id, 'Document ID'), title: str(d.title, 'Document title', 160), text };
  });
  if (documents.reduce((n,d) => n+d.text.length,0) > LIMITS.sourceChars) throw new Error('Source text exceeds 100,000 characters.');
  const claims: Claim[] = m.claims.map((v,i) => {
    const c = obj(v, `Claim ${i+1}`, ['id','text','kind','sourceId','lineStart','lineEnd','quote']);
    if (c.kind !== 'fact' && c.kind !== 'legal') throw new Error('Claim kind must be fact or legal.');
    if (!Number.isSafeInteger(c.lineStart) || !Number.isSafeInteger(c.lineEnd) || (c.lineStart as number)<1 || (c.lineEnd as number)<(c.lineStart as number) || (c.lineEnd as number)>LIMITS.lines || (c.lineEnd as number)-(c.lineStart as number)>30) throw new Error('Claim line ranges must be 1–1,000, ascending, and at most 31 lines.');
    const sourceId = str(c.sourceId, 'Source ID', 40, true);
    if (sourceId && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(sourceId)) throw new Error('Invalid source ID.');
    return { id:id(c.id,'Claim ID'), text:str(c.text,'Claim text',LIMITS.claimChars), kind:c.kind, sourceId, lineStart:c.lineStart as number, lineEnd:c.lineEnd as number, quote:str(c.quote,'Quote',LIMITS.quoteChars,true) };
  });
  for (const [name,rows] of [['document',documents],['claim',claims]] as const) if (new Set(rows.map(r=>r.id)).size !== rows.length) throw new Error(`Duplicate ${name} IDs are not allowed.`);
  return { schemaVersion:1, id:id(m.id,'Matter ID'), title:str(m.title,'Matter title',160), jurisdiction:str(m.jurisdiction,'Jurisdiction',100), synthetic:m.synthetic, documents, claims };
}
export function parseMatter(text: string): Matter {
  if (new TextEncoder().encode(text).byteLength > LIMITS.bytes) throw new Error('JSON exceeds the 200 KiB file limit.');
  let parsed: unknown; try { parsed=JSON.parse(text); } catch { throw new Error('Invalid JSON. Load the sample or fix the JSON syntax.'); }
  return validateMatter(parsed);
}
export function normalize(s: string): string { return s.replace(/\s+/g,' ').trim(); }
export async function sha256(s: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error('Secure local hashing is unavailable. Open on localhost or HTTPS; no analysis was approved.');
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function dates(s: string): string[] { return [...new Set(s.match(/\b\d{4}-\d{2}-\d{2}\b/g)||[])]; }
export function amounts(s: string): string[] {
  return [...new Set((s.match(/(?:SGD\s*|S\$\s*)\d+(?:,\d{3})*(?:\.\d{1,2})?(?!\d|,\d|\.\d)/gi)||[]).map(v=>'SGD '+v.replace(/^(SGD\s*|S\$\s*)/i,'').replace(/,/g,'')))];
}
export async function analyzeClaim(matter: Matter, c: Claim): Promise<Analysis> {
  const d = matter.documents.find(d=>d.id===c.sourceId);
  const sourceHash = d ? await sha256(JSON.stringify(d)) : null;
  const fingerprint = await sha256(JSON.stringify({matterId:matter.id,title:matter.title,jurisdiction:matter.jurisdiction,synthetic:matter.synthetic,claim:c,document:d??null}));
  const signals: Signal[] = [];
  const add=(code:string,message:string)=>signals.push({code,message});
  let passage='';
  if (!c.sourceId) add('MISSING_CITATION','No exhibit has been cited. Select a source and exact lines.');
  else if (!d) add('MISSING_SOURCE',`Cited exhibit ${c.sourceId} is not in this matter.`);
  else {
    const ls=lines(d.text);
    if (c.lineEnd>ls.length || !d.text.trim()) add('MISSING_LINES',`The cited range is not available in ${d.id}.`);
    else {
      passage=ls.slice(c.lineStart-1,c.lineEnd).join('\n');
      if (!passage.trim()) add('EMPTY_PASSAGE','The cited lines contain no text.');
      if (c.quote && !normalize(passage).includes(normalize(c.quote))) add('QUOTE_MISMATCH','The supplied quote does not occur in the cited lines (whitespace-normalized, case-sensitive).');
      const unsupportedDates=dates(c.text).filter(v=>!dates(passage).includes(v));
      const unsupportedAmounts=amounts(c.text).filter(v=>!amounts(passage).includes(v));
      if (unsupportedDates.length) add('DATE_NOT_IN_PASSAGE',`Draft date(s) not found in the cited lines: ${unsupportedDates.join(', ')}. This is a literal check, not a finding that the date is wrong.`);
      if (unsupportedAmounts.length) add('AMOUNT_NOT_IN_PASSAGE',`Draft amount(s) not found in the cited lines: ${unsupportedAmounts.join(', ')}. Source amounts: ${amounts(passage).join(', ')||'none recognized'}. No arithmetic or currency inference was performed.`);
      if (/ignore\s+(all\s+)?(previous|prior)\s+instructions|reveal\s+(the\s+)?(api\s*)?key|system\s*prompt/i.test(passage)) add('UNTRUSTED_INSTRUCTIONS','The passage contains instruction-like text. It was treated only as evidence text, never executed. Human review is required.');
    }
  }
  if (c.kind==='legal') add('LEGAL_ABSTENTION','Legal proposition: this tool cannot verify authority, applicability or legal support. Use primary legal sources and qualified review outside this tool.');
  return {claimId:c.id,fingerprint,sourceHash,passage,signals,mechanicallyClear:signals.length===0};
}
export async function analyzeMatter(matter: Matter, signal?: AbortSignal): Promise<Analysis[]> {
  validateMatter(matter);
  const result: Analysis[]=[];
  for (const c of matter.claims) {
    if (signal?.aborted) throw new Error('Review cancelled.');
    result.push(await analyzeClaim(matter,c));
  }
  if (signal?.aborted) throw new Error('Review cancelled.');
  return result;
}
export function stateFor(a: Analysis, r?: Review): ReviewState {
  if (r && r.fingerprint!==a.fingerprint) return 'stale';
  if (r?.disposition==='excluded') return 'excluded';
  if (r?.disposition==='reviewed' && a.mechanicallyClear) return 'reviewed';
  return a.mechanicallyClear ? 'needs-review':'blocked';
}
export function makeReview(a: Analysis, disposition: 'reviewed'|'excluded', reviewer: string, reason: string, acknowledged: boolean, at = new Date().toISOString()): Review {
  if (!acknowledged) throw new Error('Confirm you inspected the source and understand the scope.');
  if (disposition!=='reviewed' && disposition!=='excluded') throw new Error('Invalid review disposition.');
  if (disposition==='reviewed'&&!a.mechanicallyClear) throw new Error('Resolve mechanical issues before reviewing, or explicitly exclude this claim.');
  str(reviewer,'Reviewer label',100); str(reason,'Review reason',800);
  if (reason.trim().length<12) throw new Error('Record a meaningful reason of at least 12 characters.');
  if (Number.isNaN(Date.parse(at))) throw new Error('Invalid review timestamp.');
  return {claimId:a.claimId,fingerprint:a.fingerprint,disposition,reviewer:reviewer.trim(),reason:reason.trim(),at};
}
export function summarize(analyses: Analysis[], reviews: Record<string,Review>) {
  const counts: Record<ReviewState,number>={blocked:0,'needs-review':0,reviewed:0,excluded:0,stale:0};
  for (const a of analyses) counts[stateFor(a,Object.hasOwn(reviews,a.claimId)?reviews[a.claimId]:undefined)]++;
  return {...counts,total:analyses.length,unresolved:counts.blocked+counts['needs-review']+counts.stale,allDisposed:analyses.length>0&&counts.blocked+counts['needs-review']+counts.stale===0};
}
export function report(matter: Matter, analyses: Analysis[], reviews: Record<string,Review>): string {
  const s=summarize(analyses,reviews);
  const safe=(s:string)=>s.replace(/[\r\n]/g,' ').replace(/[\[\]<>`]/g,'');
  const content=[`# RecordCheck review packet — ${safe(matter.title)}`,`\n${matter.synthetic?'SYNTHETIC DEMONSTRATION — NOT REAL EVIDENCE':'USER-SUPPLIED MATERIAL — NOT AUTHENTICATED'}`,`\nJurisdiction label: ${safe(matter.jurisdiction)}. Not legal advice or a filing/compliance certificate.`, `\n${s.unresolved} unresolved of ${s.total}. Reviewed: ${s.reviewed}. Excluded: ${s.excluded}.`, '\nLocal, self-attested review records only: not authenticated identities, signatures or tamperproof audit evidence. A quote match does NOT establish factual/semantic support. Dates/amounts are literal checks only.'];
  for (const a of analyses) {
    const c=matter.claims.find(c=>c.id===a.claimId)!; const r=Object.hasOwn(reviews,a.claimId)?reviews[a.claimId]:undefined;
    content.push(`\n## ${c.id} — ${stateFor(a,r).toUpperCase()}`,safe(c.text),`Source: ${c.sourceId||'NONE'}, lines ${c.lineStart}–${c.lineEnd}.`,`Fingerprint: ${a.fingerprint}`,`Source SHA-256: ${a.sourceHash||'MISSING'}`);
    if (a.passage) content.push('Cited passage (plain text; untrusted):',...lines(a.passage).map(l=>'    '+l));
    for (const issue of a.signals) content.push(`- ${issue.code}: ${safe(issue.message)}`);
    if (r) content.push(`Self-attested ${safe(r.disposition)} by ${safe(r.reviewer)} at ${r.at}. Reason: ${safe(r.reason)}. ${r.fingerprint===a.fingerprint?'Revision matches.':'STALE — earlier revision, not current approval.'}`);
    else content.push('Human disposition: NOT RECORDED.');
  }
  return content.join('\n')+'\n';
}
export function demoMatter(): Matter { return {
  schemaVersion:1,id:'demo-sg-01',title:'Meridian supply dispute',jurisdiction:'Singapore — synthetic example',synthetic:true,
  documents:[
    {id:'E1',title:'Purchase order — synthetic',text:'SYNTHETIC DEMO — not a real transaction.\nPurchase order: Meridian Studio / Harbor Supplies.\nThe agreed price is SGD 8,000.\nDelivery is scheduled for 2026-08-15.\nPayment is due after delivery.'},
    {id:'E2',title:'Delivery email — synthetic',text:'SYNTHETIC DEMO — not a real email.\nFrom: Harbor Supplies (fictional).\nWe delivered the goods on 2026-08-18.\nThe customer has not confirmed acceptance.'},
    {id:'E3',title:'Account note — synthetic',text:'SYNTHETIC DEMO — not an authentic record.\nMeridian paid SGD 8,000 on 2026-08-20.\nThis note records a payment, not an admission of liability.'}
  ],
  claims:[
    {id:'C1',text:'The agreed price was SGD 18,000.',kind:'fact',sourceId:'E1',lineStart:3,lineEnd:3,quote:'The agreed price is SGD 18,000.'},
    {id:'C2',text:'The goods were delivered on 2026-08-15.',kind:'fact',sourceId:'E2',lineStart:3,lineEnd:3,quote:''},
    {id:'C3',text:'Meridian paid SGD 8,000 on 2026-08-20.',kind:'fact',sourceId:'E3',lineStart:2,lineEnd:2,quote:'Meridian paid SGD 8,000 on 2026-08-20.'},
    {id:'C4',text:'Harbor admitted liability for the delay.',kind:'fact',sourceId:'E9',lineStart:1,lineEnd:1,quote:''},
    {id:'C5',text:'These facts legally establish liability.',kind:'legal',sourceId:'E1',lineStart:3,lineEnd:5,quote:''},
    {id:'C6',text:'The customer accepted the goods.',kind:'fact',sourceId:'E2',lineStart:4,lineEnd:4,quote:'The customer has not confirmed acceptance.'}
  ]
}; }
