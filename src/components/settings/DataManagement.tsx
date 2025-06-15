import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { MyOilsManager } from '../../utils/myOilsManager';
import DataIntegrityCheck from '../DataIntegrityCheck';
import './SettingsSection.css';

const DataManagement: React.FC = () => {
  const { exportSettings, importSettings, resetSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showIntegrityCheck, setShowIntegrityCheck] = useState(false);

  const handleExportAll = () => {
    // 設定データ
    const settingsData = exportSettings();
    
    // マイオイルデータ
    const myOilsData = JSON.stringify({
      myOils: MyOilsManager.getMyOils(),
      customBlends: MyOilsManager.getCustomBlends()
    }, null, 2);
    
    // 統合データ
    const allData = {
      settings: JSON.parse(settingsData),
      myOils: JSON.parse(myOilsData),
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    };
    
    // ダウンロード
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aromawise-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // 設定のインポート
        if (data.settings) {
          importSettings(JSON.stringify(data.settings));
        }
        
        // マイオイルのインポート
        if (data.myOils) {
          if (data.myOils.myOils) {
            MyOilsManager.saveMyOils(data.myOils.myOils);
          }
          if (data.myOils.customBlends) {
            localStorage.setItem('aromawise_custom_blends', JSON.stringify(data.myOils.customBlends));
          }
        }
        
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
    
    // ファイル入力をリセット
    event.target.value = '';
  };

  const handleResetAll = () => {
    // 設定のリセット
    resetSettings();
    
    // マイオイルのリセット
    MyOilsManager.saveMyOils([]);
    localStorage.removeItem('aromawise_custom_blends');
    
    // その他のローカルストレージデータもクリア
    const keysToKeep = ['darkMode']; // 保持したいキー
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('aromawise_') && !keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    setShowResetConfirm(false);
    window.location.reload();
  };

  const statistics = MyOilsManager.getStatistics();

  return (
    <div className="settings-section">
      <h2 className="section-title">📊 データ管理</h2>
      <p className="section-description">
        アプリのデータをバックアップ、復元、または削除します。
      </p>

      <div className="data-stats">
        <h3>データ使用状況</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">保存されたオイル</span>
            <span className="stat-value">{statistics.totalOils}個</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">使用履歴</span>
            <span className="stat-value">{statistics.totalUsage}件</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">カスタムブレンド</span>
            <span className="stat-value">{MyOilsManager.getCustomBlends().length}個</span>
          </div>
        </div>
      </div>

      <div className="data-actions">
        <h3>バックアップと復元</h3>
        
        <div className="action-item">
          <div className="action-info">
            <h4>データのエクスポート</h4>
            <p>すべての設定とマイオイルデータをファイルに保存します</p>
          </div>
          <button className="btn-primary" onClick={handleExportAll}>
            エクスポート
          </button>
        </div>

        <div className="action-item">
          <div className="action-info">
            <h4>データのインポート</h4>
            <p>保存したバックアップファイルから復元します</p>
            {importStatus === 'success' && (
              <p className="status-message success">✅ インポートが完了しました</p>
            )}
            {importStatus === 'error' && (
              <p className="status-message error">❌ インポートに失敗しました</p>
            )}
          </div>
          <label className="btn-secondary file-input-label">
            インポート
            <input
              type="file"
              accept=".json"
              onChange={handleImportAll}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* データ整合性チェック */}
      <div className="action-item">
        <div className="action-info">
          <h4>データ整合性チェック</h4>
          <p>データの整合性をチェックし、問題があれば自動修復します。</p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => setShowIntegrityCheck(true)}
        >
          整合性をチェック
        </button>
      </div>

      <div className="danger-zone">
        <h3>⚠️ 危険な操作</h3>
        
        <div className="action-item danger">
          <div className="action-info">
            <h4>すべてのデータを削除</h4>
            <p>設定、マイオイル、使用履歴などすべてのデータを削除します。この操作は取り消せません。</p>
          </div>
          {!showResetConfirm ? (
            <button className="btn-danger" onClick={() => setShowResetConfirm(true)}>
              データを削除
            </button>
          ) : (
            <div className="confirm-actions">
              <button className="btn-danger" onClick={handleResetAll}>
                本当に削除
              </button>
              <button className="btn-secondary" onClick={() => setShowResetConfirm(false)}>
                キャンセル
              </button>
            </div>
          )}
        </div>
      </div>

      {/* データ整合性チェックモーダル */}
      {showIntegrityCheck && (
        <DataIntegrityCheck onClose={() => setShowIntegrityCheck(false)} />
      )}
    </div>
  );
};

export default DataManagement;