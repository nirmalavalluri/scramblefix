/**
 * textUtils.js — ScrambleFix
 * All pure text-processing functions. Safe in Node.js + browser.
 */

// ── CATEGORY 1: TEXT CLEANING ─────────────────────────────────────

export const removeBlankLines = (t) =>
  t.split('\n').filter(l => l.trim() !== '').join('\n');

export const removeExtraSpaces = (t) =>
  t.replace(/[^\S\n]+/g, ' ').split('\n').map(l => l.trim()).join('\n');

export const removeDuplicateLines = (t, caseSensitive = false) => {
  const seen = new Set();
  return t.split('\n').filter(l => {
    // Always keep blank/whitespace-only lines — don't treat them as duplicates
    if (l.trim() === '') return true;
    const k = caseSensitive ? l : l.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).join('\n');
};

export const removePunctuation = (t) =>
  t.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '');

export const removeNumbers = (t) => t.replace(/\d/g, '');

export const removeEmojis = (t) =>
  t.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]/gu, '').trim();

export const removeSymbols = (t) => t.replace(/[^a-zA-Z0-9\s\n]/g, '');

const SW = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','has','have','had','do','does','did','will','would','could','should','may','might','i','you','he','she','it','we','they','this','that','these','those','as','if','not','no','so','up','out','about','than','when','what','how','who','which','its','his','her','their','our','your','my','me','him','us','them','there','here','just','also','very']);

export const removeStopwords = (t) =>
  t.split(/(\s+)/).map(tok => /\s/.test(tok) ? tok : (SW.has(tok.toLowerCase()) ? '' : tok)).join('').replace(/\s{2,}/g,' ').trim();

export const trimWhitespace = (t) => t.split('\n').map(l => l.trim()).join('\n');

export const normalizeText = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['']/g,"'").replace(/[""]/g,'"').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();

export const stripHtmlTags = (t) =>
  t.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim();

export const cleanJson = (t) => {
  try { return JSON.stringify(JSON.parse(t), null, 2); }
  catch(e) { throw new Error('Invalid JSON — ' + e.message); }
};

// ── CATEGORY 2: EXTRACTION ────────────────────────────────────────

export const extractEmails = (t) =>
  [...new Set(t.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)||[])];

export const extractUrls = (t) =>
  [...new Set(t.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/g)||[])];

export const extractPhoneNumbers = (t) =>
  [...new Set((t.match(/(\+?\d[\d\s\-().]{6,}\d)/g)||[]).filter(p=>p.replace(/\D/g,'').length>=7))];

export const extractHashtags = (t) => [...new Set(t.match(/#[a-zA-Z]\w*/g)||[])];
export const extractMentions = (t) => [...new Set(t.match(/@[a-zA-Z]\w*/g)||[])];
export const extractNumbers  = (t) => t.match(/-?\d+\.?\d*/g)||[];

export const extractDates = (t) =>
  [...new Set(t.match(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/gi)||[])];

export const extractIpAddresses = (t) =>
  [...new Set(t.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)||[])];

export const extractJsonObjects = (t) => {
  const found=[]; const rx=/\{[^{}]*\}/g; let m;
  while((m=rx.exec(t))!==null){try{JSON.parse(m[0]);found.push(m[0]);}catch{}}
  return found;
};

export const extractKeywords = (t) => {
  const freq={};
  (t.toLowerCase().match(/[a-z']{4,}/g)||[]).filter(w=>!SW.has(w)).forEach(w=>{freq[w]=(freq[w]||0)+1;});
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([w,c])=>`${w} (${c})`);
};

// ── CATEGORY 3: FORMATTING & TRANSFORMATION ───────────────────────

export const toTitle    = s => s.replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase());
export const toSentence = s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase());
export const toCamel    = s => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase());
export const toPascal   = s => {const c=toCamel(s);return c?c[0].toUpperCase()+c.slice(1):'';};
export const toSnake    = s => s.trim().replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'').toLowerCase();
export const toKebab    = s => s.trim().replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-]/g,'').toLowerCase();
export const toAlt      = s => s.split('').map((c,i)=>i%2===0?c.toLowerCase():c.toUpperCase()).join('');

