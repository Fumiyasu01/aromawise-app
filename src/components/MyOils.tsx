import React from 'react';
import { Oil } from '../types/Oil';
import './MyOils.css';

interface MyOilsProps {
  oils: Oil[];
  onRemoveOil: (oilId: string) => void;
  onOilSelect: (oil: Oil) => void;
}

const MyOils: React.FC<MyOilsProps> = ({ oils, onRemoveOil, onOilSelect }) => {
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

  const groupedOils = oils.reduce((acc, oil) => {
    if (!acc[oil.category]) {
      acc[oil.category] = [];
    }
    acc[oil.category].push(oil);
    return acc;
  }, {} as Record<string, Oil[]>);

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

  if (oils.length === 0) {
    return (
      <div className="my-oils">
        <header className="my-oils-header">
          <h1>マイオイル</h1>
          <p>お気に入りのオイルを管理</p>
        </header>
        
        <div className="empty-state">
          <div className="empty-icon">💚</div>
          <h3>まだオイルが追加されていません</h3>
          <p>オイル詳細画面から「マイオイルに追加」をタップして、<br />お気に入りのオイルを管理しましょう。</p>
          <div className="tips">
            <h4>💡 マイオイル機能の活用方法</h4>
            <ul>
              <li>よく使うオイルをすぐに見つけられます</li>
              <li>カテゴリ別に整理されて表示されます</li>
              <li>安全性情報も一覧で確認できます</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-oils">
      <header className="my-oils-header">
        <h1>マイオイル</h1>
        <p>{oils.length}種類のオイルを管理中</p>
      </header>

      <div className="my-oils-content">
        {Object.entries(groupedOils).map(([category, categoryOils]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              <span className="category-icon">{getCategoryIcon(category)}</span>
              {getCategoryName(category)} ({categoryOils.length})
            </h3>
            
            <div className="oils-grid">
              {categoryOils.map(oil => (
                <div key={oil.id} className="my-oil-card">
                  <div className="oil-card-header">
                    <h4 onClick={() => onOilSelect(oil)}>{oil.name}</h4>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveOil(oil.id)}
                      title="マイオイルから削除"
                    >
                      ×
                    </button>
                  </div>
                  
                  <p className="oil-aroma" onClick={() => onOilSelect(oil)}>
                    {oil.aroma}
                  </p>
                  
                  <div className="oil-quick-info" onClick={() => onOilSelect(oil)}>
                    <div className="benefits-preview">
                      {oil.benefits.slice(0, 2).map((benefit, index) => (
                        <span key={index} className="benefit-tag">{benefit}</span>
                      ))}
                    </div>
                    
                    <div className="safety-preview">
                      {oil.safetyInfo.pregnancy && oil.safetyInfo.children ? (
                        <span className="safety-safe">✓ 一般使用OK</span>
                      ) : (
                        <span className="safety-caution">⚠️ 使用注意</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="usage-tips">
        <h4>🛠️ 使い方のコツ</h4>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">🔍</span>
            <p>オイル名をタップして詳細情報を確認</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🗂️</span>
            <p>カテゴリ別に自動で整理表示</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⚠️</span>
            <p>安全性情報も一目で確認可能</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOils;