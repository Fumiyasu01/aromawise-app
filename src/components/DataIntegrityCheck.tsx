import React, { useState, useEffect } from 'react';
import { DataIntegrityManager, IntegrityReport, IntegrityIssue } from '../utils/dataIntegrityManager';
import './DataIntegrityCheck.css';

interface DataIntegrityCheckProps {
  onClose: () => void;
}

const DataIntegrityCheck: React.FC<DataIntegrityCheckProps> = ({ onClose }) => {
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<{ fixed: number; errors: string[] } | null>(null);

  useEffect(() => {
    runIntegrityCheck();
  }, []);

  const runIntegrityCheck = async () => {
    setIsChecking(true);
    // UIの応答性を保つため少し遅延
    setTimeout(() => {
      const newReport = DataIntegrityManager.checkIntegrity();
      setReport(newReport);
      setIsChecking(false);
    }, 100);
  };

  const handleAutoFix = async () => {
    if (!report) return;
    
    setIsFixing(true);
    setTimeout(() => {
      const result = DataIntegrityManager.autoFix();
      setFixResult(result);
      setIsFixing(false);
      // 修復後に再チェック
      runIntegrityCheck();
    }, 100);
  };

  const handleCleanupStorage = () => {
    const result = DataIntegrityManager.cleanupStorage();
    alert(`${result.deletedItems}個の不要なアイテムを削除し、${(result.freedSpace / 1024).toFixed(2)}KBの容量を解放しました。`);
    runIntegrityCheck();
  };

  const handleCreateBackup = () => {
    const backup = DataIntegrityManager.createBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aromawise_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: IntegrityIssue['severity']) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity: IntegrityIssue['severity']) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#0369a1';
      default: return '#6b7280';
    }
  };

  if (isChecking) {
    return (
      <div className="integrity-modal-overlay">
        <div className="integrity-modal">
          <div className="integrity-checking">
            <div className="spinner"></div>
            <p>データ整合性をチェック中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const criticalIssues = report.issues.filter(i => i.severity === 'critical');
  const highIssues = report.issues.filter(i => i.severity === 'high');
  const fixableIssues = report.issues.filter(i => i.fixable);

  return (
    <div className="integrity-modal-overlay">
      <div className="integrity-modal">
        <div className="integrity-header">
          <h2>データ整合性チェック</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="integrity-content">
          {/* 概要 */}
          <div className="integrity-summary">
            <div className="summary-item">
              <span className="label">チェック時刻:</span>
              <span className="value">{report.timestamp.toLocaleString('ja-JP')}</span>
            </div>
            <div className="summary-item">
              <span className="label">問題数:</span>
              <span className={`value ${report.issues.length > 0 ? 'warning' : 'good'}`}>
                {report.issues.length}件
              </span>
            </div>
            <div className="summary-item">
              <span className="label">ストレージ使用量:</span>
              <span className={`value ${report.storageUsage.percentage > 75 ? 'warning' : 'good'}`}>
                {report.storageUsage.percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* ストレージ使用量 */}
          <div className="storage-usage">
            <h3>ストレージ使用状況</h3>
            <div className="storage-bar">
              <div 
                className="storage-fill" 
                style={{ 
                  width: `${Math.min(report.storageUsage.percentage, 100)}%`,
                  backgroundColor: report.storageUsage.percentage > 90 ? '#dc2626' : 
                                   report.storageUsage.percentage > 75 ? '#ea580c' : '#22c55e'
                }}
              ></div>
            </div>
            <div className="storage-details">
              <span>使用中: {(report.storageUsage.used / 1024 / 1024).toFixed(2)}MB</span>
              <span>残り: {(report.storageUsage.available / 1024 / 1024).toFixed(2)}MB</span>
            </div>
          </div>

          {/* レコード統計 */}
          <div className="records-stats">
            <h3>データ統計</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{report.totalRecords.blends}</span>
                <span className="stat-label">ブレンド</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{report.totalRecords.reviews}</span>
                <span className="stat-label">レビュー</span>
              </div>
            </div>
          </div>

          {/* 問題一覧 */}
          {report.issues.length > 0 && (
            <div className="issues-section">
              <h3>検出された問題</h3>
              <div className="issues-list">
                {report.issues.map((issue, index) => (
                  <div 
                    key={index} 
                    className="issue-item"
                    style={{ borderLeftColor: getSeverityColor(issue.severity) }}
                  >
                    <div className="issue-header">
                      <span className="issue-icon">{getSeverityIcon(issue.severity)}</span>
                      <span className="issue-severity" style={{ color: getSeverityColor(issue.severity) }}>
                        {issue.severity.toUpperCase()}
                      </span>
                      {issue.fixable && <span className="fixable-badge">自動修復可能</span>}
                    </div>
                    <p className="issue-description">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 修復結果 */}
          {fixResult && (
            <div className="fix-result">
              <h3>修復結果</h3>
              <p className="fix-summary">
                {fixResult.fixed > 0 ? `${fixResult.fixed}件の問題を修復しました。` : '修復できる問題はありませんでした。'}
              </p>
              {fixResult.errors.length > 0 && (
                <div className="fix-errors">
                  <h4>修復エラー:</h4>
                  <ul>
                    {fixResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="integrity-actions">
            <button onClick={runIntegrityCheck} className="check-btn">
              再チェック
            </button>
            
            {fixableIssues.length > 0 && (
              <button 
                onClick={handleAutoFix} 
                className="fix-btn"
                disabled={isFixing}
              >
                {isFixing ? '修復中...' : `自動修復 (${fixableIssues.length}件)`}
              </button>
            )}
            
            <button onClick={handleCleanupStorage} className="cleanup-btn">
              ストレージ整理
            </button>
            
            <button onClick={handleCreateBackup} className="backup-btn">
              バックアップ作成
            </button>
          </div>

          {/* 警告メッセージ */}
          {(criticalIssues.length > 0 || highIssues.length > 0) && (
            <div className="integrity-warning">
              <p>
                <strong>⚠️ 重要:</strong> 
                {criticalIssues.length > 0 && ' 重大な問題が検出されました。'}
                {highIssues.length > 0 && ' 高優先度の問題があります。'}
                できるだけ早く対処することをお勧めします。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataIntegrityCheck;