/* ===== ClosingHub News (Reiter in der Zentrale) =====
   Einbinden: in zentrale.html direkt vor </body>:  <script src="zentrale-news.js"></script>
   Braucht: closinghub-news.sql + Edge Function „news“ (siehe Datenbank/news-funktion). */
(function(){
  const N = { list:null, sel:null, busy:false, err:'' };
  window.NEWS = N;

  // Menüpunkt unter „Community“ einhängen
  const at = NAV.findIndex(n => n[0]==='support');
  NAV.splice(at<0 ? NAV.length : at, 0, ['news','ClosingHub News','inbox', () => (N.list||[]).filter(a=>a.status==='entwurf').length]);

  const aktiv = () => (D.waitlist||[]).length;
  const fmt = iso => iso ? new Date(iso).toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '–';
  const cur = () => (N.list||[]).find(a=>a.id===N.sel);
  const offene = t => [...new Set((t.match(/\[[^\]]+\]/g)||[]).filter(p=>p!=='[Vorname]'&&p!=='[Abmeldelink]'))];

  async function load(){
    try{ N.list = await api('news_ausgaben?select=*&order=nummer.desc'); N.err=''; }
    catch(e){ N.list=[]; N.err=e.message; }
    if(N.sel==null && N.list.length){ const e=N.list.find(a=>a.status==='entwurf'); N.sel=(e||N.list[0]).id; }
    if(LOADED && route()==='news') render();
  }

  function preview(t){
    return esc(t.replaceAll('[Vorname]','Max').replaceAll('[Abmeldelink]','(Abmeldelink)'))
      .replace(/\[[^\]]+\]/g, m=>`<mark style="background:#ffe08a;padding:0 3px;border-radius:3px">${m}</mark>`)
      .replace(/\n/g,'<br>');
  }

  function check(a){
    const t=a.text||'', o=offene(t+' '+(a.betreff||''));
    const items=[
      [!!(a.betreff||'').trim(), 'Betreff ausgefüllt'],
      [t.includes('[Vorname]'), 'Persönliche Anrede mit [Vorname]'],
      [o.length===0, o.length ? 'Offene Platzhalter: '+o.join(', ') : 'Keine offenen Platzhalter'],
      [/Freundliche Grüße\s*\n\s*Elias Schulz\s*\n\s*ClosingHub/.test(t), 'Grußformel: Freundliche Grüße / Elias Schulz / ClosingHub'],
      [!!a.test_gesendet_am, a.test_gesendet_am ? 'Testmail verschickt ('+fmt(a.test_gesendet_am)+')' : 'Testmail an dich noch nicht verschickt'],
    ];
    return items;
  }

  PAGES.news = function(){
    if(N.list===null){ load(); return '<div class="empty">Lade ClosingHub News …</div>'; }
    const a = cur();
    const head = `<h1 class="h1">ClosingHub News</h1><p class="sub">Wochen-Mail an die Warteliste · jeden Samstag 18 Uhr · Entwurf kommt freitags 11:43 im Chat</p>`;
    const err = N.err ? `<div class="card" style="border-color:#b4543c;margin-bottom:14px"><b>⚠️ Konnte nicht laden:</b> ${esc(N.err)}<br><span class="muted">Ist closinghub-news.sql in Supabase ausgeführt?</span></div>` : '';
    const side = `<div class="card"><div class="row between" style="margin-bottom:10px"><h3 style="margin:0">Ausgaben</h3><button class="btn sm gold-b" onclick="newsNeu()">+ Neue Ausgabe</button></div>
      ${(N.list||[]).map(x=>`<div onclick="NEWS.sel=${x.id};render()" style="cursor:pointer;padding:9px 10px;border-radius:8px;margin-bottom:4px;${x.id===N.sel?'background:var(--bg2);outline:1px solid var(--line)':''}">
        <div class="row between"><b>#${x.nummer}</b>${x.status==='gesendet'?'<span class="pill p-ok">gesendet</span>':'<span class="pill p-warn">Entwurf</span>'}</div>
        <div class="muted" style="font-size:12.5px;margin-top:2px">${esc((x.betreff||'ohne Betreff').replace(/^ClosingHub News #\d+ – /,''))}</div>
        <div class="muted" style="font-size:11.5px">${x.status==='gesendet' ? fmt(x.gesendet_am)+(x.empfaenger!=null?' · '+x.empfaenger+' Empfänger':'')+(x.notiz?' · '+esc(x.notiz):'') : 'zuletzt geändert '+fmt(x.geaendert_am)}</div></div>`).join('') || '<div class="muted">Noch keine Ausgabe.</div>'}
      <div class="muted" style="font-size:12px;margin-top:10px">Aktive Empfänger: <b>${aktiv()}</b> auf der Warteliste (Abgemeldete werden beim Versand übersprungen)</div></div>`;
    if(!a) return head+err+`<div class="grid" style="grid-template-columns:300px 1fr;gap:16px;align-items:start">${side}<div class="card empty">Leg eine neue Ausgabe an und füg den Entwurf aus dem Chat ein.</div></div>`;
    const lock = a.status==='gesendet';
    const ch = check(a), ready = ch.every(c=>c[0]);
    const editor = `<div class="card">
      <div class="row between" style="margin-bottom:10px"><h3 style="margin:0">Ausgabe #${a.nummer}</h3>${lock?'<span class="pill p-ok">verschickt – nur noch lesen</span>':''}</div>
      <label class="f">Betreff<input class="in" id="nw_b" value="${esc(a.betreff)}" ${lock?'disabled':''} oninput="newsDirty()"></label>
      <label class="f" style="margin-top:10px">Text <span class="muted" style="font-weight:400">– Platzhalter: [Vorname], [Abmeldelink] (wird sonst automatisch angehängt), [ZAHL]</span>
        <textarea class="in" id="nw_t" rows="22" style="font-family:inherit;line-height:1.5;resize:vertical" ${lock?'disabled':''} oninput="newsDirty()">${esc(a.text)}</textarea></label>
      ${lock?'':`<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn sm" onclick="newsSpeichern()">💾 Speichern</button>
        <button class="btn sm" onclick="newsZahl()">[ZAHL] → ${aktiv()} einsetzen</button>
        <button class="btn sm" onclick="newsTest()">✉️ Testmail an ${esc(SESSION&&SESSION.email||'mich')}</button>
        <button class="btn sm red" onclick="newsLoeschen()">Entwurf löschen</button></div>`}
    </div>`;
    const right = `<div class="card"><h3>Vorschau</h3><div style="font-size:14px;line-height:1.55;max-height:420px;overflow:auto;padding:12px;border:1px solid var(--line);border-radius:10px"><b>${esc(a.betreff)}</b><br><br>${preview(a.text||'')}</div></div>
      ${lock?'':`<div class="card"><h3>Check vor dem Versand</h3>${ch.map(c=>`<div style="margin:5px 0">${c[0]?'✅':'⛔'} ${esc(c[1])}</div>`).join('')}
      <button class="btn gold-b" style="margin-top:12px;width:100%;justify-content:center" ${ready&&!N.busy?'':'disabled'} onclick="newsSenden()">🚀 An ${aktiv()} Personen auf der Warteliste senden</button>
      <div class="muted" style="font-size:12px;margin-top:6px">Geht erst, wenn alles grün ist. Nach dem Versand ist die Ausgabe gesperrt – kein Doppelversand möglich.</div></div>`}`;
    return head+err+`<div class="grid" style="grid-template-columns:260px minmax(0,1.2fr) minmax(0,1fr);gap:16px;align-items:start">${side}${editor}<div class="grid" style="gap:16px">${right}</div></div>`;
  };

  let dirty=false;
  window.newsDirty = () => { dirty=true; const a=cur(); if(a){ a.betreff=$('nw_b').value; a.text=$('nw_t').value; } };
  window.newsSpeichern = async (quiet) => {
    const a=cur(); if(!a) return;
    a.betreff=$('nw_b').value; a.text=$('nw_t').value;
    const changed = dirty;
    await q(`news_ausgaben?id=eq.${a.id}`,{method:'PATCH',body:{betreff:a.betreff,text:a.text,geaendert_am:new Date().toISOString(), ...(changed?{test_gesendet_am:null}:{})}});
    if(changed) a.test_gesendet_am=null;
    dirty=false; a.geaendert_am=new Date().toISOString(); if(!quiet) toast('Gespeichert'); render();
  };
  window.newsNeu = async () => {
    const nr = Math.max(0,...(N.list||[]).map(a=>a.nummer))+1;
    const tpl = `Hey [Vorname],\n\n\n🔥 DAS IST DIESE WOCHE PASSIERT\n\n✅ \n✅ \n✅ \n\n👥 STAND DER WARTELISTE\nSchon [ZAHL] Closer, Setter, Vertriebler und Verkäufer haben sich ihren Platz gesichert.\n\n🎁 UNSER GEWINNSPIEL\n\n\n🙏 DEINE MISSION FÜR DIESE WOCHE\n\n\nWir lesen uns nächsten Samstag.\n\nFreundliche Grüße\nElias Schulz\nClosingHub`;
    const r = await q('news_ausgaben',{method:'POST',prefer:'return=representation',body:{nummer:nr,betreff:`ClosingHub News #${nr} – `,text:tpl}});
    N.list.unshift(r[0]); N.sel=r[0].id; render(); toast('Ausgabe #'+nr+' angelegt – Entwurf aus dem Chat einfügen');
  };
  window.newsZahl = () => { const t=$('nw_t'); t.value=t.value.replaceAll('[ZAHL]', String(aktiv())); newsDirty(); render(); toast('Zahl eingesetzt – speichern nicht vergessen'); };
  window.newsLoeschen = async () => {
    const a=cur(); if(!a||a.status!=='entwurf') return;
    if(!confirm(`Entwurf #${a.nummer} wirklich löschen?`)) return;
    await q(`news_ausgaben?id=eq.${a.id}`,{method:'DELETE'}); N.list=N.list.filter(x=>x.id!==a.id); N.sel=N.list[0]?.id??null; render(); toast('Entwurf gelöscht');
  };
  async function fn(body){
    const r = await fetch(`${SB_URL}/functions/v1/news`,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+await zToken(),'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j = await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error||('Fehler '+r.status)); return j;
  }
  window.newsTest = async () => {
    const a=cur(); if(!a) return; await newsSpeichern(true);
    const to = prompt('Testmail an:', SESSION&&SESSION.email||''); if(!to) return;
    try{ await fn({id:a.id,test:true,test_email:to}); a.test_gesendet_am=new Date().toISOString(); render(); toast('Testmail verschickt – bitte im Postfach prüfen'); }
    catch(e){ toast('⚠️ '+e.message); }
  };
  window.newsSenden = async () => {
    const a=cur(); if(!a) return;
    if(dirty) return toast('Erst speichern und neue Testmail schicken');
    if(!confirm(`ClosingHub News #${a.nummer} jetzt an ${aktiv()} Personen senden?\n\nBetreff: ${a.betreff}\n\nDas kann nicht rückgängig gemacht werden.`)) return;
    N.busy=true; render(); toast('Wird verschickt … Seite bitte offen lassen');
    try{ const r=await fn({id:a.id}); toast(`✅ Verschickt an ${r.gesendet} Personen${r.fehler?' · '+r.fehler+' Fehler':''}`); }
    catch(e){ toast('⚠️ '+e.message); }
    N.busy=false; await load();
  };

  // Menü sofort neu zeichnen und Daten im Hintergrund laden
  if(SESSION) load();
  if(LOADED){ drawNav(); if(route()==='news') render(); }
})();