export const CASE_FORMATS = [
  {id:'upper',   label:'UPPERCASE',    fn:s=>s.toUpperCase()},
  {id:'lower',   label:'lowercase',    fn:s=>s.toLowerCase()},
  {id:'title',   label:'Title Case',   fn:toTitle},
  {id:'sentence',label:'Sentence case',fn:toSentence},
  {id:'camel',   label:'camelCase',    fn:toCamel},
  {id:'pascal',  label:'PascalCase',   fn:toPascal},
  {id:'snake',   label:'snake_case',   fn:toSnake},
  {id:'kebab',   label:'kebab-case',   fn:toKebab},
  {id:'alt',     label:'aLtErNaTiNg', fn:toAlt},
];

export const reverseText = (t,mode='full') => {
  if(mode==='full')  return t.split('').reverse().join('');
  if(mode==='words') return t.split(/(\s+)/).map(tok=>/\s/.test(tok)?tok:tok.split('').reverse().join('')).join('');
  if(mode==='order') return t.trim().split(/\s+/).reverse().join(' ');
  return t;
};

export const sortWords = (words,mode='az') => {
  const w=[...words];
  if(mode==='az')    return w.sort((a,b)=>a.localeCompare(b));
  if(mode==='za')    return w.sort((a,b)=>b.localeCompare(a));
  if(mode==='short') return w.sort((a,b)=>a.length-b.length||a.localeCompare(b));
  if(mode==='long')  return w.sort((a,b)=>b.length-a.length||a.localeCompare(b));
  if(mode==='rev')   return w.reverse();
  return w;
};

export const sortLines = (t,mode='az') => {
  const ls=t.split('\n');
  if(mode==='az')    return ls.sort((a,b)=>a.localeCompare(b)).join('\n');
  if(mode==='za')    return ls.sort((a,b)=>b.localeCompare(a)).join('\n');
  if(mode==='short') return ls.sort((a,b)=>a.length-b.length).join('\n');
  if(mode==='long')  return ls.sort((a,b)=>b.length-a.length).join('\n');
  if(mode==='rev')   return [...ls].reverse().join('\n');
  return t;
};

export const fisherYates = (arr) => {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
};

export const doShuffle = (val,mode='words') => {
  if(mode==='words')      return fisherYates(val.split(/\s+/).filter(Boolean)).join(' ');
  if(mode==='sentences')  return fisherYates(val.split(/(?<=[.!?])\s+/).filter(Boolean)).join(' ');
  if(mode==='lines')      return fisherYates(val.split('\n')).join('\n');
  if(mode==='paragraphs') return fisherYates(val.split(/\n{2,}/)).join('\n\n');
  const chars=val.split('');
  const li=chars.reduce((a,c,i)=>/[a-zA-Z]/.test(c)?[...a,i]:a,[]);
  const sh=fisherYates(li.map(i=>chars[i]));
  li.forEach((idx,pos)=>{chars[idx]=sh[pos];});
  return chars.join('');
};

export const countWords = (t) => ({
  words:      (t.trim().match(/\S+/g)||[]).length,
  chars:      t.length,
  noSpaces:   t.replace(/\s/g,'').length,
  sentences:  (t.match(/[.!?]+/g)||[]).length||(t.trim()?1:0),
  paragraphs: t.split(/\n{2,}/).filter(p=>p.trim()).length||(t.trim()?1:0),
  lines:      t.split('\n').length,
  readTime:   Math.max(1,Math.round((t.trim().match(/\S+/g)||[]).length/200)),
});

