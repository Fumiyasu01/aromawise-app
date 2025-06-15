/* eslint-disable no-restricted-globals */

// Service Worker のバージョン管理
const CACHE_VERSION = 'v1';
const CACHE_NAME = `aromawise-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// キャッシュするファイルのリスト
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// インストールイベント
self.addEventListener('install', (event) => {
  console.log('[Service Worker] インストール中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] ファイルをキャッシュ中');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 新しいService Workerをすぐにアクティブにする
        return self.skipWaiting();
      })
  );
});

// アクティベートイベント
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] アクティベート中...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 古いキャッシュを削除
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] 古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // すべてのクライアントを制御下に置く
      return self.clients.claim();
    })
  );
});

// フェッチイベント
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }

  // APIリクエストの処理
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功したAPIレスポンスをキャッシュ
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(request);
        })
    );
    return;
  }

  // 静的アセットの処理
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }

        // ネットワークから取得
        return fetch(request).then((response) => {
          // 有効なレスポンスかチェック
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // レスポンスをキャッシュに保存
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // オフラインページを返す（必要に応じて）
        if (request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] バックグラウンド同期:', event.tag);
  
  if (event.tag === 'sync-myoils') {
    event.waitUntil(syncMyOilsData());
  }
});

// プッシュ通知
self.addEventListener('push', (event) => {
  console.log('[Service Worker] プッシュ通知を受信');
  
  const options = {
    body: event.data ? event.data.text() : 'AromaWiseからの通知',
    icon: '/logo192.png',
    badge: '/logo72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '開く',
        icon: '/logo48.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/logo48.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AromaWise', options)
  );
});

// 通知クリック
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知がクリックされました');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// MyOilsデータの同期
async function syncMyOilsData() {
  try {
    // IndexedDBからデータを取得
    const myOilsData = await getMyOilsFromIndexedDB();
    
    // サーバーに送信
    const response = await fetch('/api/sync/myoils', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myOilsData)
    });

    if (response.ok) {
      console.log('[Service Worker] MyOilsデータを同期しました');
    }
  } catch (error) {
    console.error('[Service Worker] 同期エラー:', error);
  }
}

// IndexedDBからデータを取得（仮実装）
async function getMyOilsFromIndexedDB() {
  // 実際の実装では、IndexedDBからデータを取得
  return {
    oils: [],
    lastUpdated: new Date().toISOString()
  };
}