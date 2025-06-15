import React from 'react';
import './SettingsSection.css';

const AppInfo: React.FC = () => {
  const appVersion = '1.0.0';
  const buildDate = '2024年6月';

  return (
    <div className="settings-section">
      <h2 className="section-title">ℹ️ アプリ情報</h2>
      <p className="section-description">
        AromaWiseについての情報です。
      </p>

      <div className="info-section">
        <div className="app-logo-section">
          <div className="app-icon">🌿</div>
          <h3>AromaWise</h3>
          <p>スマートアロマガイド</p>
        </div>

        <div className="version-info">
          <div className="info-item">
            <span className="info-label">バージョン</span>
            <span className="info-value">{appVersion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ビルド</span>
            <span className="info-value">{buildDate}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>開発チーム</h3>
        <p>AromaWiseは、エッセンシャルオイルを安全に楽しく使っていただくために開発されました。</p>
        <div className="credits">
          <p>企画・開発: AromaWise Team</p>
          <p>技術協力: Anthropic Claude</p>
        </div>
      </div>

      <div className="info-section">
        <h3>利用規約とプライバシー</h3>
        <div className="legal-links">
          <a href="#" className="legal-link">
            📄 利用規約
          </a>
          <a href="#" className="legal-link">
            🔒 プライバシーポリシー
          </a>
          <a href="#" className="legal-link">
            📋 特定商取引法に基づく表記
          </a>
        </div>
      </div>

      <div className="info-section">
        <h3>オープンソースライセンス</h3>
        <p>このアプリは以下のオープンソースソフトウェアを使用しています：</p>
        <div className="license-list">
          <div className="license-item">
            <strong>React</strong> - MIT License
          </div>
          <div className="license-item">
            <strong>TypeScript</strong> - Apache 2.0 License
          </div>
          <div className="license-item">
            <strong>React Router</strong> - MIT License
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>謝辞</h3>
        <p>
          AromaWiseをご利用いただき、ありがとうございます。
          皆様のフィードバックが、より良いアプリ作りの原動力となっています。
        </p>
        <p>
          エッセンシャルオイルの素晴らしい世界を、より多くの方に安全に楽しんでいただけることを願っています。
        </p>
      </div>

      <div className="copyright">
        <p>© 2024 AromaWise. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AppInfo;