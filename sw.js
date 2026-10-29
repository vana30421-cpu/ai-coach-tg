'use strict';
var CACHE = 'life-os-v49';
var ASSETS = [
  './', './index.html', './manifest.json',
  './content.js', './content2.js', './content3.js', 
  './content4.js', './content5.js', './content6.js', 
  './content7.js', './content8.js',
  './integration.js', './app.js', './app-jarvis.js', './app-render.js',
  './icon-192.png', './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(resp) {
        if (resp.ok && resp.type === 'basic') {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      }).catch(function() {
        if (e.request.destination === 'document') return caches.match('./index.html');
      });
    })
  );
});
