/* ===== ClosingHub App-Plus =====
   Stories (Kontrastfarben, Halten = Pause, links ausgerichtet), Spotlight aufklappbar rechts,
   Ränge im Player passend zum Hintergrund, Pause-Symbol kurz einblenden, Partner-Siegel im Marktplatz,
   geteilte Beiträge im Chat, Vorschau vor dem Hochladen von Nachweisen, eigene Story über das Profilbild,
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
  .sp-card{background:#0E1A2B;border:1px solid #22324A;border-radius:14px;color:#fff;margin-bottom:10px;overflow:hidden}
  aside .sp-card{margin-bottom:0}
  .sp-h{width:100%;display:flex;align-items:center;gap:8px;padding:10px 14px;text-align:left;color:#fff}
  .sp-cr{color:#F1D58A;width:16px;height:16px}
  .sp-k{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3FBF86}
  .sp-n{display:flex;align-items:center;gap:6px;margin-left:auto;min-width:0;font-size:13px}
  .sp-n b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px}
  .sp-ch{flex-shrink:0;opacity:.7;transition:transform .2s}
  .sp-card.open .sp-ch{transform:rotate(180deg)}
  .sp-b{display:none;padding:0 14px 12px}
  .sp-card.open .sp-b{display:block}
  .sp-a{font-size:14.5px;line-height:1.5;margin:0;white-space:pre-line;overflow-wrap:anywhere}
  .sp-q{font-size:12px;color:#8A9BB0;margin:6px 0 0}
  /* Geteilte Beiträge im Chat */
  .lkp{position:relative;display:block;width:min(300px,72vw);border-radius:14px;overflow:hidden;background:#0E1A2B;padding:0;border:1px solid rgb(var(--line));cursor:pointer}
  .lkp .m{display:block;width:100%;height:auto;max-height:420px;object-fit:contain;filter:blur(3px) saturate(1.05);transform:scale(1.04)}
  .lkp .tx{display:block;padding:22px 18px;min-height:150px;font-family:Georgia,serif;font-size:17px;line-height:1.45;color:#fff;white-space:pre-line;overflow-wrap:anywhere;filter:blur(2.2px);text-align:left}
  .lkp .lab{position:absolute;top:8px;left:8px;z-index:2;font-size:11px;font-weight:600;color:#fff;background:rgba(0,0,0,.5);padding:3px 8px;border-radius:999px;max-width:calc(100% - 16px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .lkp .go{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center}
  .lkp .go span{display:inline-flex;align-items:center;gap:6px;background:rgba(0,0,0,.6);color:#fff;font-weight:700;font-size:14px;padding:9px 18px;border-radius:999px;backdrop-filter:blur(4px)}
  .lkp:hover .go span{background:#087A4B}
  /* Nachweise: Vorschau */
  .nw-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
  .nw-t{position:relative;aspect-ratio:3/4;border-radius:10px;overflow:hidden;border:1px solid rgb(var(--line));background:rgb(var(--bg));display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;color:rgb(var(--muted));cursor:pointer;padding:0}
  .nw-t img{width:100%;height:100%;object-fit:cover}
  .nw-t .st{position:absolute;left:4px;right:4px;bottom:4px;font-size:10px;font-weight:700;border-radius:6px;padding:2px 4px;background:rgba(0,0,0,.62);color:#fff}
  .nw-ov{position:fixed;inset:0;z-index:80;background:rgba(4,8,14,.7);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px}
  .nw-box{background:rgb(var(--panel));border-radius:18px;width:min(520px,100%);max-height:92vh;overflow:auto;padding:18px}
  .nw-pv{border-radius:12px;overflow:hidden;border:1px solid rgb(var(--line));background:rgb(var(--bg));display:flex;align-items:center;justify-content:center;min-height:180px}
  .nw-pv img{max-width:100%;max-height:60vh;display:block}
  .nw-pv iframe{width:100%;height:60vh;border:0}
  /* Profil: eigene Story */
  .pf-st{cursor:pointer;border-radius:50%;padding:3px;background:conic-gradient(#D9B45A,#087A4B,#D9B45A)}
  .pf-st>*{box-shadow:0 0 0 3px rgb(var(--bg));border-radius:50%}
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
  function fixAll(){ try{ fixPartners(); }catch(e){} try{ fixSpot(); }catch(e){} try{ fixProfilStory(); }catch(e){} try{ fixPlayerRk(); }catch(e){} try{ fixNwThumbs(); }catch(e){} }

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

  /* ---------- Spotlight: kleines, aufklappbares Fenster (Desktop rechts über „Neueste Jobs“) ---------- */
  const DESK = () => window.matchMedia('(min-width:1024px)').matches;
  function spotData(){ try{ const b=bState(); const i=b?b.i-1:-1; const w=i>=0&&b.q&&b.q[i]?bWinner(i):null; return w?{w,q:b.q[i]}:null; }catch(e){ return null; } }
  window.APLUS_sp = () => { S.spOpen=!S.spOpen; try{ localStorage.setItem('ch_sp_open',S.spOpen?'1':'0'); }catch(e){} document.querySelectorAll('.sp-card').forEach(c=>c.classList.toggle('open',S.spOpen)); };
  try{ S.spOpen = localStorage.getItem('ch_sp_open')==='1'; }catch(e){}
  function spotCard(){ const d=spotData(); if(!d) return '';
    return `<div class="sp-card ${S.spOpen?'open':''}"><button class="sp-h" onclick="APLUS_sp()" aria-label="Spotlight aufklappen"><svg class="ci sp-cr"><use href="#i-krone"/></svg><span class="sp-k">Spotlight</span><span class="sp-n">${skAv(d.w.n,22,avatar(d.w.n),'shrink-0')}<b>${esc2(d.w.n)}</b></span><svg class="sp-ch" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
      <div class="sp-b"><p class="sp-a">„${esc2(d.w.t)}“</p><p class="sp-q">Sieger des letzten Einwand-Battles · auf „${esc2(d.q)}“</p></div></div>`; }
  function fixSpot(){
    const old=document.querySelector('#battle .bt-spot, #battle .bt-spot2, #battle .bt-spot-x'); if(!old) return;
    if(DESK()){ old.remove(); return; }
    const h=spotCard(); if(h) old.outerHTML=h; else old.remove();
  }
  if(typeof rightRail==='function'){
    const _rr = rightRail;
    rightRail = function(){ let h=_rr.apply(this,arguments); try{ const c=spotCard(); if(c){ const k='<div class="card p-4"><div class="flex justify-between mb-2"><p class="text-xs uppercase tracking-wider text-muted">Neueste Jobs'; const i=h.indexOf(k);
      h = i>0 ? h.slice(0,i)+c+h.slice(i) : h.replace(/(<aside[^>]*>)/, '$1'+c); } }catch(e){} return h; };
  }

  /* ---------- Player: Pause-Symbol nur kurz einblenden ---------- */
  if(typeof drawPlayer==='function' && typeof togglePause==='function'){
    const _dp = drawPlayer;
    drawPlayer = function(){ const ov=document.querySelector('#modal video[autoplay]'); const keep=ov?{src:ov.currentSrc||ov.src,t:ov.currentTime}:null;
      const r=_dp.apply(this,arguments); try{ plSound(keep); }catch(e){} try{
      const pz=document.querySelector('[aria-label="Pausiert"]'); const box=pz&&pz.parentElement;
      const p=S.player, dt=p&&p.pzAt?Date.now()-p.pzAt:99999;
      if(box){ if(dt<1000){ box.classList.add('pz-flash'); box.style.animationDelay=(-dt)+'ms'; } else box.remove(); }
      if(p && !p.paused && p.pzAt && dt<1000 && p.pzPlay){ const host=document.querySelector('.select-none[onclick*="togglePause"]'); if(host && !host.querySelector('.pl-flash')){ host.insertAdjacentHTML('beforeend',`<div class="pl-flash pz-flash absolute inset-0 flex items-center justify-center pointer-events-none" style="animation-delay:${-dt}ms"><svg width="64" height="64" viewBox="0 0 64 64" style="filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))"><path d="M22 14l28 18-28 18z" fill="#fff"/></svg></div>`); } }
    }catch(e){} return r; };
    const _tp = togglePause;
    togglePause = function(){ if(S.player){ S.player.pzAt=Date.now(); S.player.pzPlay=!!S.player.paused; } return _tp.apply(this,arguments); };
  }

  /* ---------- Player: Kurzvideos mit Ton (im Feed bleiben sie stumm) ---------- */
  const SPK_ON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const SPK_OFF='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
  window.APLUS_snd = e => { if(e) e.stopPropagation(); const v=document.querySelector('#modal video[autoplay]'); if(!v) return; S.muted=!v.muted; v.muted=S.muted; if(!S.muted){ v.volume=1; v.play().catch(()=>{}); } const b=$('plSnd'); if(b) b.innerHTML=v.muted?SPK_OFF:SPK_ON; };
  function plSound(keep){
    const v=document.querySelector('#modal video[autoplay]'); if(!v) return;
    v.removeAttribute('onclick'); v.onclick=null;
    if(keep && keep.src && v.src===keep.src.split('#')[0] || keep && keep.src && (v.currentSrc||v.src)===keep.src){ if(keep.t>0){ const st=()=>{ try{ v.currentTime=keep.t; }catch(e){} }; if(v.readyState>=1) st(); else v.addEventListener('loadedmetadata',st,{once:true}); } }
    v.muted = S.muted===true; v.volume=1;
    if(S.player && S.player.paused){ v.pause(); }
    else { const p=v.play(); if(p) p.catch(()=>{ v.muted=true; v.play().catch(()=>{}); const b=$('plSnd'); if(b) b.innerHTML=SPK_OFF; }); }
    if(!$('plSnd')){ const host=v.closest('.relative')||v.parentElement; host.insertAdjacentHTML('beforeend',`<button id="plSnd" onclick="APLUS_snd(event)" aria-label="Ton an oder aus" style="position:absolute;top:58px;right:14px;z-index:30;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);color:#fff">${v.muted?SPK_OFF:SPK_ON}</button>`); }
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
    ['abzeichen','Abzeichen','Was in deinem Profil zu sehen ist','medaille',t=>/^(Welche Abzeichen|Abzeichen mit Partner)/.test(t)],
    ['einladen','Freunde einladen','Dein persönlicher Einladungslink','handschlag',t=>/^Member einladen/.test(t)],
    ['benachrichtigungen','Benachrichtigungen','Was du mitbekommst','mitteilungen',t=>/^Benachrichtigung/.test(t)],
    ['konto','Konto','Abo, Abmelden und Rechtliches','einstellungen',t=>/^Konto/.test(t)]
  ];
  const _settings = PAGES.einstellungen;
  function setCards(){
    const d=document.createElement('div'); d.innerHTML=_settings(); const root=d.firstElementChild||d;
    const groups={}; [...root.children].forEach(c=>{ if(/^H1$/.test(c.tagName)) return;
      const tt=c.querySelector('.font-semibold'); const t=((tt||c).textContent||'').replace(/\s+/g,' ').trim(); if(/^Darstellung/.test(t)) return; const g=(SET.find(s=>s[4](t))||['weitere'])[0];
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

  /* ---------- Player: Ränge passend zum Hintergrund ---------- */
  function lumOf(css){ const c=colorsIn(css)[0]; return c?lum(...c):0; }
  function mix(c,t,a){ return c.map((v,i)=>Math.round(v*(1-a)+t[i]*a)); }
  function fixPlayerRk(){
    const ov=document.querySelector('#modal .bg-gradient-to-t'); if(!ov || ov.dataset.rk) return; ov.dataset.rk='1';
    // Hintergrund der Namenszeile: Bild darunter, abgedunkelt durch den Verlauf
    let bg=0.05; const img=document.querySelector('#modal img.vidimg, #modal img.object-cover, #modal img');
    try{ if(img && img.complete && img.naturalWidth){ const c=document.createElement('canvas'); c.width=24; c.height=8; const x=c.getContext('2d'); x.drawImage(img,0,img.naturalHeight*.82,img.naturalWidth,img.naturalHeight*.18,0,0,24,8); const d=x.getImageData(0,0,24,8).data; let L=0,n=0; for(let k=0;k<d.length;k+=4){ L+=lum(d[k],d[k+1],d[k+2]); n++; } bg=(L/n)*0.18; } }catch(e){}
    const light = bg>0.5;
    ov.querySelectorAll('.rk').forEach(rk=>{
      const c=colorsIn(getComputedStyle(rk).color)[0]||[200,200,200], L=lum(...c);
      let nc=c; if(!light && L<0.5) nc=mix(c,[255,255,255],0.62); if(light && L>0.25) nc=mix(c,[0,0,0],0.65);
      const col=`rgb(${nc.join(',')})`;
      rk.style.setProperty('color',col,'important'); rk.style.setProperty('border-color',`rgba(${nc.join(',')},.7)`,'important');
      rk.style.setProperty('background',light?'rgba(255,255,255,.55)':'rgba(0,0,0,.28)','important');
    });
  }

  /* ---------- Profil: eigene Story über das Profilbild ---------- */
  function fixProfilStory(){
    if(route()!=='profile' || !S.member || S.member.partner) return;
    const av=document.querySelector('#app .flex.items-center.gap-5 > .relative.shrink-0'); if(!av || av.dataset.st) return; av.dataset.st='1';
    if(S.st===undefined){ S.st=null; stLoad().then(()=>{ av.dataset.st=''; fixProfilStory(); }); return; }
    const l=S.st||[], own=l.findIndex(g=>g.ich);
    av.style.cursor='pointer'; av.title=own>=0?'Deinen Status ansehen':'Status posten';
    if(own>=0) av.classList.add('pf-st');
    av.onclick=()=>{ if(own>=0) stOpen(own); else if(typeof postMode==='function') postMode('status'); };
  }

  /* ---------- Nachrichten: geteilte Beiträge ganz zeigen, leicht verpixelt, „Ansehen“ in der Mitte ---------- */
  if(typeof lkData==='function' && typeof linkCard==='function'){
    const _lkd = lkData, _lkc = linkCard;
    lkData = async function(k,id){
      if(k!=='p') return _lkd.apply(this,arguments);
      const key=k+id; if(key in S.lkc) return S.lkc[key]; S.lkc[key]=null; let d=null;
      try{ const r=await rpc('post_laden',{p_id:id}); if(r) d={t:'Beitrag von '+String(r.name||'').split(' ')[0],full:r.text||'',img:r.media_typ==='bild'?(r.media_url||r.thumb_url):(r.thumb_url||null),vid:!r.thumb_url&&r.media_typ==='video'?r.media_url:null,s:(r.text||'').slice(0,140)}; }catch(e){}
      S.lkc[key]=d||{gone:1}; document.querySelectorAll(`[data-lk="${key}"]`).forEach(el=>{ el.outerHTML=linkCard(k,id); }); try{ cmStick(); }catch(e){} return S.lkc[key];
    };
    linkCard = function(k,id){
      if(k!=='p') return _lkc.apply(this,arguments);
      const key=k+id, d=S.lkc[key]; if(d===undefined) setTimeout(()=>lkData(k,id),0);
      if(!d || d.gone || d.full===undefined) return _lkc.apply(this,arguments);
      const media = d.img?`<img class="m" src="${esc2(d.img)}" alt="" onload="try{cmStick()}catch(e){}">`:d.vid?`<video class="m" src="${esc2(d.vid)}#t=0.1" muted playsinline preload="metadata" onloadedmetadata="try{cmStick()}catch(e){}"></video>`:`<span class="tx">${esc2(d.full||'Beitrag')}</span>`;
      return `<button type="button" class="lkp" onclick="openLink('p',${id})">${media}<span class="lab">${esc2(d.t)}</span><span class="go"><span><svg class="ci"><use href="#i-ansehen"/></svg> Ansehen</span></span></button>`;
    };
  }

  /* ---------- Lebenslauf & Nachweise: Vorschau vor dem Absenden + hochgeladene Dateien als Bild ---------- */
  const NW_ST={offen:'In Prüfung',bestaetigt:'Geprüft',abgelehnt:'Abgelehnt'};
  S.nwUrl=S.nwUrl||{};
  async function nwSign(path){ if(S.nwUrl[path]) return S.nwUrl[path]; const t=await sesToken(); const r=await fetch(`${SB_URL}/storage/v1/object/sign/nachweise/${path}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})});
    const j=await r.json().catch(()=>({})); const u=j.signedURL||j.signedUrl; if(!r.ok||!u) throw 0; S.nwUrl[path]=/^https?:/.test(u)?u:`${SB_URL}/storage/v1${u.startsWith('/')?'':'/'}${u}`; return S.nwUrl[path]; }
  window.APLUS_nwOpen = async (path) => { try{ const u=await nwSign(path); if(/\.pdf$/i.test(path)) window.open(u,'_blank','noopener'); else if(typeof lightbox==='function') lightbox(u); else window.open(u,'_blank','noopener'); }catch(e){ alert('Die Datei konnte nicht geladen werden.'); } };
  function nwGallery(list){ if(!list.length) return '';
    return `<div class="nw-g">${list.map(p=>{ const pdf=/\.pdf$/i.test(p.datei_url||''); return `<button type="button" class="nw-t" ${p.datei_url?`data-nwp="${esc2(p.datei_url)}" onclick="APLUS_nwOpen('${esc2(p.datei_url)}')"`:''} title="${esc2((PROOF_ART&&PROOF_ART[p.art])||p.titel||'')}">${pdf||!p.datei_url?`<span><svg class="ci" style="width:26px;height:26px"><use href="#i-dokument"/></svg><br>${pdf?'PDF':'Datei'}</span>`:'<span>Lädt …</span>'}<span class="st">${esc2(NW_ST[p.status]||p.status)}</span></button>`; }).join('')}</div>`; }
  function fixNwThumbs(){
    document.querySelectorAll('.nw-t[data-nwp]').forEach(b=>{ const p=b.dataset.nwp; if(b.dataset.ld||/\.pdf$/i.test(p)) return; b.dataset.ld='1';
      nwSign(p).then(u=>{ const sp=b.querySelector('span:not(.st)'); if(sp) sp.outerHTML=`<img src="${esc2(u)}" alt="" loading="lazy">`; }).catch(()=>{ const sp=b.querySelector('span:not(.st)'); if(sp) sp.textContent='Vorschau nicht verfügbar'; }); });
  }
  const injectGallery = (html, list) => { if(!list.length) return html; const i=html.indexOf('</p></div>'); return i>0 ? html.slice(0,i+10)+nwGallery(list)+html.slice(i+10) : html; };
  if(typeof cvCard==='function'){ const _cv=cvCard; cvCard=function(){ const h=_cv.apply(this,arguments); if(!h) return h; return injectGallery(h,(S.proofs||[]).filter(p=>p.art==='lebenslauf').slice(0,3)); }; }
  if(typeof nachweiseCard==='function'){ const _nw=nachweiseCard; nachweiseCard=function(){ const h=_nw.apply(this,arguments); if(!h) return h; return injectGallery(h,(S.proofs||[]).filter(p=>p.art!=='lebenslauf')); }; }
  function nwPreview(file, title, onOk){
    const url=URL.createObjectURL(file), pdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name);
    const ov=document.createElement('div'); ov.className='nw-ov';
    ov.innerHTML=`<div class="nw-box"><div class="flex items-start justify-between gap-3 mb-3"><div><p class="font-serif text-xl leading-tight">${esc2(title)} prüfen</p><p class="text-xs text-muted mt-1">Schau dir die Datei an, bevor du sie abschickst. Ist alles gut lesbar?</p></div><button class="text-muted text-xl leading-none" data-x aria-label="Schließen"><svg class="ci"><use href="#i-schliessen"/></svg></button></div>
      <div class="nw-pv">${pdf?`<iframe src="${url}" title="Vorschau"></iframe>`:file.type.startsWith('image/')?`<img src="${url}" alt="Vorschau">`:`<p class="text-sm text-muted p-6">${esc2(file.name)}</p>`}</div>
      <p class="text-xs text-muted mt-2">${esc2(file.name)} · ${(file.size/1024/1024).toFixed(1).replace('.',',')} MB</p>
      <div class="grid grid-cols-2 gap-2 mt-4"><button class="btn-ghost" data-x>Andere Datei</button><button class="btn-gold" data-ok>Jetzt absenden</button></div></div>`;
    const close=()=>{ ov.remove(); URL.revokeObjectURL(url); };
    ov.addEventListener('click',e=>{ if(e.target===ov||e.target.closest('[data-x]')) close(); if(e.target.closest('[data-ok]')){ close(); onOk(); } });
    document.body.appendChild(ov);
  }
  if(typeof cvSend==='function'){ const _cs=cvSend; cvSend=function(inp){ const f=inp.files&&inp.files[0]; if(!f) return; inp.value='';
      if(f.size>15*1024*1024){ const e=$('cvErr'); if(e) e.textContent='Die Datei ist größer als 15 MB.'; return; }
      nwPreview(f,'Lebenslauf',()=>_cs({files:[f]})); }; }
  if(typeof nwSend==='function'){ const _ns=nwSend; nwSend=function(inp){ const f=inp.files&&inp.files[0]; if(!f) return; inp.value='';
      if(f.size>15*1024*1024){ const e=$('nwErr'); if(e) e.textContent='Die Datei ist größer als 15 MB.'; return; }
      const art=$('nwArt'); nwPreview(f,(art&&art.selectedOptions[0]&&art.selectedOptions[0].textContent)||'Nachweis',()=>_ns({files:[f]})); }; }

  /* ---------- Start ---------- */
  document.documentElement.dataset.r=route();
  try{ render(); }catch(e){}
})();
