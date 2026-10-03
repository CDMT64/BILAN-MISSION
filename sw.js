// Bilan HDV – service worker « réseau d'abord »
// Avec du réseau : l'appli charge toujours la dernière version publiée sur GitHub.
// Sans réseau : elle utilise la dernière copie enregistrée sur l'appareil.
// Plus besoin de changer de version à chaque mise à jour.
const CACHE = "bilan-hdv";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(CORE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Réseau d'abord ; on contourne le cache HTTP pour les fichiers de l'appli
      const res = await fetch(sameOrigin ? new Request(req, { cache: "no-cache" }) : req);
      if (res && (res.ok || res.type === "opaque")) {
        cache.put(req.mode === "navigate" ? "./index.html" : req, res.clone());
      }
      return res;
    } catch (err) {
      // Hors ligne : copie locale
      const hit = req.mode === "navigate"
        ? (await cache.match("./index.html")) || (await cache.match("./"))
        : await cache.match(req, { ignoreSearch: sameOrigin });
      if (hit) return hit;
      throw err;
    }
  })());
});
