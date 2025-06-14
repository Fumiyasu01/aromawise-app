import React, { useState } from 'react';
import './MedicalDisclaimer.css';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'compact' | 'full';
  showDismiss?: boolean;
  className?: string;
}

const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ 
  variant = 'banner', 
  showDismiss = false,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && showDismiss) {
    return null;
  }

  const getContent = () => {
    switch (variant) {
      case 'banner':
        return {
          icon: 'ℹ️',
          title: '安全にご利用ください',
          message: 'この情報は教育目的のものです。医療上の問題については医師にご相談ください。',
          cta: null
        };
      case 'compact':
        return {
          icon: '⚠️',
          title: '医療免責事項',
          message: '医療上の問題については医師にご相談ください。',
          cta: null
        };
      case 'full':
        return {
          icon: '🏥',
          title: '医療免責事項・安全性に関する重要な情報',
          message: '',
          cta: null
        };
      default:
        return {
          icon: '⚕️',
          title: '安全性情報',
          message: '医療上の問題については医師にご相談ください。',
          cta: null
        };
    }
  };

  const content = getContent();

  if (variant === 'full') {
    return (
      <div className={`medical-disclaimer medical-disclaimer--full ${className}`}>
        <div className="disclaimer-header">
          <span className="disclaimer-icon">{content.icon}</span>
          <h2>{content.title}</h2>
        </div>
        
        <div className="disclaimer-content">
          <div className="disclaimer-section">
            <h3>📋 このアプリについて</h3>
            <ul>
              <li>AromaWiseは教育目的で作成されたエッセンシャルオイル情報アプリです</li>
              <li>医療診断、治療、予防を目的としたものではありません</li>
              <li>専門的な医療アドバイスに代わるものではありません</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h3>⚠️ 使用前の注意事項</h3>
            <ul>
              <li><strong>医師への相談</strong>: 妊娠中、授乳中、持病がある方は使用前に医師にご相談ください</li>
              <li><strong>パッチテスト</strong>: 初回使用時は必ずパッチテストを行ってください</li>
              <li><strong>希釈使用</strong>: エッセンシャルオイルは原液での使用を避け、適切に希釈してください</li>
              <li><strong>内服禁止</strong>: 専門指導なしにエッセンシャルオイルを内服しないでください</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h3>🚨 緊急時の対応</h3>
            <ul>
              <li>皮膚に異常が現れた場合は直ちに使用を中止し、大量の水で洗い流してください</li>
              <li>誤飲した場合は無理に吐かず、速やかに医療機関を受診してください</li>
              <li>重篤な症状が現れた場合は救急医療機関にご連絡ください</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h3>👶 特別な注意が必要な方</h3>
            <ul>
              <li><strong>乳幼児・小児</strong>: 3歳未満への使用は避け、小児は必ず保護者の監督下で使用</li>
              <li><strong>妊娠・授乳中</strong>: 多くのオイルは使用を避けるか医師の指導が必要</li>
              <li><strong>高齢者</strong>: より低濃度での使用を推奨</li>
              <li><strong>ペット</strong>: 多くのエッセンシャルオイルはペットに有害です</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h3>📞 相談先</h3>
            <div className="consultation-info">
              <div className="consultation-item">
                <strong>医療相談</strong>
                <p>かかりつけ医、皮膚科医、産婦人科医など</p>
              </div>
              <div className="consultation-item">
                <strong>中毒情報</strong>
                <p>日本中毒情報センター<br/>大阪：072-727-2499<br/>つくば：029-852-9999</p>
              </div>
              <div className="consultation-item">
                <strong>アロマテラピー相談</strong>
                <p>公益社団法人日本アロマ環境協会（AEAJ）認定アロマテラピーアドバイザー</p>
              </div>
            </div>
          </div>

          <div className="disclaimer-footer">
            <p><strong>最終更新:</strong> 2024年6月</p>
            <p><strong>情報源:</strong> 国際アロマセラピー協会ガイドライン、AEAJ安全ガイドライン、各種学術研究</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`medical-disclaimer medical-disclaimer--${variant} ${className}`}>
      {showDismiss && (
        <button 
          className="disclaimer-dismiss"
          onClick={() => setIsDismissed(true)}
          aria-label="免責事項を閉じる"
        >
          ×
        </button>
      )}
      
      <div className="disclaimer-content">
        <span className="disclaimer-icon">{content.icon}</span>
        <div className="disclaimer-text">
          <strong className="disclaimer-title">{content.title}</strong>
          {content.message && <p className="disclaimer-message">{content.message}</p>}
        </div>
        {content.cta && (
          <button className="disclaimer-cta">
            {content.cta}
          </button>
        )}
      </div>
    </div>
  );
};

export default MedicalDisclaimer;