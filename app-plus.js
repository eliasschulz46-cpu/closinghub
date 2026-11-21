/* ===== ClosingHub App-Plus =====
   Stories (Kontrastfarben, Halten = Pause, links ausgerichtet), Spotlight mit vollem Text,
   Feed-Aktionen rechts übereinander, Pause-Symbol kurz einblenden, Partner-Siegel im Marktplatz,
   Mitteilungen und Nachrichten links, Highlights beim Posten, Profil mit Highlights zuerst,
   Einstellungen als Kacheln mit Unterseiten.
   Einbinden: in app.html direkt vor </body>:  <script src="app-plus.js"></script> */
(function(){
  if(window.APLUS) return; window.APLUS = 1;
  const $ = id => document.getElementById(id);
  const esc2 = s => String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---------- CSS ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .left-3{left:.75rem}
  /* Stories */
  .st-hd{left:12px!important;right:12px!important;justify-content:flex-start}
  .st-hd>button{flex:1 1 auto;justify-content:flex-start;text-align:left}
  .st-ui,.st-ui *{transition:color .2s}
  .st-hell .st-hd b,.st-hell .st-hd button,.st-hell .st-hd span{color:#111!important;text-shadow:0 0 6px rgba(255,255,255,.55)}
  .st-hell .st-hd .text-\\[11px\\]{color:rgba(0,0,0,.62)!important}
  .st-dunkel .st-hd b,.st-dunkel .st-hd button,.st-dunkel .st-hd span{text-shadow:0 1px 4px rgba(0,0,0,.55)}
  .st-hell .st-bars>div{background:rgba(0,0,0,.2)!important}
  .st-hell .st-bars>div>div{background:#111!important}
  #modal .st-ui form .input{background:rgba(0,0,0,.5)!important;border-color:rgba(255,255,255,.3)!important;color:#fff!important}
  #modal .st-ui form .input::placeholder{color:rgba(255,255,255,.75)}
  .st-nav{touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
  .st-pz{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:4;opacity:0;transition:opacity .15s}
  .st-halt .st-pz{opacity:1}
  .st-halt .st-hd,.st-halt .st-bars,.st-halt form{opacity:.25;transition:opacity .2s}
  /* Spotlight */
  .bt-spot2{background:#0E1A2B;border:1px solid #22324A;border-radius:1rem;padding:14px 16px;margin-bottom:10px;color:#fff}
  .bt-spot2 .k{display:flex;align-items:center;gap:8px;color:#3FBF86;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  .bt-spot2 .a{margin:10px 0 0;font-size:16px;line-height:1.5;color:#fff;white-space:pre-line;overflow-wrap:anywhere}
  .bt-spot2 .w{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px;color:#C9D3E3;flex-wrap:wrap}
  .bt-spot2 .w b{color:#fff}
  .bt-spot2 .q{color:#8A9BB0;font-size:12.5px}
  /* Feed-Aktionen rechts */
  .fa-col{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex!important;flex-direction:column;gap:14px!important;align-items:center;z-index:3;color:#fff}
  .fa-col>button{display:flex!important;flex-direction:column;align-items:center;gap:3px!important;margin:0!important;color:#fff}
  .fa-col .icbox{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,14,22,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  .fa-col .icbox svg{color:#fff;stroke:#fff}
  .fa-col .icon-on .icbox svg,.fa-col .icon-on .icbox svg *{color:#ff3b5c!important;stroke:#ff3b5c!important;fill:#ff3b5c!important}
  .fa-col .text-sm{font-size:12px;font-weight:700;line-height:1;text-shadow:0 1px 3px rgba(0,0,0,.6)}
  .fa-empty{display:none!important}
  /* Pause-Symbol im Player: kurz einblenden */
  .pz-flash{animation:pzFlash 1s ease forwards}
  @keyframes pzFlash{0%{opacity:0;transform:scale(.7)}18%{opacity:1;transform:scale(1)}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.15)}}
  /* Mitteilungen + Nachrichten links */
  html[data-r="notifications"] #app .max-w-lg.mx-auto{max-width:calc(36rem + 2rem);margin-left:max(0px,calc((100% - 72rem)/2));margin-right:auto}
  .cmbox{margin:0!important;border-left:0!important;max-width:none!important}
  @media(max-width:767px){.cmbox{border-right:0!important}}
  /* Einstellungen */
  .set-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  @media(min-width:900px){.set-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
  .set-t{display:flex;flex-direction:column;align-items:flex-start;gap:8px;text-align:left;padding:14px;border-radius:16px;border:1px solid rgb(var(--line));background:rgb(var(--panel));transition:border-color .15s,transform .15s;min-height:112px}
  .set-t:hover{border-color:#087A4B}
  .set-t:active{transform:scale(.98)}
  .set-t .i{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(8,122,75,.1);color:#087A4B;font-size:18px}
  .set-t b{font-size:14.5px;display:block}
  .set-t span.s{font-size:12px;color:rgb(var(--muted));line-height:1.35}
  .set-back{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:rgb(var(--muted));margin-bottom:10px}
  .set-back:hover{color:rgb(var(--fg))}
  .hl-opt{display:flex;align-items:flex-start;gap:12px;margin-top:14px;padding:12px 14px;border:1px solid rgb(var(--line));border-radius:14px;cursor:pointer}
  .hl-opt input{accent-color:#087A4B;width:18px;height:18px;margin-top:2px}`;
  document.head.appendChild(css);

  /* ---------- Route-Markierung + Nachbearbeitung nach jedem Rendern ---------- */
  const _render = render;
  render = function(){ const r=route(); if(r!=='einstellungen') S.setSub=null; document.documentElement.dataset.r=r; const out=_render.apply(this,arguments); fixAll(); return out; };
  let fixQ=0; const fixSoon=()=>{ if(fixQ) return; fixQ=requestAnimationFrame(()=>{ fixQ=0; fixAll(); }); };
  new MutationObserver(fixSoon).observe(document.body,{childList:true,subtree:true});
  function fixAll(){ try{ fixFeed(); }catch(e){} try{ fixPartners(); }catch(e){} try{ fixSpot(); }catch(e){} }

  /* ---------- Feed: Herz, Kommentar, Teilen rechts übereinander ---------- */
  function fixFeed(){
    document.querySelectorAll('#app article.card').forEach(art=>{
      if(art.dataset.fa) return;
      const bar=[...art.querySelectorAll('div.flex.gap-4.items-center')].find(d=>d.querySelector('[onclick*="toggleLike"]')&&d.querySelector('[aria-label="Teilen"]'));
      const box=art.querySelector('div.relative[onclick*="startPlayer"]')||art.querySelector('div.relative.aspect-square');
      art.dataset.fa='1'; if(!bar||!box) return;
      const wrap=bar.parentElement; box.appendChild(bar); bar.classList.add('fa-col');
      if(wrap && !wrap.children.length && !wrap.textContent.trim()) wrap.classList.add('fa-empty');
    });
  }

  /* ---------- Marktplatz: Siegel am Partnerbild, im Partner-Fenster nur einmal ---------- */
  function fixPartners(){
    document.querySelectorAll('#app button[onclick^="personModal"]').forEach(b=>{
      if(b.dataset.sl) return; b.dataset.sl='1';
      const av=b.firstElementChild; if(!av || av.querySelector('img[alt^="Siegel"]')) return;
      const w=document.createElement('span'); w.style.cssText='position:relative;display:inline-block;line-height:0';
      av.replaceWith(w); w.appendChild(av);
      w.insertAdjacentHTML('beforeend', SEAL.replace('width="26" height="26"','width="30" height="30"').replace('right:-6px;bottom:-2px','right:-2px;bottom:0'));
    });
  }
  if(typeof partnerModal==='function'){
    const _pm = partnerModal;
    partnerModal = function(){ const r=_pm.apply(this,arguments); try{ const s=document.querySelector('#modal .-mt-6 .relative.shrink-0 > img[alt^="Siegel"]'); if(s) s.remove(); }catch(e){} return r; };
  }

  /* ---------- Spotlight: dunkles Fenster, kompletter Text ---------- */
  function fixSpot(){
    const old=document.querySelector('#battle .bt-spot'); if(!old) return;
    let html='';
    try{
      const b=bState(); const i=b?b.i-1:-1; const w=i>=0&&b.q[i]?bWinner(i):null;
      if(w) html=`<div class="bt-spot2"><div class="k"><svg class="ci"><use href="#i-krone"/></svg>Spotlight · Sieger des letzten Battles</div>
        <p class="a">„${esc2(w.t)}“</p>
        <div class="w">${skAv(w.n,28,avatar(w.n),'shrink-0')}<b>${esc2(w.n)}</b><span class="q">auf „${esc2(b.q[i])}“</span></div></div>`;
    }catch(e){}
    if(!html){ old.querySelectorAll('.truncate').forEach(e=>{ e.classList.remove('truncate'); e.style.whiteSpace='normal'; }); old.style.alignItems='flex-start'; old.classList.replace('bt-spot','bt-spot-x'); return; }
    old.outerHTML=html;
  }

  /* ---------- Player: Pause-Symbol nur kurz einblenden ---------- */
  if(typeof drawPlayer==='function' && typeof togglePause==='function'){
    const _dp = drawPlayer;
    drawPlayer = function(){ const r=_dp.apply(this,arguments); try{
      const pz=document.querySelector('[aria-label="Pausiert"]'); const box=pz&&pz.parentElement;
      const p=S.player, dt=p&&p.pzAt?Date.now()-p.pzAt:99999;
      if(box){ if(dt<1000){ box.classList.add('pz-flash'); box.style.animationDelay=(-dt)+'ms'; } else box.remove(); }
      if(p && !p.paused && p.pzAt && dt<1000 && p.pzPlay){ const host=document.querySelector('.select-none[onclick*="togglePause"]'); if(host && !host.querySelector('.pl-flash')){ host.insertAdjacentHTML('beforeend',`<div class="pl-flash pz-flash absolute inset-0 flex items-center justify-center pointer-events-none" style="animation-delay:${-dt}ms"><svg width="64" height="64" viewBox="0 0 64 64" style="filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))"><path d="M22 14l28 18-28 18z" fill="#fff"/></svg></div>`); } }
    }catch(e){} return r; };
    const _tp = togglePause;
    togglePause = function(){ if(S.player){ S.player.pzAt=Date.now(); S.player.pzPlay=!!S.player.paused; } return _tp.apply(this,arguments); };
  }

  /* ---------- Stories ---------- */
  function lum(r,g,b){ const f=v=>{ v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4); }; return .2126*f(r)+.7152*f(g)+.0722*f(b); }
  function colorsIn(str){ const out=[]; String(str||'').replace(/#([0-9a-f]{3,8})\b/gi,(m,h)=>{ if(h.length===3) h=h.split('').map(c=>c+c).join(''); out.push([parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]); }).replace(/rgba?\(([^)]+)\)/g,(m,a)=>{ const p=a.split(/[ ,/]+/).map(parseFloat); if(p.length>=3&&!(p[3]===0)) out.push(p.slice(0,3)); }); return out; }
  function setTone(box,light){ box.classList.toggle('st-hell',!!light); box.classList.toggle('st-dunkel',!light); }
  function stTone(box,hd){
    const media=box.querySelector('.absolute.inset-0 img, .absolute.inset-0 video');
    const hr=hd.getBoundingClientRect(), br=box.getBoundingClientRect();
    const fromBg = () => { // Hintergrund an der Stelle der Kopfzeile
      const x=hr.left+Math.min(60,hr.width/2), y=hr.top+hr.height/2; let light=false, found=false;
      for(const el of document.elementsFromPoint(x,y)){ if(hd.contains(el)) continue; const cs=getComputedStyle(el); const c=colorsIn(cs.backgroundImage!=='none'?cs.backgroundImage:'').concat(cs.backgroundColor&&cs.backgroundColor!=='rgba(0, 0, 0, 0)'&&cs.backgroundColor!=='transparent'?colorsIn(cs.backgroundColor):[]);
        if(c.length){ const L=c.reduce((s,v)=>s+lum(...v),0)/c.length; light=L>.45; found=true; break; } if(el===box) break; }
      setTone(box, found?light:false);
    };
    if(!media || media.tagName==='VIDEO'){ if(media){ try{ sampleEl(media); return; }catch(e){} } return fromBg(); }
    const go = () => {
      const nw=media.naturalWidth, nh=media.naturalHeight; if(!nw||!nh) return fromBg();
      const sc=Math.min(br.width/nw, br.height/nh), dw=nw*sc, dh=nh*sc, dx=br.left+(br.width-dw)/2, dy=br.top+(br.height-dh)/2;
      const top=Math.max(hr.top,dy), bot=Math.min(hr.bottom,dy+dh), share=Math.max(0,bot-top)/Math.max(1,hr.height);
      if(share<.25) return setTone(box,false); // Kopfzeile liegt (fast) nur auf dem schwarzen Rand
      const im=new Image(); im.crossOrigin='anonymous';
      im.onload=()=>{ try{ const c=document.createElement('canvas'); c.width=64; c.height=16; const x=c.getContext('2d');
          const sy=(top-dy)/sc, sh=Math.max(1,(bot-top)/sc), sx=Math.max(0,(hr.left-dx)/sc), sw=Math.max(1,Math.min(nw-sx,hr.width/sc));
          x.drawImage(im,sx,sy,sw,sh,0,0,64,16); const d=x.getImageData(0,0,64,16).data; let L=0,n=0; for(let k=0;k<d.length;k+=4){ L+=lum(d[k],d[k+1],d[k+2]); n++; }
          setTone(box, (L/n)*share>.42); }catch(e){ setTone(box,false); } };
      im.onerror=()=>setTone(box,false);
      im.src=media.currentSrc||media.src; if(im.complete&&im.naturalWidth) im.onload();
    };
    if(media.complete) go(); else media.addEventListener('load',go,{once:true});
    function sampleEl(v){ const c=document.createElement('canvas'); c.width=32; c.height=8; const x=c.getContext('2d'); const run=()=>{ try{ x.drawImage(v,0,0,v.videoWidth,v.videoHeight*.15,0,0,32,8); const d=x.getImageData(0,0,32,8).data; let L=0,n=0; for(let k=0;k<d.length;k+=4){ L+=lum(d[k],d[k+1],d[k+2]); n++; } setTone(box,L/n>.42); }catch(e){ setTone(box,false); } }; if(v.readyState>=2) run(); else v.addEventListener('loadeddata',run,{once:true}); }
  }
  function stHold(box){
    const nav=[...box.querySelectorAll(':scope > .absolute.inset-x-0.flex')].find(d=>d.querySelector('[onclick*="stNext"]')); if(!nav) return;
    nav.classList.add('st-nav'); box.insertAdjacentHTML('beforeend','<div class="st-pz"><svg width="56" height="56" viewBox="0 0 64 64" style="filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))"><rect x="17" y="12" width="10" height="40" rx="3" fill="#fff"/><rect x="37" y="12" width="10" height="40" rx="3" fill="#fff"/></svg></div>');
    let tmr=null, held=false, eat=false;
    const start=e=>{ if(e.button>0) return; eat=false; clearTimeout(tmr); tmr=setTimeout(()=>{ const s=S.sv; if(!s) return; held=true; eat=true; if(s.hold==null) s.hold=Date.now()-s.t0; const v=$('stv'); if(v) v.pause(); box.classList.add('st-halt'); },220); };
    const end=()=>{ clearTimeout(tmr); if(!held) return; held=false; const s=S.sv; if(s&&s.hold!=null){ s.t0=Date.now()-s.hold; s.hold=null; } const v=$('stv'); if(v) v.play().catch(()=>{}); box.classList.remove('st-halt'); };
    nav.addEventListener('pointerdown',start); ['pointerup','pointercancel','pointerleave'].forEach(t=>nav.addEventListener(t,end));
    nav.addEventListener('click',e=>{ if(eat){ e.stopPropagation(); e.preventDefault(); eat=false; } },true);
    nav.addEventListener('contextmenu',e=>e.preventDefault());
  }
  if(typeof stDraw==='function'){
    const _sd = stDraw;
    stDraw = function(){ const r=_sd.apply(this,arguments); try{
      const box=document.querySelector('#modal .dark-zone > div.relative'); if(!box) return r;
      const hd=[...box.children].find(d=>d.querySelector&&d.querySelector('[onclick*="stClose"]')&&d.style.top==='16px');
      const bars=[...box.children].find(d=>d.querySelector&&d.querySelector('[id^="stb"]'));
      if(hd){ hd.classList.add('st-hd'); } if(bars) bars.classList.add('st-bars');
      box.classList.add('st-ui'); if(hd) stTone(box,hd); stHold(box);
      document.onkeydown = e=>{ if(!S.sv) return; if(e.key==='ArrowRight') stNext(); else if(e.key==='ArrowLeft') stPrev(); else if(e.key==='Escape') stClose(); };
    }catch(e){} return r; };
  }

  /* ---------- Posten: selbst entscheiden, ob der Beitrag in die Highlights kommt ---------- */
  if(typeof cfKatOpen==='function'){
    const _ko = cfKatOpen;
    cfKatOpen = function(){ const r=_ko.apply(this,arguments); try{
      const go=$('cfGo'); if(go && !$('cfHl')){ const f=S.cf||{};
        go.insertAdjacentHTML('beforebegin',`<label class="hl-opt"><input type="checkbox" id="cfHl" ${f.hl?'checked':''} onchange="S.cf&&(S.cf.hl=this.checked)"><span><b class="block text-sm"><svg class="ci"><use href="#i-stern_voll"/></svg> In meinen Highlights zeigen</b><span class="block text-xs text-muted mt-0.5">Highlights stehen ganz vorne in deinem Profil. Auftraggeber sehen nach der Freischaltung nur deine Highlights (maximal 6).</span></span></label>`); }
    }catch(e){} return r; };
  }
  const _rpc = rpc;
  rpc = async function(fn,args){
    const wantHl = fn==='post_neu' && S.cf && S.cf.hl;
    const res = await _rpc.apply(this,arguments);
    if(wantHl && res && res.ok && res.id){
      try{ const j=await _rpc('post_highlight',{p_id:res.id,p_an:true});
        if(j&&j.ok){ if(S.member) delete S.hl[S.member.id]; }
        else if(j&&j.grund==='max') setTimeout(()=>alert('Dein Beitrag ist online. In die Highlights konnte er nicht, weil du schon 6 hast. Nimm erst eines raus.'),300);
      }catch(e){}
    }
    return res;
  };

  /* ---------- Profil: Highlights zuerst, Beiträge rechts daneben ---------- */
  profTabs = function(mid,posts,own){
    const t=S.ptab[mid]||'hl'; if(t==='hl'&&S.hl[mid]===undefined){ S.hl[mid]=null; hlLoad(mid); }
    const tab=(k,l)=>`<button onclick="S.ptab[${mid}]='${k}';render()" class="pb-2 text-sm font-semibold" style="border-bottom:2px solid ${t===k?'#087A4B':'transparent'};color:${t===k?'rgb(var(--fg))':'rgb(var(--muted))'}">${l}</button>`;
    const hl=S.hl[mid];
    return `<div class="flex gap-6 border-b border-line mt-8">${tab('hl','<svg class="ci"><use href="#i-stern_voll"/></svg> Highlights')}${tab('alle','Beiträge')}</div>
      ${t==='hl'?`${own?`<p class="text-xs text-muted mt-3">Deine besten Beiträge, maximal 6. Auftraggeber sehen nach der Freischaltung nur diese. Beim Posten kannst du direkt „In meinen Highlights zeigen“ wählen, oder du öffnest einen Beitrag und tippst auf „<svg class="ci"><use href="#i-stern"/></svg> Highlight“.</p>`:''}${hl===null?'<p class="mt-6 text-sm text-muted text-center">Lädt …</p>':hl&&hl.length?postGrid(hl,false).replace('mt-8 ','mt-3 '):`<div class="mt-6 text-sm text-muted text-center">${own?'Noch keine Highlights.':'Noch keine Highlights.'} <button class="text-gold font-semibold" onclick="S.ptab[${mid}]='alle';render()">Alle Beiträge ansehen →</button></div>`}`
        :postGrid(posts,own).replace('mt-8 ','mt-3 ')}`;
  };

  /* ---------- Einstellungen: Kacheln mit Unterseiten ---------- */
  const SET = [
    ['profil','Profil bearbeiten','Bild, Angaben und Profiltext','profil',t=>/^(Profilbild|Über dich|Profiltext|Angaben)/.test(t)],
    ['cv','Lebenslauf & Nachweise','Für Bewerbungen und deinen Rang','dokument',t=>/^(Lebenslauf|Nachweise)/.test(t)],
    ['feed','Feed','Themen, Atempause und Timer','feedeinstellungen',t=>/^Feed/.test(t)],
    ['darstellung','Darstellung','Tag- oder Nacht-Modus','dunkel',t=>/^Darstellung/.test(t)],
    ['abzeichen','Abzeichen','Was in deinem Profil zu sehen ist','medaille',t=>/^(Welche Abzeichen|Abzeichen mit Partner)/.test(t)],
    ['einladen','Freunde einladen','Dein persönlicher Einladungslink','handschlag',t=>/^Member einladen/.test(t)],
    ['benachrichtigungen','Benachrichtigungen','Was du mitbekommst','mitteilungen',t=>/^Benachrichtigung/.test(t)],
    ['konto','Konto','Abo, Abmelden und Rechtliches','einstellungen',t=>/^Konto/.test(t)]
  ];
  const _settings = PAGES.einstellungen;
  function setCards(){
    const d=document.createElement('div'); d.innerHTML=_settings(); const root=d.firstElementChild||d;
    const groups={}; [...root.children].forEach(c=>{ if(/^H1$/.test(c.tagName)) return;
      const tt=c.querySelector('.font-semibold'); const t=((tt||c).textContent||'').replace(/\s+/g,' ').trim(); const g=(SET.find(s=>s[4](t))||['weitere'])[0];
      (groups[g]=groups[g]||[]).push(c.outerHTML); });
    return groups;
  }
  PAGES.einstellungen = function(){
    const G=setCards(), sub=S.setSub, def=SET.find(s=>s[0]===sub);
    if(sub && (G[sub]||sub==='konto')){
      const title=def?def[1]:'Weitere Einstellungen';
      let extra='';
      if(sub==='konto'){ const abo=S.member&&S.member.abo; const L={basic:'Basic (kostenlos)',dayone:'Day One',plus:'Plus',premium:'Premium'};
        extra=`${S.member?`<div class="card p-4 flex items-center justify-between gap-3"><div><p class="font-semibold">Dein Abo</p><p class="text-sm text-muted">${L[abo]||abo||'–'}</p></div>${abo==='basic'&&typeof plusModal==='function'?`<button class="btn-gold text-sm" onclick="plusModal('alle Funktionen nutzen')">Plus holen</button>`:''}</div>`:''}
          <div class="card p-4 text-sm space-y-2"><p class="font-semibold">Rechtliches</p><p class="text-muted">${typeof LEGAL==='function'?LEGAL():''} · <button class="hover:underline" onclick="legalOpen('widerruf')">Widerruf</button></p></div>
          ${S.user?`<button onclick="doLogout()" class="btn-ghost w-full">Abmelden</button>`:''}`; }
      return `<div class="ch-left sm px-4 py-6 space-y-4"><button class="set-back" onclick="S.setSub=null;render();scrollTo(0,0)">‹ Einstellungen</button>
        <h1 class="font-serif text-2xl" style="margin-top:0">${esc2(title)}</h1>${(G[sub]||[]).filter(h=>!(sub==='konto'&&/Sprache · Datenschutz/.test(h))).join('')}${extra}</div>`;
    }
    const tiles=SET.filter(s=>G[s[0]]||s[0]==='konto');
    if(G.weitere) tiles.push(['weitere','Weitere','Alle übrigen Einstellungen','menue']);
    return `<div class="ch-left sm px-4 py-6"><h1 class="font-serif text-2xl mb-4">Einstellungen</h1>
      <div class="set-grid">${tiles.map(s=>`<button class="set-t" onclick="S.setSub='${s[0]}';render();scrollTo(0,0)"><span class="i"><svg class="ci" style="width:20px;height:20px"><use href="#i-${s[3]}"/></svg></span><span><b>${s[1]}</b><span class="s">${s[2]}</span></span></button>`).join('')}</div></div>`;
  };

  /* ---------- Start ---------- */
  document.documentElement.dataset.r=route();
  try{ render(); }catch(e){}
})();
