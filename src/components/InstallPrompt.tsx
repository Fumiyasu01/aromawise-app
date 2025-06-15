import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // PWAがすでにインストールされているかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // インストールプロンプトのイベントリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 最後の表示から7日経過していたら表示
      const lastPromptTime = localStorage.getItem('lastInstallPromptTime');
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      if (!lastPromptTime || parseInt(lastPromptTime) < sevenDaysAgo) {
        setShowPrompt(true);
      }
    };

    // アプリのインストール成功を検知
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // インストールプロンプトを表示
      await deferredPrompt.prompt();
      
      // ユーザーの選択を待つ
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // プロンプトを非表示にする
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // 表示時刻を記録
      localStorage.setItem('lastInstallPromptTime', Date.now().toString());
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('lastInstallPromptTime', Date.now().toString());
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-icon">🌿</div>
        <div className="install-text">
          <h3>AromaWiseをインストール</h3>
          <p>ホーム画面に追加してオフラインでも使えるようにしましょう</p>
        </div>
        <div className="install-actions">
          <button 
            className="install-button"
            onClick={handleInstallClick}
          >
            インストール
          </button>
          <button 
            className="dismiss-button"
            onClick={handleDismiss}
            aria-label="閉じる"
          >
            後で
          </button>
        </div>
      </div>
    </div>
  );
};

// インストールバナー（小さいバージョン）
export const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // インストール済みの場合は表示しない
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // バナーを表示するかチェック
      const dismissedBanner = localStorage.getItem('installBannerDismissed');
      if (!dismissedBanner) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="install-banner">
      <span className="banner-icon">📲</span>
      <span className="banner-text">アプリをインストールして快適に使う</span>
      <button className="banner-install" onClick={handleInstall}>
        インストール
      </button>
      <button className="banner-dismiss" onClick={handleDismiss}>
        ×
      </button>
    </div>
  );
};

export default InstallPrompt;