const CACHE = 'life-os-v49';
const CORE_ASSETS = ['./','./index.html','./content.js','./content2.js','./content3.js','./app.js','./manifest.json','./icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE_ASSETS.map(async asset => {
      try { const response = await fetch(asset, {cache:'reload'}); if(response.ok) await cache.put(asset,response); }
      catch(error) { console.warn('[SW] Не удалось загрузить:',asset,error); }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('life-os-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  const isNavigation=request.mode==='navigate'||request.destination==='document';
  if(isNavigation){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}
        return response;
      }catch(error){
        const cached=await caches.match('./index.html');
        return cached||new Response('Life OS временно недоступен. Проверьте подключение к интернету.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached) return cached;
    try{
      const response=await fetch(request);
      if(response&&response.ok&&response.type==='basic'){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
      return response;
    }catch(error){
      // Не подменяем JS/CSS/JSON/изображения документом index.html.
      return new Response('Ресурс временно недоступен: '+url.pathname,{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
