const CACHE = 'life-os-v51';
const CORE_ASSETS = ['./','./index.html','./content.js','./content2.js','./content3.js','./app.js','./manifest.json','./icon.svg'];
self.addEventListener('message', event => { if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
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
    const isAppAsset=/\\.(?:js|css|json|svg|png|webp|woff2?)$/i.test(url.pathname);
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    try{
      const response=await fetch(request,{cache:isAppAsset?'no-cache':'default'});
      if(response&&response.ok&&response.type==='basic'){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      if(cached)return cached;
      return new Response('Ресурс временно недоступен: '+url.pathname,{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
