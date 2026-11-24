/* ===== ClosingHub App-Plus (r26 · Partner-Angebote ohne 3er-Grenze, Suche findet Partner-Angebote, Follower-Listen) =====
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
  .ht{color:#087A4B;font-weight:600;cursor:pointer;border-radius:4px}
  .ht:hover{text-decoration:underline}
  html:not(.light) .ht{color:#3FCF8E}
  #modal .ht{color:#7FE6B5}
  .ht-chips{display:flex;flex-wrap:wrap;gap:8px}
  .ht-chip{display:inline-flex;align-items:center;gap:4px;padding:7px 12px;border-radius:999px;border:1px solid rgb(var(--line,128 128 128) / .35);background:rgb(var(--panel,128 128 128) / .5);font-size:14px;line-height:1}
  .ht-chip b{color:#087A4B} html:not(.light) .ht-chip b{color:#3FCF8E}
  .ht-chip span{font-size:11px;opacity:.55;margin-left:4px}
  .ht-chip:hover{border-color:#087A4B}
  .ht-hint{font-size:11px;opacity:0;max-height:0;overflow:hidden;transition:opacity .2s,max-height .2s;color:#B4690E;margin:0}
  .ht-hint.on{opacity:.9;max-height:20px;margin-top:4px}
  .sr-box{position:relative}
  .sr-box .sr-ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5;pointer-events:none}
  .sr-box .input{padding-left:38px;padding-right:36px}
  .sr-box input[type=search]::-webkit-search-cancel-button{-webkit-appearance:none}
  .sr-x{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;font-size:18px;line-height:1;opacity:.55}
  .object-contain{-o-object-fit:contain;object-fit:contain}
  .pl-fit{object-fit:contain!important;background:transparent!important}
  #modal .bg-gradient-to-t{z-index:25}
  .pl-acts{margin-left:auto;display:inline-flex;align-items:center;gap:10px;position:relative}
  .pl-menu{display:none;position:absolute;right:0;bottom:calc(100% + 10px);min-width:200px;background:rgba(14,26,43,.96);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:6px;z-index:40;box-shadow:0 12px 30px rgba(0,0,0,.4)}
  .pl-menu.open{display:block}
  .pl-mi{display:flex!important;align-items:center;gap:8px;width:100%;text-align:left;padding:10px 12px!important;border-radius:10px;font-size:14px!important;color:#fff!important;margin:0!important;background:none}
  .pl-mi:hover{background:rgba(255,255,255,.08)}
  .pl-bd{position:absolute;inset:-6%;width:112%;height:112%;object-fit:cover;filter:blur(28px) brightness(.55) saturate(1.2);pointer-events:none}
  /* Handy: Plus in der unteren Leiste, Profil, Laufband */
  .bn-plus{display:flex;align-items:center;justify-content:center}
  .bn-pl{width:44px;height:34px;border-radius:12px;background:#087A4B;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(8,122,75,.35)}
  .bn-plus.on .bn-pl{background:#0E1A2B}
  .pf-set{display:none}
  @media(max-width:767px){
    html[data-r="profile"] #app .flex-1.space-y-2 a[href="#create"]{display:none!important}
    .pf-set{display:flex;position:absolute;top:14px;right:14px;width:40px;height:40px;border-radius:50%;align-items:center;justify-content:center;border:1px solid rgb(var(--line));background:rgb(var(--panel));color:rgb(var(--fg));z-index:5}
    .adlane{display:none!important}
    .admarq{display:block!important;position:relative;width:100%;height:24px;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
    .admarq-track{display:flex;align-items:center;height:100%;width:max-content;animation-name:admarq;animation-timing-function:linear;animation-iteration-count:infinite;will-change:transform}
    .admarq-it{display:inline-flex;align-items:center;gap:.45rem;white-space:nowrap;padding:0 1.25rem;height:100%;font-size:13px}
  }
  /* Player: Wischen + Aktionen rechts (Handy) */
  html.pl-open,html.pl-open body{overflow:hidden!important;overscroll-behavior:none}
  html.pl-open #modal{touch-action:none;overscroll-behavior:contain}
  html.pl-open #modal #psheet,html.pl-open #modal #plMenu{touch-action:auto}
  #pbar{transition:width .1s linear}
  @keyframes plUp{from{transform:translateY(100%)}to{transform:none}}
  @keyframes plDown{from{transform:translateY(-100%)}to{transform:none}}
  #modal .slide-up{animation:plUp .3s cubic-bezier(.2,.8,.2,1)!important}
  #modal .slide-down{animation:plDown .3s cubic-bezier(.2,.8,.2,1)!important}
  html.pl-open #modal > div{background:#000}
  .pl-side{position:absolute;right:8px;bottom:22px;display:flex;flex-direction:column;align-items:center;gap:16px;z-index:30}
  .pl-side>button{display:flex!important;flex-direction:column;align-items:center;gap:3px!important;margin:0!important;color:#fff}
  .pl-side .icbox{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,14,22,.38);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  .pl-side .icbox svg{color:#fff;stroke:#fff}
  .pl-side .icon-on .icbox svg,.pl-side .icon-on .icbox svg *{color:#ff3b5c!important;stroke:#ff3b5c!important;fill:#ff3b5c!important}
  .pl-side .text-sm{font-size:12px;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.6)}
  .pl-av{position:relative;margin-bottom:6px}
  .pl-av>span{display:block;border-radius:50%;box-shadow:0 0 0 2px #fff}
  .pl-av button{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;background:#e5484d;color:#fff;font-weight:800;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;border:0}
  .pl-av button.on{background:#fff;color:#087A4B}
  .pl-side #plMenu{right:56px;bottom:0}
  @media(max-width:767px){ #modal .pl-has-side{padding-right:74px!important} #modal .pl-has-side .pl-acts{display:none} }
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
  render = function(){ const r=route(); if(r!=='einstellungen') S.setSub=null; document.documentElement.dataset.r=r; try{ htFix(); }catch(e){} const out=_render.apply(this,arguments); fixAll(); return out; };
  let fixQ=0; const fixSoon=()=>{ if(fixQ) return; fixQ=requestAnimationFrame(()=>{ fixQ=0; fixAll(); }); };
  const lvOwn=m=>{ const t=m.target.nodeType===1?m.target:m.target.parentElement; return !!(t&&t.closest&&t.closest('.chlv,#chlvo')); };
  new MutationObserver(ms=>{ if(ms.every(lvOwn)) return; fixSoon(); }).observe(document.body,{childList:true,subtree:true});
  function fixAll(){ try{ fixJobs(); }catch(e){}  try{ fixSeen(); }catch(e){} try{ fixOrt(); }catch(e){}  try{ fixTop(); }catch(e){}  try{ fixNav(); }catch(e){} try{ fixProfil(); }catch(e){} try{ fixPartners(); }catch(e){} try{ fixSpot(); }catch(e){} try{ fixProfilStory(); }catch(e){} try{ fixPlayerRk(); }catch(e){} try{ fixNwThumbs(); }catch(e){} }

  /* ---------- Handy: Plus-Knopf unten, Profil aufgeräumt, Einstellungen im Profil ---------- */
  function fixNav(){
    const bar=document.querySelector('nav.fixed.bottom-0 .flex.justify-around'); if(!bar) return;
    let pl=bar.querySelector('.bn-plus');
    if(!pl){ const feedA=bar.querySelector('a[href="#feed"]'); bar.insertAdjacentHTML('beforeend',`<a href="#create" class="p-2 bn-plus" onclick="S.cmode='beitrag'" aria-label="Beitrag posten"><span class="bn-pl"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span></a>`); pl=bar.querySelector('.bn-plus'); const prof=bar.querySelector('a[href="#profile"]'); if(prof) bar.insertBefore(pl,prof); }
    pl.classList.toggle('on', route()==='create');
    let sr=bar.querySelector('.bn-search');
    if(!sr){ bar.insertAdjacentHTML('beforeend',`<a href="#search" class="p-2 bn-search" aria-label="Suche"><span>${ic('search')}</span></a>`); sr=bar.querySelector('.bn-search'); }
    const prof=bar.querySelector('a[href="#profile"],a[href="#login"]:last-child'); if(prof && sr.nextElementSibling!==prof) bar.insertBefore(sr,prof);
    if(pl.nextElementSibling!==sr) bar.insertBefore(pl,sr);
    sr.firstElementChild.classList.toggle('icon-on', route()==='search');
    document.querySelectorAll('header.md\\:hidden a[href="#search"]').forEach(a=>a.remove());
  }
  function fixProfil(){
    const r=route(), mob=window.innerWidth<768;
    const perk=document.querySelector('.perk-label'); const strip=perk&&perk.parentElement; if(strip) strip.style.display=(mob&&r==='profile')?'none':'';
    if(r!=='profile' || !S.member || S.member.partner) return;
    const head=document.querySelector('#app .flex.items-center.gap-5'); if(!head) return; const box=head.parentElement;
    const desc=[...box.children].find(c=>c.classList.contains('mt-5')&&c.classList.contains('space-y-2')&&c.classList.contains('text-left'));
    if(desc && desc.previousElementSibling!==head){ head.after(desc); desc.classList.remove('mt-5'); desc.style.marginTop='16px'; desc.style.marginBottom='4px'; }
    if(!box.querySelector('.pf-set')){ if(getComputedStyle(box).position==='static') box.style.position='relative'; box.insertAdjacentHTML('afterbegin',`<a href="#einstellungen" class="pf-set" aria-label="Einstellungen"><svg class="ci" style="width:20px;height:20px"><use href="#i-einstellungen"/></svg></a>`); }
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
    drawPlayer = function(){ try{ htFix(); }catch(e){} const ov=document.querySelector('#modal video[autoplay]'); const keep=ov?{src:ov.currentSrc||ov.src,t:ov.currentTime}:null;
      const r=_dp.apply(this,arguments); try{ plSwap(); }catch(e){} plOpen(true); try{ plFit(); }catch(e){} try{ plMenu(); }catch(e){} try{ plSide(); }catch(e){} try{ plSound(keep); }catch(e){} try{
      const pz=document.querySelector('[aria-label="Pausiert"]'); const box=pz&&pz.parentElement;
      const p=S.player, dt=p&&p.pzAt?Date.now()-p.pzAt:99999;
      if(box){ if(dt<1000){ box.classList.add('pz-flash'); box.style.animationDelay=(-dt)+'ms'; } else box.remove(); }
      if(p && !p.paused && p.pzAt && dt<1000 && p.pzPlay){ const host=document.querySelector('.select-none[onclick*="togglePause"]'); if(host && !host.querySelector('.pl-flash')){ host.insertAdjacentHTML('beforeend',`<div class="pl-flash pz-flash absolute inset-0 flex items-center justify-center pointer-events-none" style="animation-delay:${-dt}ms"><svg width="64" height="64" viewBox="0 0 64 64" style="filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))"><path d="M22 14l28 18-28 18z" fill="#fff"/></svg></div>`); } }
    }catch(e){} return r; };
    const _tp = togglePause;
    togglePause = function(){ if(S.player){ S.player.pzAt=Date.now(); S.player.pzPlay=!!S.player.paused; } return _tp.apply(this,arguments); };
  }

  /* ---------- Player: Bilder und Videos im richtigen Seitenverhältnis (nichts gestreckt oder beschnitten) ---------- */
  function plFit(){
    document.querySelectorAll('#modal img.absolute.inset-0, #modal video.absolute.inset-0').forEach(m=>{
      if(m.classList.contains('vidimg') || m.classList.contains('pl-bd') || m.dataset.fit) return;
      const r=m.getBoundingClientRect(); if(r.width<200) return;
      m.dataset.fit='1'; m.classList.add('pl-fit');
      const host=m.parentElement; if(!host) return; if(getComputedStyle(host).position==='static') host.style.position='relative'; host.style.overflow='hidden';
      if(m.tagName==='IMG' && !host.querySelector('.pl-bd')){ const bd=document.createElement('img'); bd.className='pl-bd'; bd.src=m.currentSrc||m.src; bd.alt=''; bd.setAttribute('aria-hidden','true'); host.insertBefore(bd,m); }
      if(m.tagName==='IMG'){ const fit=()=>plBand(m,host); if(m.complete&&m.naturalWidth) fit(); else m.addEventListener('load',fit,{once:true}); }
      if(m.tagName==='VIDEO'){ host.style.background='#000'; }
    });
  }

  // Bild genau auf seine sichtbare Fläche setzen und die Kanten weich in den Hintergrund auslaufen lassen
  function plBand(m,host){
    const W=host.clientWidth, H=host.clientHeight, nw=m.naturalWidth, nh=m.naturalHeight; if(!W||!H||!nw||!nh) return;
    const sc=Math.min(W/nw,H/nh), w=nw*sc, h=nh*sc, top=(H-h)/2, left=(W-w)/2;
    Object.assign(m.style,{inset:'auto',top:top+'px',left:left+'px',width:w+'px',height:h+'px',objectFit:'fill'});
    const g = h<H-4 ? 'linear-gradient(to bottom,transparent 0,#000 9%,#000 91%,transparent 100%)' : w<W-4 ? 'linear-gradient(to right,transparent 0,#000 9%,#000 91%,transparent 100%)' : 'none';
    m.style.webkitMaskImage=g; m.style.maskImage=g;
  }
  window.addEventListener('resize',()=>{ document.querySelectorAll('#modal img.pl-fit').forEach(m=>plBand(m,m.parentElement)); });

  /* ---------- Player: Highlight, Nur im Feed, Bearbeiten, Zurückziehen bzw. Melden im Menü neben „Senden“ ---------- */
  window.APLUS_plm = e => { if(e) e.stopPropagation(); const mn=$('plMenu'); if(mn) mn.classList.toggle('open'); };
  document.addEventListener('pointerdown', e=>{ const mn=$('plMenu'); if(mn && mn.classList.contains('open') && !e.target.closest('#plMenu') && !e.target.closest('.pl-more')) mn.classList.remove('open'); }, true);
  function plMenu(){
    const ov=document.querySelector('#modal .bg-gradient-to-t'); if(!ov || ov.querySelector('.pl-more')) return;
    const row=ov.querySelector('span.flex.gap-4.mt-1'), rep=ov.querySelector('button[onclick*="reportPost"]'), share=ov.querySelector('[aria-label="Teilen"]');
    if(!share || (!row && !rep)) return;
    const items=row?[...row.children]:[rep];
    const mn=document.createElement('div'); mn.id='plMenu'; mn.className='pl-menu';
    items.forEach(b=>{ b.className='pl-mi'; b.style.color=''; const f=b.getAttribute('onclick')||''; b.setAttribute('onclick',f+';var m=document.getElementById(\'plMenu\');if(m)m.classList.remove(\'open\')'); mn.appendChild(b); });
    if(row) row.remove();
    const wrap=document.createElement('span'); wrap.className='pl-acts'; share.replaceWith(wrap); share.classList.remove('ml-auto');
    wrap.insertAdjacentHTML('beforeend',`<button class="pl-more" onclick="APLUS_plm(event)" aria-label="Einstellungen zum Beitrag"><span class="icbox"><svg class="ci" style="width:20px;height:20px"><use href="#i-einstellungen"/></svg></span></button>`);
    wrap.appendChild(share); wrap.appendChild(mn);
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

  /* ---------- Player: Zeit und Fortschritt passend zum Kurzvideo ---------- */
  if(typeof updBar==='function'){
    const _ub = updBar;
    updBar = function(){ const v=document.querySelector('#modal video[autoplay]');
      if(!v || !isFinite(v.duration) || !v.duration) return _ub.apply(this,arguments);
      const b=$('pbar'), t=$('ptime'); if(b){ b.style.transition='none'; b.style.width=(v.currentTime/v.duration*100)+'%'; } if(t) t.textContent=Math.max(0,Math.ceil(v.duration-v.currentTime))+'s'; };
  }
  // flüssig: Balken bei jedem Bild neu setzen, solange ein Video im Player läuft
  let rafOn=false;
  function plRaf(){ const v=document.querySelector('#modal video[autoplay]');
    if(!v){ rafOn=false; return; }
    if(!v.paused && isFinite(v.duration) && v.duration){ const bb=$('pbar'); if(bb){ bb.style.transition='none'; bb.style.width=(v.currentTime/v.duration*100)+'%'; } const t=$('ptime'); if(t) t.textContent=Math.max(0,Math.ceil(v.duration-v.currentTime))+'s'; }
    requestAnimationFrame(plRaf); }
  document.addEventListener('play', e=>{ if(e.target && e.target.matches && e.target.matches('#modal video[autoplay]') && !rafOn){ rafOn=true; requestAnimationFrame(plRaf); } }, true);
  document.addEventListener('timeupdate', e=>{ if(e.target && e.target.matches && e.target.matches('#modal video[autoplay]')) try{ updBar(); }catch(x){} }, true);
  document.addEventListener('loadedmetadata', e=>{ if(e.target && e.target.matches && e.target.matches('#modal video[autoplay]')) try{ updBar(); }catch(x){} }, true);

  /* ---------- Player: Wischen wie bei TikTok (folgt dem Finger, gleitet weich weiter, lädt nach) ---------- */
  const plBox = () => { const f=document.querySelector('#modal > div'); return f && f.firstElementChild; };
  const plBlocked = t => !!(t.closest && (t.closest('#psheet') || t.closest('#plMenu') || t.closest('#chatwrap') || t.closest('.nw-ov') || t.closest('input,textarea,select')));
  const plOpen = on => document.documentElement.classList.toggle('pl-open', !!on);
  function canNext(){ const p=S.player; if(!p) return false; return p.i < PL().length-1 || (S.user && S.rpMore && S.plist===S.feedList); }
  function plMore(){ if(S._plLoad || !S.rpMore || !(S.plist===S.feedList)) return Promise.resolve(false); S._plLoad=true; const n0=(S.feedList||[]).length;
    return feedLoad(true).then(()=>{ S._plLoad=false; if(route()==='feed' && S.feedList && S.feedList.length>n0){ S.plist=S.feedList; return true; } return false; }).catch(()=>{ S._plLoad=false; return false; }); }
  function plBump(dir){ const b=plBox(); if(!b) return; b.style.transition='transform .18s ease-out'; b.style.transform=`translateY(${dir*-36}px)`; setTimeout(()=>{ b.style.transform=''; },180);
    if(dir>0 && S.user && !$('plEnd')){ b.insertAdjacentHTML('beforeend','<div id="plEnd" style="position:absolute;left:50%;bottom:110px;transform:translateX(-50%);z-index:40;background:rgba(14,26,43,.92);color:#fff;font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;white-space:nowrap">Du bist durch – das waren alle Beiträge</div>'); setTimeout(()=>{ const e=$('plEnd'); if(e) e.remove(); },1800); } }
  if(typeof nextP==='function'){
    const _np = nextP;
    nextP = function(){ const p=S.player; if(!p) return; const n=PL().length;
      if(S.user && p.i>=n-4) plMore();                     // rechtzeitig nachladen
      if(S.user && p.i>=n-1){ plMore().then(ok=>{ if(ok && S.player) _np(); else plBump(1); }); return; }
      return _np.apply(this,arguments); };
  }
  if(typeof stopPlayer==='function'){ const _sp=stopPlayer; stopPlayer=function(){ plOpen(false); return _sp.apply(this,arguments); }; }
  if(typeof closeModal==='function'){ const _cm=closeModal; closeModal=function(){ const r=_cm.apply(this,arguments); if(!S.player) plOpen(false); return r; }; }
  setInterval(()=>{ if(!S.player && document.documentElement.classList.contains('pl-open')) plOpen(false); },1000);
  let dg=null;
  document.addEventListener('touchstart', e=>{ if(!S.player || e.touches.length>1 || plBlocked(e.target) || S.breath) { dg=null; return; }
    dg={y:e.touches[0].clientY, x:e.touches[0].clientX, t:Date.now(), dy:0, dir:null}; const b=plBox(); if(b) b.style.transition='none'; }, {capture:true, passive:true});
  document.addEventListener('touchmove', e=>{ if(!S.player) return; if(!dg){ if(!plBlocked(e.target)) e.preventDefault(); return; }
    const dy=e.touches[0].clientY-dg.y, dx=e.touches[0].clientX-dg.x;
    if(!dg.dir && (Math.abs(dy)>8 || Math.abs(dx)>8)) dg.dir = Math.abs(dy)>Math.abs(dx) ? 'v' : 'h';
    if(dg.dir!=='h') e.preventDefault();               // kein Scrollen der Seite dahinter, kein Scrollbalken
    if(dg.dir==='v'){ dg.dy=dy; const b=plBox(); const edge=(dy<0&&!canNext())||(dy>0&&S.player.i===0); if(b) b.style.transform=`translateY(${edge?dy*.22:dy}px)`; }
  }, {capture:true, passive:false});
  window.addEventListener('touchend', e=>{ if(!dg) return; const d=dg; dg=null; if(d.dir!=='v' || !S.player) return;
    e.stopPropagation();                                 // alte Wisch-Erkennung nicht zusätzlich auslösen
    const b=plBox(), H=window.innerHeight, v=Math.abs(d.dy)/Math.max(1,Date.now()-d.t), go=Math.abs(d.dy)>H*.16 || (v>.45 && Math.abs(d.dy)>30);
    const out=(dir,fn)=>{ if(!b) return fn(); b.style.transition='transform .22s cubic-bezier(.3,.7,.4,1)'; b.style.transform=`translateY(${dir*105}%)`; setTimeout(()=>{ S._plSwipe=true; fn(); S._plSwipe=false; },200); };
    if(go && d.dy<0 && canNext()){ if(S.player.i>=PL().length-1){ if(b){ b.style.transition='transform .2s'; b.style.transform=''; } nextP(); } else out(-1,()=>nextP()); }
    else if(go && d.dy>0 && S.player.i>0) out(1,()=>prevP());
    else if(b){ b.style.transition='transform .26s cubic-bezier(.2,.8,.2,1)'; b.style.transform=''; if(go && d.dy<0) plBump(1); }
  }, {capture:true});

  /* ---------- Handy: Aktionen im Player rechts übereinander (wie TikTok / Instagram) ---------- */
  window.APLUS_fol = async (mid,btn) => { if(btn) btn.disabled=true; try{ const j=await rpc('folgen_umschalten',{p_member:mid}); if(j&&j.ok){ (PL()||[]).forEach(x=>{ if(x&&x.mid===mid) x.folge=j.folge; }); const b=$('plFol'); if(b){ b.classList.toggle('on',!!j.folge); b.innerHTML=j.folge?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>':'+'; } } }catch(e){} if(btn) btn.disabled=false; };
  function plSide(){
    if(window.innerWidth>=768) return; const ov=document.querySelector('#modal .bg-gradient-to-t'); if(!ov || ov.querySelector('.pl-side')) return;
    const p=S.player, post=p&&PL()[p.i]; if(!post) return;
    const like=ov.querySelector('[onclick*="toggleLike"]'), com=ov.querySelector('[onclick*="commentsP"]'), share=ov.querySelector('[aria-label="Teilen"]'), more=ov.querySelector('.pl-more'); if(!like) return;
    const col=document.createElement('div'); col.className='pl-side';
    if(post.real && !post.mine && post.mid){ col.insertAdjacentHTML('beforeend',`<div class="pl-av"><span onclick="event.stopPropagation();closeModal();stopPlayer();openProfile(${post.mid})">${skAv(post.a,46,avatar(post.a),'shrink-0')}</span><button id="plFol" class="${post.folge?'on':''}" onclick="event.stopPropagation();APLUS_fol(${post.mid},this)" aria-label="Folgen">${post.folge?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>':'+'}</button></div>`); }
    [like,com,share,more].filter(Boolean).forEach(b=>{ b.classList.remove('ml-auto'); col.appendChild(b); });
    ov.appendChild(col); ov.classList.add('pl-has-side');
    const pm=$('plMenu'); if(pm) col.appendChild(pm);
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
    return `<div class="ch-left sm px-4 py-6">${window.innerWidth<768?'<a class="set-back" href="#profile">‹ Profil</a>':''}<h1 class="font-serif text-2xl mb-4">Einstellungen</h1>
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

  /* ---------- Hashtags & Suche (r11) ----------
     Gleiche Regel wie in der Datenbank (closinghub-hashtags.sql · ch_hashtags): max. 5 verschiedene Hashtags pro Beitrag. */
  const HT_C='0-9A-Za-z_À-ÖØ-öø-ÿ';
  const HT_RE=()=>new RegExp('(?<!['+HT_C+'&/#])#(['+HT_C+']{1,40})(?!['+HT_C+'])','g');
  const HT_SLOT=()=>new RegExp('(?<!['+HT_C+'&/#])#(['+HT_C+']*)','g');
  const htNorm=t=>String(t||'').replace(/^#+/,'').toLowerCase().replace(new RegExp('[^'+HT_C+']','g'),'').slice(0,40);
  const htList=raw=>{ const out=[]; for(const m of String(raw||'').matchAll(HT_RE())){ const n=m[1].toLowerCase(); if(!out.includes(n)){ out.push(n); if(out.length===5) break; } } return out; };
  const htSlots=v=>{ const s=new Set(); let empty=0; for(const m of String(v||'').matchAll(HT_SLOT())){ if(m[1]) s.add(m[1].toLowerCase()); else empty++; } return s.size+empty; };
  window.htHtml=function(raw){ raw=String(raw||''); const ok=htList(raw); let out='', last=0;
    for(const m of raw.matchAll(HT_RE())){ const n=m[1].toLowerCase(); if(!ok.includes(n)) continue;
      out+=esc(raw.slice(last,m.index))+`<span class="ht" role="link" tabindex="0" data-ht="${esc2(n)}">#${esc(m[1])}</span>`; last=m.index+m[0].length; }
    return (out+esc(raw.slice(last))).replace(/\n/g,'<br>'); };
  const _mapPost=mapPost;
  mapPost=function(p){ const o=_mapPost.apply(this,arguments); try{ if(o&&p&&p.thumb_url&&!o.thumb) o.thumb=p.thumb_url; }catch(e){} try{ if(o&&p&&p.text&&p.text.includes('#')){ o.t=htHtml(p.text); o._ht=p.text; } }catch(e){} return o; };
  function htFix(){ try{ [S.rp,S.myPosts,S.plist,S.plistReal,S.feedList,S.htList,S.mp&&S.mp.posts,S.onePost&&[S.onePost],...Object.values(S.hl||{})].forEach(a=>(a||[]).forEach(p=>{ if(p&&p.real&&typeof p.raw==='string'&&p._ht!==p.raw&&(p.raw.includes('#')||p._ht)){ p.t=htHtml(p.raw); p._ht=p.raw; } })); }catch(e){} }
  window.APLUS_htFix=htFix;
  function htOpen(tag){ tag=htNorm(tag); if(!tag) return;
    try{ if(S.player){ stopPlayer(); closeModal(); } }catch(e){} try{ document.getElementById('peEd')?.remove(); }catch(e){}
    S.sq='#'+tag; S._srNoFocus=1; if(route()==='search'){ const i=$('srIn'); if(i) i.value=S.sq; srRun(); } else go('search'); window.scrollTo(0,0); }
  window.htOpen=htOpen;
  document.addEventListener('click',e=>{ const t=e.target.closest&&e.target.closest('[data-ht]'); if(!t) return;
    if(t.closest('.grid-cols-3')) return;                       // Kachel im Raster: Beitrag öffnen wie bisher
    e.preventDefault(); e.stopPropagation(); htOpen(t.dataset.ht); },true);
  document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.matches&&e.target.matches('.ht[data-ht]')){ e.preventDefault(); htOpen(e.target.dataset.ht); } },true);

  // Schreiben: das 6. Hashtag-Zeichen wird nicht übernommen, dezenter Hinweis
  const HT_FIELDS='#cfText,#peTx';
  function htHint(el,on){ let h=el.parentElement&&el.parentElement.querySelector(':scope > .ht-hint');
    if(on&&!h){ el.insertAdjacentHTML('afterend','<p class="ht-hint">Hashtag-Limit erreicht · max. 5</p>'); h=el.nextElementSibling; }
    if(h){ h.classList.toggle('on',!!on); clearTimeout(h._t); if(on) h._t=setTimeout(()=>{ if(htSlots(el.value)<5) h.classList.remove('on'); },2600); } }
  document.addEventListener('beforeinput',e=>{ const el=e.target; if(!el.matches||!el.matches(HT_FIELDS)) return;
    const d=e.data||(e.dataTransfer&&e.dataTransfer.getData('text/plain'))||''; if(!d.includes('#')) return;
    const v=el.value, nv=v.slice(0,el.selectionStart)+d+v.slice(el.selectionEnd), n=htSlots(nv);
    if(n>5 && n>htSlots(v)){ e.preventDefault(); htHint(el,true);
      if(d.length>1){ const keep=htTrim(nv); const pos=el.selectionStart+d.length-(nv.length-keep.length); el.value=keep; try{ el.setSelectionRange(pos,pos); }catch(x){} el.dispatchEvent(new Event('input',{bubbles:true})); } } },true);
  function htTrim(v){ let seen=new Set(), empty=0; return String(v).replace(HT_SLOT(),(m,t)=>{ const k=t?t.toLowerCase():null; if(k&&seen.has(k)) return m; if(seen.size+empty<5){ if(k) seen.add(k); else empty++; return m; } return t; }); }
  document.addEventListener('input',e=>{ const el=e.target; if(!el.matches||!el.matches(HT_FIELDS)) return;
    const n=htSlots(el.value), was=el._htN==null?5:el._htN;
    if(n>5 && n>was){ const p=el.selectionStart, v=el.value, nv=htTrim(v); el.value=nv; const q=Math.max(0,p-(v.length-nv.length)); try{ el.setSelectionRange(q,q); }catch(x){} htHint(el,true); }
    else if(n<5) htHint(el,false);
    el._htN=htSlots(el.value); },true);
  document.addEventListener('focusin',e=>{ const el=e.target; if(el.matches&&el.matches(HT_FIELDS)) el._htN=htSlots(el.value); },true);

  // Suche: Mitglieder, Hashtags, Beiträge, Jobs, Marktplatz
  S.htCache=S.htCache||{};
  async function htGet(fn,args,key){ const c=S.htCache[key]; if(c&&Date.now()-c.at<20000) return c.v; let v=[]; try{ v=(await rpc(fn,args))||[]; }catch(e){ return c?c.v:[]; } S.htCache[key]={at:Date.now(),v}; return v; }
  const chip=(t,n)=>`<button type="button" class="ht-chip" onclick="htOpen('${esc2(t)}')"><b>#</b>${esc2(t)}${n?`<span>${n}</span>`:''}</button>`;
  function htGrid(list){ const keep=S.plistReal; S.htList=list; let h=postGrid(list,false); S.plistReal=keep;
    return h.replace(/S\.plist=S\.plistReal/g,'S.plist=S.htList').replace('mt-8 grid','grid'); }
  search=function(){ const nf=S._srNoFocus; S._srNoFocus=0;
    setTimeout(()=>{ const i=$('srIn'); if(!i) return; if(!nf && !(window.innerWidth<768 && S.sq)) i.focus(); srRun(); },0);
    return `<div class="ch-left sm px-4 py-6 space-y-4"><h1 class="font-serif text-2xl">Suche</h1>
      <div class="sr-box"><svg class="sr-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="srIn" class="input" type="search" enterkeyhint="search" placeholder="Name, Job, Angebot oder #Hashtag …" value="${esc(S.sq)}" oninput="S.sq=this.value;clearTimeout(S._srT);S._srT=setTimeout(srRun,250)" autocomplete="off" autocapitalize="off" spellcheck="false">
      <button type="button" class="sr-x" aria-label="Leeren" style="${S.sq?'':'display:none'}" onclick="S.sq='';const i=document.getElementById('srIn');i.value='';i.focus();srRun()">×</button></div>
      <div id="srRes">${S._srHtml||''}</div></div>`; };
  try{ PAGES.search=search; }catch(e){}
  srRun=async function(){ const q=(S.sq||'').trim(), box=$('srRes'); if(!box) return;
    const sec=(t,h)=>`<p class="text-xs uppercase tracking-wider text-muted mt-5 mb-2">${t}</p>${h}`, still=()=>(S.sq||'').trim()===q && $('srRes')===box;
    const put=h=>{ if(!still()) return; S._srHtml=h; box.innerHTML=h; };
    const x=box.parentElement&&box.parentElement.querySelector('.sr-x'); if(x) x.style.display=q?'':'none';
    if(!q || q==='#'){ const top=await htGet('hashtags_beliebt',{p_q:null,p_limit:15},'top');
      put(sec('Beliebte Hashtags',top.length?`<div class="ht-chips">${top.map(t=>chip(t.tag,t.n)).join('')}</div>`:'<p class="text-sm text-muted">Noch keine Hashtags. Schreib z. B. <b>#Kaltakquise</b> in deinen Beitrag.</p>')
        +'<p class="text-xs text-muted mt-4">Tipp: Mit <b>#</b> vorne suchst du nach Hashtags, sonst nach Mitgliedern, Jobs und Angeboten.</p>'); return; }
    if(q.startsWith('#')){ const t=htNorm(q); if(!t){ put('<p class="text-sm text-muted">Nach dem # bitte Buchstaben oder Zahlen.</p>'); return; }
      if(!S._srHtml||!S._srHtml.includes('data-q="'+esc2(t)+'"')) box.innerHTML='<p class="text-sm text-muted">Sucht …</p>';
      const [posts,sug]=await Promise.all([htGet('hashtag_beitraege',{p_tag:t,p_vor:null,p_limit:60},'p:'+t),htGet('hashtags_beliebt',{p_q:t,p_limit:10},'s:'+t)]);
      if(!still()) return; const list=posts.map(mapPost), more=sug.filter(s=>s.tag!==t);
      put(`<div data-q="${esc2(t)}"><p class="font-serif text-xl mt-2">#${esc2(t)} <span class="text-sm text-muted font-sans">${list.length?list.length+(list.length===60?'+':'')+' Beiträge':''}</span></p>`
        +(list.length?`<div class="mt-3">${htGrid(list)}</div>`:`<p class="text-sm text-muted mt-2">Noch keine Beiträge mit #${esc2(t)}.</p>`)
        +(more.length?sec('Ähnliche Hashtags',`<div class="ht-chips">${more.map(s=>chip(s.tag,s.n)).join('')}</div>`):'')+'</div>'); return; }
    if(q.length<2){ put('<p class="text-sm text-muted">Tipp mindestens 2 Buchstaben ein.</p>'); return; }
    if(!S._srHtml||!S._srHtml.includes('data-q="~'+esc2(q)+'"')) box.innerHTML='<p class="text-sm text-muted">Sucht …</p>';
    const t=htNorm(q);
    const [mem,sug]=await Promise.all([S.member?htGet('mitglieder_suchen',{p_q:q},'m:'+q.toLowerCase()):Promise.resolve([]), t?htGet('hashtags_beliebt',{p_q:t,p_limit:8},'s:'+t):Promise.resolve([])]);
    const exact=sug.find(s=>s.tag===t); const posts=exact?await htGet('hashtag_beitraege',{p_tag:t,p_vor:null,p_limit:60},'p:'+t):[];
    if(!still()) return;
    const ql=q.toLowerCase(), jobs=(JOBS||[]).filter(j=>(j.live||!S.member)&&[j.t,j.ind,j.p,j.reg,j.roles].join(' ').toLowerCase().includes(ql)).slice(0,6);
    const offs=[]; try{ (PARTNERS||[]).filter(p=>p.real).forEach(p=>{ ((S.ptAll&&S.ptAll[p.n])||p.offers||[]).forEach(o=>{ if([o.t,p.s,p.n].join(' ').toLowerCase().includes(ql)) offs.push({p,o}); }); }); }catch(e){}
    const list=posts.map(mapPost);
    put(`<div data-q="~${esc2(q)}"></div>`+(S.member?sec('Mitglieder',mem.length?mem.map(m=>`<button class="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-panel" onclick="openProfile(${m.id})"><span class="w-11 h-11 rounded-full overflow-hidden shrink-0">${m.avatar_url?`<img src="${esc(m.avatar_url)}" class="w-full h-full object-cover">`:initAv(m.name)}</span><span class="min-w-0"><span class="block text-sm">${nameRank(esc(m.name),RANKS[(m.rang||1)-1])}</span><span class="text-xs text-muted">${esc([m.rolle,m.land].filter(Boolean).join(' · '))}</span></span></button>`).join(''):'<p class="text-sm text-muted">Kein Mitglied gefunden.</p>'):sec('Mitglieder','<p class="text-sm text-muted"><a href="#login" class="text-gold">Melde dich an</a>, um Mitglieder zu finden.</p>'))
      +(sug.length?sec('Hashtags',`<div class="ht-chips">${sug.map(s=>chip(s.tag,s.n)).join('')}</div>`):'')
      +(list.length?sec(`Beiträge mit #${esc2(t)}`,htGrid(list.slice(0,9))+(list.length>9?`<button class="text-sm text-gold mt-2" onclick="htOpen('${esc2(t)}')">Alle ${list.length} Beiträge ansehen</button>`:'')):'')
      +(offs.length?sec('Angebote der Partner',offs.slice(0,8).map(({p,o})=>`<button class="w-full text-left p-3 rounded-xl hover:bg-panel" onclick="APLUS_ptOpen('${esc(p.n).replace(/'/g,'')}')"><b class="text-sm block">${esc(o.t)}</b><span class="text-xs text-muted">${esc(p.n)} · ${esc(p.s)}${o.pr?' · '+esc(o.pr)+(/€|[a-zA-Z]/.test(String(o.pr))?'':' €'):''}</span></button>`).join('')):'')
      +sec('Jobs',jobs.length?jobs.map(j=>`<button class="w-full text-left p-3 rounded-xl hover:bg-panel" onclick="S.job=${j.id};S.jopen=1;go('jobs')"><b class="text-sm block">${esc(j.t)}</b><span class="text-xs text-muted">${esc([j.ind,j.reg,j.pay].filter(Boolean).join(' · '))}</span></button>`).join(''):'<p class="text-sm text-muted">Kein Job gefunden.</p>')
      ); };
  // Neuer/geänderter Beitrag: Hashtag-Listen frisch laden
  const _rpcH=rpc; rpc=async function(fn){ const r=await _rpcH.apply(this,arguments); if((fn==='post_neu'||fn==='post_bearbeiten'||fn==='post_loeschen'||fn==='post_zurueckziehen')&&r&&r.ok){ S.htCache={}; S._srHtml=''; } return r; };

  /* ---------- Inhaltsfilter (r12) – gleiche Regeln wie nachricht_pruefen in der Datenbank ---------- */
  const W='[\\p{L}\\p{N}_]', B='(?<!'+W+')', E='(?!'+W+')';
  const SOC='(insta|instagram|ig|tiktok|tik tok|linkedin|linked in|facebook|fb|twitter|youtube|snapchat|snap)';
  const R=(s)=>new RegExp(s,'u');
  window.chFilter=function(t){
    let u=' '+String(t||'').toLowerCase()+' ';
    u=u.replace(/(https?:\/\/)?(www\.)?getclosinghub\.com[^\s]*/g,' ');
    if(/(closerportal|yeahbase|top[ -]?closer|remote sales army)/.test(u)) return 'Werbung für andere Plattformen ist auf ClosingHub nicht erlaubt.';
    if(/(https?:\/\/|www\.)/.test(u)||/[a-z0-9-]+\.(de|com|net|org|io|at|ch|eu|info|biz|me|co|app|ly|gl|to|tv|shop|online|site|link|xyz|ee|gg|page|club|pro|digital|agency|academy|es|it|fr|nl|uk|us)([/?#:]|[\s.,!;)]|$)/.test(u)) return 'Links zu anderen Seiten sind auf ClosingHub nicht erlaubt.';
    if(/[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}/.test(u)) return 'E-Mail-Adressen dürfen hier nicht geteilt werden. Bleibt bitte im ClosingHub-Chat.';
    for(const m of u.matchAll(/(?:\+|00)?[0-9][0-9 /()-]{6,}[0-9]/g)) if(m[0].replace(/[^0-9]/g,'').length>=8) return 'Telefonnummern dürfen hier nicht geteilt werden. Bleibt bitte im ClosingHub-Chat.';
    if(R(B+'(whats ?app|whatsapp|telegram|discord|threema|snapchat)'+E).test(u)||/(wa\.me|t\.me|chat\.whatsapp)/.test(u)) return 'Bitte bleibt im ClosingHub-Chat – Wechsel zu anderen Messengern ist nicht erlaubt.';
    if((R(B+SOC+E).test(u)&&/(^|[\s(:])@[a-z0-9._]{3,30}/.test(u))||R(B+SOC+E+'\\s*[:@]').test(u)||R('(folg|add|abonnier|schreib)'+W+'*\\s+(mir|mich|uns)\\s+(auf|bei|über|ueber)\\s+'+SOC).test(u)) return 'Bitte teile hier keine Social-Media-Profile. Folgen geht direkt über ClosingHub.';
    if(R(B+'(komm|wechsel|steig)'+W+'*\\s(\\S+\\s){0,5}(zu uns|bei uns ein|in (mein|unser)'+W+'* team|zu mir ins team)').test(u)||/willst du (zu uns|bei uns anfangen|in (mein|unser)\S* team)/.test(u)
      ||/wir (zahlen|bieten|geben) (dir |euch )?(mehr|bessere|höhere|hoehere)/.test(u)||R('(höhere|hoehere|bessere|mehr) provisions?'+W+'* (bei|von) (uns|mir)').test(u)
      ||/(an|ohne) closinghub vorbei/.test(u)||/außerhalb (von |der )?(closinghub|plattform|app)/.test(u)
      ||R('(schreib|meld|kontaktier)'+W+'* (mir|dich|mich|uns) (mal )?(privat|direkt außerhalb)').test(u)||/(lass|lasst) uns (privat|woanders|außerhalb)/.test(u)
      ||/(direkt|privat) (bei|über|ueber) (mir|uns) (buchen|kaufen|bezahlen|zahlen|abschließen|abschliessen)/.test(u)
      ||R('(buch|kauf|bezahl|zahl)'+W+'*\\s(\\S+\\s){0,2}(direkt|privat) (bei|über|ueber) (mir|uns)').test(u)
      ||/(handy)?nummern? (austauschen|tauschen)/.test(u)||/gib mir (mal )?(deine|eure) (handy)?(nummer|mail|e-mail|kontaktdaten)/.test(u)) return 'Abwerbung und Kontakt außerhalb von ClosingHub sind nicht erlaubt.';
    return null; };
  const FTXT={post_neu:1,post_bearbeiten:1,story_neu:1,kommentar_neu:1,kommentar_antwort:1};
  let chSupp=0; const _alert=window.alert.bind(window);
  window.alert=function(m){ if(Date.now()-chSupp<1500 && /nicht geklappt|nochmal/.test(String(m||''))) return; return _alert(m); };
  const _rpcFi=rpc;
  rpc=async function(fn,body){
    if(FTXT[fn] && body && body.p_text){ const f=chFilter(body.p_text);
      if(f){ if(fn==='post_neu'||fn==='story_neu') throw new Error(f);
        if(fn==='post_bearbeiten') setTimeout(()=>{ const e=document.getElementById('peErr'); if(e) e.textContent=f; },0);
        else { _alert(f); chSupp=Date.now(); }
        return {ok:false,grund:'filter',text:f}; } }
    return _rpcFi.apply(this,arguments); };

  /* ---------- Top-Job-Preis aus den Einstellungen (statt fest 19 €) ---------- */
  let TOPP=null;
  (async()=>{ try{ const r=await fetch(SB_URL+'/rest/v1/settings?select=value&key=eq.preise',{headers:{apikey:SB_KEY}}); const j=await r.json();
    const v=j&&j[0]&&j[0].value&&j[0].value.topJob; if(v!=null){ TOPP=String(v).replace('.',',')+' €'; fixTop(); } }catch(e){} })();
  function fixTop(){ if(!TOPP) return; document.querySelectorAll('.border-dashed .text-gold').forEach(s=>{
    if(s.parentElement && s.parentElement.textContent.includes('Freier Top-Platz') && /€/.test(s.textContent) && s.textContent!==TOPP) s.textContent=TOPP; }); }

  /* ---------- Like in Feed und Player ohne Neuzeichnen (kein Flackern bei Videos) ---------- */
  const _tl=toggleLike;
  toggleLike=function(id,ctx){
    if(!S.user) return _tl.apply(this,arguments);   // Feed UND Player: nur Herz + Zahl aktualisieren
    const btns=[...document.querySelectorAll('[onclick*="toggleLike('+id+',"]')];
    if(!btns.length) return _tl.apply(this,arguments);
    const paint=(on)=>btns.forEach(b=>{ const was=b.classList.contains('icon-on'); b.classList.toggle('icon-on',!!on); const s=b.querySelector('span');
      if(s && was!==!!on){ const n=parseInt(s.textContent,10)||0; s.textContent=Math.max(0,n+(on?1:-1)); } });
    S.liked[id]=!S.liked[id]; paint(S.liked[id]);
    if(id>=1e6 && S.member) rpc('post_like',{p_post:id-1e6}).then(j=>{ if(j&&j.ok&&j.liked!==S.liked[id]){ S.liked[id]=j.liked; paint(j.liked); } }).catch(()=>{});
  };

  /* ---------- Feed-Logik (r15) ----------
     Stellen zählen über alle Karten: Mitmach 10/20/30 …, Kontaktvorschlag 17/34 …, ClosingHub-Beitrag 7/14 …,
     beliebter ungesehener Beitrag 1/3/6/9 …, sonst neueste. Gleiche Stelle: Mitmach > Kontakt > ClosingHub > beliebt;
     Verdrängtes rutscht auf die nächste freie Stelle. Gilt für Feed und Player (mkSlot/mkPL/mkIdx). */
  const FL_PRIO=['mk','kv','ed','pop'];
  function flRules(k){ const r=[]; if(k%10===0) r.push('mk'); if(k%17===0) r.push('kv'); if(k%7===0) r.push('ed'); if(k===1||k%3===0) r.push('pop'); return r; }
  window.APLUS_flPlan=function(news,pop,ed,kvN,mkOn,more){
    const items=[], after=[]; let ni=0,pi=0,ei=0,kvi=0,mki=0,carry=[];
    const have={pop:()=>pi<pop.length, ed:()=>ei<ed.length, kv:()=>kvi<kvN, mk:()=>!!mkOn};
    const left=()=>ni<news.length||pi<pop.length;   // ClosingHub-Beiträge nur auf ihren 7er-Stellen, nie als Lückenfüller
    for(let k=1;k<5000;k++){
      if(!left()) break;
      const want=[...new Set([...carry,...flRules(k)])].filter(t=>have[t]());
      let pick=FL_PRIO.find(t=>want.includes(t)); carry=want.filter(t=>t!==pick);
      if(pick==='mk'||pick==='kv'){ if(!items.length){ carry.push(pick); pick=null; } else { (after[items.length-1]=after[items.length-1]||[]).push(pick==='mk'?{t:'mk',slot:mki++}:{t:'kv',i:kvi++}); continue; } }
      if(pick==='pop') items.push(pop[pi++]);
      else if(pick==='ed') items.push(ed[ei++]);
      else if(ni<news.length) items.push(news[ni++]);
      else if(pi<pop.length) items.push(pop[pi++]);
      else break;
    }
    if(mkOn && items.length && !after.some(a=>a&&a.some(x=>x.t==='mk'))) (after[items.length-1]=after[items.length-1]||[]).push({t:'mk',slot:0});
    return {items,after};
  };
  function flLoadExtras(force){
    const kats=S.ptopics||S.topics||null, jobs=[];
    if(force||(S.pop===undefined&&!S._popL)){ S._popL=1; jobs.push(rpc('feed_beliebt',{p_kats:kats&&kats.length?kats:null,p_limit:30}).then(r=>{ S.pop=(r||[]).map(mapPost); }).catch(()=>{ S.pop=S.pop||[]; }).finally(()=>{ S._popL=0; })); }
    if(S.member&&(force||(S.kv===undefined&&!S._kvL))){ S._kvL=1; jobs.push(rpc('kontakt_vorschlaege',{p_limit:10}).then(r=>{ S.kv=(r&&r.liste)||[]; S.kvMe=r||null; }).catch(()=>{ S.kv=S.kv||[]; }).finally(()=>{ S._kvL=0; })); }
    return Promise.all(jobs);
  }
  feedPool=function(){
    if(!S.rp) return null;
    if(S.pop===undefined||(S.member&&S.kv===undefined)){ if(!S._popL&&!S._kvL) flLoadExtras().then(()=>{ if(route()==='feed'&&!S.player) render(); }); }
    if(!S.rp.length&&!S.member&&!(S.pop||[]).length) return null;
    const ft=S.ptopics||S.topics, okK=p=>!ft||ft.includes(p.k);
    const pop=(S.pop||[]).filter(okK), popIds=new Set(pop.map(p=>p.id));
    const news=S.rp.filter(p=>okK(p)&&!popIds.has(p.id)), ed=EDIT_POSTS.filter(okK);
    const mkOn=typeof mkCards==='function'&&mkCards().length>0;
    const plan=APLUS_flPlan(news,pop,ed,(S.kv||[]).length,mkOn,!!S.rpMore);
    S.flAfter=plan.after; S.flItems=plan.items; return plan.items;
  };
  function kvHtml(m,big){
    const av=m.avatar_url?`<img src="${esc(m.avatar_url)}" class="w-full h-full object-cover" loading="lazy">`:initAv(m.name);
    const sz=big?84:52, ort=[m.rolle,m.stadt||m.land].filter(Boolean).map(esc).join(' · ');
    return `<article class="card p-4 kv-card"${big?' style="background:transparent;border:0;box-shadow:none"':''}>
      <p class="text-xs uppercase tracking-wider ${big?'':'text-muted'} mb-3"${big?' style="color:#C9D3E3"':''}>Kontaktvorschlag · ${m.gleiche_stadt?'aus deiner Stadt':'aus deinem Land'}</p>
      <div class="flex ${big?'flex-col text-center':''} items-center gap-3">
        <span class="rounded-full overflow-hidden shrink-0 cursor-pointer" style="width:${sz}px;height:${sz}px" onclick="event.stopPropagation();${big?'closeModal();stopPlayer();':''}memberModal(${m.id})">${av}</span>
        <span class="min-w-0 flex-1"${big?' style="color:#fff"':''}><span class="block">${nameRank(esc(m.name),RANKS[(m.rang||1)-1])}</span><span class="text-xs ${big?'':'text-muted'}"${big?' style="color:#C9D3E3"':''}>${ort}</span></span>
        <button class="btn-gold text-sm kv-fol" style="padding:7px 16px" onclick="event.stopPropagation();APLUS_kvFol(${m.id},this)">Folgen</button>
      </div></article>`;
  }
  window.APLUS_kvFol=async(mid,btn)=>{ btn.disabled=true; try{ const j=await rpc('folgen_umschalten',{p_member:mid}); if(j&&j.ok){ document.querySelectorAll('.kv-fol[onclick*="APLUS_kvFol('+mid+',"]').forEach(b=>{ b.textContent=j.folge?'Folge ich ✓':'Folgen'; b.classList.toggle('btn-gold',!j.folge); b.classList.toggle('btn-ghost',!!j.folge); }); } }catch(e){} btn.disabled=false; };
  const _mkSlot=mkSlot;
  mkSlot=function(i,n){
    if(!S.flAfter||S.feedList!==S.flItems&&!(S.feedList&&S.flItems&&S.feedList.length<=S.flItems.length&&S.feedList[0]===S.flItems[0])) return _mkSlot.apply(this,arguments);
    return (S.flAfter[i]||[]).map(c=>c.t==='mk'?mitmachCard(c.slot):(S.kv&&S.kv[c.i]?kvHtml(S.kv[c.i]):'')).join('');
  };
  const _mkPL=mkPL;
  mkPL=function(base){
    if(!S.plMk||!base||!base.length) return base;
    if(!S.flAfter||base!==S.feedList) return _mkPL.apply(this,arguments);
    const out=[]; base.forEach((p,i)=>{ out.push(p); (S.flAfter[i]||[]).forEach(c=>{ if(c.t==='mk') out.push({mk:1,slot:c.slot}); else if(S.kv&&S.kv[c.i]) out.push({mk:1,kv:1,m:S.kv[c.i]}); }); });
    return out;
  };
  const _mkIdx=mkIdx;
  mkIdx=function(i){
    if(!S.plMk) return i; if(!S.flAfter||S.plist!==S.feedList) return _mkIdx.apply(this,arguments);
    let n=i; for(let k=0;k<i;k++) n+=(S.flAfter[k]||[]).filter(c=>c.t==='mk'||(S.kv&&S.kv[c.i])).length; return n;
  };
  const _dms=drawMkSlide;
  drawMkSlide=function(p,post){
    if(!post||!post.kv) return _dms.apply(this,arguments);
    const _mc=mitmachCard; mitmachCard=()=>kvHtml(post.m,true);
    try{ _dms.apply(this,arguments); } finally { mitmachCard=_mc; }
    const t=[...document.querySelectorAll('#modal p')].find(x=>x.textContent.trim()==='Mitmachen'); if(t) t.textContent='Kontakte';
  };
  // Laden: beliebte (ungesehene) Beiträge + Kontaktvorschläge, einmal pro frischem Feed-Laden (nicht bei "Mehr laden")
  const _fl=feedLoad;
  feedLoad=async function(more){
    if(!more) await flLoadExtras(true);
    return _fl.apply(this,arguments);
  };
  // Gesehen: Beitrag mind. 1 s zu 60 % sichtbar im Feed oder im Player angezeigt
  const flSeen=new Set(), flQ=new Set(); let flT={};
  function flMark(id){ if(!S.member||!(id>=1e6)) return; const pid=id-1e6; if(flSeen.has(pid)) return; flSeen.add(pid); flQ.add(pid); }
  function flFlush(){ if(!flQ.size||!S.member) return; const ids=[...flQ].slice(0,100); ids.forEach(i=>flQ.delete(i)); rpc('posts_gesehen',{p_ids:ids}).catch(()=>ids.forEach(i=>flQ.add(i))); }
  setInterval(flFlush,5000); document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') flFlush(); });
  const flIO='IntersectionObserver' in window ? new IntersectionObserver(es=>es.forEach(e=>{ const id=+e.target.dataset.flid;
    if(e.isIntersecting&&e.intersectionRatio>=.6){ flT[id]=setTimeout(()=>flMark(id),1000); } else { clearTimeout(flT[id]); } }),{threshold:[0,.6]}) : null;
  function fixSeen(){ if(!flIO||route()!=='feed') return; document.querySelectorAll('#app article.card').forEach(a=>{ if(a.dataset.flid) return; const b=a.querySelector('[onclick*="toggleLike("]'); if(!b) return;
    const m=(b.getAttribute('onclick')||'').match(/toggleLike\((\d+),/); if(!m) return; a.dataset.flid=m[1]; flIO.observe(a); }); }
  const _dpFl=drawPlayer; drawPlayer=function(){ const r=_dpFl.apply(this,arguments); try{ const post=PL()[S.player.i]; if(post&&!post.mk&&post.real) flMark(post.id); }catch(e){} return r; };
  // Profil: Stadt (freiwillig) + "In Vorschlägen anzeigen"
  function fixOrt(){ const land=document.getElementById('pfLand'); if(!land||document.getElementById('pfStadt')) return;
    const me=S.kvMe||{}; const lab=land.closest('label');
    lab.insertAdjacentHTML('afterend',`<label class="text-xs text-muted">Stadt <span class="opacity-70">(freiwillig)</span><input id="pfStadt" class="input text-sm mt-1" maxlength="60" value="${esc(me.stadt||'')}" placeholder="z. B. Köln"></label>`);
    const grid=land.closest('.grid'); if(grid) grid.insertAdjacentHTML('afterend',`<label class="flex items-start gap-2 text-sm"><input id="pfVor" type="checkbox" class="mt-1" ${me.sichtbar===false?'':'checked'}><span>In Kontaktvorschlägen anzeigen<span class="block text-xs text-muted">Für Mitglieder aus deiner Stadt bzw. deinem Land</span></span></label>`);
    if(!S.kvMe&&S.member) rpc('kontakt_vorschlaege',{p_limit:1}).then(r=>{ S.kvMe=r; const s=document.getElementById('pfStadt'), v=document.getElementById('pfVor'); if(s&&!s.value) s.value=r.stadt||''; if(v) v.checked=r.sichtbar!==false; }).catch(()=>{}); }
  const _spd=saveProfilDb;
  saveProfilDb=async function(p){ const s=document.getElementById('pfStadt'), v=document.getElementById('pfVor');
    if(p&&('land' in p)&&s){ const st=s.value, sv=v?v.checked:true; const r=await _spd.apply(this,arguments);
      const j=await rpc('profil_ort_speichern',{p_stadt:st,p_sichtbar:sv}); if(!j||!j.ok) throw new Error('Stadt konnte nicht gespeichert werden.');
      S.kvMe=Object.assign(S.kvMe||{},{stadt:st.trim()||null,sichtbar:sv}); S.myOrt=Object.assign(S.myOrt||{},{stadt:st.trim()||null}); return r; }
    return _spd.apply(this,arguments); };

  /* ---------- Stadt im Profil anzeigen (r16) ---------- */
  const _pLine=profLine;
  profLine=function(){
    if(!S.member) return _pLine.apply(this,arguments);
    if(S.myOrt===undefined&&!S._myOrtL){ S._myOrtL=1; rpc('profil_ort',{p_member:S.member.id}).then(o=>{ S.myOrt=o||{}; if(route()==='profile') render(); }).catch(()=>{ S.myOrt={}; }); }
    const st=S.myOrt&&S.myOrt.stadt, ort=[st,ME.country].filter(Boolean).map(x=>esc(String(x))).join(', ');
    const l=[ME.role+' <svg class="ci"><use href="#i-stern_voll"/></svg>']; if(ME.years) l.push(ME.years+' Jahre Erfahrung'); if(ort) l.push(ort); if(ME.langs) l.push(ME.langs); return l.join(' · ');
  };
  const _rpcOrt=rpc;
  rpc=async function(fn,body){ const r=await _rpcOrt.apply(this,arguments);
    if(fn==='profil_laden'&&r&&body&&body.p_member){ try{ const o=await _rpcOrt('profil_ort',{p_member:body.p_member}); if(o&&o.stadt) r.land=[o.stadt,r.land].filter(Boolean).join(', '); }catch(e){} }
    return r; };

  /* ---------- Jobs am Handy (r17): sauberes Layout + Glocke für Job-Benachrichtigungen ---------- */
  (function(){ const st=document.createElement('style'); st.textContent=`
    .jbell{display:none}
    @media (max-width:767px){
      html[data-r="jobs"] #app{overflow-x:hidden}
      html[data-r="jobs"] #app .jobs-grid{display:block}
      html[data-r="jobs"] #app .jobs-grid > .jobs-detail{display:none}
      html[data-r="jobs"] #app .jsub-card{display:none}
      html[data-r="jobs"] #app .jobs-grid > div:first-child > * + *{margin-top:12px}
      html[data-r="jobs"] #app .jrole-wrap{display:flex;align-items:center;gap:8px}
      html[data-r="jobs"] #app .jrole-row{flex:1;min-width:0;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;padding-bottom:0!important}
      html[data-r="jobs"] #app .jrole-row::-webkit-scrollbar{display:none}
      html[data-r="jobs"] #app .jrole-row > button{flex:none;padding:6px 12px!important;font-size:13px!important}
      .jbell{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:50%;border:1px solid rgb(var(--line));background:rgb(var(--panel));position:relative;color:inherit}
      .jbell.on{border-color:#087A4B;color:#087A4B}
      .jbell b{position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#087A4B;color:#fff;font-size:10px;line-height:17px;font-weight:700}
      html[data-r="jobs"] #app .jd-wrap{padding-top:18px!important;padding-bottom:24px}
      html[data-r="jobs"] #app .jd-wrap > button:first-child{display:inline-flex;margin-bottom:12px}
      .jd-card .p-5{padding:16px!important}
      .jd-card h1{font-size:23px!important;line-height:1.22!important}
      .jd-card .font-serif.mt-0\\.5{font-size:20px!important}
      .jd-card *{overflow-wrap:anywhere;min-width:0}
      .jd-card .grid.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
      .jd-card .grid.grid-cols-2 > .jd-wide{grid-column:1/-1}
      .jd-card .grid.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
      .jd-card .grid.grid-cols-3 > *{padding-left:6px!important;padding-right:6px!important}
      html[data-r="jobs"] #app .jobs-list-card{overflow-wrap:anywhere}
      .jd-card .flex.justify-between.items-center.gap-3{flex-wrap:wrap}
      .jd-card .flex.justify-between.items-center.gap-3 > button{flex:1 1 100%;white-space:normal}
    }
    .jb-sheet{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center}
    .jb-box{width:100%;max-width:480px;background:rgb(var(--bg));border-radius:20px 20px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.25)}
    @media (min-width:768px){ .jb-sheet{align-items:center} .jb-box{border-radius:20px} }
    .jb-row{display:flex;align-items:center;justify-content:space-between;padding:12px 2px;border-top:1px solid rgb(var(--line) / .6)}
    .jb-sw{width:44px;height:26px;border-radius:13px;background:rgb(var(--line));position:relative;transition:background .15s;flex:none}
    .jb-sw::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
    .jb-sw.on{background:#087A4B} .jb-sw.on::after{left:21px}
  `; document.head.appendChild(st); })();
  const BELL='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
  // Auswahl aus der Datenbank laden und Änderungen speichern (auch die Chips am PC)
  function jsLoad(){ if(!S.member||S._jsL!==undefined) return; S._jsL=1; rpc('job_abos_laden').then(r=>{ if(r&&Array.isArray(r.abos)){ S.jsubs=r.abos.slice(); S._jsSaved=JSON.stringify(S.jsubs); if(route()==='jobs') render(); } }).catch(()=>{}); }
  let jsT=null; function jsSave(){ if(!S.member||S._jsSaved===undefined) return; const cur=JSON.stringify(S.jsubs||[]); if(cur===S._jsSaved) return;
    clearTimeout(jsT); jsT=setTimeout(()=>{ const v=(S.jsubs||[]).slice(); rpc('job_abos_speichern',{p_abos:v}).then(j=>{ if(j&&j.ok) S._jsSaved=JSON.stringify(v); }).catch(()=>{}); },400); }
  window.APLUS_jbell=function(){
    if(!S.user){ go('login'); return; }
    const m=document.getElementById('modal'); const on=c=>(S.jsubs||[]).includes(c);
    const draw=()=>{ m.innerHTML=`<div class="jb-sheet" onclick="if(event.target===this)APLUS_jbClose()"><div class="jb-box">
      <div class="flex items-center justify-between mb-1"><p class="font-semibold text-lg">Job-Benachrichtigungen</p><button onclick="APLUS_jbClose()" class="text-muted text-2xl leading-none" aria-label="Schließen">×</button></div>
      <p class="text-sm text-muted mb-3">Wähle, über welche neuen Jobs du sofort eine Mitteilung bekommst.</p>
      ${JROLES.map(c=>`<button type="button" class="jb-row w-full text-left" onclick="APLUS_jbTog('${c}')"><span class="text-[15px]">${c}</span><span class="jb-sw ${on(c)?'on':''}"></span></button>`).join('')}
      <button class="btn-gold w-full mt-4" onclick="APLUS_jbClose()">Fertig</button></div></div>`; };
    window.APLUS_jbTog=c=>{ chEv&&chEv('jobabo'); S.jsubs=on(c)?S.jsubs.filter(x=>x!==c):[...(S.jsubs||[]),c]; jsSave(); draw(); };
    window.APLUS_jbClose=()=>{ m.innerHTML=''; render(); };
    draw();
  };
  function fixJobs(){
    if(route()!=='jobs') return; jsLoad(); jsSave();
    const grid=[...document.querySelectorAll('#app .grid')].find(g=>/grid-cols-\[340px_1fr\]/.test(g.className));
    if(grid){ grid.classList.add('jobs-grid'); const col=grid.children[0], det=grid.children[1]; if(det) det.classList.add('jobs-detail');
      if(col){ [...col.children].forEach(c=>{ if(c.classList.contains('card')&&/Job-Benachrichtigungen/.test(c.textContent)) c.classList.add('jsub-card'); });
        const row=[...col.children].find(c=>c.classList.contains('flex')&&c.classList.contains('flex-wrap')&&c.querySelector('button')&&JROLES.some(r=>c.textContent.includes(r))&&!c.classList.contains('card'));
        if(row&&!row.classList.contains('jrole-row')){ row.classList.add('jrole-row'); const w=document.createElement('div'); w.className='jrole-wrap'; row.before(w); w.appendChild(row);
          w.insertAdjacentHTML('beforeend',`<button class="jbell" onclick="APLUS_jbell()" aria-label="Job-Benachrichtigungen">${BELL}</button>`); }
        [...col.querySelectorAll(':scope > button')].forEach(b=>b.classList.add('jobs-list-card'));
        col.querySelectorAll('p,span').forEach(s=>{ if(s.childNodes.length===1&&s.firstChild.nodeType===3&&/(^–\s·\s)|(\s·\s–$)/.test(s.textContent)){ const t=s.textContent.replace(/^(–\s·\s)+/,'').replace(/(\s·\s–)+$/,''); if(t!==s.textContent) s.textContent=t; } }); } }
    const b=document.querySelector('#app .jbell'); if(b){ const n=(S.jsubs||[]).length; if(b.classList.contains('on')!==(n>0)) b.classList.toggle('on',n>0); const old=b.querySelector('b'); const want=n?String(n):''; if((old?old.textContent:'')!==want){ if(old) old.remove(); if(n) b.insertAdjacentHTML('beforeend',`<b>${n}</b>`); } }
    document.querySelectorAll('#app .card.overflow-hidden.h-fit').forEach(c=>{ c.classList.add('jd-card');
      c.querySelectorAll('.grid.grid-cols-2 > div').forEach(f=>{ const v=f.querySelector('p.text-sm'); const wide=!!v&&v.textContent.trim().length>38; if(f.classList.contains('jd-wide')!==wide) f.classList.toggle('jd-wide',wide); }); });
    const back=[...document.querySelectorAll('#app button')].find(x=>x.textContent.trim()==='← Alle Jobs'); if(back&&back.parentElement) back.parentElement.classList.add('jd-wrap');
  }

  /* ---------- Player flüssig wie Instagram (r18): nächste Videos vorladen und beim Wischen das fertige Video einsetzen ---------- */
  const PRE=new Map(); let preBox=null;
  function preHost(){ if(!preBox){ preBox=document.createElement('div'); preBox.setAttribute('aria-hidden','true'); preBox.style.cssText='position:fixed;left:-9999px;top:0;width:2px;height:2px;overflow:hidden;opacity:0;pointer-events:none'; document.body.appendChild(preBox); } return preBox; }
  function preGet(post){
    if(!post||post.mk||!post.video) return null; const url=post.video; if(PRE.has(url)) return PRE.get(url);
    const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('muted',''); v.preload='auto'; v.loop=true;
    if(post.thumb) v.poster=post.thumb; v.src=url; preHost().appendChild(v);
    try{ v.load(); const pr=v.play(); if(pr&&pr.then) pr.then(()=>{ if(v.parentElement===preBox){ v.pause(); } }).catch(()=>{}); }catch(e){}
    PRE.set(url,v); return v;
  }
  function plPreload(){
    const p=S.player; if(!p) return; const list=PL(); const want=new Set();
    [p.i+1,p.i+2,p.i-1].forEach(k=>{ const post=list[k]; if(post&&!post.mk&&post.video){ want.add(post.video); preGet(post); } });
    const cur=list[p.i]; if(cur&&cur.video) want.add(cur.video);
    for(const [u,v] of PRE){ if(!want.has(u)&&v.parentElement===preBox){ try{ v.pause(); v.removeAttribute('src'); v.load(); }catch(e){} v.remove(); PRE.delete(u); } }
  }
  function plSwap(){
    const p=S.player; if(!p) return; const post=PL()[p.i];
    const nv=document.querySelector('#modal video[autoplay]');
    if(nv&&post&&!post.mk&&post.video){
      if(post.thumb&&!nv.poster) nv.poster=post.thumb;
      const pre=PRE.get(post.video);
      if(pre&&pre!==nv&&pre.parentElement===preBox&&pre.readyState>=2){
        [...nv.attributes].forEach(a=>{ if(a.name!=='src') pre.setAttribute(a.name,a.value); });
        pre.removeAttribute('preload'); pre.style.cssText=nv.style.cssText; pre.className=nv.className;
        nv.replaceWith(pre); PRE.delete(post.video);
        try{ const pr=pre.play(); if(pr&&pr.catch) pr.catch(()=>{}); }catch(e){}
      }
    }
    setTimeout(plPreload,60);
  }
  const _stopPre=stopPlayer; stopPlayer=function(){ const r=_stopPre.apply(this,arguments); for(const [u,v] of PRE){ try{ v.pause(); v.removeAttribute('src'); v.load(); }catch(e){} v.remove(); } PRE.clear(); return r; };


  /* ---------- Player: Vorschaubild statt Schwarz (r22) ----------
     Videos zeigen sofort ihr Vorschaubild, bis das erste Bild geladen ist. Beiträge, die vor dem Laden
     von app-plus.js geholt wurden, bekommen ihr Vorschaubild hier nachgetragen. */
  const THB={};
  async function thumbFor(post){ if(!post||!post.video||post.thumb) return post&&post.thumb; const id=post.id-1e6; if(!(id>0)) return null;
    if(THB[id]===undefined){ THB[id]=rpc('post_laden',{p_id:id}).then(r=>r&&r.thumb_url||null).catch(()=>null); }
    const t=await THB[id]; if(t) post.thumb=t; return t; }
  function thumbsFill(){ try{ [S.feedList,S.plist,S.pop].forEach(L=>(L||[]).forEach(p=>{ if(p&&p.video&&!p.thumb) thumbFor(p); })); }catch(e){} }
  setTimeout(thumbsFill,1500); setInterval(thumbsFill,15000);
  const _dpT=drawPlayer; drawPlayer=function(){ const r=_dpT.apply(this,arguments);
    try{ const post=PL()[S.player.i], v=document.querySelector('#modal video[autoplay]');
      if(v&&post&&post.video){ v.style.background='#000'; if(post.thumb){ if(!v.poster) v.poster=post.thumb; } else thumbFor(post).then(t=>{ if(t&&v.isConnected&&!v.poster) v.poster=t; }); } }catch(e){}
    return r; };
  /* ---------- Handy: Buttons reagieren beim ersten Tippen (r19) ----------
     iOS behandelt den ersten Tipp als "Hover", wenn dabei etwas sichtbar animiert oder eingeblendet wird.
     Die Strich-Animation der Icons (drawGold) und die nur per Hover sichtbaren Kommentar-Aktionen
     haben deshalb einen zweiten Tipp verlangt. Auf Touch-Geräten sind diese Hover-Effekte jetzt aus. */
  (function(){ const st=document.createElement('style'); st.textContent=`
    button,a,[onclick],[role="button"],label,summary,.ht,.ht-chip{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    @media (hover:none),(pointer:coarse){
      a:hover .icbox svg *,button:hover .icbox svg *,.icbox:hover svg *,button:hover>svg *,a:hover>svg *{animation:none!important;stroke-dasharray:none!important}
      a:hover .icbox,button:hover .icbox,.icbox:hover{box-shadow:none!important}
      .cm-row .cm-act{opacity:1!important}
      .admarq:hover .admarq-track{animation-play-state:running!important}
    }`; document.head.appendChild(st); })();

  /* ---------- Live-Calls (r20) ----------
     Fester Balken oben ab 15 Minuten vor Start bis zum Ende. Stream direkt in der App (YouTube, ohne Cookies).
     Partner-Vortrag: nur Premium, mit Fragen an den Sprecher. Motivations-Call: ab Plus, ohne Chat.
     Termine pflegt Elias in der Zentrale unter "Live". Braucht closinghub-runde22-live-calls.sql. */
  (function(){
    try{ if(typeof PLUS_LIST!=='undefined' && !PLUS_LIST.some(t=>/Motivations/.test(t))) PLUS_LIST.push('Motivations-Call jeden Morgen live'); }catch(e){}
    const st=document.createElement('style'); st.textContent=`
    .chlv{position:sticky;top:56px;z-index:29;display:flex;align-items:center;gap:10px;padding:9px 12px;margin:0;cursor:pointer;
      background:linear-gradient(90deg,rgba(184,137,46,.16),rgba(184,137,46,.05));border-bottom:1px solid rgba(184,137,46,.45);contain:layout paint}
    @media(min-width:768px){.chlv{top:0;padding:10px 18px}}
    html:not(.light) .chlv{background:linear-gradient(90deg,rgba(40,30,12,.92),rgba(20,17,12,.92))}
    html.light .chlv,.light .chlv{background:linear-gradient(90deg,rgba(255,246,226,.96),rgba(255,251,242,.96))}
    .chlv .lv-dot{flex:none;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.06em;padding:4px 8px;border-radius:999px;color:#fff;background:#e5484d}
    .chlv .lv-dot i{width:7px;height:7px;border-radius:50%;background:#fff;animation:lvP 1.4s infinite}
    .chlv .lv-dot.bald{background:#B8892E}
    .chlv .lv-dot.bald i{animation:none;opacity:.85}
    @keyframes lvP{0%,100%{opacity:1}50%{opacity:.25}}
    .chlv .lv-t{min-width:0;flex:1;line-height:1.2}
    .chlv .lv-t b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chlv .lv-t span{display:block;font-size:12px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chlv .lv-b{flex:none;font-size:12.5px;font-weight:700;padding:8px 12px;border-radius:999px;background:#B8892E;color:#111;white-space:nowrap}
    .chlv .lv-b.lock{background:transparent;color:#B8892E;border:1px solid #B8892E}
    .chlv .lv-more{flex:none;font-size:11px;opacity:.7}
    #chlvo{position:fixed;inset:0;z-index:300;display:flex;align-items:stretch;justify-content:center;background:rgba(4,6,10,.86)}
    #chlvo .lvo-in{width:100%;max-width:980px;display:flex;flex-direction:column;background:rgb(var(--bg,12 12 14));color:rgb(var(--fg,240 240 240));overflow:hidden}
    @media(min-width:768px){#chlvo{align-items:center;padding:24px} #chlvo .lvo-in{border-radius:20px;max-height:92vh;border:1px solid rgba(184,137,46,.4)}}
    #chlvo .lvo-h{display:flex;align-items:center;gap:10px;padding:12px 14px;padding-top:max(12px,env(safe-area-inset-top))}
    #chlvo .lvo-h b{font-size:15px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #chlvo .lvo-h small{font-size:12px;opacity:.65}
    #chlvo .lvo-x{margin-left:auto;flex:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(127,127,127,.15)}
    #chlvo .lvo-v{position:relative;width:100%;aspect-ratio:16/9;background:#000;flex:none}
    #chlvo .lvo-v iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
    #chlvo .lvo-v .lvo-wait{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#fff;text-align:center;padding:20px}
    #chlvo .lvo-v .lvo-wait b{font-size:34px;font-variant-numeric:tabular-nums;color:#E3B85C}
    #chlvo .lvo-q{flex:1;min-height:0;display:flex;flex-direction:column;border-top:1px solid rgba(127,127,127,.2)}
    #chlvo .lvo-ql{flex:1;min-height:120px;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:8px}
    #chlvo .lvo-qi{font-size:14px;line-height:1.35;padding:8px 11px;border-radius:12px;background:rgba(127,127,127,.1)}
    #chlvo .lvo-qi.me{background:rgba(184,137,46,.14)}
    #chlvo .lvo-qi.ok{opacity:.55}
    #chlvo .lvo-qi.hid{opacity:.4;text-decoration:line-through}
    #chlvo .lvo-qi b{font-size:12px;display:block;opacity:.75;margin-bottom:2px}
    #chlvo .lvo-qi .lvo-qa{display:flex;gap:6px;margin-top:6px}
    #chlvo .lvo-qi .lvo-qa button{font-size:11.5px;padding:4px 9px;border-radius:999px;border:1px solid rgba(127,127,127,.35)}
    #chlvo .lvo-f{display:flex;gap:8px;padding:10px 12px;padding-bottom:max(10px,env(safe-area-inset-bottom));border-top:1px solid rgba(127,127,127,.2)}
    #chlvo .lvo-f input{flex:1;min-width:0;font-size:16px;padding:10px 14px;border-radius:999px;background:rgba(127,127,127,.12);border:1px solid rgba(127,127,127,.25);color:inherit;outline:none}
    #chlvo .lvo-f button{flex:none;font-weight:700;padding:0 16px;border-radius:999px;background:#B8892E;color:#111}
    #chlvo .lvo-err{font-size:12px;color:#e5484d;padding:0 14px 6px}
    #chlvo .lvo-note{padding:16px 16px max(16px,env(safe-area-inset-bottom));font-size:14px;opacity:.75;text-align:center}
    #chlvo .lvo-empty{margin:auto;font-size:13px;opacity:.6;text-align:center;padding:12px}`;
    document.head.appendChild(st);

    const LV = window.APLUS_LV = { ev:[], at:0, off:0, open:null, qt:0, seenT:0, sent:0 };
    const now = () => Date.now()+LV.off;
    const T = x => new Date(x).getTime();
    const hm = x => new Date(x).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
    const cd = ms => { ms=Math.max(0,ms); const m=Math.floor(ms/60000), s=Math.floor(ms/1000)%60; return m+':'+String(s).padStart(2,'0'); };
    const ytId = u => { u=String(u||''); const m=u.match(/(?:youtu\.be\/|v=|\/live\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/)||u.match(/^([A-Za-z0-9_-]{11})$/); return m?m[1]:null; };
    const label = e => e.typ==='vortrag' ? ('Partner-Vortrag'+(e.sprecher?' · '+e.sprecher:'')) : e.typ==='gast' ? ('Gastbeitrag'+(e.sprecher?' · '+e.sprecher:'')) : ('Motivations-Call'+(e.sprecher?' mit '+e.sprecher:''));
    const lockTxt = e => e.typ==='vortrag' ? 'Mit Premium live dabei' : 'Mit Plus live dabei';
    const cur = () => { const t=now(); const L=LV.ev.filter(e=>T(e.e)>t && T(e.s)-15*60000<=t); L.sort((a,b)=>((T(a.s)<=t)?0:1)-((T(b.s)<=t)?0:1) || T(a.s)-T(b.s)); return L; };

    async function load(){
      if(!S.member){ LV.ev=[]; draw(); return; }
      try{ const j=await rpc('live_aktuell',{}); if(j&&j.ok){ LV.ev=j.events||[]; if(j.jetzt) LV.off=T(j.jetzt)-Date.now(); } }catch(e){ }
      LV.at=Date.now(); draw();
    }

    function barHtml(L){
      const e=L[0], t=now(), live=T(e.s)<=t;
      const tag = live ? '<span class="lv-dot"><i></i>LIVE</span>' : `<span class="lv-dot bald"><i></i><span data-lvcd>${cd(T(e.s)-t)}</span></span>`;
      const btn = e.zugang ? `<span class="lv-b">${live?'Jetzt ansehen':'Öffnen'}</span>` : `<span class="lv-b lock">${lockTxt(e)}</span>`;
      return `${tag}<span class="lv-t"><b>${esc2(e.titel)}</b><span>${esc2(label(e))} · ${live?'bis '+hm(e.e):'ab '+hm(e.s)}</span></span>${L.length>1?`<span class="lv-more">+${L.length-1}</span>`:''}${btn}`;
    }
    function draw(){
      const L=S.member?cur():[];
      document.querySelectorAll('.chlv').forEach(b=>{ if(!L.length) b.remove(); });
      if(!L.length) return;
      const head=document.querySelector('header.md\\:hidden.sticky'); if(!head||!head.parentNode) return;
      let bar=head.nextElementSibling; if(!bar||!bar.classList.contains('chlv')){ bar=document.createElement('div'); bar.className='chlv'; bar.setAttribute('role','button'); head.after(bar); }
      const k=L.map(e=>e.id+':'+e.termin+':'+(T(e.s)<=now())+':'+e.zugang).join('|');
      if(bar.dataset.k!==k){ bar.dataset.k=k; bar.innerHTML=barHtml(L); bar.onclick=()=>openLive(L[0].id,L[0].termin); }
    }
    function tick(){
      if(Date.now()-LV.at>60000) load();
      if(S.player && !LV.open) return;   // Player offen: nichts am Balken ändern, damit Videos flüssig laufen
      const L=S.member?cur():[];
      const bar=document.querySelector('.chlv');
      if(bar&&L.length){ const c=bar.querySelector('[data-lvcd]'); if(c){ const v=cd(T(L[0].s)-now()); if(c.textContent!==v) c.textContent=v; } }
      if(!!bar!==!!L.length || (bar&&L.length&&!bar.dataset.k.startsWith(L[0].id+':'))) draw();
      else if(bar&&L.length&&bar.dataset.k.split('|')[0].split(':')[2]!==String(T(L[0].s)<=now())) draw();
      if(LV.open) ovTick();
    }

    /* ----- Fenster mit Stream ----- */
    function find(id,termin){ return LV.ev.find(e=>e.id===id&&e.termin===termin); }
    window.APLUS_lvOpen = openLive;
    window.APLUS_lvLock = e => (e.typ!=='vortrag' && typeof plusModal==='function') ? plusModal(e.typ==='gast'?'bei Gastbeiträgen live dabei sein':'beim Motivations-Call live dabei sein') : lockSheet(e);
    function openLive(id,termin){
      const e=find(id,termin); if(!e) return;
      if(!e.zugang){
        if(e.typ!=='vortrag' && typeof plusModal==='function') return plusModal(e.typ==='gast'?'bei Gastbeiträgen live dabei sein':'beim Motivations-Call live dabei sein');
        return lockSheet(e);
      }
      LV.open={id,termin}; LV.sent=0; LV.seenT=Date.now();
      let o=$('chlvo'); if(o) o.remove();
      o=document.createElement('div'); o.id='chlvo';
      o.innerHTML=`<div class="lvo-in"><div class="lvo-h"><span class="lv-dot" style="display:none"></span><span style="min-width:0"><b>${esc2(e.titel)}</b><small>${esc2(label(e))} · ${hm(e.s)}–${hm(e.e)}</small></span><button class="lvo-x" aria-label="Schließen" onclick="APLUS_lvClose()">×</button></div>
        <div class="lvo-v" id="lvo-v"></div>
        ${e.fragen?`<div class="lvo-q"><div class="lvo-ql" id="lvo-ql"><div class="lvo-empty">Noch keine Fragen. Stell die erste!</div></div><div class="lvo-err" id="lvo-err" hidden></div>
          <form class="lvo-f" onsubmit="event.preventDefault();APLUS_lvAsk()"><input id="lvo-in" maxlength="300" autocomplete="off" enterkeyhint="send" placeholder="Frage an ${esc2(e.sprecher||'den Sprecher')} …"><button type="submit">Senden</button></form></div>`
        :`<div class="lvo-note">Kein Chat – einfach zuhören, mitmachen und stark in den Tag starten.</div>`}</div>`;
      o.onclick=ev=>{ if(ev.target===o) APLUS_lvClose(); };
      document.body.appendChild(o); document.documentElement.style.overflow='hidden';
      try{ if(S.player) S.player.paused=true; document.querySelectorAll('video').forEach(v=>{ if(!v.closest('#chlvo')) v.pause(); }); }catch(err){}
      drawVideo(true); if(e.fragen) loadQ();
    }
    function drawVideo(force){
      const e=LV.open&&find(LV.open.id,LV.open.termin), box=$('lvo-v'); if(!e||!box) return;
      const t=now(), id=ytId(e.yt), started=T(e.s)<=t;
      const want = id ? (started||T(e.s)-t<5*60000 ? 'yt' : 'wait') : 'nolink';
      if(!force && box.dataset.m===want) return; box.dataset.m=want;
      if(want==='yt') box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" title="${esc2(e.titel)}"></iframe>`;
      else if(want==='wait') box.innerHTML=`<div class="lvo-wait"><span style="opacity:.75;font-size:13px">Startet in</span><b data-lvo-cd>${cd(T(e.s)-t)}</b><span style="opacity:.6;font-size:12px">Lass das Fenster offen, der Stream startet hier.</span></div>`;
      else box.innerHTML=`<div class="lvo-wait"><span style="opacity:.75;font-size:13px">${started?'Gleich geht\'s los':'Startet in'}</span>${started?'':`<b data-lvo-cd>${cd(T(e.s)-t)}</b>`}<span style="opacity:.6;font-size:12px">Der Stream erscheint hier automatisch.</span></div>`;
    }
    function ovTick(){
      const e=find(LV.open.id,LV.open.termin);
      if(!e || T(e.e)<=now()){ const b=$('lvo-v'); if(b&&b.dataset.m!=='end'){ b.dataset.m='end'; b.innerHTML='<div class="lvo-wait"><b style="font-size:20px;color:#fff">Danke fürs Dabeisein!</b><span style="opacity:.7;font-size:13px">Der Call ist vorbei.</span></div>'; } return; }
      const c=document.querySelector('[data-lvo-cd]'); if(c) c.textContent=cd(T(e.s)-now());
      drawVideo(false);
      if(!LV.sent && T(e.s)<=now() && Date.now()-LV.seenT>5*60000){ LV.sent=1; rpc('live_dabei',{p_event:e.id}).catch(()=>{}); }
      if(e.fragen && Date.now()-LV.qt>6000) loadQ();
    }
    window.APLUS_lvClose=function(){ const o=$('chlvo'); if(o) o.remove(); LV.open=null; document.documentElement.style.overflow=''; try{ if(S.player){ S.player.paused=false; } }catch(e){} };
    async function loadQ(){
      LV.qt=Date.now(); const e=LV.open&&find(LV.open.id,LV.open.termin); if(!e) return;
      try{ const j=await rpc('live_fragen_laden',{p_event:e.id}); if(!j||!j.ok) return; drawQ(j.liste||[],e); }catch(err){}
    }
    function drawQ(L,e){
      const box=$('lvo-ql'); if(!box) return; const atEnd=box.scrollHeight-box.scrollTop-box.clientHeight<40;
      const k=JSON.stringify(L.map(q=>[q.id,q.status])); if(box.dataset.k===k) return; box.dataset.k=k;
      box.innerHTML = L.length ? L.map(q=>`<div class="lvo-qi ${q.eigene?'me':''} ${q.status==='beantwortet'?'ok':''} ${q.status==='versteckt'?'hid':''}"><b>${esc2(q.name)}${q.eigene?' (du)':''}${q.status==='beantwortet'?' · beantwortet':''}</b>${esc2(q.text)}${e.speaker?`<div class="lvo-qa">${q.status!=='beantwortet'?`<button onclick="APLUS_lvQs(${q.id},'beantwortet')">Beantwortet</button>`:`<button onclick="APLUS_lvQs(${q.id},'offen')">Wieder offen</button>`}${q.status!=='versteckt'?`<button onclick="APLUS_lvQs(${q.id},'versteckt')">Ausblenden</button>`:''}</div>`:''}</div>`).join('') : '<div class="lvo-empty">Noch keine Fragen. Stell die erste!</div>';
      if(atEnd) box.scrollTop=box.scrollHeight;
    }
    window.APLUS_lvQs=async(id,s)=>{ try{ await rpc('live_frage_status',{p_id:id,p_status:s}); }catch(e){} loadQ(); };
    window.APLUS_lvAsk=async function(){
      const i=$('lvo-in'), er=$('lvo-err'), e=LV.open&&find(LV.open.id,LV.open.termin); if(!i||!e) return;
      const t=i.value.trim(); if(t.length<2) return;
      const show=m=>{ er.textContent=m; er.hidden=!m; };
      try{ if(window.chFilter){ const f=window.chFilter(t); if(f) return show(f); } }catch(x){}
      const b=i.form.querySelector('button'); b.disabled=true;
      try{ const j=await rpc('live_frage_neu',{p_event:e.id,p_text:t});
        if(j&&j.ok){ i.value=''; show(''); LV.qt=0; loadQ(); }
        else show(({filter:j&&j.text,tempo:'Kurz warten, dann kannst du die nächste Frage stellen.',limit:'Du hast schon 10 Fragen gestellt.',vorbei:'Der Vortrag ist vorbei.',premium:'Fragen stellen geht mit Premium.'})[j&&j.grund]||'Hat nicht geklappt. Versuch es nochmal.');
      }catch(x){ show('Hat nicht geklappt. Versuch es nochmal.'); }
      b.disabled=false;
    };
    function lockSheet(e){
      const html=`<div class="text-center space-y-3"><p class="font-serif text-2xl leading-tight">Mit Premium live dabei</p>
        <p class="text-sm text-muted">„${esc2(e.titel)}“${e.sprecher?' mit '+esc2(e.sprecher):''} ist ein Partner-Vortrag. Live zuschauen und Fragen stellen geht mit Premium.</p></div>
        <ul class="space-y-2 text-sm my-2">${['Wöchentliche Live-Vorträge von unseren Partnern','Fragen direkt an den Sprecher','Neue Jobs 24 h vor allen anderen','10 statt 5 Bewerbungen pro Monat'].map(t=>`<li class="flex items-center gap-2"><span style="color:#B8892E;font-weight:800">✓</span>${t}</li>`).join('')}</ul>
        <a class="btn-gold w-full block text-center" style="padding:12px" href="https://www.getclosinghub.com/#preise" target="_blank" rel="noopener">Premium ansehen</a>
        <button class="text-sm text-muted w-full" onclick="closeSheet()">Später</button>`;
      if(typeof sheet==='function') sheet(html);
    }

    new MutationObserver(()=>{ if(S.player) return; if(LV.ev.length && !document.querySelector('.chlv') && cur().length) draw(); }).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden && Date.now()-LV.at>15000) load(); });
    setInterval(tick,1000);
    let tries=0; const boot=setInterval(()=>{ tries++; if(S.member||tries>40){ clearInterval(boot); load(); } },500);
  })();

  /* ---------- r23: Start-Challenge 750 + Bonus-Lauf ---------- */
  (function(){
    const st = document.createElement('style');
    st.textContent = `
    .chp{margin-top:12px}
    .chp-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px}
    .chp-top b{font-size:15px;color:#087A4B} html:not(.light) .chp-top b{color:#3FCF8E}
    .chp-bar{height:8px;border-radius:99px;background:rgb(var(--line,128 128 128) / .35);overflow:hidden;margin-top:6px}
    .chp-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#087A4B,#D9B45A);transition:width .8s ease}
    .chm{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}
    .chm div{border:1px solid rgb(var(--line,128 128 128) / .6);border-radius:10px;padding:6px 4px;text-align:center;font-size:10.5px;line-height:1.25;color:rgb(var(--muted,120 120 120))}
    .chm div b{display:block;font-size:12px;color:inherit}
    .chm div.on{background:#087A4B;border-color:#087A4B;color:#fff}
    .chm div.nx{border-color:#D9B45A;color:inherit}
    .bl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:8px;margin-top:14px}
    .bl-f{position:relative;min-height:58px;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px 6px;border-radius:12px;border:1px solid rgb(var(--line,128 128 128) / .7);background:rgb(var(--panel,255 255 255));font:600 12.5px/1.25 Inter,sans-serif;transition:background .12s,color .12s,box-shadow .12s,transform .12s}
    .bl-f.on{background:#087A4B;color:#fff;border-color:#087A4B;box-shadow:0 0 0 2px #D9B45A,0 0 18px rgba(217,180,90,.55);transform:scale(1.04)}
    .bl-f.win{background:linear-gradient(135deg,#D9B45A,#F0D88C);color:#0E1A2B;border-color:#D9B45A;box-shadow:0 0 0 2px #087A4B,0 0 22px rgba(217,180,90,.7);animation:blWin 1.1s ease-in-out 3}
    .bl-f.off{opacity:.45}
    @keyframes blWin{0%,100%{transform:scale(1.04)}50%{transform:scale(1.1)}}
    .bl-res{margin-top:14px;padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(217,180,90,.18),rgba(8,122,75,.12));text-align:center}
    .bl-res b{display:block;font:600 21px Lora,serif;margin:2px 0}
    .bl-go{margin-top:14px;width:100%;padding:12px!important}
    .chf-ic{width:64px;height:64px;border-radius:50%;margin:0 auto 6px;display:grid;place-items:center;background:linear-gradient(135deg,#087A4B,#0b9a5f);color:#fff;font-size:28px;box-shadow:0 0 0 4px rgba(217,180,90,.5)}
    .chf-ic .ci{width:30px;height:30px}
    @media (prefers-reduced-motion:reduce){ .bl-f,.chp-bar i{transition:none} .bl-f.win{animation:none} }`;
    document.head.appendChild(st);

    const ic = n => `<svg class="ci"><use href="#i-${n}"/></svg>`;
    const de = n => (+n||0).toLocaleString('de-DE');

    /* Konfetti */
    window.APLUS_konfetti = function(stark){
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const c=document.createElement('canvas'); c.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
      document.body.appendChild(c); const x=c.getContext('2d'), W=c.width=innerWidth, H=c.height=innerHeight;
      const col=['#087A4B','#D9B45A','#F0D88C','#3FCF8E','#ffffff'], n=stark?170:90;
      const P=Array.from({length:n},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.38,vx:(Math.random()-.5)*13,vy:-Math.random()*13-4,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:col[Math.floor(Math.random()*col.length)]}));
      const t0=performance.now();
      (function f(t){ const k=(t-t0)/2600; x.clearRect(0,0,W,H);
        P.forEach(p=>{ p.vy+=.32; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; x.save(); x.globalAlpha=Math.max(0,1-k); x.translate(p.x,p.y); x.rotate(p.r); x.fillStyle=p.c; x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66); x.restore(); });
        if(k<1) requestAnimationFrame(f); else c.remove(); })(t0);
    };

    /* ===== Start-Challenge-Karte ===== */
    const _chReal = window.challengeReal;
    window.challengeReal = function(){
      const c=S.chs; if(!c || c.ziel==null) return _chReal();
      const T=chToday(); if(!T) return '<div id="chcard"></div>';
      const full=v=>v===3, cnt=c.geschafft||0, d=T.d, tp=+c.tag_punkte||0, ms=c.ms||{}, er=c.erreicht||[];
      const dot=i=>{ const v=c.tage[i]||0; const s=full(v)?'background:#087A4B;border-color:#087A4B;color:#fff':(i===d-1?'border-color:#087A4B;color:#087A4B':(i<d-1?'color:rgb(var(--muted));opacity:.5':'color:rgb(var(--muted))')); return `<span class="aspect-square rounded-full border border-line flex items-center justify-center text-[9px] font-semibold" style="${s}">${full(v)?ic('erledigt'):i+1}</span>`; };
      const row=(a,i)=>{ const done=!!(T.bits&(1<<i)); return `<div class="flex items-center justify-between gap-3 py-2.5 border-t border-line"><span class="text-sm ${done?'text-muted line-through':''}" style="line-height:1.4">${done?ic('erledigt')+' ':''}${esc(a.t)}</span>${done?'<span class="text-xs text-gold font-semibold whitespace-nowrap">Erledigt</span>':`<button onclick="chGo(${i})" class="btn-gold text-xs whitespace-nowrap" style="padding:.35rem .8rem">${a.typ==='selbst'?'Abhaken':'Los'}</button>`}</div>`; };
      const ziel=+c.ziel||750, p=Math.max(0,+c.punkte14||0), pct=Math.min(100,Math.round(p/ziel*100));
      const stufen=[[3,ms['3']?'+'+ms['3']:'Tag 3'],[7,ms['7']?'+'+ms['7']:'Woche'],[10,'Abzeichen'],[14,ms['14']?'+'+ms['14']:'Finale']];
      const nx=stufen.find(s=>!er.includes(s[0]));
      return `<div id="chcard" class="card p-4" style="border-color:#087A4B">
        <div class="flex items-center justify-between gap-2"><p class="text-xs uppercase tracking-wider text-gold font-semibold">Start-Challenge</p><span class="text-xs text-muted">Tag ${d} von 14</span></div>
        <p class="font-semibold mt-1">Deine Aufgaben für heute</p>
        <div class="chp"><div class="chp-top"><span><b>${de(p)}</b> von ${de(ziel)} Punkten</span><span class="text-muted">${p>=ziel?'Ziel geknackt! '+ic('feier'):'in deinen ersten 14 Tagen'}</span></div><div class="chp-bar"><i style="width:${pct}%"></i></div></div>
        <div class="mt-3" style="display:grid;grid-template-columns:repeat(14,minmax(0,1fr));gap:3px">${Array.from({length:14},(_,i)=>dot(i)).join('')}</div>
        <div class="mt-3">${T.t.map(row).join('')}</div>
        <p class="text-xs mt-2 ${full(T.bits)?'text-gold font-semibold':'text-muted'}">${full(T.bits)?ic('feier')+` Tag geschafft! +${tp} Punkte`:`Belohnung heute: +${tp} Punkte, wenn du beide Aufgaben schaffst`}</p>
        <div class="chm">${stufen.map(s=>`<div class="${er.includes(s[0])?'on':(nx&&nx[0]===s[0]?'nx':'')}"><b>${er.includes(s[0])?ic('erledigt'):s[0]+' Tage'}</b>${s[1]}</div>`).join('')}</div>
        <p class="text-xs text-muted mt-2 border-t border-line pt-2">${cnt} von 14 Tagen geschafft.${cnt<10?' Schaffe 10 der 14 Tage und sichere dir das Abzeichen „Challenger“.':''}</p></div>`;
    };

    /* Erfolgsmoment bei Meilensteinen */
    const FEIER={
      3:['flamme','Du bist drin!',p=>`3 Challenge-Tage geschafft.${p?` +${p} Punkte sind gutgeschrieben.`:''} Bleib dran!`],
      7:['staerke','Eine Woche durchgezogen!',p=>`7 Challenge-Tage geschafft.${p?` +${p} Punkte sind gutgeschrieben.`:''}`],
      10:['medaille','Abzeichen „Challenger“!',()=>'10 von 14 Tagen. Das Abzeichen steht jetzt in deinem Profil.'],
      14:['pokal','Alle 14 Tage geschafft!',p=>`Du hast die Start-Challenge komplett durchgezogen.${p?` +${p} Punkte sind gutgeschrieben.`:''}`]};
    let feierAn=false;
    function feiern(){
      const l=(S.chs&&S.chs.feiern)||[]; if(!l.length || feierAn) return;
      const m=$('modal'); if(!m || m.innerHTML.trim() || S.player) return;
      const f=l[l.length-1], F=FEIER[f.stufe]; if(!F) return; feierAn=true;
      m.innerHTML=`<div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onclick="APLUS_chfZu()"><div class="card w-full max-w-sm p-6 relative text-center space-y-3" onclick="event.stopPropagation()">
        <div class="chf-ic">${ic(F[0])}</div><p class="text-xs uppercase tracking-wider text-gold font-semibold">Start-Challenge</p>
        <p class="font-serif" style="font-size:26px;line-height:1.2">${F[1]}</p><p class="text-sm text-muted">${F[2](+f.punkte||0)}</p>
        ${f.stufe===7?`<button class="btn-gold w-full" onclick="APLUS_chfZu();setTimeout(()=>chBilanz(),50)">Wochenbilanz ansehen</button><button class="text-sm text-muted w-full" onclick="APLUS_chfZu()">Weiter</button>`:`<button class="btn-gold w-full" onclick="APLUS_chfZu()">Weiter geht's</button>`}</div></div>`;
      APLUS_konfetti(f.stufe>=10);
      rpc('challenge_gefeiert',{p_stufe:f.stufe}).catch(()=>{});
      S.chs.feiern=[];
    }
    window.APLUS_chfZu=()=>{ feierAn=false; closeModal(); };
    const _chLoad=window.chLoad;
    window.chLoad=async function(){ const r=await _chLoad.apply(this,arguments); try{ feiern(); }catch(e){} return r; };
    let chAt=0; const chAgain=()=>{ if(!S.member||document.hidden||Date.now()-chAt<15000) return; chAt=Date.now(); chLoad(); };
    window.addEventListener('hashchange',chAgain); document.addEventListener('visibilitychange',chAgain);

    /* Punkte im eigenen Monat (Ranglisten bleiben beim Kalendermonat) */
    if(typeof window.ptCard==='function'){ const _pt=window.ptCard;
      window.ptCard=function(){ let h=_pt.apply(this,arguments); const p=S.pt; if(!h||!p||p.pm_punkte==null||!p.pm_ab) return h;
        const ab=new Date(p.pm_ab+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});
        return h.replace(/(<p class="text-xs text-muted">)diesen Monat(<\/p><p class="font-semibold text-gold">)[^<]*/,`$1dein Monat seit ${ab}$2${de(p.pm_punkte)}`); }; }

    /* ===== Bonus-Lauf (statt Glücksrad) ===== */
    const BL_DEMO=['+25 Punkte','+50 Punkte','+1 Bewerbung','1 Tag Premium','+100 Punkte','Partner-Rabatt'];
    const blDemo = () => !(S.gr&&S.gr.felder&&S.gr.felder.length);
    const blFelder = () => blDemo()?BL_DEMO.map((t,i)=>({id:'d'+i,t,demo:1})):S.gr.felder;
    const blDemoDone = () => { try{ return localStorage.getItem('ch_gr_demo')===grWeek(); }catch(e){ return false; } };
    function blArt(){
      const g=S.gr;
      if(g && g.w_offen && !blDemo()) return 'willkommen';
      if(blDemo()) return grFriday()&&!blDemoDone()?'freitag':null;
      return g.offen && !g.gedreht ? 'freitag' : null;
    }
    window.wheelCard=function(){
      const R=S.blRun, art=R?R.art:blArt(); if(!art) return '<div id="grcard" hidden></div>';
      const f=R?R.f:blFelder(), demo=!!(f[0]&&f[0].demo), w=art==='willkommen';
      const done=R&&R.done, lit=R?R.i:-1;
      const tiles=f.map((x,i)=>`<div class="bl-f${done?(i===R.k?' win':' off'):(i===lit?' on':'')}">${esc(x.t)}</div>`).join('');
      const res=done?`<div class="bl-res"><span class="mk-t">${w?'Dein Willkommens-Gewinn':'Dein Freitags-Gewinn'}</span><b>${esc(R.t)}</b><span class="mk-t">${demo?'Beispiel – echte Gewinne kommen bald.':(+R.p>0?`+${de(R.p)} Punkte sind gutgeschrieben.`:'Wir melden uns bei dir zum Einlösen.')}</span></div>`:'';
      return `<article class="card mk" id="grcard"><div class="mk-hd"><div class="mk-logo">HUB</div><div><div class="mk-n">ClosingHub${demo?'<span class="mk-demo">Beispiel</span>':''}</div><div class="mk-t">${w?'Willkommen · dein erster Lauf':'Freitag · 1 Lauf pro Woche'}</div></div><span class="mk-chip" style="background:rgba(217,180,90,.2);color:#8a6a12">Bonus-Lauf</span></div>
        <div class="mk-bd" style="text-align:center"><p class="mk-q">${done?(w?'Willkommen bei ClosingHub!':'Starker Freitag!')+' '+ic('feier'):(w?'Dein Willkommens-Lauf wartet':'Dein Freitags-Lauf wartet')+' '+ic('geschenk')}</p>
        <p class="mk-t" style="margin-top:4px">${done?(w?'Ab jetzt gibt es jeden Freitag ab 8 Uhr einen neuen Lauf.':'Nächsten Freitag ab 8 Uhr gibt es den nächsten Lauf.'):(w?'Ein Geschenk zum Start: Das Licht läuft über die Felder und bleibt auf deinem Gewinn stehen.':'Einmal pro Woche, nur heute bis 23:59 Uhr.')}</p>
        <div class="bl-grid">${tiles}</div>
        ${R?'':`<button class="btn-gold bl-go" onclick="APLUS_blGo(this)">Lauf starten</button>`}${res}</div></article>`;
    };
    window.grRefresh=function(){ const e=$('grcard'); if(e) e.outerHTML=wheelCard(); };
    const blPaint=()=>{ const t=document.querySelectorAll('#grcard .bl-f'); t.forEach((e,i)=>e.classList.toggle('on',i===S.blRun.i)); };
    window.APLUS_blGo=async function(b){
      if(S.blRun) return; const art=blArt(); if(!art) return; b.disabled=true; b.textContent='Läuft …';
      const f=blFelder(), demo=!!(f[0]&&f[0].demo); let k,t,p=0;
      if(demo){ k=Math.floor(Math.random()*f.length); t=f[k].t; try{ localStorage.setItem('ch_gr_demo',grWeek()); }catch(e){} }
      else{ const j=await rpc('bonuslauf_starten',{p_art:art}).catch(()=>null);
        if(!j||!j.ok){ b.disabled=false; b.textContent='Lauf starten'; const g=j&&j.grund; alert(g==='gedreht'?'Den Lauf hast du schon gemacht.':g==='zu'?'Der Lauf ist gerade nicht offen.':'Das hat gerade nicht geklappt. Versuch es gleich nochmal.'); return; }
        k=Math.max(0,f.findIndex(x=>x.id===j.id)); t=j.t; p=+j.punkte||0; }
      S.blRun={art,f,k,t,p,i:0,done:false}; grRefresh();
      const n=f.length, steps=n*3+k, fast=55, slow=420; let s=0;
      const step=()=>{ if(!S.blRun) return; S.blRun.i=s%n; blPaint();
        if(s>=steps){ setTimeout(fertig,350); return; }
        const q=s/steps; s++; setTimeout(step, fast+(slow-fast)*q*q*q); };
      step();
      function fertig(){
        if(!S.blRun) return; S.blRun.done=true;
        if(!demo&&S.gr){ if(art==='willkommen'){ S.gr.w_offen=false; S.gr.w_gedreht=true; S.gr.w_gewinn=t; } else { S.gr.gedreht=true; S.gr.gewinn=t; } }
        grRefresh(); APLUS_konfetti(false);
        if(p>0 && typeof ptLoad==='function') ptLoad();
        if(art==='willkommen' && typeof chLoad==='function') setTimeout(()=>chLoad(),400);
        setTimeout(()=>{ const c=$('grcard'); S.blRun=null; const nxt=wheelCard();
          if(!c) return; if(!/hidden><\/div>$/.test(nxt)){ c.outerHTML=nxt; return; }
          c.style.transition='opacity .6s,max-height .6s,margin .6s'; c.style.overflow='hidden'; c.style.maxHeight=c.offsetHeight+'px';
          requestAnimationFrame(()=>{ c.style.opacity=0; c.style.maxHeight='0px'; c.style.margin='0'; }); setTimeout(()=>{ c.outerHTML=nxt; },700); }, 9000);
      }
    };
    window.grSpin=window.APLUS_blGo;
    if(typeof route==='function'&&route()==='feed') setTimeout(()=>{ try{ grRefresh(); }catch(e){} },0);
  })();

  /* ---------- r24: Nachrichten von Auftraggebern (nach der Freischaltung) ---------- */
  (function(){
    if(typeof window.chatsLoad!=='function' || typeof window.convHead!=='function') return;
    S.ka = S.ka || [];
    const kaUn = () => (S.ka||[]).reduce((a,c)=>a+(+c.ungelesen||0),0);
    const kaFind = k => (S.ka||[]).find(x=>'a'+x.id===k);
    async function kaLoad(){ try{ const r=await rpc('kandidat_postfach',{}); if(Array.isArray(r)) S.ka=r; }catch(e){} }

    const _cl = window.chatsLoad;
    window.chatsLoad = async function(){
      const [r] = await Promise.all([_cl.apply(this,arguments), S.member?kaLoad():null]);
      if(S.member && kaUn()){ S.unreadMsg=(+S.unreadMsg||0)+kaUn(); try{ markBell(); }catch(e){} }
      if(route()==='messages') try{ drawMsgs(); }catch(e){}
      return r;
    };
    const kaItems = () => { const q=(S.cq||'').trim().toLowerCase();
      return (S.ka||[]).filter(x=>!q||(x.firma+' '+x.job).toLowerCase().includes(q)).map(x=>({k:'a'+x.id,name:x.firma,av:null,last:x.letzte,at:x.last_at,un:+x.ungelesen||0,sub:'Auftraggeber · '+esc(x.job)})); };
    if(typeof window.cxItems==='function'){ const _ci=window.cxItems;
      window.cxItems = function(items){ const ka=kaItems(); if(!ka.length||S.cl===null) return _ci.apply(this,arguments);
        return _ci.call(this,[...(items||[]),...ka].sort((a,b)=>new Date(b.at)-new Date(a.at))); };
    }
    const _ch = window.convHead;
    window.convHead = function(){
      const k=S.cur; if(k && k[0]==='a'){ const x=kaFind(k); return {name:x?x.firma:'Auftraggeber', av:null, auftraggeber:true, job:x?x.job:''}; }
      return _ch.apply(this,arguments);
    };
    const _cv = window.convHtml;
    window.convHtml = function(){
      let h=_cv.apply(this,arguments); const k=S.cur; if(!k||k[0]!=='a') return h;
      const x=kaFind(k)||{};
      return h.replace(/(<b class="block truncate" style="font-size:15px">[^<]*<\/b><span class="text-muted" style="font-size:12px">)/, `$1Auftraggeber · ${esc(x.job||'')}`)
              .replace(/placeholder="Nachricht schreiben …"/,'placeholder="Antwort an den Auftraggeber …"');
    };
    const _mh = window.msgsHtml;
    window.msgsHtml = function(){
      const h=_mh.apply(this,arguments); if(!S.cur||S.cur[0]!=='a') return h;
      return h.replace(/<span class="cm-act">(?:(?!<\/span>)[\s\S])*<\/span>/g,'');
    };
    const _lc = window.convLoad;
    window.convLoad = async function(){
      const k=S.cur; if(!k||k[0]!=='a') return _lc.apply(this,arguments);
      try{ const r=await rpc('kandidat_nachrichten_laden',{p_bewerbung:+k.slice(1)}); if(S.cur===k){ const first=S.cmsg===null; S.cmsg=Array.isArray(r)?r:[]; drawMsgs(first); } }catch(e){}
    };
    const _cs = window.cSend;
    window.cSend = async function(){
      if(!S.cur||S.cur[0]!=='a') return _cs.apply(this,arguments);
      const i=document.getElementById('cminput'), v=(i&&i.value||'').trim(); if(!v) return; i.value=''; S.cdraft=''; S.cerr='';
      try{ const j=await rpc('kandidat_nachricht_senden',{p_bewerbung:+S.cur.slice(1),p_text:v});
        if(!j||!j.ok){ S.cerr=j&&j.grund==='tempo'?'Kurze Pause: zu viele Nachrichten in der letzten Stunde.':j&&j.grund==='zu'?'Dieses Gespräch ist nicht mehr offen.':'Senden hat nicht geklappt.'; if(i) i.value=v; drawMsgs(); return; }
      }catch(e){ S.cerr='Senden hat nicht geklappt.'; if(i) i.value=v; drawMsgs(); return; }
      S._keepFocus=true; await convLoad(); chatsLoad();
    };
    let kaT=0; const kaKick=()=>{ if(!S.member||Date.now()-kaT<3000) return; kaT=Date.now(); kaLoad().then(()=>{ if(route()==='messages') try{ drawMsgs(); }catch(e){} }); };
    window.addEventListener('hashchange',()=>{ if(route()==='messages') kaKick(); });
    { let n=0; const t=setInterval(()=>{ n++; if(S.member){ clearInterval(t); kaKick(); } else if(n>40) clearInterval(t); },500); }
  })();

  /* ---------- r25: Partner statt Marktplatz – Partnerübersicht + Wochenkalender der Live-Calls ---------- */
  (function(){
    if(typeof PAGES!=='object' || typeof NAV==='undefined') return;
    const st=document.createElement('style'); st.textContent=`
    .pk-week{margin-top:26px}
    .pk-wh{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:10px}
    .pk-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
    .pk-day{border:1px solid rgb(var(--line));border-radius:14px;padding:8px;min-height:140px;background:rgb(var(--panel));min-width:0}
    .pk-day.today{border-color:#087A4B;box-shadow:inset 0 0 0 1px #087A4B}
    .pk-dh{display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:600;margin-bottom:2px}
    .pk-dh small{font-weight:500;color:rgb(var(--muted))}
    .pk-today{background:#087A4B;color:#fff;border-radius:99px;font-size:10px;font-weight:700;padding:1px 7px}
    .pk-ev{display:block;width:100%;text-align:left;border-radius:10px;padding:7px 8px;margin-top:6px;border:1px solid transparent;font-size:11.5px;line-height:1.3;color:inherit}
    .pk-ev.vortrag{background:rgba(217,180,90,.13);border-color:rgba(217,180,90,.38)}
    .pk-ev.motivation{background:rgba(8,122,75,.09);border-color:rgba(8,122,75,.28)}
    .pk-ev.gast{background:rgba(64,98,168,.09);border-color:rgba(64,98,168,.30)}
    .pk-ev.past{opacity:.45}
    .pk-ev.live{box-shadow:0 0 0 2px #087A4B}
    .pk-t{display:flex;align-items:center;gap:5px;font-weight:600;color:rgb(var(--muted));white-space:nowrap}
    .pk-live{background:#087A4B;color:#fff;font-size:9.5px;font-weight:700;border-radius:99px;padding:1px 6px;animation:pkPulse 1.6s ease-in-out infinite}
    @keyframes pkPulse{50%{opacity:.55}}
    .pk-ti{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-weight:600;font-size:12.5px;margin:3px 0 4px}
    .pk-sp{display:flex;align-items:center;gap:5px;font-size:11px;color:rgb(var(--muted));min-width:0}
    .pk-sp span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .pk-av{width:18px;height:18px;border-radius:50%;overflow:hidden;flex:none;display:inline-flex}
    .pk-av>*{width:100%!important;height:100%!important;font-size:8px!important}
    .pk-tag{display:inline-flex;align-items:center;gap:3px;margin-top:5px;font-size:10px;font-weight:700;letter-spacing:.02em}
    .pk-tag.v{color:#8a6a12} .pk-tag.m{color:#087A4B} .pk-tag.g{color:#3D5E9E}
    html:not(.light) .pk-tag.v{color:#D9B45A} html:not(.light) .pk-tag.m{color:#3FCF8E} html:not(.light) .pk-tag.g{color:#9DB4E3}
    .pk-gast{display:flex;align-items:center;gap:14px;margin-top:22px;padding:16px;border-radius:16px;border:1px dashed rgb(var(--line));background:rgb(var(--panel))}
    .pk-gic{width:44px;height:44px;border-radius:12px;flex:none;display:grid;place-items:center;background:rgba(217,180,90,.18);color:#B8892E}
    .pk-gic .ci{width:22px;height:22px}
    .pk-f{display:block;font-size:12.5px;font-weight:600;margin-bottom:5px}
    .pk-f small{font-weight:400;color:rgb(var(--muted))}
    @media (max-width:767px){ .pk-gast{flex-wrap:wrap} .pk-gast .btn-gold{width:100%;text-align:center} }
    .pk-gast-ok{border:1px solid rgba(8,122,75,.45);background:rgba(8,122,75,.07)} .pk-gast-ok .pk-gic{background:#087A4B;color:#fff}
    .pk-tag .ci{width:11px;height:11px}
    .pk-none{font-size:11.5px;color:rgb(var(--muted));margin-top:8px}
    .pk-legend{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:12px;color:rgb(var(--muted));margin-top:14px}
    .pk-legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
    @media (max-width:767px){
      .pk-prow{flex-wrap:wrap;justify-content:center;row-gap:18px}
      .pk-grid{grid-template-columns:1fr;gap:8px}
      .pk-day{display:grid;grid-template-columns:46px minmax(0,1fr);gap:10px;min-height:0;padding:10px}
      .pk-day.empty:not(.today){display:none}
      .pk-dh{flex-direction:column;align-items:center;justify-content:flex-start;margin:0;padding-top:2px;font-size:11px;color:rgb(var(--muted))}
      .pk-dh b{font-size:20px;line-height:1.1;color:rgb(var(--fg))}
      .pk-dh small{display:none}
      .pk-dh>span:first-child{display:flex;flex-direction:column;align-items:center;gap:1px;font-weight:600}
      .pk-day.today .pk-dh b{color:#087A4B} html:not(.light) .pk-day.today .pk-dh b{color:#3FCF8E}
      .pk-ev{margin-top:0;margin-bottom:6px;font-size:12px} .pk-ev:last-child{margin-bottom:0}
      .pk-ti{font-size:13.5px;-webkit-line-clamp:2}
      .pk-none{margin-top:6px}
    }
    @media (min-width:768px){ .pk-dh b{font-weight:600} .pk-dh .pk-dnum{display:none} }`;
    document.head.appendChild(st);

    try{ IC.partner='<circle cx="9" cy="8" r="3.2"/><path d="M3.2 19.5c.8-3.4 3.1-5.2 5.8-5.2s5 1.8 5.8 5.2"/><circle cx="16.8" cy="9" r="2.6"/><path d="M15.6 14.5c2.5-.3 4.5 1.4 5.2 4.6"/>'; }catch(e){}
    const ni=NAV.findIndex(x=>x[0]==='markt'); if(ni>=0) NAV[ni]=['partner','partner','Partner & Live'];
    try{ const ri=REVIEWS.findIndex(g=>g.t==='Marktplatz'); if(ri>=0) REVIEWS.splice(ri,1); }catch(e){}

    // Alte Links (#markt) führen jetzt zur Partner-Seite
    const toP=()=>{ if(/^#markt(\b|$)/.test(location.hash)) location.replace('#partner'); };
    window.addEventListener('hashchange',toP); toP();
    PAGES.markt=()=>{ setTimeout(toP,0); return '<div class="px-4 py-16 text-center text-sm text-muted">Lädt …</div>'; };
    // Reiter über Jobs und Forum
    const tab=h=>typeof h==='string'?h.replace('<a href="#markt" class="btn-ghost">Marktplatz</a>','<a href="#partner" class="btn-ghost">Partner &amp; Live</a>'):h;
    ['jobs','forum'].forEach(k=>{ const f=PAGES[k]; if(typeof f==='function') PAGES[k]=function(){ return tab(f.apply(this,arguments)); }; });
    // Unten im Handy-Menü: Partner gehört wie Forum zum Bereich „Jobs“
    if(typeof window.shell==='function'){ const _sh=window.shell; window.shell=function(){ let h=_sh.apply(this,arguments); if(route()==='partner') h=h.replace(/(<a href="#jobs" class="p-2 [^"]*"><span class=")(")/,'$1icon-on$2'); return h; }; }

    S.pk={d:null,at:0,busy:0};
    const WD=['Mo','Di','Mi','Do','Fr','Sa','So'];
    const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const berlin=()=>{ const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); return new Date(p+'T12:00:00'); };
    const wk=off=>{ const d=berlin(); d.setDate(d.getDate()-((d.getDay()+6)%7)+7*off); return d; };
    const hm=t=>new Date(t).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});
    const dm=d=>d.toLocaleDateString('de-DE',{day:'numeric',month:'long'});
    async function pkLoad(){ if(S.pk.busy) return; S.pk.busy=1; const a=wk(0), e=wk(1); e.setDate(e.getDate()+6);
      try{ const r=await rpc('live_kalender',{p_von:ymd(a),p_bis:ymd(e)}); S.pk.d=Array.isArray(r)?r:[]; }catch(x){ if(!S.pk.d) S.pk.d=[]; }
      S.pk.at=Date.now(); S.pk.busy=0; const el=document.getElementById('pkcal'); if(el&&route()==='partner') el.innerHTML=pkCal(); }
    function pkEv(x,i){
      const now=Date.now(), s=new Date(x.start).getTime(), e=new Date(x.ende).getTime(), live=s<=now&&now<e, past=e<=now, v=x.typ==='vortrag', g=x.typ==='gast', who=x.sprecher||x.partner||'';
      return `<button class="pk-ev ${x.typ} ${past?'past':''} ${live?'live':''}" onclick="APLUS_pkEv(${i})">
        <span class="pk-t">${hm(x.start)} – ${hm(x.ende)}${live?'<span class="pk-live">LIVE</span>':''}</span>
        <span class="pk-ti">${esc(x.titel)}</span>
        ${who?`<span class="pk-sp"><span class="pk-av">${avatar(who)}</span><span>${esc(who)}</span></span>`:''}
        <span class="pk-tag ${v?'v':g?'g':'m'}">${v?'Vortrag · Premium':g?'Gastbeitrag · Plus':'Motivations-Call · Plus'}${x.zugang?'':' <svg class="ci"><use href="#i-sperren"/></svg>'}</span></button>`;
    }
    function pkWeek(off){
      const a=wk(off), today=ymd(berlin()), L=S.pk.d||[];
      const days=[...Array(7)].map((_,k)=>{ const d=new Date(a); d.setDate(a.getDate()+k); return d; });
      const e=days[6], any=days.some(d=>L.some(x=>x.termin===ymd(d)));
      return `<section class="pk-week"><div class="pk-wh"><p class="font-semibold">${off?'Nächste Woche':'Diese Woche'}</p><span class="text-xs text-muted">${a.getDate()}.${a.getMonth()!==e.getMonth()?' '+a.toLocaleDateString('de-DE',{month:'long'}):''} – ${dm(e)}</span></div>
        <div class="pk-grid">${days.map((d,k)=>{ const id=ymd(d), ev=L.map((x,i)=>[x,i]).filter(([x])=>x.termin===id), t=id===today;
          return `<div class="pk-day ${t?'today':''} ${ev.length?'':'empty'}"><div class="pk-dh"><span>${WD[k]} <b class="pk-dnum">${d.getDate()}</b><small>${d.getDate()}.${d.getMonth()+1}.</small></span>${t?'<span class="pk-today">Heute</span>':''}</div>
            <div class="min-w-0">${ev.length?ev.map(([x,i])=>pkEv(x,i)).join(''):`<p class="pk-none">${t?'Heute keine Calls':'–'}</p>`}</div></div>`; }).join('')}</div>
        ${any?'':`<p class="text-sm text-muted mt-2">${off?'Nächste Woche':'Diese Woche'} sind noch keine Calls geplant.</p>`}</section>`;
    }
    function pkCal(){
      if(S.pk.d===null){ pkLoad(); return '<p class="text-sm text-muted mt-8">Live-Calls laden …</p>'; }
      if(Date.now()-S.pk.at>60000) setTimeout(pkLoad,0);
      return `<div class="mt-8"><h2 class="font-serif text-2xl">Live-Calls</h2><p class="text-muted text-sm">15 Minuten vor Beginn erscheint oben in der App der Live-Hinweis – ein Tipp, und du bist dabei.</p></div>
        ${pkWeek(0)}${pkWeek(1)}
        <div class="pk-legend"><span><i style="background:rgba(217,180,90,.55)"></i>Vortrag mit Partner · ab Premium</span><span><i style="background:rgba(8,122,75,.45)"></i>Motivations-Call · ab Plus</span><span><i style="background:rgba(64,98,168,.45)"></i>Gastbeitrag · ab Plus</span></div>
        ${pkGastCard()}`;
    }
    S.gast=S.gast||{m:undefined};
    async function gastLoad(){ if(!S.member) return; try{ const r=await rpc('gast_meine'); S.gast.m=r||{}; if(r&&r.angenommen&&r.angenommen.termin) pkLoad(); }catch(e){ S.gast.m={}; } const el=document.getElementById('pkgast'); if(el) el.outerHTML=pkGastCard(); }
    function pkGastCard(){
      if(S.member && S.gast.m===undefined){ S.gast.m=null; gastLoad(); }
      const o=S.gast.m&&S.gast.m.offen, an=S.gast.m&&S.gast.m.angenommen;
      const wann=t=>{ const d=new Date(t); return d.toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'2-digit'})+' um '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+' Uhr'; };
      const txt=o?`<p class="font-semibold">Deine Bewerbung ist eingereicht</p><p class="text-sm text-muted">„${esc(o.thema)}“ – wir schauen sie uns an und melden uns bei dir.</p>`
        :an&&an.termin?`<p class="font-semibold">Dein Gastbeitrag steht!</p><p class="text-sm text-muted">„${esc(an.thema)}“ · <b style="color:rgb(var(--fg))">${wann(an.termin)}</b>. Du findest ihn oben im Kalender.</p>`
        :an?`<p class="font-semibold">Deine Bewerbung ist angenommen!</p><p class="text-sm text-muted">„${esc(an.thema)}“ – wir rufen dich an, um den Termin abzustimmen.</p>`
        :`<p class="font-semibold">Du willst selbst einen Live-Call halten?</p><p class="text-sm text-muted">Bewirb dich für einen Gastbeitrag und teil dein Wissen mit der Community.</p>`;
      return `<div class="pk-gast${an&&!o?' pk-gast-ok':''}" id="pkgast"><span class="pk-gic"><svg class="ci"><use href="#i-${an&&!o?'erledigt':'mikrofon'}"/></svg></span>
        <div class="flex-1 min-w-0">${txt}</div>
        ${o||an?'':`<button class="btn-gold text-sm whitespace-nowrap" onclick="APLUS_gastForm()">Gastbeitrag vorschlagen</button>`}</div>`;
    }
    window.APLUS_gastForm=function(){
      if(!S.user||!S.member) return go('login');
      const f=(id,lab,sub,tag,ph,max,h)=>`<label class="block"><span class="pk-f">${lab}${sub?` <small>${sub}</small>`:''}</span>${tag==='ta'?`<textarea id="${id}" class="input text-sm" style="height:${h}px" maxlength="${max}" placeholder="${ph}"></textarea>`:`<input id="${id}" class="input text-sm" maxlength="${max}" placeholder="${ph}">`}</label>`;
      sheet(`<div class="text-center"><p class="font-serif text-2xl leading-tight">Gastbeitrag vorschlagen</p><p class="text-sm text-muted mt-1">Halte selbst einen Live-Call für die ClosingHub-Community.</p></div>
        ${f('gb-thema','Thema','','in','z. B. Einwände am Telefon knacken',120)}
        ${f('gb-text','Worum geht’s?','2–3 Sätze','ta','Was lernen die Zuschauer bei dir?',800,92)}
        ${f('gb-erf','Deine Erfahrung im Vertrieb','','ta','z. B. 4 Jahre Closer im Solar-Vertrieb, 300 Abschlüsse',400,64)}
        ${f('gb-tel','Telefonnummer','für die Terminabsprache','in','z. B. +49 171 2345678',30)}
        ${f('gb-wunsch','Wann passt es dir?','optional','in','z. B. dienstags ab 18 Uhr',200)}
        <p id="gb-err" class="text-sm" style="color:#C0392B;display:none"></p>
        <button class="btn-gold w-full" style="padding:12px" onclick="APLUS_gastSend(this)">Bewerbung senden</button>
        <button class="text-sm text-muted w-full" onclick="closeSheet()">Abbrechen</button>`);
      { const t=document.getElementById('gb-tel'); if(t){ t.type='tel'; t.inputMode='tel'; t.autocomplete='tel'; } }
      setTimeout(()=>{ const e=document.getElementById('gb-thema'); if(e) e.focus(); },50);
    };
    window.APLUS_gastSend=async function(b){
      const v=id=>(document.getElementById(id)||{}).value||'', err=t=>{ const e=document.getElementById('gb-err'); if(e){ e.textContent=t; e.style.display=''; } };
      const th=v('gb-thema').trim(), tx=v('gb-text').trim(), er=v('gb-erf').trim();
      if(th.length<3) return err('Bitte gib ein Thema an.'); if(tx.length<10) return err('Beschreib kurz, worum es geht.'); if(er.length<3) return err('Erzähl kurz von deiner Erfahrung.');
      const tel=v('gb-tel').trim(); if(!/^\+?[0-9 ()\/.-]+$/.test(tel)||tel.replace(/\D/g,'').length<7||tel.replace(/\D/g,'').length>15) return err('Bitte gib deine Telefonnummer an, damit wir den Termin mit dir abstimmen können.');
      b.disabled=true; b.textContent='Wird gesendet …';
      try{ const j=await rpc('gast_bewerben',{p_thema:th,p_text:tx,p_erfahrung:er,p_telefon:tel,p_wunsch:v('gb-wunsch').trim()});
        if(!j||!j.ok){ b.disabled=false; b.textContent='Bewerbung senden'; return err(j&&j.grund==='offen'?'Du hast schon eine offene Bewerbung. Wir melden uns bald.':j&&j.grund==='tempo'?'Du hast in den letzten 30 Tagen schon 3 Bewerbungen geschickt.':j&&j.grund==='telefon'?'Bitte prüf deine Telefonnummer.':'Senden hat nicht geklappt. Versuch es gleich nochmal.'); }
        S.gast.m={offen:{thema:th,at:new Date().toISOString()}};
        sheet(`<div class="text-center space-y-3"><div style="width:60px;height:60px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:#087A4B;color:#fff"><svg class="ci" style="width:28px;height:28px"><use href="#i-erledigt"/></svg></div>
          <p class="font-serif text-2xl leading-tight">Danke für deine Bewerbung!</p><p class="text-sm text-muted">Wir schauen uns dein Thema an und melden uns per Mitteilung bei dir.</p></div>
          <button class="btn-gold w-full" style="padding:12px" onclick="closeSheet()">Alles klar</button>`);
        const el=document.getElementById('pkgast'); if(el) el.outerHTML=pkGastCard();
      }catch(e){ b.disabled=false; b.textContent='Bewerbung senden'; err('Senden hat nicht geklappt. Versuch es gleich nochmal.'); }
    };
    window.APLUS_pkEv=function(i){
      const x=(S.pk.d||[])[i]; if(!x) return;
      if(!S.user) return go('login');
      const now=Date.now(), live=new Date(x.start)<=now&&now<new Date(x.ende);
      if(!x.zugang){ if(typeof APLUS_lvLock==='function') return APLUS_lvLock({typ:x.typ,titel:x.titel,sprecher:x.sprecher||x.partner}); return; }
      if(live && typeof APLUS_lvOpen==='function'){ APLUS_lvOpen(x.id,x.termin); return; }
      const d=new Date(x.start), past=new Date(x.ende)<=now;
      toastMsg(past?'Dieser Call ist schon vorbei.':`Startet ${d.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'numeric',timeZone:'Europe/Berlin'})} um ${hm(x.start)} Uhr. 15 Minuten vorher erscheint oben der Live-Hinweis.`);
    };
    PAGES.partner=function(){
      if(S.member&&S.chs) setTimeout(()=>chEv('markt'),300);
      return `<div class="px-4 py-6 max-w-6xl mx-auto">
        <div class="flex gap-2 mb-5 hubtabs"><a href="#jobs" class="btn-ghost">Jobs</a><a href="#forum" class="btn-ghost">Forum</a><span class="btn-gold">Partner &amp; Live</span></div>
        <div class="mb-4"><h1 class="font-serif text-3xl">Partner</h1><p class="text-muted text-sm">Erfahrene Vertriebsprofis an deiner Seite – lern von ihnen live in den Calls.</p></div>
        ${partnersRow().replace('flex gap-4 overflow-x-auto noscroll pb-1','pk-prow flex gap-4 pb-1')}
        <div id="pkcal">${pkCal()}</div></div>`;
    };
    // Partnerliste kommt etwas später aus der Datenbank: dann einmal neu zeichnen
    { let n=0, was=!!S._ptOk; const t=setInterval(()=>{ n++; if(!was&&S._ptOk&&route()==='partner') render(); was=!!S._ptOk; if(was||n>30) clearInterval(t); },400); }
    setInterval(()=>{ if(route()==='partner'&&!document.hidden){ const el=document.getElementById('pkcal'); if(el&&!S.pk.busy){ if(Date.now()-S.pk.at>60000) pkLoad(); else el.innerHTML=pkCal(); } } },30000);
  })();

  /* ---------- r26: Partner-Angebote ohne 3er-Grenze (bis 20), lange Listen klappen auf ---------- */
  (function(){
    S.ptAll=S.ptAll||{};
    const c=(x,m)=>String(x??'').replace(/[<>"'`]/g,'').trim().slice(0,m);
    fetch('https://bzcnqggwyfocpbkwqhsy.supabase.co/rest/v1/rpc/partner_liste',{method:'POST',headers:{apikey:'sb_publishable_97FHvL7dI_g9ueRVwfhE6A_qv07CJ6D','Content-Type':'application/json'},body:'{}'})
      .then(r=>r.ok?r.json():null).then(l=>{ if(!Array.isArray(l)) return;
        l.forEach(p=>{ const n=c(p&&p.n,40); if(!n) return; S.ptAll[n]=(Array.isArray(p.offers)?p.offers:[]).slice(0,20).map(x=>({t:c(x&&x.t,70),pr:c(x&&x.pr,12)})).filter(x=>x.t); });
      }).catch(()=>{});
    const SHOW=5;
    window.APLUS_ptOpen=n=>{ try{ personModal(n); }catch(e){} };
    window.APLUS_ofAll=b=>{ const box=b.previousElementSibling; if(box) box.querySelectorAll('[data-ofx]').forEach(e=>e.style.display=''); b.remove(); };
    if(typeof partnerModal==='function'){
      const _pm=partnerModal;
      partnerModal=function(p,offers,r,rt){
        try{ const full=p&&p.real&&S.ptAll[p.n]; if(full&&full.length>=(offers||[]).length) offers=full.map(o=>({t:o.t,pr:o.pr,cat:p.s,n:0,st:0})); }catch(e){}
        const res=_pm.call(this,p,offers,r,rt);
        try{
          const lab=[...document.querySelectorAll('#modal p')].find(e=>e.textContent.trim()==='Leistungen'), box=lab&&lab.nextElementSibling;
          if(box){ const rows=[...box.children]; rows.forEach(e=>{ const t=e.querySelector('.truncate'); if(t){ t.classList.remove('truncate'); t.style.overflowWrap='anywhere'; } });
            if(rows.length>SHOW+1){ rows.slice(SHOW).forEach(e=>{ e.dataset.ofx=1; e.style.display='none'; });
              box.insertAdjacentHTML('afterend',`<button class="text-sm font-semibold mt-2" style="color:#087A4B" onclick="APLUS_ofAll(this)">Alle ${rows.length} Leistungen anzeigen</button>`); } }
        }catch(e){}
        return res;
      };
    }
  })();

  /* ---------- r26: Follower- und Gefolgt-Listen (Tipp auf die Zahlen im Profil) ---------- */
  (function(){
    const FL={mid:0,art:'follower',q:'',off:0,list:[],n:{},mehr:false,busy:false,name:''};
    if(typeof memberModal==='function'){ const _mm=memberModal; memberModal=function(mid){ S.flModal=+mid||0; return _mm.apply(this,arguments); }; }
    const ctxMid=el=>{ if(el.closest('#modal')) return S.flModal||0; const r=route(); if(r==='mitglied') return +S.mpid||0; if(r==='profile') return S.member?S.member.id:0; return 0; };
    const ctxName=mid=>{ try{ if(S.member&&mid===S.member.id) return S.member.name||''; if(S.mp&&S.mp.p&&+S.mpid===mid) return S.mp.p.name||''; }catch(e){} return ''; };
    function mark(){
      document.querySelectorAll('#app span, #modal span').forEach(sp=>{
        if(sp.dataset.fl) return; const t=sp.textContent.replace(/\s+/g,' ').trim(), m=t.match(/^[\d.]+ (Follower|gefolgt)$/); if(!m) return;
        const mid=ctxMid(sp); if(!mid) return;
        sp.dataset.fl=m[1]==='Follower'?'follower':'gefolgt'; sp.dataset.mid=mid; sp.setAttribute('role','button'); sp.tabIndex=0; sp.classList.add('fl-cnt');
      });
    }
    let q=0; new MutationObserver(()=>{ if(q) return; q=requestAnimationFrame(()=>{ q=0; try{ mark(); }catch(e){} }); }).observe(document.body,{childList:true,subtree:true});
    const st=document.createElement('style'); st.textContent='.fl-cnt{cursor:pointer;border-radius:8px}.fl-cnt:hover{text-decoration:underline;text-underline-offset:3px}.fl-cnt:focus-visible{outline:2px solid #087A4B;outline-offset:2px}'; document.head.appendChild(st);
    const open=(mid,art)=>{ if(!S.member){ go('login'); return; } Object.assign(FL,{mid,art,q:'',off:0,list:[],mehr:false,name:ctxName(mid),n:{}}); try{ document.querySelectorAll(`[data-fl][data-mid="${mid}"]`).forEach(e=>{ const z=parseInt(e.textContent.replace(/\D/g,''),10); if(!isNaN(z)) FL.n[e.dataset.fl]=z; }); }catch(e){} draw(true); load(); };
    document.addEventListener('click',e=>{ const sp=e.target.closest&&e.target.closest('[data-fl]'); if(!sp) return; e.preventDefault(); e.stopPropagation(); open(+sp.dataset.mid,sp.dataset.fl); },true);
    document.addEventListener('keydown',e=>{ if(e.key!=='Enter') return; const sp=e.target.closest&&e.target.closest('[data-fl]'); if(sp) open(+sp.dataset.mid,sp.dataset.fl); });
    async function load(more){
      if(FL.busy) return; FL.busy=true; const key=FL.mid+FL.art+FL.q;
      let r=null; try{ r=await rpc('folgen_liste',{p_member:FL.mid,p_art:FL.art,p_q:FL.q||null,p_offset:more?FL.off:0}); }catch(e){}
      FL.busy=false; if(key!==FL.mid+FL.art+FL.q) return load(more);
      if(!r||!r.ok){ FL.err=true; FL.list=more?FL.list:[]; draw(); return; }
      FL.err=false; FL.list=more?FL.list.concat(r.liste||[]):(r.liste||[]); FL.off=FL.list.length; FL.mehr=!!r.mehr; if(!FL.q) FL.n[FL.art]=r.anzahl; draw();
    }
    const row=m=>`<div class="flex items-center gap-3 py-2">
      <button class="flex items-center gap-3 min-w-0 flex-1 text-left" onclick="closeSheet();openProfile(${+m.id})">
        <span class="w-11 h-11 rounded-full overflow-hidden shrink-0">${m.avatar_url?`<img src="${esc(m.avatar_url)}" alt="" class="w-full h-full object-cover">`:initAv(m.name||'?')}</span>
        <span class="min-w-0"><span class="block text-sm truncate">${nameRank(esc(m.name||''),RANKS[(m.rang||1)-1])}</span><span class="block text-xs text-muted truncate">${esc([m.rolle,m.stadt].filter(Boolean).join(' · '))}</span></span></button>
      ${m.ich?'<span class="text-xs text-muted pr-1">Du</span>':`<button class="${m.folge?'btn-ghost':'btn-gold'} text-sm shrink-0" style="padding:6px 14px;min-width:92px" onclick="APLUS_flTog(${+m.id},this)">${m.folge?'Gefolgt':'Folgen'}</button>`}</div>`;
    function draw(first){
      const tab=(a,l)=>`<button class="${FL.art===a?'btn-gold':'btn-ghost'} flex-1 text-sm" onclick="APLUS_flArt('${a}')">${l}${FL.n[a]!=null?' · '+FL.n[a]:''}</button>`;
      const body=FL.busy&&!FL.list.length?'<p class="text-sm text-muted py-6 text-center">Lädt …</p>'
        :FL.err?'<p class="text-sm text-muted py-6 text-center">Die Liste konnte gerade nicht geladen werden.</p>'
        :!FL.list.length?`<p class="text-sm text-muted py-6 text-center">${FL.q?'Niemand mit diesem Namen.':FL.art==='follower'?'Noch keine Follower.':'Folgt noch niemandem.'}</p>`
        :FL.list.map(row).join('')+(FL.mehr?`<button class="btn-ghost w-full text-sm mt-2" onclick="APLUS_flMore()">Mehr laden</button>`:'');
      const html=`<div class="flex items-center justify-between"><p class="font-semibold">${esc(FL.name?String(FL.name).split(' ')[0]:'Profil')}</p><button onclick="closeSheet()" class="text-muted text-xl" aria-label="Schließen"><svg class="ci"><use href="#i-schliessen"/></svg></button></div>
        <div class="flex gap-2">${tab('follower','Follower')}${tab('gefolgt','Gefolgt')}</div>
        ${(FL.n[FL.art]||0)>12||FL.q?`<input id="flQ" class="input text-sm" type="search" placeholder="Name suchen …" value="${esc(FL.q)}" oninput="APLUS_flQ(this.value)">`:''}
        <div id="flBody">${body}</div>`;
      const box=document.querySelector('#psheet > div');
      if(first||!box){ sheet(html); return; }
      const f=document.activeElement&&document.activeElement.id==='flQ', pos=f?document.activeElement.selectionStart:0;
      box.innerHTML=html; if(f){ const i=document.getElementById('flQ'); if(i){ i.focus(); try{ i.setSelectionRange(pos,pos); }catch(e){} } }
    }
    let qt=0;
    window.APLUS_flArt=a=>{ if(FL.art===a) return; Object.assign(FL,{art:a,q:'',off:0,list:[],mehr:false}); draw(); load(); };
    window.APLUS_flQ=v=>{ FL.q=String(v||'').slice(0,40); clearTimeout(qt); qt=setTimeout(()=>{ FL.off=0; load(); },250); };
    window.APLUS_flMore=()=>load(true);
    window.APLUS_flTog=async(id,b)=>{ b.disabled=true; let r=null; try{ r=await rpc('folgen_umschalten',{p_member:id}); }catch(e){} b.disabled=false;
      if(!r||!r.ok){ toastMsg&&toastMsg('Hat nicht geklappt. Versuch es gleich nochmal.'); return; }
      const m=FL.list.find(x=>+x.id===+id); if(m) m.folge=!!r.folge;
      if(S.member&&ME){ ME.following=Math.max(0,(+ME.following||0)+(r.folge?1:-1)); if(FL.mid===S.member.id) FL.n.gefolgt=Math.max(0,(+FL.n.gefolgt||0)+(r.folge?1:-1)); }
      S.flDirty=1; draw(); };
    const _cs=closeSheet; closeSheet=function(){ const r=_cs.apply(this,arguments); if(S.flDirty){ S.flDirty=0; if(route()==='mitglied'){ S.mp=null; } try{ render(); }catch(e){} } return r; };
  })();

  /* ---------- r26: Fremde Profile ohne Punkte- und Streak-Karte (Streak steht schon am Profilbild) ---------- */
  try{ if(typeof mpStats==='function') mpStats=function(){ return ''; }; }catch(e){}

  /* ---------- Start ---------- */
  document.documentElement.dataset.r=route();
  try{ render(); }catch(e){}
})();
