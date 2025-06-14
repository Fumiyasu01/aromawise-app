import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import './AnalyticsDashboard.css';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'feedback'>('overview');

  useEffect(() => {
    const generatedReport = analytics.generateReport();
    setReport(generatedReport);
  }, []);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}時間${remainingMinutes}分`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aromawise-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 機能名を日本語に変換
  const getFeatureName = (feature: string): string => {
    const featureNames: Record<string, string> = {
      'oil_view': 'オイル詳細表示',
      'recipe_view': 'レシピ表示',
      'blend_view': 'ブレンド表示', 
      'search': '検索',
      'recommendation_click': '推奨クリック',
      'favorite_toggle': 'お気に入り',
      'navigation': 'ナビゲーション',
      'safety_check': '安全性チェック'
    };
    return featureNames[feature] || feature;
  };

  // フィードバックデータ表示
  const renderFeedbackData = () => {
    const feedbackData = JSON.parse(localStorage.getItem('aromawise_feedback') || '[]');
    
    if (feedbackData.length === 0) {
      return <p className="no-data">フィードバックデータがありません</p>;
    }

    return (
      <div className="feedback-list">
        {feedbackData.slice(-5).reverse().map((feedback: any) => (
          <div key={feedback.id} className="feedback-item">
            <div className="feedback-header">
              <span className="feedback-rating">
                {'⭐'.repeat(feedback.rating)}
              </span>
              <span className="feedback-date">
                {formatDate(feedback.timestamp)}
              </span>
            </div>
            <p className="feedback-category">{feedback.category}</p>
            {feedback.comment && (
              <p className="feedback-comment">"{feedback.comment}"</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!report) {
    return (
      <div className="analytics-overlay">
        <div className="analytics-modal">
          <div className="analytics-loading">
            <div className="loading-spinner">📊</div>
            <p>分析データを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-overlay">
      <div className="analytics-modal">
        <div className="analytics-header">
          <h3>📊 使用統計ダッシュボード</h3>
          <button onClick={onClose} className="analytics-close">×</button>
        </div>

        <div className="analytics-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📈 概要
          </button>
          <button 
            className={`tab ${activeTab === 'engagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('engagement')}
          >
            🎯 エンゲージメント
          </button>
          <button 
            className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 フィードバック
          </button>
        </div>

        <div className="analytics-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-content">
                    <h4>総セッション数</h4>
                    <p className="stat-value">{report.overview.totalSessions}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <h4>総利用時間</h4>
                    <p className="stat-value">{formatDuration(report.overview.totalTimeMinutes)}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📱</div>
                  <div className="stat-content">
                    <h4>平均セッション時間</h4>
                    <p className="stat-value">{formatDuration(report.overview.averageSessionMinutes)}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h4>アクティブ日数</h4>
                    <p className="stat-value">{report.overview.daysActive}日</p>
                  </div>
                </div>
              </div>

              <div className="device-info">
                <h4>💻 デバイス情報</h4>
                {report.device && (
                  <div className="device-details">
                    <p><strong>画面サイズ:</strong> {report.device.screenWidth} × {report.device.screenHeight}</p>
                    <p><strong>デバイス:</strong> {report.device.isMobile ? 'モバイル' : report.device.isTablet ? 'タブレット' : 'デスクトップ'}</p>
                    <p><strong>言語:</strong> {report.device.language}</p>
                    <p><strong>タイムゾーン:</strong> {report.device.timezone}</p>
                  </div>
                )}
              </div>

              <div className="retention-info">
                <h4>🔄 継続利用状況</h4>
                <div className="retention-details">
                  <p><strong>初回利用:</strong> {formatDate(report.retention.installDate)}</p>
                  <p><strong>最終利用:</strong> {formatDate(report.retention.lastActiveDate)}</p>
                  <p><strong>ユーザー状態:</strong> 
                    <span className={`status ${report.retention.isActiveUser ? 'active' : 'inactive'}`}>
                      {report.retention.isActiveUser ? 'アクティブ' : '休眠中'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="engagement-tab">
              <div className="engagement-section">
                <h4>🌿 人気オイル</h4>
                <div className="ranking-list">
                  {report.engagement.topOils.map((oil: any, index: number) => (
                    <div key={oil.oilId} className="ranking-item">
                      <span className="ranking-position">{index + 1}</span>
                      <span className="ranking-name">{oil.oilId}</span>
                      <span className="ranking-count">{oil.count}回</span>
                    </div>
                  ))}
                  {report.engagement.topOils.length === 0 && (
                    <p className="no-data">まだデータがありません</p>
                  )}
                </div>
              </div>

              <div className="engagement-section">
                <h4>⭐ 人気機能</h4>
                <div className="ranking-list">
                  {report.engagement.topFeatures.map((feature: any, index: number) => (
                    <div key={feature.feature} className="ranking-item">
                      <span className="ranking-position">{index + 1}</span>
                      <span className="ranking-name">{getFeatureName(feature.feature)}</span>
                      <span className="ranking-count">{feature.count}回</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="engagement-section">
                <h4>🔍 検索ワード</h4>
                <div className="ranking-list">
                  {report.engagement.searchActivity.map((search: any, index: number) => (
                    <div key={search.term} className="ranking-item">
                      <span className="ranking-position">{index + 1}</span>
                      <span className="ranking-name">"{search.term}"</span>
                      <span className="ranking-count">{search.count}回</span>
                    </div>
                  ))}
                  {report.engagement.searchActivity.length === 0 && (
                    <p className="no-data">検索履歴がありません</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="feedback-tab">
              <div className="feedback-overview">
                <div className="feedback-stat">
                  <h4>📝 送信済みフィードバック</h4>
                  <p className="big-number">{report.overview.feedbackSubmitted}</p>
                </div>
              </div>
              
              <div className="feedback-data">
                <h4>💬 フィードバック詳細</h4>
                {renderFeedbackData()}
              </div>
            </div>
          )}
        </div>

        <div className="analytics-footer">
          <button onClick={exportData} className="export-btn">
            📥 データエクスポート
          </button>
          <p className="privacy-note">
            ℹ️ すべてのデータはデバイス内に保存され、外部送信されません
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;