export const wordFrequency = (t, ignore=true) => {
  const freq={};
  (t.toLowerCase().match(/[a-z']+/g)||[]).filter(w=>w.length>1&&(!ignore||!SW.has(w))).forEach(w=>{freq[w]=(freq[w]||0)+1;});
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,50).map(([w,c])=>`${w}: ${c}`).join('\n');
};

export const indentText    = (t,spaces=2) => t.split('\n').map(l=>' '.repeat(spaces)+l).join('\n');
export const deIndentText  = (t)          => t.split('\n').map(l=>l.replace(/^[ \t]+/,'')).join('\n');
export const splitText     = (t,delim='\n')=> t.split(delim).filter(Boolean);

export const sortParagraphs = (t,mode='az') => {
  const ps=t.split(/\n{2,}/).filter(p=>p.trim());
  if(mode==='az')  return ps.sort((a,b)=>a.localeCompare(b)).join('\n\n');
  if(mode==='za')  return ps.sort((a,b)=>b.localeCompare(a)).join('\n\n');
  if(mode==='rev') return [...ps].reverse().join('\n\n');
  return t;
};
export const shuffleParagraphs = (t) => fisherYates(t.split(/\n{2,}/).filter(p=>p.trim())).join('\n\n');

// ── CATEGORY 4: ENCODING / DECODING ──────────────────────────────

export const base64Encode = (t) => { try{return btoa(unescape(encodeURIComponent(t)));}catch(e){throw new Error('Encoding failed');} };
export const base64Decode = (t) => { try{return decodeURIComponent(escape(atob(t.trim())));}catch(e){throw new Error('Invalid Base64');} };
export const urlEncode    = (t) => encodeURIComponent(t);
export const urlDecode    = (t) => { try{return decodeURIComponent(t);}catch(e){throw new Error('Invalid encoded string');} };

const HE={  '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'};
const HD=Object.fromEntries(Object.entries(HE).map(([k,v])=>[v,k]));
export const htmlEncode = (t) => t.replace(/[<>&"']/g,c=>HE[c]||c);
export const htmlDecode = (t) => t.replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g,e=>HD[e]||e);

export const decodeJwt = (token) => {
  const parts=token.trim().split('.');
  if(parts.length!==3) throw new Error('Invalid JWT — expected header.payload.signature');
  const dec=p=>{const pad=p.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(p.length/4)*4,'=');try{return JSON.parse(atob(pad));}catch{throw new Error('Could not decode JWT part');}};
  return JSON.stringify({header:dec(parts[0]),payload:dec(parts[1]),signature:'[hashed — not decoded]'},null,2);
};

const M2T={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z','-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9'};
const T2M=Object.fromEntries(Object.entries(M2T).map(([k,v])=>[v,k]));
export const morseEncode = (t) => t.toUpperCase().split('').map(c=>c===' '?'/':(T2M[c]||'?')).join(' ');
export const morseDecode = (t) => t.split(' / ').map(w=>w.split(' ').map(c=>M2T[c]||'?').join('')).join(' ');

// ── CATEGORY 5: GENERATORS ────────────────────────────────────────

const POOL={upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lower:'abcdefghijklmnopqrstuvwxyz',digits:'0123456789',symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?'};

export const generatePassword = ({length=16,upper=true,lower=true,digits=true,symbols=false}={}) => {
  let pool='';
  if(upper)   pool+=POOL.upper;
  if(lower)   pool+=POOL.lower;
  if(digits)  pool+=POOL.digits;
  if(symbols) pool+=POOL.symbols;
  if(!pool)   pool=POOL.lower+POOL.digits;
  return Array.from({length},()=>pool[Math.floor(Math.random()*pool.length)]).join('');
};

const ADJ=['swift','bold','calm','dark','bright','cool','wild','keen','sharp','deep','vast','quiet','brave','grand','rare'];
const NOUN=['wolf','fox','eagle','lion','bear','hawk','raven','storm','river','peak','ridge','forge','vault','crest','vale'];
export const generateUsername = ({capitalize=false}={}) => {
  const name=`${ADJ[Math.floor(Math.random()*ADJ.length)]}${NOUN[Math.floor(Math.random()*NOUN.length)]}${Math.floor(Math.random()*999)+1}`;
  return capitalize?name[0].toUpperCase()+name.slice(1):name;
};

const LOREM='lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'.split(' ');
const rw=()=>LOREM[Math.floor(Math.random()*LOREM.length)];
const rSent=()=>{const ws=Array.from({length:Math.floor(Math.random()*8)+5},rw);ws[0]=ws[0][0].toUpperCase()+ws[0].slice(1);return ws.join(' ')+'.';};

export const generateLoremIpsum    = ({paragraphs=1,sentences=5}={}) => Array.from({length:paragraphs},()=>Array.from({length:sentences},rSent).join(' ')).join('\n\n');
export const generateRandomWord    = (count=1) => Array.from({length:count},rw).join('\n');
export const generateRandomSentence= (count=1) => Array.from({length:count},rSent).join('\n');
export const generateRandomParagraph=(count=1)  => Array.from({length:count},()=>Array.from({length:Math.floor(Math.random()*4)+3},rSent).join(' ')).join('\n\n');
export const generateRandomNumber  = ({min=1,max=100,count=1,decimals=0}={}) => Array.from({length:count},()=>{const n=Math.random()*(max-min)+min;return decimals>0?n.toFixed(decimals):Math.floor(n);}).join('\n');

const EMOJIS=['😀','😂','🥰','😎','🤔','🎉','🔥','⭐','💯','🌟','🎯','🚀','💡','🌈','🎸','🍕','☕','🐶','🦊','🌸','🎨','🏆','💎','🦋','🌙','🍀','🎭','🦄','🌊','🎪'];
export const generateRandomEmoji = (count=5) => Array.from({length:count},()=>EMOJIS[Math.floor(Math.random()*EMOJIS.length)]).join(' ');

export const generateRandomColor = ({format='hex',count=1}={}) => Array.from({length:count},()=>{
  const r=Math.floor(Math.random()*256),g=Math.floor(Math.random()*256),b=Math.floor(Math.random()*256);
  if(format==='rgb') return `rgb(${r}, ${g}, ${b})`;
  if(format==='hsl'){const rn=r/255,gn=g/255,bn=b/255,mx=Math.max(rn,gn,bn),mn=Math.min(rn,gn,bn);let h,s,l=(mx+mn)/2;if(mx===mn){h=s=0;}else{const d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);h=mx===rn?(gn-bn)/d+(gn<bn?6:0):mx===gn?(bn-rn)/d+2:(rn-gn)/d+4;h/=6;}return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;}
  return '#'+[r,g,b].map(n=>n.toString(16).padStart(2,'0')).join('');
}).join('\n');

export const generateUuid = (count=1) => Array.from({length:count},()=>'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);})).join('\n');

// ── SHARED ────────────────────────────────────────────────────────

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

let _dictCache=null;
export async function loadDictionary(){
  if(_dictCache)return _dictCache;
  const res=await fetch('/words.js');const text=await res.text();
  const m=text.match(/DICTIONARY=(\[.*\])/s);
  if(!m)throw new Error('words.js: unexpected format');
  _dictCache=JSON.parse(m[1]);return _dictCache;
}

export function unscramble(letters,dict){
  const counts={};
  for(const ch of letters.toUpperCase())counts[ch]=(counts[ch]||0)+1;
  const grouped={};
  for(const word of dict){
    const wc={};let valid=true;
    for(const ch of word){wc[ch]=(wc[ch]||0)+1;if(wc[ch]>(counts[ch]||0)){valid=false;break;}}
    if(valid){const len=String(word.length);if(!grouped[len])grouped[len]=[];grouped[len].push(word);}
  }
  return grouped;
}

export const removeDuplicates=(raw,mode,caseSensitive)=>{
  const items=(mode==='lines'?raw.split('\n'):raw.trim().split(/[\s,]+/)).map(s=>s.trim()).filter(Boolean);
  const seen=new Set(),kept=[],dupes=[];
  for(const item of items){const key=caseSensitive?item:item.toLowerCase();if(seen.has(key))dupes.push(item);else{seen.add(key);kept.push(item);}}
  return{items,kept,dupes:[...new Set(dupes.map(d=>caseSensitive?d:d.toLowerCase()))]};
};
