// Reflection — Service Worker
// Strategi: network-first untuk semua request, fallback ke cache kalau offline.
// Setiap response sukses otomatis disimpan ke cache biar kunjungan berikutnya lebih cepat
// dan tetap bisa dibuka walau sinyal internet lagi jelek/putus.

const CACHE_NAME = "reflection-cache-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
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

  const url = new URL(request.url);
  // Jangan cache request ke Supabase (API/data harus selalu segar & butuh koneksi nyata),
  // hanya cache asset milik app ini sendiri (JS, CSS, gambar, HTML).
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match(OFFLINE_URL);
        return new Response("", { status: 503, statusText: "Offline" });
      })
  );
});
