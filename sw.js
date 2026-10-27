// Rumbo a Ayamonte · funciona sin conexión
const V = "ayamonte-v28";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  // Página: primero red (para recibir versiones nuevas), si no hay conexión, la guardada
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(ca => ca.put("index.html", c)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  // Fuentes e iconos: lo guardado al momento y se refresca por detrás
  if (u.origin === location.origin || u.host.includes("fonts.googleapis.com") || u.host.includes("fonts.gstatic.com")) {
    e.respondWith(caches.open(V).then(async ca => {
      const hit = await ca.match(r);
      const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) ca.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
