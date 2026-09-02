// Reflection — Service Worker
// Strategi AMAN: halaman (navigasi) SELALU langsung ke network, tidak pernah
// diintersep sama sekali — supaya tidak pernah "nyangkut" di halaman offline
// padahal internet normal. Yang di-cache cuma asset statis (JS/CSS/gambar)
// biar loading lebih cepat di kunjungan berikutnya.

const CACHE_NAME = "reflection-cache-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // JANGAN pernah intersep navigasi halaman (buka/refresh app) — biarkan browser
  // menangani ini secara normal langsung ke server, supaya tidak pernah salah
  // menampilkan halaman offline saat sebenarnya online.
  if (request.mode === "navigate") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate: tampilkan versi cache dulu (kalau ada) biar cepat,
  // sambil diam-diam ambil versi terbaru dari network buat cache berikutnya.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
