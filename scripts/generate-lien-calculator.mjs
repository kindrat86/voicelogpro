#!/usr/bin/env node
/**
 * generate-lien-calculator.mjs — build self-contained interactive lien deadline
 * calculator that inlines the dataset. Only computes dates for clean numeric rules.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { POSTHOG_SNIPPET, captureBlock } from "./lib/capture-snippet.mjs";

const D = JSON.parse(readFileSync(join(process.cwd(), "src/data/lien-deadlines.json"), "utf8"));

// compact payload: state -> { pn:[cells], lf:[cells], en:[cells], num:{pn,lf} }
const payload = {};
for (const s of D.states) {
  const b = D.byState[s];
  payload[s] = {
    pn: b.preliminaryNotice,
    lf: b.lienFiling,
    en: b.enforcement,
    num: b.numeric,
  };
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mechanics Lien Deadline Calculator — All 50 States | VoiceLogPro</title>
<meta name="description" content="Free mechanics lien deadline calculator. Pick your state and furnishing dates to see your preliminary notice, lien filing, and enforcement deadlines. Not legal advice.">
<link rel="canonical" href="https://voicelogpro.com/free/lien-deadline-calculator">
<style>:root{color-scheme:light dark}body{font:16px/1.6 system-ui,sans-serif;max-width:680px;margin:0 auto;padding:1.5rem 1rem;color:#0f172a}@media(prefers-color-scheme:dark){body{background:#0b1120;color:#e2e8f0}}label{display:block;font-weight:600;margin:.75rem 0 .25rem}select,input{width:100%;padding:.6rem;border:1px solid #cbd5e1;border-radius:.4rem;font-size:1rem}@media(prefers-color-scheme:dark){select,input{background:#1e293b;color:#e2e8f0;border-color:#334155}}.out{margin-top:1rem;border:1px solid #e2e8f0;border-radius:.6rem;padding:1rem}@media(prefers-color-scheme:dark){.out{border-color:#1e293b}}.row{padding:.5rem 0;border-bottom:1px solid #f1f5f9}.d{font-weight:700;color:#ea580c}.disc{font-size:.82rem;color:#64748b;margin-top:1.5rem;border-top:1px solid #e2e8f0;padding-top:1rem}a{color:#ea580c}.cap-form input[type=email]{width:auto}</style>
${POSTHOG_SNIPPET}
</head><body>
<h1>Mechanics Lien Deadline Calculator</h1>
<p>Pick your state and your furnishing dates. We apply that state's rule from our verified 50-state reference.</p>
<label for="st">State</label><select id="st"></select>
<label for="ff">First furnishing date (when you started)</label><input type="date" id="ff">
<label for="lf">Last furnishing date (when you finished)</label><input type="date" id="lf">
<div class="out" id="out">Select a state to see deadlines.</div>
${captureBlock("/free/lien-deadline-calculator", "", "my state's")}
<div class="cta" style="margin-top:1.25rem;background:#fff7ed;border:1px solid #fed7aa;border-radius:.6rem;padding:1rem"><strong>Your dates are only as good as your records.</strong> <a href="/">VoiceLogPro</a> documents your furnishing dates automatically from voice notes. <a href="/lien-law-deadlines">Browse deadlines by state →</a></div>
<p class="disc">${D.disclaimer}</p>
<script>
const DATA=${JSON.stringify(payload)};
const DISC=${JSON.stringify(D.disclaimer)};
const sel=document.getElementById('st');
Object.keys(DATA).sort().forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;sel.appendChild(o);});
sel.value='';const ph=document.createElement('option');ph.value='';ph.textContent='— choose your state —';sel.prepend(ph);sel.value='';
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);}
function addMonths(d,n){const x=new Date(d);x.setMonth(x.getMonth()+n);return x.toISOString().slice(0,10);}
function computed(rule,ff,lf){if(!rule)return null;const base=rule.trigger==='firstFurnishing'?ff:lf;if(!base)return null;return rule.unit==='months'?addMonths(base,rule.n):addDays(base,rule.n);}
function line(label,cells,rule,ff,lf){if(!cells)return'';const text=cells.slice(1).filter(Boolean).join(' — ');const c=computed(rule,ff,lf);return'<div class="row"><strong>'+label+':</strong> '+text+(c?' → <span class="d">by '+c+'</span>':'')+'</div>';}
function render(){const s=sel.value,ff=document.getElementById('ff').value,lf=document.getElementById('lf').value,o=document.getElementById('out');if(!s){o.textContent='Select a state to see deadlines.';return;}const d=DATA[s];o.innerHTML=line('Preliminary notice',d.pn,d.num&&d.num.preliminaryNotice,ff,lf)+line('Lien filing',d.lf,d.num&&d.num.lienFiling,ff,lf)+line('Enforcement',d.en,null,ff,lf)+'<p class="disc">'+DISC+'</p>';}
sel.onchange=render;document.getElementById('ff').onchange=render;document.getElementById('lf').onchange=render;
</script>
</body></html>`;

mkdirSync(join(process.cwd(), "free/lien-deadline-calculator"), { recursive: true });
writeFileSync(join(process.cwd(), "free/lien-deadline-calculator/index.html"), html);
console.log("✓ lien-deadline-calculator generated");
