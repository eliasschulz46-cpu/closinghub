/* ClosingHub – Service Worker nur für Mitteilungen aufs Handy (kein Zwischenspeicher) */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data ? e.data.text() : '' }; }
  const title = d.title || 'ClosingHub';
  const opt = {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/badge-96.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: d.url || '/app' }
  };
  e.waitUntil(self.registration.showNotification(title, opt));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/app', self.location.origin).href;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (new URL(c.url).origin === self.location.origin && /\/app(\.html)?/.test(new URL(c.url).pathname)) {
        try { await c.focus(); c.postMessage({ ch: 'open', url }); return; } catch (err) {}
      }
    }
    await self.clients.openWindow(url);
  })());
});
