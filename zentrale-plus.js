/* ===== ClosingHub Zentrale-Plus =====
   Menü in Kategorien, rote Zähler, Live-Aktualisierung alle 4 Sekunden, globale Suche,
   KI-Mitteilungen (automatische Analyse) und Affiliate-Programm.
   Einbinden: in zentrale.html vor </body>, NACH zentrale-news.js:  <script src="zentrale-plus.js"></script>
   Braucht: closinghub-zentrale-plus.sql */
(function(){
  if(window.ZP) return;
  const ZP = window.ZP = { prev:{}, busy:false, first:true, last:0, err:0, typed:0, click:0, hl:null, kiAt:0, kiErr:false };
  const RPC = (fn,b={}) => api('rpc/'+fn,{method:'POST',body:b});
  const LS = { get(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v); }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} } };

  /* ---------- Aussehen ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .side .bdg,.side a.on .bdg,.zp-grp .bdg{background:#e5484d!important;color:#fff!important;border-radius:999px;min-width:19px;height:19px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;line-height:1;margin-left:auto;box-shadow:0 0 0 2px var(--bg)}
  .zp-grp{display:flex;align-items:center;gap:6px;margin:14px 6px 4px;padding:4px 6px;border-radius:8px;cursor:pointer;user-select:none;font-size:11.5px;font-weight:700;letter-spacing:.04em;color:#7A8494}
  .zp-grp:hover{background:var(--bg2)}
  .zp-grp .zp-ch{font-size:10px;transition:transform .15s;opacity:.7}
  .zp-grp.zu .zp-ch{transform:rotate(-90deg)}
  .side .zp-items a{padding:8px 12px;font-size:14px}
  .side>.zp-grp:first-child{margin-top:2px}
  .zp-live{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);white-space:nowrap}
  .zp-live i{width:8px;height:8px;border-radius:50%;background:#2fb170;box-shadow:0 0 0 0 rgba(47,177,112,.6);animation:zpPuls 2s infinite}
  .zp-live.off i{background:#e0a100;animation:none}
  @keyframes zpPuls{0%{box-shadow:0 0 0 0 rgba(47,177,112,.55)}70%{box-shadow:0 0 0 7px rgba(47,177,112,0)}100%{box-shadow:0 0 0 0 rgba(47,177,112,0)}}
  .zp-sw{position:relative}
  .zp-sr{position:absolute;top:calc(100% + 6px);left:0;width:min(520px,92vw);max-height:70vh;overflow:auto;background:var(--bg);border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.18);z-index:60;padding:6px;display:none}
  .zp-sr.open{display:block}
  .zp-sr .c{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:8px 10px 4px}
  .zp-sr .r{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:9px;cursor:pointer}
  .zp-sr .r:hover,.zp-sr .r.sel{background:var(--bg2)}
  .zp-sr .r b{font-weight:600;display:block;font-size:13.5px}
  .zp-sr .r span{font-size:12px;color:var(--muted)}
  .zp-sr .nix{padding:14px;color:var(--muted);font-size:13px}
  .zp-sr mark{background:#ffe08a;color:inherit;border-radius:3px;padding:0 1px}
  .zp-kbd{font-size:10.5px;border:1px solid var(--line);border-radius:5px;padding:0 5px;color:var(--muted);margin-left:6px}
  .zp-hl{outline:2px solid #e0a100!important;outline-offset:3px;border-radius:10px;animation:zpHl 2.6s ease}
  @keyframes zpHl{0%{background:rgba(255,224,138,.55)}100%{background:transparent}}
  .zp-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}
  .zp-tbl{width:100%;border-collapse:collapse;font-size:13px}
  .zp-tbl th{text-align:left;font-size:11.5px;color:var(--muted);font-weight:600;padding:8px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
  .zp-tbl td{padding:9px 8px;border-bottom:1px solid var(--line);vertical-align:middle}
  .zp-tbl tr.k{cursor:pointer} .zp-tbl tr.k:hover td{background:var(--bg2)} .zp-tbl tr.on td{background:var(--bg2)}
  .zp-new{display:inline-block;background:#e5484d;color:#fff;border-radius:99px;font-size:10.5px;font-weight:700;padding:1px 6px;margin-left:6px}
  @media(max-width:1100px){ .zp-kpis{grid-template-columns:repeat(3,1fr)} }
  @media(max-width:820px){ .zp-grp{display:none} .zp-items,.zp-items[hidden]{display:contents!important} .zp-live b{display:none} .zp-kpis{grid-template-columns:1fr 1fr} }`;
  document.head.appendChild(css);

  /* ---------- Icons ---------- */
  Object.assign(I, {
    gift:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    news:'<path d="M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2"/><path d="M8 8h5M8 12h5M8 16h3"/>',
    chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    x:'<path d="M18 6L6 18M6 6l12 12"/>',
    store:'<path d="M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v7h14v-7"/>'
  });

  /* ---------- Menüpunkte ---------- */
  const navItem = id => NAV.find(n=>n.length>1&&n[0]===id);
  const setNav = (id,patch) => { const n=navItem(id); if(n) patch.forEach((v,i)=>{ if(v!==undefined) n[i]=v; }); };
  setNav('mitteilungen',[undefined,'KI-Mitteilungen','spark',()=>(D.ai||[]).filter(a=>a.st==='neu').length]);
  setNav('moderation',[undefined,'Prüfen & Meldungen','shield',()=>(D.meld||[]).filter(m=>(m.status||'offen')==='offen').length+(D.queue||[]).length+(D.reports||[]).length]);
  setNav('mitmachx',[undefined,'Mitmach-Karten','star',()=>{ if(!Array.isArray(D.mkz)) return 0; return ['dc','sd','wb','uf'].filter(t=>D.mkz.filter(c=>c.typ===t&&c.status==='warteschlange').length<3).length; }]);
  setNav('marktx',[undefined,'Marktplatz & Forum','store']);
  setNav('gewinnspiel',[undefined,'Start & Gewinnspiel','gift']);
  setNav('support',[undefined,'Support','support']);
  if(!navItem('affiliate')) NAV.push(['affiliate','Affiliates','link',()=>afNeu()]);
  if(!navItem('live')) NAV.push(['live','Live-Calls','bell',()=>lvOffen()]);

  const LAYOUT = [
    ['Übersicht',            ['dashboard','mitteilungen']],
    ['Launch & Wachstum',    ['gewinnspiel','affiliate','partner','news','anfragen']],
    ['Community & Feed',     ['live','feedx','mitmachx','marktx','punktex','moderation']],
    ['Mitglieder & Support', ['member','support']],
    ['Geschäft',             ['auftraggeber','rechnungen','laufband']],
    ['System',               ['inhalte','einstellungen']]
  ];
  const bval = n => { try{ const v=n[3]?n[3]():0; return v==null?0:v; }catch(e){ return 0; } };
  const bshow = v => v==='!'?'!':(+v>99?'99+':v);
  ZP.tog = g => { const zu=new Set(LS.get('zp_zu',[])); zu.has(g)?zu.delete(g):zu.add(g); LS.set('zp_zu',[...zu]); drawNav(); };

  drawNav = function(){
    const r=route(), zu=new Set(LS.get('zp_zu',[])), used=new Set(); let html='', total=0;
    const link = n => { const v=bval(n); if(typeof v==='number') total+=v; return `<a href="#${n[0]}" class="${r===n[0]?'on':''}">${ic(n[2])}<span>${n[1]}</span>${v&&v!=='0'?`<span class="bdg">${bshow(v)}</span>`:''}</a>`; };
    const group = (g,items) => {
      if(!items.length) return '';
      const open = !zu.has(g) || items.some(n=>n[0]===r);
      let sum=0, bang=false; items.forEach(n=>{ const v=bval(n); if(v==='!') bang=true; else sum+=(+v||0); });
      return `<div class="zp-grp ${open?'':'zu'}" onclick="ZP.tog('${g}')"><span class="zp-ch">▾</span><span>${g}</span>${!open&&(sum||bang)?`<span class="bdg">${sum?bshow(sum):'!'}</span>`:''}</div><div class="zp-items" ${open?'':'hidden'}>${items.map(link).join('')}</div>`;
    };
    LAYOUT.forEach(([g,ids])=>{ const items=ids.map(navItem).filter(Boolean); items.forEach(n=>used.add(n[0])); html+=group(g,items); });
    html+=group('Weitere', NAV.filter(n=>n.length>1&&!used.has(n[0])));
    $('side').innerHTML=html;
    document.title=(total?`(${total>99?'99+':total}) `:'')+'Zentrale · ClosingHub';
  };

  /* ---------- Live-Anzeige ---------- */
  const live = document.createElement('span'); live.className='zp-live'; live.innerHTML='<i></i><b>Live</b>';
  const top = document.querySelector('.top'), qIn = $('q');
  if(top && qIn) top.insertBefore(live, qIn);
  const liveDraw = () => { const ok=!ZP.err && Date.now()-ZP.last<15000; live.classList.toggle('off',!ok); live.title = ZP.last ? (ok?'Aktualisiert sich alle 4 Sekunden · zuletzt ':'Verbindung hakt · zuletzt ')+new Date(ZP.last).toLocaleTimeString('de-DE') : 'Wird geladen …'; live.style.visibility = SESSION?'':'hidden'; };

  /* ---------- Live-Aktualisierung ---------- */
  const fmtReq = r=>({ id:r.id, type:r.typ==='werbung'?'Werbung':r.typ==='sonstiges'?'Sonstiges':'Auftraggeber', name:r.firma ? `${r.firma} · ${r.name}` : r.name, email:r.email, text:r.nachricht||'', at:fmtAt(r.created_at), st:r.status });
  const SRC = [
    ['wl',   ()=>api('waitlist?select=*&order=created_at.desc'), r=>{ D.waitlist=r.map(w=>({ id:w.id, name:w.name, email:w.email, abo:w.abo, at:w.created_at, quelle:w.quelle||'', token:w.invite_token||null, member:w.member_id||null })); }],
    ['cr',   ()=>api('contact_requests?select=*&order=created_at.desc'), r=>{ D.requests=r.map(fmtReq); }],
    ['tix',  ()=>api('tickets?select=*&order=created_at.desc'), r=>{ D.tickets=r.map(t=>({ id:t.id, from:t.from_name, email:t.email, topic:t.topic, prio:t.prio, st:t.status, msgs:t.messages||[] })); }],
    ['inv',  ()=>api('invoices?select=*&order=created_at.desc'), r=>{ D.invoices=r.map(i=>({ id:i.id, no:i.no, date:i.created_at.slice(0,10), cust:i.customer, email:i.email||'', item:i.item, net:+i.net, vat:+i.vat, st:i.status, client_id:i.client_id??null })); }],
    ['ai',   ()=>api('ai_suggestions?select=*&order=created_at.desc'), r=>{ D.ai=r.map(a=>({ id:a.id, area:a.area||'Allgemein', title:a.title, text:a.text||'', why:a.why||'', impact:a.impact||'', st:a.status, t:fmtAt(a.created_at), regel:a.regel||'' })); }],
    ['jobs', ()=>api('jobs?select=*&order=created_at.desc'), r=>{ D.jobs=r; }],
    ['cl',   ()=>api('clients?select=*&order=created_at.desc'), r=>{ D.clients=r; }],
    ['mb',   ()=>api('members?select=*&order=created_at.desc'), r=>{ D.members=r; }],
    ['pf',   ()=>api('member_proofs?select=*&order=created_at.desc'), r=>{ D.proofs=r; }],
    ['meld', ()=>RPC('meldungen_liste'), r=>{ D.meld=r||[]; }],
    ['mx',   ()=>RPC('markt_antraege'), r=>{ D.mx=r||[]; }],
    ['pa',   ()=>RPC('partner_aufgaben_admin'), r=>{ D.pa=(r&&r.freigaben)?r:{off:1}; }],
    ['ptz',  ()=>RPC('punkte_admin'), r=>{ if(r&&r.regeln){ D.ptz=r; D.ptzErr=0; } }],
    ['mkz',  ()=>RPC('mitmach_admin_liste'), r=>{ D.mkz=r||[]; D.mkzErr=0; }],
    ['gwW',  ()=>RPC('gewinnspiel_gewinner_liste'), r=>{ D.gwW=r||[]; }],
    ['gwT',  ()=>RPC('gewinnspiel_teilnehmer'), r=>{ D.gwT=r||[]; }, ()=>route()==='gewinnspiel'],
    ['grz',  ()=>RPC('gluecksrad_admin'), r=>{ D.grz=r||{}; }, ()=>route()==='mitmachx'],
    ['chz',  ()=>RPC('challenge_admin'), r=>{ D.chz=r||null; }, ()=>route()==='punktex'],
    ['news', ()=>api('news_ausgaben?select=*&order=nummer.desc'), r=>{ if(window.NEWS) NEWS.list=r; }, ()=>!!window.NEWS],
    ['aff',  ()=>RPC('affiliate_admin'), r=>{ if(r&&r.ok){ AF.d=r; AF.err=0; } }],
    ['pt',   ()=>api('partners?select=*&order=sort.asc,id.asc'), r=>{ ptSet(r); }, ()=>route()!=='partner'],
    ['live', ()=>RPC('live_admin'), r=>{ if(r&&r.ok){ ZLV.d=r; ZLV.err=0; } }],
    ['fp',   ()=>api('posts?select=id,kategorie,ki_kategorie,text,media_url,media_typ,thumb_url,created_at,member_id,versteckt&order=created_at.desc&limit=80'), r=>{ D.fposts=r||[]; }, ()=>route()==='feedx']
  ];
  const sig = v => { const s=JSON.stringify(v); let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0; return s.length+':'+h; };
  function formDirty(){
    for(const el of document.querySelectorAll('#main input, #main textarea, #main select')){
      if(el.type==='checkbox'||el.type==='radio'){ if(el.checked!==el.defaultChecked) return true; }
      else if(el.tagName==='SELECT'){ for(const o of el.options) if(o.selected!==o.defaultSelected) return true; }
      else if(el.type!=='file' && el.value!==el.defaultValue) return true;
    }
    return false;
  }
  function canRedraw(){
    if(document.querySelector('.modal.open')) return false;
    if(['einstellungen','inhalte'].includes(route())) return false;
    const a=document.activeElement; if(a && a.closest && a.closest('#main') && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return false;
    const s=window.getSelection && getSelection(); if(s && String(s).trim() && s.anchorNode && $('main').contains(s.anchorNode)) return false;
    if(Date.now()-ZP.typed<15000 || Date.now()-ZP.click<1500) return false;
    if(formDirty()) return false;
    return true;
  }
  function redraw(){
    const m=$('main'), y=window.scrollY, det=[...m.querySelectorAll('details')].map(d=>d.open);
    const box=[...m.querySelectorAll('*')].filter(e=>e.scrollTop>0||e.scrollLeft>0).map(e=>[[...m.querySelectorAll(e.tagName)].indexOf(e),e.tagName,e.scrollTop,e.scrollLeft]);
    m.innerHTML=(PAGES[route()]||dashboard)();
    m.querySelectorAll('details').forEach((d,i)=>{ if(det[i]) d.open=true; });
    box.forEach(([i,t,st,sl])=>{ const e=m.querySelectorAll(t)[i]; if(e){ e.scrollTop=st; e.scrollLeft=sl; } });
    window.scrollTo(0,y);
  }
  async function poll(force){
    if(ZP.busy || !SESSION || !LOADED || (document.hidden && !force) || document.querySelector('.modal.open')) { liveDraw(); return; }
    ZP.busy=true;
    try{
      if(Date.now()-ZP.kiAt>10*60*1000){ ZP.kiAt=Date.now(); RPC('ki_analyse').then(()=>{ ZP.kiErr=false; }).catch(()=>{ ZP.kiErr=true; }); }
      const list=SRC.filter(s=>!s[3]||s[3]());
      const res=await Promise.allSettled(list.map(s=>s[1]()));
      let changed=false, fails=0;
      res.forEach((r,i)=>{ const s=list[i]; if(r.status!=='fulfilled'||r.value===undefined){ fails++; if(s[0]==='aff') AF.err=AF.err||1; return; }
        const g=sig(r.value); if(ZP.prev[s[0]]===g) return; ZP.prev[s[0]]=g; try{ s[2](r.value); changed=true; }catch(e){} });
      ZP.err = fails>=list.length ? 1 : 0; ZP.last=Date.now();
      if(changed){ drawNav(); if(!ZP.first && canRedraw()) redraw(); }
      ZP.first=false;
    }catch(e){ ZP.err=1; }
    finally{ ZP.busy=false; liveDraw(); }
  }
  ZP.poll=poll;
  setInterval(poll, 4000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) poll(); });
  document.addEventListener('input', e=>{ if(e.target.closest && e.target.closest('#main')) ZP.typed=Date.now(); }, true);
  document.addEventListener('click', e=>{ if(e.target.closest && e.target.closest('#main')) ZP.click=Date.now(); }, true);
  window.addEventListener('hashchange',()=>{ ZP.typed=0; });

  /* ---------- Nach jedem Rendern: Suchtreffer markieren ---------- */
  const _render = render;
  render = async function(){ const r=await _render.apply(this,arguments); try{ after(); }catch(e){} liveDraw(); return r; };
  function after(){
    if(route()==='affiliate') LS.set('zp_aff_seen', Date.now());
    if(!ZP.hl) return; const needle=String(ZP.hl).toLowerCase(); ZP.hl=null;
    setTimeout(()=>{
      const m=$('main'); let best=null;
      for(const sel of ['tr','.item','.card']){ for(const el of m.querySelectorAll(sel)){ if((el.textContent||'').toLowerCase().includes(needle)) best=el; } if(best) break; }
      if(best){ best.scrollIntoView({block:'center',behavior:'smooth'}); best.classList.add('zp-hl'); setTimeout(()=>best.classList.remove('zp-hl'),2700); }
    },60);
  }
  const go = (r,needle,prep) => { try{ prep&&prep(); }catch(e){} ZP.hl=needle||null; if(route()===r){ render(); } else location.hash=r; };

  /* ---------- Suche ---------- */
  if(qIn){
    const q2=qIn.cloneNode(true); q2.placeholder='Suchen: Member, Warteliste, Rechnung, Ticket, Affiliate …'; q2.autocomplete='off';
    const wrap=document.createElement('div'); wrap.className='zp-sw'; qIn.replaceWith(wrap); wrap.appendChild(q2);
    const box=document.createElement('div'); box.className='zp-sr'; wrap.appendChild(box);
    let hits=[], sel=0, tmr=null;
    const low = v => String(v??'').toLowerCase();
    const mk = (s,txt) => { const t=String(txt??''); const i=t.toLowerCase().indexOf(s); return i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+s.length))+'</mark>'+esc(t.slice(i+s.length)); };
    function find(s){
      const out=[], add=(cat,label,sub,fn,max=6)=>{ if(out.filter(h=>h.cat===cat).length<max) out.push({cat,label,sub,fn}); };
      const has=(...v)=>v.some(x=>low(x).includes(s));
      NAV.filter(n=>n.length>1).forEach(n=>{ if(has(n[1])) add('Bereiche',n[1],'Öffnen',()=>go(n[0])); });
      (D.members||[]).forEach(m=>{ if(has(m.name,m.email,m.instagram,m.ort)) add('Member',m.name||m.email,[m.email,m.abo].filter(Boolean).join(' · '),()=>go('member',m.email||m.name,()=>{ mbSel=m.id; mbQ=''; })); });
      (D.waitlist||[]).forEach(w=>{ if(has(w.name,w.email,w.quelle)) add('Warteliste',w.name,[w.email,w.abo,typeof quelleLabel==='function'?quelleLabel(w.quelle):w.quelle].filter(Boolean).join(' · '),()=>go('anfragen',w.email,()=>{ reqTab='warteliste'; })); });
      (D.requests||[]).forEach(r=>{ if(has(r.name,r.email,r.text)) add('Anfragen',r.name,[r.type,r.email,r.st].filter(Boolean).join(' · '),()=>go('anfragen',r.email,()=>{ reqTab='anfragen'; })); });
      (D.tickets||[]).forEach(t=>{ if(has(t.from,t.email,t.topic,(t.msgs||[]).map(x=>x&&x.text).join(' '))) add('Support',t.topic,[t.from,t.st].filter(Boolean).join(' · '),()=>go('support',t.topic,()=>{ tSel=t.id; })); });
      (D.invoices||[]).forEach(i=>{ if(has(i.no,i.cust,i.email,i.item)) add('Rechnungen',i.no+' · '+i.cust,[i.item,eur(gross(i)),i.st].join(' · '),()=>go('rechnungen',i.no,()=>{ invQ=i.no; invFilter='alle'; })); });
      (D.clients||[]).forEach(c=>{ if(has(c.firma,c.name,c.email,c.kontakt_name,c.ansprechpartner)) add('Auftraggeber',c.firma||c.name||c.email,[c.email,c.status].filter(Boolean).join(' · '),()=>go('auftraggeber',c.firma||c.name||c.email,()=>{ clSel=c.id; clQ=''; })); });
      (D.jobs||[]).forEach(j=>{ if(has(j.titel,j.firma,j.kontakt_name,j.kontakt_email,j.branche)) add('Stellen',j.titel||j.firma||'Anfrage',[j.firma,j.status].filter(Boolean).join(' · '),()=>go('auftraggeber',j.titel||j.firma,()=>{ if(['anfrage','entwurf','freigabe','live','beendet'].includes(j.status)) jobTab=j.status; })); });
      (D.partners||[]).forEach(p=>{ const n=p.n||p.name||(p._row&&p._row.invite_email)||''; if(has(n,p._row&&p._row.invite_email,p.firma)) add('Partner',n||'Partner',[p._st,p._row&&p._row.invite_email].filter(Boolean).join(' · '),()=>go('partner',n)); });
      ((AF.d&&AF.d.affiliates)||[]).forEach(a=>{ if(has(a.name,a.code,a.email,a.instagram,a.kanal)) add('Affiliates',a.name,['?ref='+a.code,a.anmeldungen+' Anmeldungen',a.status].join(' · '),()=>go('affiliate',null,()=>{ AF.sel=a.id; AF.edit=null; })); });
      (D.gwT||[]).forEach(t=>{ if(has(t.name,t.email,t.insta)) add('Gewinnspiel',t.name,['@'+(t.insta||'–'),t.voll?'im Lostopf':'unvollständig'].join(' · '),()=>go('gewinnspiel',t.insta||t.name)); });
      (D.mkz||[]).forEach(c=>{ const d=c.daten||{}, t=d.einwand||d.frage||d.a; if(has(t,d.b)) add('Mitmach-Karten',String(t).slice(0,80),[(typeof MKZ!=='undefined'?MKZ:{})[c.typ]||c.typ,c.status].join(' · '),()=>go('mitmachx',null,()=>{ D.mkTab=c.typ; D.mkEdit=null; })); });
      return out;
    }
    function draw(){
      const s=low(q2.value.trim());
      if(s.length<2){ box.classList.remove('open'); hits=[]; return; }
      hits=find(s); sel=Math.min(sel,Math.max(hits.length-1,0));
      if(!hits.length){ box.innerHTML='<div class="nix">Nichts gefunden für „'+esc(q2.value.trim())+'“</div>'; box.classList.add('open'); return; }
      let h='', cat='';
      hits.forEach((x,i)=>{ if(x.cat!==cat){ cat=x.cat; h+=`<div class="c">${esc(cat)}</div>`; } h+=`<div class="r ${i===sel?'sel':''}" data-i="${i}"><div style="min-width:0"><b>${mk(s,x.label)}</b><span>${mk(s,x.sub)}</span></div></div>`; });
      box.innerHTML=h; box.classList.add('open');
    }
    const pick = i => { const x=hits[i]; if(!x) return; box.classList.remove('open'); q2.value=''; hits=[]; q2.blur(); x.fn(); };
    q2.addEventListener('input',()=>{ sel=0; clearTimeout(tmr); tmr=setTimeout(draw,90); });
    q2.addEventListener('focus',draw);
    q2.addEventListener('keydown',e=>{
      if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1,hits.length-1); draw(); box.querySelector('.r.sel')?.scrollIntoView({block:'nearest'}); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(sel-1,0); draw(); box.querySelector('.r.sel')?.scrollIntoView({block:'nearest'}); }
      else if(e.key==='Enter'){ e.preventDefault(); if(!hits.length) draw(); pick(sel); }
      else if(e.key==='Escape'){ box.classList.remove('open'); q2.blur(); }
    });
    box.addEventListener('mousedown',e=>{ const r=e.target.closest('.r'); if(r){ e.preventDefault(); pick(+r.dataset.i); } });
    document.addEventListener('click',e=>{ if(!wrap.contains(e.target)) box.classList.remove('open'); });
    document.addEventListener('keydown',e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'&&SESSION){ e.preventDefault(); q2.focus(); q2.select(); } });
  }

  /* ---------- KI-Mitteilungen ---------- */
  const KI_ZIEL = { support_offen:'support', anfragen_neu:'anfragen', jobs_anfrage:'auftraggeber', nachweise_offen:'member', meldungen_offen:'moderation', forum_offen:'marktx', markt_antraege:'marktx', mitmach_leer:'mitmachx', warteliste_rueckgang:'anfragen', warteliste_schub:'anfragen', launch_vorbereitung:'gewinnspiel', gewinnspiel_fast:'gewinnspiel', rechnungen_alt:'rechnungen', basic_upgrade:'member', feed_still:'feedx', affiliate_still:'affiliate', partner_freigabe:'partner' };
  ZP.kiJetzt = async b => { b.disabled=true; b.textContent='Analysiere …'; try{ const r=await RPC('ki_analyse'); ZP.kiErr=false; ZP.kiAt=Date.now(); await poll(true); render(); toast(r&&r.neu?r.neu+' neue Mitteilung'+(r.neu===1?'':'en'):'Analyse fertig – nichts Neues'); }catch(e){ ZP.kiErr=true; render(); toast('Analyse noch nicht eingerichtet: closinghub-zentrale-plus.sql ausführen'); } };
  PAGES.mitteilungen = function(){
    const F=['neu','später','übernommen','abgelehnt','erledigt','alle'];
    if(!F.includes(aiFilter)) aiFilter='neu';
    const list=(D.ai||[]).filter(a=>aiFilter==='alle'||a.st===aiFilter);
    const lbl=f=>({neu:'Neu',später:'Später',übernommen:'Erledigt',abgelehnt:'Ignoriert',erledigt:'Automatisch erledigt',alle:'Alle'})[f];
    return `<div class="row between" style="align-items:flex-start;gap:12px;flex-wrap:wrap"><div><h1 class="h1">KI-Mitteilungen</h1><p class="sub" style="max-width:720px">Die Zentrale prüft automatisch Support, Anfragen, Jobs, Nachweise, Community, Feed, Warteliste, Gewinnspiel, Affiliates und Partner und sagt dir, was gerade wichtig ist. Das läuft alle 15 Minuten und jedes Mal, wenn die Zentrale offen ist. Was sich erledigt hat, verschwindet von selbst.</p></div>
      <button class="btn gold-b" onclick="ZP.kiJetzt(this)">${ic('spark',15)} Jetzt analysieren</button></div>
    <div class="tabs">${F.map(f=>`<button class="${aiFilter===f?'on':''}" onclick="aiFilter='${f}';render()">${lbl(f)} ${f!=='alle'?`<span class="muted">${(D.ai||[]).filter(a=>a.st===f).length}</span>`:''}</button>`).join('')}</div>
    <div class="grid">${list.length?list.map(a=>{ const ziel=KI_ZIEL[a.regel]; return `<div class="card"><div class="row between"><div class="row"><span class="pill p-gold">${esc(a.area)}</span><span class="muted" style="font-size:12px">${esc(a.t)}</span></div>${pill(a.st)}</div>
      <h3 style="font-size:16px;margin:10px 0 4px">${esc(a.title)}</h3><p>${esc(a.text)}</p>
      <div class="grid g2" style="margin-top:12px;gap:10px"><div style="background:var(--bg2);border-radius:10px;padding:10px 12px"><div class="muted" style="font-size:11px">WARUM</div>${esc(a.why)}</div><div style="background:var(--bg2);border-radius:10px;padding:10px 12px"><div class="muted" style="font-size:11px">ERWARTETE WIRKUNG</div><span class="up">${esc(a.impact)}</span></div></div>
      <div class="row" style="margin-top:14px;flex-wrap:wrap">${ziel?`<a class="btn sm" href="#${ziel}">Zum Bereich →</a>`:''}${a.st==='neu'||a.st==='später'?`<button class="btn gold-b sm" onclick="aiSet(${a.id},'übernommen')">${ic('check',14)} Erledigt</button><button class="btn sm" onclick="aiSet(${a.id},'später')">Später</button><button class="btn sm red" onclick="aiSet(${a.id},'abgelehnt')">${ic('x',14)} Ignorieren</button>`:`<button class="btn sm" onclick="aiSet(${a.id},'neu')">Zurück in „Neu“</button>`}</div>
    </div>`; }).join(''):`<div class="card empty">${ZP.kiErr&&!(D.ai||[]).length?'Die automatische Analyse ist noch nicht eingerichtet. Führe einmal <b>closinghub-zentrale-plus.sql</b> in Supabase aus.':aiFilter==='neu'?'Gerade gibt es nichts zu tun. 👌 Sobald etwas Wichtiges passiert, erscheint es hier.':'Keine Mitteilungen in diesem Bereich.'}</div>`}</div>`;
  };

  /* ---------- Affiliate-Programm ---------- */
  const AF = window.AF = { d:undefined, sel:null, edit:null, err:0, pre:null };
  function afNeu(){ const seen=LS.get('zp_aff_seen', Date.now()-864e5); return ((AF.d&&AF.d.anmeldungen)||[]).filter(a=>new Date(a.created_at).getTime()>seen).length; }
  async function afLoad(){ try{ const r=await RPC('affiliate_admin'); if(r&&r.ok){ AF.d=r; AF.err=0; } else { AF.d={}; AF.err=1; } }catch(e){ AF.d={}; AF.err=1; } if(route()==='affiliate') render(); else drawNav(); }
  const SITE='https://www.getclosinghub.com/?ref=';
  const slug = s => String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'').slice(0,20);
  const num = v => (+v||0).toLocaleString('de-DE');
  const abo = a => ({plus:'Plus',premium:'Premium',dayone:'Day One',basic:'Basic'}[a]||a||'–');
  ZP.afCopy = c => { navigator.clipboard.writeText(SITE+c).then(()=>toast('Link kopiert')); };
  ZP.afSel = id => { AF.sel = AF.sel===id?null:id; AF.edit=null; render(); };
  ZP.afEdit = id => { AF.edit=id||0; AF.pre=null; render(); setTimeout(()=>{ const e=$('af-name'); if(e) e.focus(); },30); };
  ZP.afFromCode = c => { AF.edit=0; AF.pre={code:c}; render(); setTimeout(()=>{ const e=$('af-name'); if(e) e.focus(); },30); };
  ZP.afSlug = () => { const c=$('af-code'); if(c && !c.dataset.manual) c.value=slug($('af-name').value); };
  ZP.afSave = async b => {
    const v=k=>{ const e=$('af-'+k); return e?e.value.trim():''; };
    const p={ name:v('name'), code:v('code').toLowerCase(), email:v('email'), instagram:v('instagram').replace(/^@/,''), kanal:v('kanal'), provision_jahr1:v('p1'), provision_danach:v('p2'), status:v('status'), notiz:v('notiz') };
    if(p.name.length<2) return toast('Bitte einen Namen eintragen');
    if(!/^[a-z0-9_-]{2,24}$/.test(p.code)) return toast('Code: 2–24 Zeichen, nur a–z, 0–9, - und _');
    b.disabled=true;
    try{ const r=await RPC('affiliate_speichern',{p_id:AF.edit||null,p});
      if(!r||!r.ok){ toast(r&&r.grund==='vergeben'?'Dieser Code ist schon vergeben':r&&r.grund==='code'?'Code ungültig':'Speichern hat nicht geklappt'); b.disabled=false; return; }
      toast(AF.edit?'Gespeichert':'Affiliate angelegt – Link ist sofort aktiv'); AF.sel=r.id; AF.edit=null; AF.pre=null; ZP.typed=0; await afLoad(); }
    catch(e){ b.disabled=false; toast('Speichern hat nicht geklappt'); }
  };
  ZP.afPay = async (b,aid) => {
    const m=$('ap-monat').value, betrag=parseFloat(String($('ap-betrag').value).replace(',','.')), st=$('ap-status').value, n=$('ap-notiz').value;
    if(!m||!(betrag>=0)) return toast('Monat und Betrag eintragen');
    b.disabled=true;
    try{ const r=await RPC('affiliate_auszahlung_speichern',{p_id:null,p_affiliate:aid,p_monat:m+'-01',p_betrag:betrag,p_status:st,p_notiz:n}); if(!r||!r.ok) throw 0; toast('Auszahlung eingetragen'); ZP.typed=0; await afLoad(); }
    catch(e){ b.disabled=false; toast('Hat nicht geklappt'); }
  };
  ZP.afPaid = async (id,b) => { b.disabled=true; const z=((AF.d&&AF.d.auszahlungen)||[]).find(x=>x.id===id); if(!z) return;
    try{ const r=await RPC('affiliate_auszahlung_speichern',{p_id:id,p_affiliate:z.affiliate_id,p_monat:z.monat,p_betrag:+z.betrag,p_status:'ausgezahlt',p_notiz:z.notiz||''}); if(!r||!r.ok) throw 0; toast('Als ausgezahlt markiert'); await afLoad(); }catch(e){ b.disabled=false; toast('Hat nicht geklappt'); } };

  function afForm(a){
    a = a || AF.pre || {};
    const f=(k,l,val,ph,extra='')=>`<label class="f">${l}<input class="in" id="af-${k}" value="${esc(val??'')}" placeholder="${esc(ph||'')}" ${extra}></label>`;
    return `<div class="card"><h3 style="margin:0 0 10px">${AF.edit?'Affiliate bearbeiten':'Neuer Affiliate'}</h3>
      <div class="grid g2" style="gap:10px">
        ${f('name','Name *',a.name,'z. B. Max Mustermann','oninput="ZP.afSlug()"')}
        ${f('code','Code für den Link *',a.code||'','z. B. maxsales','oninput="this.dataset.manual=1;this.value=this.value.toLowerCase()" '+(a.code?'data-manual="1"':''))}
        ${f('email','E-Mail',a.email,'')}
        ${f('instagram','Instagram',a.instagram?'@'+a.instagram:'','@name')}
        ${f('kanal','Kanal / Reichweite',a.kanal,'z. B. Instagram, 25k Follower')}
        <label class="f">Status<select class="in" id="af-status">${['aktiv','pausiert','beendet'].map(s=>`<option value="${s}" ${(a.status||'aktiv')===s?'selected':''}>${s[0].toUpperCase()+s.slice(1)}</option>`).join('')}</select></label>
        ${f('p1','Provision 1. Jahr (%)',a.provision_jahr1??25,'','type="number" min="0" max="100" step="0.5"')}
        ${f('p2','Provision danach (%)',a.provision_danach??10,'','type="number" min="0" max="100" step="0.5"')}
      </div>
      <label class="f" style="margin-top:10px">Notiz (intern)<textarea class="in" id="af-notiz" rows="2">${esc(a.notiz||'')}</textarea></label>
      <p class="muted" style="font-size:12px;margin:8px 0 0">Link: <b>${SITE}${esc(a.code||'code')}</b> · Wer sich darüber auf der Warteliste einträgt, wird automatisch diesem Affiliate zugeordnet.</p>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px">${AF.edit!==null?'<button class="btn" onclick="AF.edit=null;AF.pre=null;ZP.typed=0;render()">Abbrechen</button>':''}<button class="btn gold-b" onclick="ZP.afSave(this)">${AF.edit?'Speichern':'Affiliate anlegen'}</button></div></div>`;
  }
  function afDetail(a){
    const anm=((AF.d.anmeldungen)||[]).filter(x=>x.affiliate_id===a.id), pays=((AF.d.auszahlungen)||[]).filter(x=>x.affiliate_id===a.id);
    const monat=new Date().toISOString().slice(0,7);
    return `<div class="card" style="margin-top:16px;border-color:var(--gold)"><div class="row between" style="flex-wrap:wrap;gap:10px"><div><h3 style="margin:0">${esc(a.name)} <span class="pill ${a.status==='aktiv'?'p-ok':a.status==='pausiert'?'p-warn':'p-bad'}" style="margin-left:6px">${esc(a.status)}</span></h3>
        <p class="muted" style="font-size:12.5px;margin:4px 0 0">${[a.email,a.instagram?'@'+a.instagram:'',a.kanal].filter(Boolean).map(esc).join(' · ')||'Keine Kontaktdaten'}</p></div>
      <div class="row" style="gap:6px"><button class="btn sm" onclick="ZP.afCopy('${esc(a.code)}')">${ic('link',13)} Link kopieren</button><button class="btn sm" onclick="ZP.afEdit(${a.id})">${ic('pen',13)} Bearbeiten</button><button class="btn sm" onclick="ZP.afSel(${a.id})">Schließen</button></div></div>
      <p style="margin:10px 0 0;font-size:13px"><code>${SITE}${esc(a.code)}</code></p>
      ${a.notiz?`<p class="muted" style="font-size:12.5px;margin-top:6px;white-space:pre-wrap">${esc(a.notiz)}</p>`:''}
      <div class="grid g3" style="gap:10px;margin-top:12px">
        <div style="background:var(--bg2);border-radius:10px;padding:10px 12px"><div class="muted" style="font-size:11px">ANMELDUNGEN</div><b style="font-size:20px">${num(a.anmeldungen)}</b> <span class="muted" style="font-size:12px">· ${num(a.anmeldungen_7)} in 7 Tagen</span></div>
        <div style="background:var(--bg2);border-radius:10px;padding:10px 12px"><div class="muted" style="font-size:11px">MITGLIEDER / ZAHLEND</div><b style="font-size:20px">${num(a.mitglieder)} / ${num(a.zahlend)}</b> <span class="muted" style="font-size:12px">· ${num(a.dayone)} Day One</span></div>
        <div style="background:var(--bg2);border-radius:10px;padding:10px 12px"><div class="muted" style="font-size:11px">PROVISION / MONAT (GESCHÄTZT)</div><b style="font-size:20px">${eur(a.provision_monat)}</b> <span class="muted" style="font-size:12px">· ${num(a.provision_jahr1)} % / ${num(a.provision_danach)} %</span></div></div>
      <div class="grid g2" style="gap:16px;margin-top:16px">
        <div><h4 style="margin:0 0 6px">Anmeldungen über den Link</h4>${anm.length?`<div style="max-height:300px;overflow:auto"><table class="zp-tbl"><thead><tr><th>Name</th><th>Eingetragen</th><th>Status</th></tr></thead><tbody>${anm.map(x=>`<tr><td><b>${esc(x.name)}</b><div class="muted" style="font-size:11.5px">${esc(x.email)}</div></td><td>${new Date(x.created_at).toLocaleDateString('de-DE')}</td><td>${x.mitglied_abo?`<span class="pill ${['plus','premium'].includes(x.mitglied_abo)?'p-ok':''}">${abo(x.mitglied_abo)}</span>`:'<span class="muted">Warteliste</span>'}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted" style="font-size:13px">Noch keine Anmeldungen über diesen Link.</p>'}</div>
        <div><h4 style="margin:0 0 6px">Auszahlungen</h4>
          ${pays.length?pays.map(z=>`<div class="item" style="align-items:center"><div style="flex:1"><b>${new Date(z.monat).toLocaleDateString('de-DE',{month:'long',year:'numeric'})}</b> · ${eur(z.betrag)}${z.notiz?`<div class="muted" style="font-size:12px">${esc(z.notiz)}</div>`:''}</div>${z.status==='ausgezahlt'?'<span class="pill p-ok">ausgezahlt</span>':`<span class="pill p-warn">offen</span><button class="btn sm" style="margin-left:6px" onclick="ZP.afPaid(${z.id},this)">✓ Ausgezahlt</button>`}</div>`).join(''):'<p class="muted" style="font-size:13px">Noch keine Auszahlungen.</p>'}
          <div class="row" style="gap:8px;margin-top:10px;align-items:flex-end;flex-wrap:wrap">
            <label class="f" style="flex:1;min-width:120px">Monat<input class="in" type="month" id="ap-monat" value="${monat}"></label>
            <label class="f" style="flex:1;min-width:90px">Betrag (€)<input class="in" id="ap-betrag" value="${(+a.provision_monat||0).toFixed(2).replace('.',',')}"></label>
            <label class="f" style="flex:1;min-width:110px">Status<select class="in" id="ap-status"><option value="offen">Offen</option><option value="ausgezahlt">Ausgezahlt</option></select></label>
            <label class="f" style="flex:2;min-width:140px">Notiz<input class="in" id="ap-notiz" placeholder="optional"></label>
            <button class="btn gold-b" onclick="ZP.afPay(this,${a.id})">Eintragen</button></div>
          <p class="muted" style="font-size:11.5px;margin-top:6px">Vorschlag = geschätzte Provision dieses Monats.</p></div></div></div>`;
  }
  PAGES.affiliate = function(){
    if(AF.d===undefined){ AF.d=null; afLoad(); }
    const head=`<div class="row between" style="align-items:flex-start;gap:12px;flex-wrap:wrap"><div><h1 class="h1">Affiliate-Programm</h1><p class="sub" style="max-width:760px">Jeder Affiliate bekommt einen eigenen Link (<b>getclosinghub.com/?ref=CODE</b>). Wer sich darüber auf der Warteliste einträgt, wird automatisch zugeordnet. Provision: 25 % im ersten Jahr, danach dauerhaft 10 % (pro Affiliate änderbar).</p></div>
      <button class="btn gold-b" onclick="ZP.afEdit(0)">+ Affiliate anlegen</button></div>`;
    if(AF.d===null) return head+'<p class="muted">Lade …</p>';
    if(AF.err && !(AF.d.affiliates)) return head+'<div class="card empty">Fehlt noch: Führe einmal <b>closinghub-zentrale-plus.sql</b> in Supabase aus. Danach erscheint hier die Übersicht.</div>';
    const L=AF.d.affiliates||[], akt=L.filter(a=>a.status==='aktiv'), sum=k=>L.reduce((s,a)=>s+(+a[k]||0),0), pr=AF.d.preise||{}, seen=LS.get('zp_aff_seen',Date.now()-864e5);
    const neuVon=id=>((AF.d.anmeldungen)||[]).filter(x=>x.affiliate_id===id&&new Date(x.created_at).getTime()>seen).length;
    const kpi=(l,v,s)=>`<div class="card kpi"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="muted" style="font-size:12px;margin-top:2px">${s}</div>`:''}</div>`;
    const sel=L.find(a=>a.id===AF.sel), ed=AF.edit?L.find(a=>a.id===AF.edit):null, free=AF.d.freie_codes||[];
    return head+`<div class="zp-kpis">
        ${kpi('Aktive Affiliates',num(akt.length),L.length-akt.length?`${L.length-akt.length} pausiert/beendet`:'')}
        ${kpi('Anmeldungen',num(sum('anmeldungen')),`${num(sum('anmeldungen_7'))} in den letzten 7 Tagen`)}
        ${kpi('Mitglieder / zahlend',num(sum('mitglieder'))+' / '+num(sum('zahlend')),`${num(sum('dayone'))} Day One · ${num(sum('basic'))} Basic`)}
        ${kpi('Provision / Monat',eur(sum('provision_monat')),'geschätzt aus aktuellen Abos')}
        ${kpi('Offene Auszahlungen',eur(sum('offen')),`${eur(sum('ausgezahlt'))} schon ausgezahlt`)}</div>
      <div class="grid" style="grid-template-columns:${AF.edit!==null?'minmax(0,1.6fr) minmax(0,1fr)':'1fr'};gap:16px;align-items:start">
        <div class="card" style="padding:0;overflow:hidden">${L.length?`<div style="overflow:auto"><table class="zp-tbl"><thead><tr><th style="padding-left:16px">Affiliate</th><th>Link</th><th>Anmeldungen</th><th>Mitglieder</th><th>Zahlend</th><th>Provision/Monat</th><th>Status</th></tr></thead><tbody>
          ${L.map(a=>{ const n=neuVon(a.id); return `<tr class="k ${AF.sel===a.id?'on':''}" onclick="ZP.afSel(${a.id})"><td style="padding-left:16px"><b>${esc(a.name)}</b>${n?`<span class="zp-new">+${n} neu</span>`:''}<div class="muted" style="font-size:11.5px">${esc(a.instagram?'@'+a.instagram:a.kanal||a.email||'')}</div></td>
            <td><button class="btn sm" onclick="event.stopPropagation();ZP.afCopy('${esc(a.code)}')" title="${SITE}${esc(a.code)}">?ref=${esc(a.code)}</button></td>
            <td><b>${num(a.anmeldungen)}</b>${a.anmeldungen_24?`<span class="muted" style="font-size:11.5px"> · +${num(a.anmeldungen_24)} heute</span>`:''}</td><td>${num(a.mitglieder)}</td><td>${num(a.zahlend)}</td><td><b>${eur(a.provision_monat)}</b></td>
            <td><span class="pill ${a.status==='aktiv'?'p-ok':a.status==='pausiert'?'p-warn':'p-bad'}">${esc(a.status)}</span></td></tr>`; }).join('')}</tbody></table></div>`
          :'<div class="empty" style="padding:28px">Noch keine Affiliates. Leg den ersten mit „+ Affiliate anlegen“ an. Sein Link ist sofort aktiv.</div>'}</div>
        ${AF.edit!==null?afForm(ed):''}
      </div>
      ${sel?afDetail(sel):''}
      ${free.length?`<div class="card" style="margin-top:16px"><h3 style="margin:0 0 6px">Links ohne Affiliate</h3><p class="muted" style="font-size:12.5px;margin:0 0 10px">Über diese ?ref-Codes haben sich Leute eingetragen, es gibt aber noch keinen Affiliate dazu. Lege ihn an, dann werden die Anmeldungen automatisch nachgetragen.</p>
        ${free.map(c=>`<div class="item" style="align-items:center"><div style="flex:1"><b>?ref=${esc(c.code)}</b> <span class="muted" style="font-size:12.5px">· ${num(c.anzahl)} Anmeldung${+c.anzahl===1?'':'en'}</span></div><button class="btn sm" onclick="ZP.afFromCode('${esc(c.code)}')">Als Affiliate anlegen</button></div>`).join('')}</div>`:''}
      <p class="muted" style="font-size:12px;margin-top:14px">Provision geschätzt mit den aktuellen Abo-Preisen (Plus ${eur(pr.plus||0)}, Premium ${eur(pr.premium||0)} pro Monat), bis die Zahlungen über Stripe laufen. Day-One-Mitglieder zählen erst, wenn sie bezahlen.</p>`;
  };

  /* ---------- Live-Calls (Runde 22) ----------
     Partner-Vorträge (nur Premium, mit Fragen) und Motivations-Call (ab Plus, ohne Chat).
     In der App erscheint 15 Minuten vor Start ein fester Balken oben, bis der Call vorbei ist. */
  const LV = window.ZLV = { d:undefined, edit:null, err:0 };
  const lvT = x => new Date(x).getTime();
  const lvDT = x => new Date(x).toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const lvHM = x => new Date(x).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
  const lvP2 = n => String(n).padStart(2,'0');
  const lvOffen = () => { const d=LV.d; if(!d||!d.fragen) return 0; const t=Date.now(); const lauf=new Set((d.termine||[]).filter(x=>lvT(x.s)-9e5<=t&&lvT(x.e)>t).map(x=>x.event_id+'|'+x.termin)); return d.fragen.filter(f=>f.status==='offen'&&lauf.has(f.event_id+'|'+f.termin)).length; };
  async function lvLoad(){ try{ const r=await RPC('live_admin'); if(r&&r.ok){ LV.d=r; LV.err=0; } else { LV.d=LV.d||{}; LV.err=1; } }catch(e){ LV.d=LV.d||{}; LV.err=1; } if(route()==='live') render(); else drawNav(); }
  ZP.lvEdit = id => { LV.edit=id; ZP.typed=0; render(); };
  const LV_WT=['Mo','Di','Mi','Do','Fr','Sa','So'];
  const LV_NR={'1':'1.','2':'2.','3':'3.','4':'4.','-1':'letzten','0':'gleichen Datum'};
  const lvIso = d => { const x=new Date(d); return x.getFullYear()+'-'+lvP2(x.getMonth()+1)+'-'+lvP2(x.getDate()); };
  // Klartext der Wiederholung, z. B. "Jeden Di · alle 2 Wochen"
  function lvRegel(e){
    const wd0=((new Date(e.start_at).getDay()+6)%7)+1, tage=(e.tage&&e.tage.length?e.tage:[wd0]);
    let t = ({einmal:'Einmalig',taeglich:'Jeden Tag',werktags:'Mo–Fr'})[e.wiederholung];
    if(e.wiederholung==='woechentlich') t=(+e.alle_wochen>1?'Alle '+e.alle_wochen+' Wochen ':'Jeden ')+tage.map(n=>LV_WT[n-1]).join(', ');
    if(e.wiederholung==='monatlich') t= !+e.monat_nr ? 'Monatlich am '+new Date(e.start_at).getDate()+'.' : 'Jeden '+LV_NR[String(e.monat_nr)]+' '+LV_WT[(tage[0]||wd0)-1]+' im Monat';
    if(e.bis) t+=' bis '+new Date(e.bis).toLocaleDateString('de-DE');
    if(e.ausfall&&e.ausfall.length) t+=' · '+e.ausfall.length+' Ausfall'+(e.ausfall.length>1?'tage':'tag');
    return t||e.wiederholung;
  }
  // Gleiche Regeln wie live_termine in der Datenbank, für die Vorschau im Formular
  function lvVorschau(p,n){
    const s0=new Date(p.start_at); if(isNaN(s0)) return [];
    const d0=new Date(s0.getFullYear(),s0.getMonth(),s0.getDate()), bis=p.bis?new Date(p.bis+'T23:59'):null, out=[];
    const wd=d=>((d.getDay()+6)%7)+1, tage=p.tage&&p.tage.length?p.tage.map(Number):[wd(d0)], wk0=new Date(d0); wk0.setDate(d0.getDate()-(wd(d0)-1));
    const today=new Date(); today.setHours(0,0,0,0);
    for(let i=0;i<800&&out.length<n;i++){
      const d=new Date(d0); d.setDate(d0.getDate()+i); if(bis&&d>bis) break;
      const iso=lvIso(d); if((p.ausfall||[]).includes(iso)) continue;
      let ok=false; const w=wd(d);
      if(p.wiederholung==='einmal') ok=i===0;
      else if(p.wiederholung==='taeglich') ok=true;
      else if(p.wiederholung==='werktags') ok=w<6;
      else if(p.wiederholung==='woechentlich') ok=tage.includes(w) && (Math.floor(Math.round((d-wk0)/864e5)/7)%Math.max(1,+p.alle_wochen||1))===0;
      else if(p.wiederholung==='monatlich'){ const nr=+p.monat_nr||0; const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
        if(nr===0) ok=d.getDate()===Math.min(d0.getDate(),last); else if(nr===-1) ok=w===tage[0]&&d.getDate()+7>last; else ok=w===tage[0]&&Math.ceil(d.getDate()/7)===nr; }
      if(ok && d>=today){ const s=new Date(d); s.setHours(s0.getHours(),s0.getMinutes(),0,0); out.push(s); }
      if(p.wiederholung==='einmal') break;
    }
    return out;
  }
  function lvLesen(){
    const g=id=>{ const e=$(id); return e?(e.type==='checkbox'?e.checked:e.value.trim()):''; };
    const d=g('lv-d'), t=g('lv-t'), w=g('lv-wdh');
    return { typ:g('lv-typ'), titel:g('lv-titel'), sprecher:g('lv-spr'), partner_id:g('lv-pid'),
      start_at: d&&t ? new Date(d+'T'+t).toISOString() : null, dauer_min:g('lv-dauer')||60, wiederholung:w, bis:g('lv-bis'),
      yt_url:g('lv-yt'), aktiv:g('lv-akt'),
      tage: w==='woechentlich' ? [...document.querySelectorAll('.lv-wt.on')].map(b=>+b.dataset.t) : (w==='monatlich' ? [+g('lv-mwt')||1] : []),
      alle_wochen: w==='woechentlich' ? (+g('lv-alle')||1) : 1,
      monat_nr: w==='monatlich' ? g('lv-mnr') : '',
      ausfall: LV.aus||[] };
  }
  ZP.lvUpd = () => {
    try{ const dv=$('lv-d')&&$('lv-d').value; if(dv){ const wdx=((new Date(dv+'T12:00').getDay()+6)%7)+1;
      if(!LV.wtTouched) document.querySelectorAll('.lv-wt').forEach(b=>b.classList.toggle('on',+b.dataset.t===wdx));
      const m=$('lv-mwt'); if(m&&!LV.mwTouched) m.value=String(wdx); } }catch(e){}
    const p=lvLesen(), w=p.wiederholung;
    const show=(id,on)=>{ const e=$(id); if(e) e.style.display=on?'':'none'; };
    show('lv-box-woche', w==='woechentlich'); show('lv-box-monat', w==='monatlich'); show('lv-box-bis', w!=='einmal');
    const mw=$('lv-mwt-wrap'); if(mw) mw.style.display = w==='monatlich' && p.monat_nr!=='0' ? '' : 'none';
    const box=$('lv-vorschau'); if(!box) return;
    const L=lvVorschau(p,6);
    box.innerHTML = L.length ? L.map(s=>`<span class="pill" style="margin:0 6px 6px 0">${s.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'})} · ${lvHM(s)}</span>`).join('') : '<span class="muted">Keine kommenden Termine mit diesen Einstellungen.</span>';
    const a=$('lv-aus-list'); if(a) a.innerHTML=(LV.aus||[]).map(x=>`<span class="pill" style="margin:0 6px 6px 0">${new Date(x+'T12:00').toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'})} <a href="javascript:void 0" onclick="ZP.lvAusWeg('${x}')" style="margin-left:4px">✕</a></span>`).join('') || '<span class="muted" style="font-size:12px">Keine</span>';
  };
  ZP.lvWt = b => { LV.wtTouched=1; b.classList.toggle('on'); ZP.lvUpd(); };
  ZP.lvAusDazu = () => { const e=$('lv-aus-d'); if(!e||!e.value) return; LV.aus=[...new Set([...(LV.aus||[]),e.value])].sort(); e.value=''; ZP.lvUpd(); };
  ZP.lvAusWeg = x => { LV.aus=(LV.aus||[]).filter(y=>y!==x); ZP.lvUpd(); };
  ZP.lvPartner = sel => { const P=(LV.d&&LV.d.partner)||[], p=P.find(x=>String(x.id)===sel.value), s=$('lv-spr'); if(p&&s&&!s.value) s.value=p.n||''; };
  ZP.lvSave = async b => {
    const p=lvLesen();
    if(!p.titel||!p.start_at){ toast('Titel, Datum und Uhrzeit fehlen'); return; }
    if(p.wiederholung==='woechentlich'&&!p.tage.length){ toast('Wähle mindestens einen Wochentag'); return; }
    b.disabled=true;
    try{ const r=await RPC('live_event_speichern',{p_id:LV.edit||null,p}); if(!r||!r.ok) throw 0;
      const n=lvVorschau(p,1)[0]; toast(n?'Gespeichert – nächster Termin '+n.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'Gespeichert');
      LV.edit=null; ZP.typed=0; await lvLoad(); }
    catch(e){ b.disabled=false; toast('Hat nicht geklappt. Ist closinghub-runde23-live-termine-flexibel.sql ausgeführt?'); }
  };
  ZP.lvTyp = v => { const s=$('lv-titel'); if(s && !s.value) s.value = v==='motivation' ? 'Motivations-Call' : ''; const w=$('lv-wdh'); if(w && w.value==='einmal'){ w.value = v==='motivation' ? 'werktags' : 'woechentlich'; } ZP.lvUpd(); };
  function lvForm(e){
    const s=e?new Date(e.start_at):new Date(Math.ceil((Date.now()+5*6e4)/9e5)*9e5), P=(LV.d&&LV.d.partner)||[];
    const val=(x,d='')=>esc(x==null?d:x), wd0=((s.getDay()+6)%7)+1, w=e?e.wiederholung:'einmal';
    const tage=e&&e.tage&&e.tage.length?e.tage.map(Number):[wd0], mnr=e&&e.monat_nr!=null?String(e.monat_nr):'1';
    LV.aus=(e&&e.ausfall||[]).map(String);
    LV.wtTouched=!!(e&&e.tage&&e.tage.length); LV.mwTouched=!!(e&&e.wiederholung==='monatlich');
    setTimeout(ZP.lvUpd,0);
    const opt=(v,t,cur)=>`<option value="${v}" ${String(cur)===String(v)?'selected':''}>${t}</option>`;
    return `<div class="card" oninput="ZP.lvUpd()" onchange="ZP.lvUpd()"><h3 style="margin:0 0 10px">${e?'Live-Termin bearbeiten':'Neuer Live-Termin'}</h3>
      <style>.lv-wt{min-width:42px;padding:8px 0;border-radius:10px;border:1px solid var(--line,#ddd);font-weight:600;font-size:13px;background:transparent}.lv-wt.on{background:#B8892E;border-color:#B8892E;color:#111}</style>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">
        <label class="f">Art<select class="in" id="lv-typ" onchange="ZP.lvTyp(this.value)">${opt('vortrag','Partner-Vortrag (nur Premium, mit Fragen)',e?e.typ:'vortrag')}${opt('motivation','Motivations-Call (ab Plus, ohne Chat)',e?e.typ:'')}</select></label>
        <label class="f">Titel<input class="in" id="lv-titel" maxlength="120" value="${val(e&&e.titel)}" placeholder="z. B. Einwandbehandlung live"></label>
        <label class="f">Partner<select class="in" id="lv-pid" onchange="ZP.lvPartner(this)"><option value="">kein Partner (z. B. Motivations-Call)</option>${P.map(p=>`<option value="${p.id}" ${e&&+e.partner_id===+p.id?'selected':''}>${esc(p.n||('Partner '+p.id))}</option>`).join('')}</select></label>
        <label class="f">Sprecher (Name in der App)<input class="in" id="lv-spr" maxlength="60" value="${val(e&&e.sprecher)}" placeholder="z. B. Paul"></label>
        <label class="f">Startdatum (erster Termin ab)<input class="in" type="date" id="lv-d" value="${lvIso(s)}"></label>
        <label class="f">Uhrzeit<input class="in" type="time" id="lv-t" value="${lvP2(s.getHours())+':'+lvP2(s.getMinutes())}"></label>
        <label class="f">Dauer in Minuten<input class="in" type="number" min="5" max="600" id="lv-dauer" value="${val(e&&e.dauer_min,60)}"></label>
        <label class="f">Wiederholen<select class="in" id="lv-wdh">${opt('einmal','Nur einmal',w)}${opt('woechentlich','Wöchentlich (Tage wählen)',w)}${opt('monatlich','Monatlich',w)}${opt('werktags','Jeden Werktag (Mo–Fr)',w)}${opt('taeglich','Jeden Tag',w)}</select></label>
        <div id="lv-box-woche" style="grid-column:1/-1;display:none"><div class="f" style="margin-bottom:6px">An diesen Tagen</div>
          <div class="row" style="gap:6px;flex-wrap:wrap">${LV_WT.map((t,i)=>`<button type="button" class="lv-wt ${tage.includes(i+1)?'on':''}" data-t="${i+1}" onclick="ZP.lvWt(this)">${t}</button>`).join('')}
          <select class="in" id="lv-alle" style="width:auto;margin-left:8px">${[1,2,3,4].map(n=>opt(n,n===1?'jede Woche':'alle '+n+' Wochen',e?e.alle_wochen||1:1)).join('')}</select></div></div>
        <div id="lv-box-monat" style="grid-column:1/-1;display:none"><div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><span class="f" style="margin:0">Jeden</span>
          <select class="in" id="lv-mnr" style="width:auto">${['1','2','3','4','-1','0'].map(n=>opt(n,n==='0'?'Monat am gleichen Datum':LV_NR[n],mnr)).join('')}</select>
          <span id="lv-mwt-wrap"><select class="in" id="lv-mwt" style="width:auto" onchange="ZLV.mwTouched=1">${LV_WT.map((t,i)=>opt(i+1,['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'][i],tage[0])).join('')}</select> <span class="f" style="margin:0">im Monat</span></span></div></div>
        <label class="f" id="lv-box-bis">Wiederholen bis (leer = offen)<input class="in" type="date" id="lv-bis" value="${val(e&&e.bis)}"></label>
        <div class="f" style="grid-column:1/-1">Fällt aus am (z. B. Feiertage, Urlaub)<div class="row" style="gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap"><input class="in" type="date" id="lv-aus-d" style="width:auto"><button type="button" class="btn sm" onclick="ZP.lvAusDazu()">Hinzufügen</button><span id="lv-aus-list"></span></div></div>
        <label class="f" style="grid-column:1/-1">YouTube-Link (Livestream, „nicht gelistet“)<input class="in" id="lv-yt" value="${val(e&&e.yt_url)}" placeholder="https://youtube.com/live/…"></label>
        <label class="row" style="gap:8px;align-items:center;font-size:13px"><input type="checkbox" id="lv-akt" ${!e||e.aktiv?'checked':''}> Aktiv (in der App sichtbar)</label>
      </div>
      <div style="margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(184,137,46,.08)"><div class="f" style="margin-bottom:6px">Vorschau: die nächsten Termine</div><div id="lv-vorschau"></div></div>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn" onclick="ZLV.edit=null;ZP.typed=0;render()">Abbrechen</button><button class="btn gold-b" onclick="ZP.lvSave(this)">${e?'Speichern':'Anlegen'}</button></div></div>`;
  }
  PAGES.live = function(){
    if(LV.d===undefined){ LV.d=null; lvLoad(); }
    const head=`<div class="row between" style="align-items:flex-start;gap:12px;flex-wrap:wrap"><div><h1 class="h1">Live-Calls</h1><p class="sub" style="max-width:760px">15 Minuten vor Start erscheint in der App oben ein fester Balken, bis der Call vorbei ist. <b>Partner-Vorträge</b> sehen nur Premium-Member (inkl. Day One in den Premium-Monaten), mit Fragen an den Sprecher. Den <b>Motivations-Call</b> sehen alle ab Plus, ohne Chat.</p></div>
      <button class="btn gold-b" onclick="ZP.lvEdit(0)">+ Live-Termin</button></div>`;
    if(LV.d===null) return head+'<p class="muted">Lade …</p>';
    if(LV.err && !LV.d.events) return head+'<div class="card empty">Fehlt noch: Führe einmal <b>closinghub-runde22-live-calls.sql</b> in Supabase aus.</div>';
    const E=LV.d.events||[], byId=Object.fromEntries(E.map(e=>[e.id,e])), t=Date.now();
    const T=(LV.d.termine||[]).filter(x=>byId[x.event_id]);
    const lauf=T.filter(x=>lvT(x.s)-9e5<=t&&lvT(x.e)>t), next=T.filter(x=>lvT(x.s)-9e5>t).slice(0,20), alt=T.filter(x=>lvT(x.e)<=t).slice(-6).reverse();
    const typP=e=>e.typ==='vortrag'?'<span class="pill p-gold">Vortrag · Premium</span>':'<span class="pill p-ok">Motivation · ab Plus</span>';
    const wdh={einmal:'einmal',werktags:'Mo–Fr',taeglich:'täglich'};
    const row=(x,st)=>{ const e=byId[x.event_id]; return `<tr><td style="padding-left:16px"><b>${lvDT(x.s)}</b><div class="muted" style="font-size:11.5px">bis ${lvHM(x.e)}</div></td><td>${typP(e)}</td><td><b>${esc(e.titel)}</b><div class="muted" style="font-size:11.5px">${esc(e.sprecher||'')}</div></td><td>${st}</td><td>${num(x.dabei)}</td><td>${e.typ==='vortrag'?num(x.fragen):'–'}</td><td>${e.yt_url?'':'<span class="pill p-bad">Link fehlt</span>'}</td></tr>`; };
    const tbl=(L,st,leer)=>L.length?`<div style="overflow:auto"><table class="zp-tbl"><thead><tr><th style="padding-left:16px">Wann</th><th>Art</th><th>Titel</th><th>Status</th><th>Dabei</th><th>Fragen</th><th></th></tr></thead><tbody>${L.map(x=>row(x,typeof st==='function'?st(x):st)).join('')}</tbody></table></div>`:`<div class="empty" style="padding:18px">${leer}</div>`;
    const F=(LV.d.fragen||[]).filter(f=>lauf.some(x=>x.event_id===f.event_id&&x.termin===f.termin)||alt.slice(0,1).some(x=>x.event_id===f.event_id&&x.termin===f.termin));
    const ed=LV.edit===null?null:(LV.edit?byId[LV.edit]:0);
    return head+`
      ${ed!==null?lvForm(ed||null):''}
      <div class="card" style="padding:0;overflow:hidden;margin-top:16px"><h3 style="margin:14px 16px 6px">Jetzt (Balken in der App sichtbar)</h3>${tbl(lauf,x=>lvT(x.s)<=t?'<span class="pill p-bad">LIVE</span>':'<span class="pill p-warn">in '+Math.ceil((lvT(x.s)-t)/6e4)+' Min</span>','Gerade läuft nichts.')}</div>
      ${F.length?`<div class="card" style="margin-top:16px"><h3 style="margin:0 0 8px">Fragen aus dem Vortrag</h3>${F.map(f=>`<div class="item" style="align-items:flex-start;gap:10px;${f.status==='versteckt'?'opacity:.45':''}"><div style="flex:1"><b style="font-size:13px">${esc(f.name)}</b> <span class="muted" style="font-size:11.5px">${lvHM(f.at)} · ${esc((byId[f.event_id]||{}).titel||'')}</span><div style="font-size:14px;margin-top:2px">${esc(f.text)}</div></div>
          ${f.status!=='beantwortet'?`<button class="btn sm" onclick="ZP.lvQ(${f.id},'beantwortet')">Beantwortet</button>`:`<span class="pill p-ok">beantwortet</span>`}${f.status!=='versteckt'?`<button class="btn sm" onclick="ZP.lvQ(${f.id},'versteckt')">Ausblenden</button>`:`<button class="btn sm" onclick="ZP.lvQ(${f.id},'offen')">Wieder zeigen</button>`}</div>`).join('')}</div>`:''}
      <div class="card" style="padding:0;overflow:hidden;margin-top:16px"><h3 style="margin:14px 16px 6px">Nächste Termine</h3>${tbl(next,'<span class="pill">geplant</span>','Noch nichts geplant. Leg oben einen Live-Termin an.')}</div>
      <div class="card" style="padding:0;overflow:hidden;margin-top:16px"><h3 style="margin:14px 16px 6px">Alle Live-Termine</h3>${E.length?`<div style="overflow:auto"><table class="zp-tbl"><thead><tr><th style="padding-left:16px">Titel</th><th>Art</th><th>Start</th><th>Wiederholung</th><th>Status</th><th></th></tr></thead><tbody>
        ${E.map(e=>`<tr class="k" onclick="ZP.lvEdit(${e.id})"><td style="padding-left:16px"><b>${esc(e.titel)}</b><div class="muted" style="font-size:11.5px">${esc(e.sprecher||'')}</div></td><td>${typP(e)}</td><td>${lvDT(e.start_at)} · ${num(e.dauer_min)} Min</td><td>${esc(lvRegel(e))}</td><td>${e.aktiv?'<span class="pill p-ok">aktiv</span>':'<span class="pill">aus</span>'}</td><td><button class="btn sm" onclick="event.stopPropagation();ZP.lvEdit(${e.id})">Bearbeiten</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty" style="padding:18px">Noch keine Live-Termine.</div>'}</div>
      ${alt.length?`<div class="card" style="padding:0;overflow:hidden;margin-top:16px"><h3 style="margin:14px 16px 6px">Zuletzt</h3>${tbl(alt,'<span class="pill">vorbei</span>','')}</div>`:''}
      <div class="card" style="margin-top:16px"><h3 style="margin:0 0 6px">So richtest du den Stream ein</h3><p class="muted" style="font-size:13px;margin:0">YouTube Studio → Livestream planen → Sichtbarkeit <b>„Nicht gelistet“</b> → unter Einstellungen <b>„Einbetten zulassen“</b> an → Link hier eintragen. Der Link wird nur an Member mit Zugang geschickt. Den täglichen Morgen-Call kannst du einmal als „Jeden Werktag“ anlegen; wechselt der Stream-Link, hier einfach aktualisieren.</p></div>`;
  };

  /* ---------- Start ---------- */
  drawNav(); liveDraw();
  if(LOADED){ if(['affiliate','mitteilungen','live'].includes(route())) render(); }
  setTimeout(()=>poll(true), 300);
})();
