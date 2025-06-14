// Service Worker for AromaWise PWA
const CACHE_NAME = 'aromawise-v1.0.1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあれば返す、なければネットワークから取得
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // 有効なレスポンスかチェック
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // レスポンスをクローンしてキャッシュに保存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // オフライン時のフォールバック
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// バックグラウンド同期（今後の拡張用）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // ユーザー設定の同期など
  }
});

// プッシュ通知（今後の拡張用）
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'AromaWiseからの新しいお知らせです',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', 
        title: '開く',
        icon: '/logo192.png'
      },
      {
        action: 'close', 
        title: '閉じる'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AromaWise', options)
  );
});

// 通知クリック処理（今後の拡張用）
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});