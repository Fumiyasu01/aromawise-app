import React from 'react';
import { Oil } from '../types/Oil';
import { getEnhancedOilById } from '../data/enhancedOils';
import BackHeader from './BackHeader';
import SafetyChecker from './SafetyChecker';
import './OilDetail.css';

interface OilDetailProps {
  oil: Oil;
  onAddToMyOils: (oil: Oil) => void;
  isInMyOils: boolean;
  onBack: () => void;
}

const OilDetail: React.FC<OilDetailProps> = ({ oil, onAddToMyOils, isInMyOils, onBack }) => {
  const enhancedOil = getEnhancedOilById(oil.id);
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      citrus: '🍋',
      floral: '🌸',
      herbal: '🌿',
      blend: '🧪',
      popular: '⭐'
    };
    return icons[category] || '🌿';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      citrus: '柑橘系',
      floral: 'フローラル・樹木系',
      herbal: 'ハーブ・スパイス系',
      blend: 'ブレンド',
      popular: '人気単品'
    };
    return names[category] || category;
  };

  const getUsageIcon = (usage: string) => {
    const icons: Record<string, string> = {
      'アロマ': '💨',
      '局所塗布': '🤲',
      '内服': '💧'
    };
    return icons[usage] || '•';
  };

  return (
    <div className="oil-detail">
      <BackHeader 
        title={oil.name}
        subtitle={getCategoryName(oil.category)}
        backLabel="オイル一覧"
        onBack={onBack}
      />
      <div className="oil-detail-content">
      <div className="oil-detail-header">
        <div className="oil-title">
          <span className="oil-category-icon">{getCategoryIcon(oil.category)}</span>
          <div>
            <h1>{oil.name}</h1>
            <p className="oil-category">{getCategoryName(oil.category)}</p>
          </div>
        </div>
        <button 
          className={`add-to-myoils-btn ${isInMyOils ? 'added' : ''}`}
          onClick={() => onAddToMyOils(oil)}
          disabled={isInMyOils}
        >
          {isInMyOils ? '✓ 追加済み' : '+ マイオイルに追加'}
        </button>
      </div>

      <div className="oil-aroma-section">
        <h3>🌸 香りの特徴</h3>
        <p>{oil.aroma}</p>
      </div>

      <div className="oil-description-section">
        <h3>📝 概要</h3>
        <p>{oil.description}</p>
      </div>

      <div className="oil-benefits-section">
        <h3>✨ 主な効果・効能</h3>
        <div className="benefits-list">
          {oil.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <span className="benefit-icon">•</span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="oil-symptoms-section">
        <h3>🎯 対応する症状</h3>
        <div className="symptoms-list">
          {oil.symptoms.map((symptom, index) => (
            <span key={index} className="symptom-tag">{symptom}</span>
          ))}
        </div>
      </div>

      <div className="oil-usage-section">
        <h3>🛠️ 使用方法</h3>
        <div className="usage-list">
          {oil.usage.map((usage, index) => (
            <div key={index} className="usage-item">
              <span className="usage-icon">{getUsageIcon(usage)}</span>
              {usage}
            </div>
          ))}
        </div>
      </div>

      <div className="oil-safety-section">
        <h3>⚠️ 安全性情報</h3>
        {enhancedOil ? (
          <SafetyChecker oil={enhancedOil} />
        ) : (
          <div className="safety-info">
            <div className="safety-item">
              <span className="safety-label">妊娠中の使用:</span>
              <span className={`safety-value ${oil.safetyInfo.pregnancy ? 'safe' : 'caution'}`}>
                {oil.safetyInfo.pregnancy ? '✓ 使用可能' : '✗ 使用注意'}
              </span>
            </div>
            <div className="safety-item">
              <span className="safety-label">お子様への使用:</span>
              <span className={`safety-value ${oil.safetyInfo.children ? 'safe' : 'caution'}`}>
                {oil.safetyInfo.children ? '✓ 使用可能' : '✗ 使用注意'}
              </span>
            </div>
            {oil.safetyInfo.notes && (
              <div className="safety-notes">
                <strong>注意事項:</strong> {oil.safetyInfo.notes}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="disclaimer">
        <p>※ この情報は教育目的のものです。医療上の問題については医師にご相談ください。</p>
      </div>
      </div>
    </div>
  );
};

export default OilDetail;