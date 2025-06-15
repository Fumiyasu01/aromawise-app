import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '../../contexts/ThemeContext';
import './SettingsSection.css';

const AppPreferences: React.FC = () => {
  const { appSettings, updateAppSettings } = useSettings();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updateAppSettings({ theme });
    // テーマの即時適用
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      if (!isDarkMode) toggleDarkMode();
    } else if (theme === 'light') {
      if (isDarkMode) toggleDarkMode();
    }
  };

  return (
    <div className="settings-section">
      <h2 className="section-title">🎨 アプリ設定</h2>
      <p className="section-description">
        アプリの表示や動作をカスタマイズします。
      </p>

      <div className="preference-group">
        <h3>表示設定</h3>
        
        <div className="form-group">
          <label>テーマ</label>
          <select
            value={appSettings.theme}
            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'auto')}
          >
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
            <option value="auto">自動（システム設定に従う）</option>
          </select>
        </div>

        <div className="form-group">
          <label>言語</label>
          <select
            value={appSettings.language}
            onChange={(e) => updateAppSettings({ language: e.target.value as 'ja' | 'en' })}
          >
            <option value="ja">日本語</option>
            <option value="en" disabled>English（準備中）</option>
          </select>
        </div>
      </div>

      <div className="preference-group">
        <h3>通知設定</h3>
        
        <div className="toggle-item">
          <div className="toggle-label">
            <span>使用期限アラート</span>
            <small>オイルの使用期限が近づいたら通知します</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.notifications.expirationAlerts}
            onChange={(e) => updateAppSettings({
              notifications: {
                ...appSettings.notifications,
                expirationAlerts: e.target.checked
              }
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>在庫少アラート</span>
            <small>オイルの在庫が少なくなったら通知します</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.notifications.lowStockAlerts}
            onChange={(e) => updateAppSettings({
              notifications: {
                ...appSettings.notifications,
                lowStockAlerts: e.target.checked
              }
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>使用リマインダー</span>
            <small>定期的な使用を促すリマインダーを表示します</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.notifications.usageReminders}
            onChange={(e) => updateAppSettings({
              notifications: {
                ...appSettings.notifications,
                usageReminders: e.target.checked
              }
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>プッシュ通知</span>
            <small>デバイスへのプッシュ通知を有効にします（PWA化後）</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.notifications.pushEnabled}
            onChange={(e) => updateAppSettings({
              notifications: {
                ...appSettings.notifications,
                pushEnabled: e.target.checked
              }
            })}
            disabled
          />
        </div>
      </div>

      <div className="preference-group">
        <h3>プライバシー設定</h3>
        
        <div className="toggle-item">
          <div className="toggle-label">
            <span>使用状況分析</span>
            <small>アプリの改善のため匿名の使用データを収集します</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.privacy.analyticsEnabled}
            onChange={(e) => updateAppSettings({
              privacy: {
                ...appSettings.privacy,
                analyticsEnabled: e.target.checked
              }
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>クラッシュレポート</span>
            <small>アプリのエラー情報を自動送信します</small>
          </div>
          <input
            type="checkbox"
            checked={appSettings.privacy.crashReportingEnabled}
            onChange={(e) => updateAppSettings({
              privacy: {
                ...appSettings.privacy,
                crashReportingEnabled: e.target.checked
              }
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default AppPreferences;