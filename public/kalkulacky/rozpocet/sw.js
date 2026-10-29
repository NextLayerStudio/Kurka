// Service worker: appka funguje aj bez internetu. Neukladá ani neodosiela žiadne dáta používateľa.
var CACHE = 'rodinny-rozpocet-v3';
var CORE = [
  './', './index.html', './navod.html', './manifest.webmanifest', './fonts.css',
  './vendor/chart.umd.min.js',
  './fonts/inter-latin.woff2', './fonts/inter-latin-ext.woff2',
  './fonts/monda-latin.woff2', './fonts/monda-latin-ext.woff2',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  // Najprv sieť (aby sa dostali aktualizácie), bez internetu z uloženej kópie.
  e.respondWith(fetch(req).then(function(res){
    if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req, {ignoreSearch:true}).then(function(hit){
      return hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined);
    });
  }));
});
