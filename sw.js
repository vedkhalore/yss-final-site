// sw.js - basic app shell cache for offline PWA behavior
const CACHE = 'yss-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/register.html',
  '/report.html',
  '/manifesto.html',
  '/team.html',
  '/admin.html',
  '/site.webmanifest',
  '/favicon.ico'
];

// install: cache app shell
self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// activate: cleanup
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null))).then(() => self.clients.claim())
  );
});

// fetch: respond from cache first, fallback to network
self.addEventListener('fetch', ev => {
  if(ev.request.method !== 'GET') return;
  ev.respondWith(
    caches.match(ev.request).then(resp => resp || fetch(ev.request).then(r => {
      // add dynamic resources to cache
      return caches.open(CACHE).then(cache => { cache.put(ev.request, r.clone()); return r; });
    })).catch(()=> caches.match('/index.html'))
  );
});
