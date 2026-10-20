// Zero-dependency static site generator for MRRwithAI. Run: node build.js -> dist/
const fs=require('fs'),path=require('path');
const SITE='https://mrrwithai.com',NAME='MRRwithAI';
const CFG={buttondownUser:'mrrwithai', // TODO: set to your Buttondown username
stripe:{newsletter:'https://buy.stripe.com/9B6dRb8YYeOqfZr54Y0kE02',featured:'https://buy.stripe.com/3cI6oJfnm6hUcNfapi0kE01',bundle:'https://buy.stripe.com/7sY3cx7UUbCe4gJgNG0kE00'},
 repo:'https://github.com/kmarikatauriainen-sketch/shippedwithai'};
const rd=f=>JSON.parse(fs.readFileSync(path.join(__dirname,'data',f)));
const cases=rd('cases.json').sort((a,b)=>b.date.localeCompare(a.date)),cats=rd('categories.json'),tools=rd('tools.json'),issues=rd('newsletter.json');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'\x26amp;','<':'\x26lt;','>':'\x26gt;','"':'\x26quot;'}[c]));
const out='dist';fs.rmSync(out,{recursive:true,force:true});
const urls=[];
function write(p,html){const f=path.join(out,p,'index.html');fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,html);urls.push(SITE+p);}
function page(p,{title,desc,body,ld}){const t=title?`${title} · ${NAME}`:`${NAME} — real micro-SaaS built with AI`;
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${SITE}${p}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${p}"><meta property="og:image" content="${SITE}/og.svg">
<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/style.css">
${(ld||[]).map(x=>`<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}
<script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script><script defer src="/_vercel/insights/script.js"></script>
</head><body><header><a class="logo" href="/">MRR<span>with</span>AI</a><nav><a href="/category/">Categories</a><a href="/tools/">Tools</a><a href="/newsletter/">Newsletter</a><a href="/submit/">Submit</a><a href="/sponsor/">Sponsor</a></nav></header>
<main>${body}</main><footer><p>${NAME} — a hand-curated directory of real products built with AI tools. Every metric links to its public source; figures are as reported by founders or the press and are not independently audited.</p><p><a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">sitemap</a> · <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="${CFG.repo}">GitHub</a></p></footer></body></html>`;}
const tl=s=>`<a class="tag" href="/tools/${s}/">${esc(tools[s]||s)}</a>`;
const card=c=>`<article class="card"><h3><a href="/cases/${c.slug}/">${esc(c.name)}</a></h3><p>${esc(c.built)}</p><p class="res">${esc(c.results)}</p><p>${c.tools.map(tl).join(' ')} <a class="tag cat" href="/category/${c.category}/">${esc(cats[c.category])}</a></p></article>`;
const signup=`<section class="signup"><h2>Get one real AI-built case study a week</h2><p>Free. Numbers with sources, plus the prompt/workflow to steal.</p>
<form action="https://buttondown.com/api/emails/embed-subscribe/${CFG.buttondownUser}" method="post" target="_blank"><input type="email" name="email" placeholder="you@example.com" required aria-label="Email"><input type="hidden" name="tag" value="website"><button>Subscribe</button></form></section>`;
const orgLd={'@context':'https://schema.org','@type':'WebSite',name:NAME,url:SITE};
// home
write('/',page('/',{desc:'Real micro-SaaS and apps built with Lovable, Bolt, Cursor, v0, Claude and Grok — with sourced revenue numbers and the workflow to copy.',ld:[orgLd],body:
`<section class="hero"><h1>Real products shipped with AI.</h1><p>A curated directory of micro-SaaS and apps built with Lovable, Bolt, Cursor, Claude, Replit and friends — with <strong>sourced</strong> revenue numbers and the prompt or workflow you can steal.</p></section>
${signup}
<aside class="sponsor"><small>SPONSOR</small><p><strong>Your product here.</strong> Reach indie builders shipping with AI. <a href="/sponsor/">Sponsor MRRwithAI →</a></p></aside>
<h2>Latest cases</h2><div class="grid">${cases.map(card).join('')}</div>`}));
// cases
for(const c of cases){const ld={'@context':'https://schema.org','@type':'Article',headline:`${c.name}: built with ${c.tools.map(t=>tools[t]).join(', ')}`,description:c.built,datePublished:c.date,author:{'@type':'Organization',name:NAME},about:{'@type':'SoftwareApplication',name:c.name,url:c.productUrl||undefined,applicationCategory:cats[c.category]},citation:c.sourceUrl};
write(`/cases/${c.slug}/`,page(`/cases/${c.slug}/`,{title:`${c.name} — built with ${c.tools.map(t=>tools[t]).join(', ')}`,desc:`${c.name}: ${c.built} ${c.results}`,ld:[ld,{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE+'/'},{'@type':'ListItem',position:2,name:c.name,item:`${SITE}/cases/${c.slug}/`}]}],body:
`<article class="case"><p><a href="/category/${c.category}/">${esc(cats[c.category])}</a></p><h1>${esc(c.name)}</h1>${c.builder?`<p class="by">by ${esc(c.builder)}</p>`:''}
<dl><dt>What was built</dt><dd>${esc(c.built)}</dd><dt>Tools used</dt><dd>${c.tools.map(tl).join(' ')}</dd>${c.timeToBuild?`<dt>Time to build</dt><dd>${esc(c.timeToBuild)}</dd>`:''}
<dt>Reported results</dt><dd>${esc(c.results)} <a href="${esc(c.sourceUrl)}" rel="nofollow noopener" target="_blank">Source ↗</a></dd>
${c.productUrl?`<dt>Product</dt><dd><a href="${esc(c.productUrl)}" rel="noopener" target="_blank">${esc(c.productUrl.replace(/^https?:\/\//,''))} ↗</a></dd>`:''}</dl>
<section class="steal"><h2>Steal this workflow</h2><p>${esc(c.steal)}</p></section></article>${signup}`}));}
// taxonomy
function tax(base,map,key,label){write(`/${base}/`,page(`/${base}/`,{title:label,desc:`Browse AI-built products by ${label.toLowerCase()}.`,body:`<h1>${label}</h1><ul class="list">${Object.entries(map).map(([s,n])=>{const k=cases.filter(c=>key(c).includes(s)).length;return k?`<li><a href="/${base}/${s}/">${esc(n)}</a> (${k})</li>`:''}).join('')}</ul>`}));
for(const [s,n] of Object.entries(map)){const list=cases.filter(c=>key(c).includes(s));if(!list.length)continue;
write(`/${base}/${s}/`,page(`/${base}/${s}/`,{title:base==='tools'?`Products built with ${n}`:`${n} built with AI`,desc:`Real ${base==='tools'?'products built with '+n:n.toLowerCase()+' built with AI tools'}, with sourced revenue numbers.`,ld:[{'@context':'https://schema.org','@type':'ItemList',itemListElement:list.map((c,i)=>({'@type':'ListItem',position:i+1,url:`${SITE}/cases/${c.slug}/`,name:c.name}))}],body:`<h1>${base==='tools'?'Built with '+esc(n):esc(n)}</h1><div class="grid">${list.map(card).join('')}</div>`}));}}
tax('category',cats,c=>[c.category],'Categories');tax('tools',tools,c=>c.tools,'Tools');
// submit
const issueUrl=`${CFG.repo}/issues/new?template=submit-case.yml`;
write('/submit/',page('/submit/',{title:'Submit a case',desc:'Built something with AI that makes money? Submit it to MRRwithAI.',body:`<h1>Submit a case</h1><p>Built (or know of) a product made with AI tools that has <strong>public</strong> numbers? Submit it — free. We only list metrics that link to a public source (a post, interview, dashboard screenshot or article).</p>
<p><a class="btn" href="${issueUrl}">Submit via GitHub (free form) →</a></p><p>We need: product name & link, what it does, tools used, time to build, results (MRR/users/revenue), a public source URL for those results, and the prompt/workflow others can learn from.</p>`}));
// sponsor
const tier=(n,p,d,k)=>`<div class="tier"><h3>${n}</h3><p class="price">${p}</p><p>${d}</p><a class="btn" href="${CFG.stripe[k]}">Book</a></div>`;
write('/sponsor/',page('/sponsor/',{title:'Sponsor',desc:'Reach indie hackers and builders shipping with AI. Newsletter slots and featured listings.',body:`<h1>Sponsor MRRwithAI</h1><p>Our readers are founders, indie hackers and no-code builders actively shipping with AI tools.</p><div class="tiers">
${tier('Newsletter slot','$99 / issue','One sponsor block at the top of a weekly issue.','newsletter')}${tier('Featured listing','$149 / month','Pinned sponsor slot on the homepage and every case page for 30 days.','featured')}${tier('Bundle','$249','Featured listing for a month + one newsletter slot.','bundle')}</div><p><small>One-off payment in USD via Stripe. Questions? Email <a href="mailto:mrrwithai@gmail.com">mrrwithai@gmail.com</a>.</small></p>`}));
// newsletter
write('/newsletter/',page('/newsletter/',{title:'Newsletter archive',desc:'Archive of the MRRwithAI weekly newsletter.',body:`<h1>Newsletter archive</h1>${issues.length?`<ul class="list">${issues.map(i=>`<li><a href="${esc(i.url)}">${esc(i.title)}</a> — ${esc(i.date)}</li>`).join('')}</ul>`:'<p>The first issue is on its way. Subscribe to get it.</p>'}${signup}`}));
// static + seo files
fs.cpSync('static',out,{recursive:true});
fs.writeFileSync(`${out}/robots.txt`,`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
urls.push(`${SITE}/privacy/`,`${SITE}/terms/`);
fs.writeFileSync(`${out}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`<url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(`${out}/llms.txt`,`# ${NAME}\n\n> A curated directory and newsletter of real micro-SaaS and apps built with AI tools (Lovable, Bolt, Cursor, v0, Claude, Grok, Replit). Each case lists tools used, time to build, publicly sourced results and a reusable workflow.\n\n## Cases\n${cases.map(c=>`- [${c.name}](${SITE}/cases/${c.slug}/): ${c.results} Source: ${c.sourceUrl}`).join('\n')}\n\n## Pages\n- [Submit a case](${SITE}/submit/)\n- [Sponsor](${SITE}/sponsor/)\n- [Newsletter](${SITE}/newsletter/)\n- [Privacy](${SITE}/privacy/)\n- [Terms](${SITE}/terms/)\n`);
console.log('built',urls.length,'pages');
