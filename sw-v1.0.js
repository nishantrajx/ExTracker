/* ExTracker service worker: makes the app open offline. Network first (so updates arrive), cache as fallback. */
const V='extracker-v1',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'],XLSX='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));try{await c.put(XLSX,await fetch(XLSX,{mode:'no-cors'}))}catch(_){}self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.href===XLSX){e.respondWith(caches.match(XLSX).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(XLSX,c));return x})));return}
 if(u.origin!==self.location.origin)return;
 const net=Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,4000))]);
 e.respondWith(net.then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):null)||Response.error())))});
