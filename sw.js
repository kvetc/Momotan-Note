		// Service Worker 脚本 (sw.js)

const CACHE_VERSION = 'v1.0.0'; // 更新版本号以触发缓存更新
const CACHE_NAME = `Momotan-Note-${CACHE_VERSION}`;
const urlsToCache = [
	'/',
  'sw.js',
  'momonote.html',
  'img/note-64.png',
  'img/note.png',
  'img/notebanner2.png',
  'img/momotan.png',
  'img/svg.png',
  'img/storage.png',
  'img/vnut.png',
  'library/dexie.min.js',
  'library/marked.min.js',
];

// 安装阶段：缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求：缓存优先，但检查更新
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 立即返回缓存响应
      const fetchPromise = fetch(event.request).then(
        networkResponse => {
          // 更新缓存
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }
      );
      return cachedResponse || fetchPromise;
    })
  );
});