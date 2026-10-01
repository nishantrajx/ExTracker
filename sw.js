/* ExTracker service worker: makes the app open offline. Network first (so updates arrive), cache as fallback. */
const V='extracker-v3',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'],XLSX='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',EXT=[XLSX,...['app','auth','firestore'].map(n=>'https://www.gstatic.com/firebasejs/10.14.1/firebase-'+n+'-compat.js')];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));for(const u of EXT){try{await c.put(u,await fetch(u,{mode:'no-cors'}))}catch(_){}}self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(EXT.includes(u.href)){e.respondWith(caches.match(u.href).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(u.href,c));return x})));return}
 if(u.origin!==self.location.origin)return;
 const net=Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,4000))]);
 e.respondWith(net.then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):null)||Response.error())))});
