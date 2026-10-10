'use strict';
/* ============================================================
   LIFE OS — Service Worker v46
   Стратегии кэширования:
   - HTML — network-first с fallback на кэш
   - Статика — cache-first + stale-while-revalidate
   - Telegram API — не кэшируем
   ============================================================ */

var CACHE = 'life-os-v46';
var CACHE_ICONS = 'life-os-icons-v46';

var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './content.js',
  './content2.js',
  './content3.js',
  './content4.js',
  './content5.js',
  './content6.js',
  './integration.js',
  './app.js'
];

var ICONS = [
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

/* ============ INSTALL ============ */
self.addEventListener('install', function(event){
  event.waitUntil(
    Promise.all([
      caches.open(CACHE).then(function(cache){
        return cache.addAll(ASSETS).catch(function(err){
          console.warn('[SW] Не все ASSETS закэшированы:', err);
        });
      }),
      caches.open(CACHE_ICONS).then(function(cache){
        return cache.addAll(ICONS).catch(function(err){
          console.warn('[SW] Не все ICONS закэшированы:', err);
        });
      })
    ]).then(function(){
      return self.skipWaiting();
    })
  );
});

/* ============ ACTIVATE ============ */
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){
          return k !== CACHE && k !== CACHE_ICONS;
        }).map(function(k){
          console.log('[SW] Удаляю старый кэш:', k);
          return caches.delete(k);
        })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

/* ============ MESSAGE (для принудительного обновления) ============ */
self.addEventListener('message', function(event){
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
  if(event.data && event.data.type === 'CLEAR_CACHE'){
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){
      if(event.source && event.source.postMessage){
        event.source.postMessage({type:'CACHE_CLEARED'});
      }
    });
  }
});

/* ============ FETCH ============ */
self.addEventListener('fetch', function(event){
  var request = event.request;

  /* Только GET */
  if(request.method !== 'GET') return;

  /* Telegram API и внешние API — не кэшируем */
  if(request.url.includes('api.telegram.org') ||
     request.url.includes('generativelanguage.googleapis.com') ||
     request.url.includes('openai.com')){
    return;
  }

  /* Telegram SDK — не кэшируем (нужен свежий) */
  if(request.url.includes('telegram.org')){
    return;
  }

  /* HTML — network-first с fallback на кэш */
  if(request.destination === 'document'){
    event.respondWith(
      fetch(request)
        .then(function(resp){
          if(resp && resp.ok){
            var clone = resp.clone();
            caches.open(CACHE).then(function(cache){
              cache.put(request, clone);
            });
          }
          return resp;
        })
        .catch(function(){
          /* Сеть упала — отдаём кэш */
          return caches.match(request).then(function(cached){
            if(cached) return cached;
            /* Совсем ничего — отдаём index.html */
            return caches.match('./index.html').then(function(fallback){
              if(fallback) return fallback;
              /* Ничего нет — простая заглушка */
              return new Response(
                '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Офлайн</title><style>body{background:#000;color:#fff;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100dvh;margin:0;text-align:center;padding:20px}h1{font-size:24px;margin-bottom:10px}p{color:#888}</style></head><body><div><h1>📡 Офлайн</h1><p>Проверь интернет и обнови страницу</p></div></body></html>',
                {
                  status: 200,
                  headers: {'Content-Type': 'text/html; charset=utf-8'}
                }
              );
            });
          });
        })
    );
    return;
  }

  /* Иконки — cache-first, но если нет — fetch */
  if(request.destination === 'image' && request.url.match(/icon-|apple-touch/)){
    event.respondWith(
      caches.match(request).then(function(cached){
        if(cached) return cached;
        return fetch(request).then(function(resp){
          if(resp && resp.ok){
            var clone = resp.clone();
            caches.open(CACHE_ICONS).then(function(cache){
              cache.put(request, clone);
            });
          }
          return resp;
        }).catch(function(){
          return new Response('', {status: 404});
        });
      })
    );
    return;
  }

  /* Остальное (CSS, JS, шрифты, картинки) — cache-first + SWR */
  event.respondWith(
    caches.match(request).then(function(cached){
      /* Параллельно обновляем кэш из сети */
      var fetchPromise = fetch(request)
        .then(function(resp){
          if(resp && resp.ok && resp.type === 'basic'){
            var clone = resp.clone();
            caches.open(CACHE).then(function(cache){
              cache.put(request, clone);
            });
          }
          return resp;
        })
        .catch(function(){
          /* Сеть упала — ничего не делаем, отдадим кэш ниже */
          return null;
        });

      /* Если в кэше есть — отдаём сразу, обновление идёт фоном */
      if(cached) return cached;

      /* Если в кэше нет — ждём сеть */
      return fetchPromise.then(function(resp){
        if(resp) return resp;
        /* Ничего нет — пустой ответ */
        return new Response('', {status: 404, statusText: 'Not Found'});
      });
    })
  );
});

/* ============ SYNC (для фоновой синхронизации, если нужно) ============ */
self.addEventListener('sync', function(event){
  if(event.tag === 'sync-life-os'){
    event.waitUntil(
      Promise.resolve().then(function(){
        console.log('[SW] Фоновая синхронизация');
      })
    );
  }
});

/* ============ PUSH (если будет) ============ */
self.addEventListener('push', function(event){
  var data = {title:'Life OS', body:'Пора проверить прогресс'};
  try{
    if(event.data) data = event.data.json();
  }catch(e){}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'life-os-notification',
      renotify: true
    })
  );
});

/* ============ NOTIFICATION CLICK ============ */
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled: true}).then(function(clientList){
      /* Если окно открыто — фокус на него */
      for(var i = 0; i < clientList.length; i++){
        var client = clientList[i];
        if(client.url.includes('index.html') && 'focus' in client){
          return client.focus();
        }
      }
      /* Иначе — открываем новое */
      if(clients.openWindow){
        return clients.openWindow('./index.html');
      }
    })
  );
});

console.log('[SW v46 ✅] Service Worker загружен');
