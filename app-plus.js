/* ===== ClosingHub App-Plus (r17 · Jobs am Handy + Glocke für Job-Benachrichtigungen) =====
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
  new MutationObserver(fixSoon).observe(document.body,{childList:true,subtree:true});
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
      const r=_dp.apply(this,arguments); plOpen(true); try{ plFit(); }catch(e){} try{ plMenu(); }catch(e){} try{ plSide(); }catch(e){} try{ plSound(keep); }catch(e){} try{
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
  mapPost=function(p){ const o=_mapPost.apply(this,arguments); try{ if(o&&p&&p.text&&p.text.includes('#')){ o.t=htHtml(p.text); o._ht=p.text; } }catch(e){} return o; };
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
    const offs=(typeof realOffers==='function'&&S.member?realOffers():[]).filter(o=>[o.t,o.cat,o.desc,o.full].join(' ').toLowerCase().includes(ql)).slice(0,6);
    const list=posts.map(mapPost);
    put(`<div data-q="~${esc2(q)}"></div>`+(S.member?sec('Mitglieder',mem.length?mem.map(m=>`<button class="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-panel" onclick="openProfile(${m.id})"><span class="w-11 h-11 rounded-full overflow-hidden shrink-0">${m.avatar_url?`<img src="${esc(m.avatar_url)}" class="w-full h-full object-cover">`:initAv(m.name)}</span><span class="min-w-0"><span class="block text-sm">${nameRank(esc(m.name),RANKS[(m.rang||1)-1])}</span><span class="text-xs text-muted">${esc([m.rolle,m.land].filter(Boolean).join(' · '))}</span></span></button>`).join(''):'<p class="text-sm text-muted">Kein Mitglied gefunden.</p>'):sec('Mitglieder','<p class="text-sm text-muted"><a href="#login" class="text-gold">Melde dich an</a>, um Mitglieder zu finden.</p>'))
      +(sug.length?sec('Hashtags',`<div class="ht-chips">${sug.map(s=>chip(s.tag,s.n)).join('')}</div>`):'')
      +(list.length?sec(`Beiträge mit #${esc2(t)}`,htGrid(list.slice(0,9))+(list.length>9?`<button class="text-sm text-gold mt-2" onclick="htOpen('${esc2(t)}')">Alle ${list.length} Beiträge ansehen</button>`:'')):'')
      +sec('Jobs',jobs.length?jobs.map(j=>`<button class="w-full text-left p-3 rounded-xl hover:bg-panel" onclick="S.job=${j.id};S.jopen=1;go('jobs')"><b class="text-sm block">${esc(j.t)}</b><span class="text-xs text-muted">${esc([j.ind,j.reg,j.pay].filter(Boolean).join(' · '))}</span></button>`).join(''):'<p class="text-sm text-muted">Kein Job gefunden.</p>')
      +(S.member?sec('Marktplatz',offs.length?offs.map(o=>`<button class="w-full text-left p-3 rounded-xl hover:bg-panel" onclick="S.mcat='${esc(o.cat).replace(/'/g,'')}';go('markt')"><b class="text-sm block">${o.t}</b><span class="text-xs text-muted">${esc(o.cat)} · ${esc(o.full||'')}</span></button>`).join(''):'<p class="text-sm text-muted">Kein Angebot gefunden.</p>'):'')); };
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

  /* ---------- Start ---------- */
  document.documentElement.dataset.r=route();
  try{ render(); }catch(e){}
})();
