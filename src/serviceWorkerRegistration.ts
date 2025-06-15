// Service Workerの登録と管理

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    // Reactアプリがビルドされた後にService Workerを登録
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 開発環境での動作確認
        checkValidServiceWorker(swUrl, config);

        // ローカルホストに関する追加ログ
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'このウェブアプリはservice-workerによってキャッシュファーストで提供されています。' +
              '詳細: https://cra.link/PWA'
          );
        });
      } else {
        // 本番環境では通常通り登録
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 新しいコンテンツが利用可能
              console.log(
                '新しいコンテンツが利用可能です。すべてのタブを閉じた後、更新されます。'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // コンテンツがオフライン使用のためにキャッシュされました
              console.log('コンテンツはオフライン使用のためにキャッシュされました。');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Service Workerの登録中にエラーが発生しました:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Service Workerが見つかるかチェック。見つからない場合はリロード
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Service Workerが存在しない、または異なるアプリからのJS
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Service Workerが見つからない場合は、おそらく異なるアプリ
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service Workerが見つかった場合は通常通り登録
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'インターネット接続が見つかりません。アプリはオフラインモードで実行されています。'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}