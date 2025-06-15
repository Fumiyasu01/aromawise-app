import React, { useState, useEffect } from 'react';
import { offlineStorage } from '../utils/offlineStorage';
import './OfflineIndicator.css';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // ネットワーク状態の監視
    offlineStorage.watchNetworkStatus((online) => {
      setIsOnline(online);
      
      if (!online) {
        setMessage('オフラインモードです。データは端末に保存されます。');
        setShowBanner(true);
      } else if (!navigator.onLine && online) {
        // オフラインから復帰
        setMessage('オンラインに復帰しました。データを同期中...');
        setShowBanner(true);
        
        // 3秒後にバナーを非表示
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      }
    });
  }, []);

  if (!showBanner) return null;

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="offline-content">
        <span className="offline-icon">
          {isOnline ? '🟢' : '🔴'}
        </span>
        <span className="offline-message">{message}</span>
        <button 
          className="offline-close"
          onClick={() => setShowBanner(false)}
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;