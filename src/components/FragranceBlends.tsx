import React, { useState } from 'react';
import { Oil } from '../types/Oil';
import { BlendSuggestion } from '../types/FragranceBlend';
import { blendSuggestions } from '../data/blendCompatibility';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fragranceProfiles, aromaFamilyDescriptions } from '../data/fragranceProfiles';
import './FragranceBlends.css';

interface FragranceBlendsProps {
  myOils: Oil[];
  onBlendSelect: (blend: BlendSuggestion) => void;
}

const FragranceBlends: React.FC<FragranceBlendsProps> = ({ myOils, onBlendSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'すべて', icon: '🌈' },
    { id: 'energizing', label: 'エナジー', icon: '⚡' },
    { id: 'relaxing', label: 'リラックス', icon: '🧘' },
    { id: 'romantic', label: 'ロマンチック', icon: '💕' },
    { id: 'fresh', label: 'フレッシュ', icon: '🌿' },
    { id: 'sophisticated', label: '上品', icon: '✨' }
  ];

  const moods = [
    { id: 'all', label: 'すべて' },
    { id: 'morning', label: '朝の目覚め' },
    { id: 'focus', label: '集中力アップ' },
    { id: 'calm', label: '癒し・安らぎ' },
    { id: 'romantic', label: 'ロマンチック' },
    { id: 'fresh', label: '爽やか・浄化' },
    { id: 'elegant', label: '上品・洗練' }
  ];

  const filteredBlends = blendSuggestions.filter(blend => {
    const categoryMatch = selectedCategory === 'all' || blend.category === selectedCategory;
    const moodMatch = selectedMood === 'all' || 
      blend.mood.toLowerCase().includes(selectedMood) ||
      blend.name.toLowerCase().includes(selectedMood);
    return categoryMatch && moodMatch;
  });

  const checkCanMake = (blend: BlendSuggestion) => {
    return blend.oils.every(blendOil => 
      myOils.some(myOil => myOil.id === blendOil.oilId)
    );
  };

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 4.5) return '#4caf50';
    if (compatibility >= 4.0) return '#8bc34a';
    if (compatibility >= 3.5) return '#ff9800';
    return '#f44336';
  };

  const getCompatibilityLabel = (compatibility: number) => {
    if (compatibility >= 4.5) return '最高の相性';
    if (compatibility >= 4.0) return '相性良好';
    if (compatibility >= 3.5) return '相性普通';
    return '上級者向け';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      primary: '🎯',
      secondary: '🔸',
      accent: '✨'
    };
    return icons[role as keyof typeof icons] || '•';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      primary: 'メイン',
      secondary: 'サブ',
      accent: 'アクセント'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="fragrance-blends">
      <header className="blends-header">
        <h1>🌸 香りブレンド</h1>
        <p>アロマを組み合わせて理想の香りを見つけよう</p>
      </header>

      <div className="aroma-families-section">
        <h3>🎨 香りの系統</h3>
        <div className="aroma-families">
          {Object.entries(aromaFamilyDescriptions).map(([key, family]) => (
            <div key={key} className="aroma-family-card">
              <span className="family-icon">{family.icon}</span>
              <div className="family-info">
                <h4>{family.name}</h4>
                <p>{family.description}</p>
                <div className="characteristics">
                  {family.characteristics.map((char, index) => (
                    <span key={index} className="characteristic-tag">{char}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <div className="category-filters">
          <h4>カテゴリ:</h4>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="btn-icon">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mood-filters">
          <h4>シーン・気分:</h4>
          <div className="filter-buttons">
            {moods.map(mood => (
              <button
                key={mood.id}
                className={`filter-btn ${selectedMood === mood.id ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood.id)}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="blends-grid">
        {filteredBlends.map(blend => {
          const canMake = checkCanMake(blend);
          const missingOils = blend.oils.filter(blendOil => 
            !myOils.some(myOil => myOil.id === blendOil.oilId)
          );

          return (
            <div 
              key={blend.id} 
              className={`blend-card ${canMake ? 'can-make' : 'missing-oils'}`}
              onClick={() => onBlendSelect(blend)}
            >
              <div className="blend-header">
                <h3>{blend.name}</h3>
                <div className="compatibility-badge">
                  <span 
                    className="compatibility-score"
                    style={{ color: getCompatibilityColor(blend.compatibility) }}
                  >
                    ★ {blend.compatibility}
                  </span>
                  <span className="compatibility-label">
                    {getCompatibilityLabel(blend.compatibility)}
                  </span>
                </div>
              </div>

              <p className="blend-description">{blend.description}</p>

              <div className="blend-mood">
                <strong>雰囲気:</strong> {blend.mood}
              </div>

              <div className="blend-oils">
                <h4>使用オイル:</h4>
                <div className="oils-list">
                  {blend.oils.map((oil, index) => (
                    <div 
                      key={index} 
                      className={`oil-item ${myOils.some(myOil => myOil.id === oil.oilId) ? 'have' : 'missing'}`}
                    >
                      <div className="oil-role">
                        <span className="role-icon">{getRoleIcon(oil.role)}</span>
                        <span className="role-label">{getRoleLabel(oil.role)}</span>
                      </div>
                      <span className="oil-name">{oil.oilName}</span>
                      <span className="oil-drops">{oil.drops}滴</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="blend-status">
                {canMake ? (
                  <div className="can-make-status">
                    <span className="status-icon">✅</span>
                    <span>作成可能</span>
                  </div>
                ) : (
                  <div className="missing-status">
                    <span className="status-icon">⚠️</span>
                    <span>不足: {missingOils.length}種類</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {myOils.length === 0 && (
        <div className="no-oils-message">
          <h3>💡 マイオイルを追加して香りブレンドを楽しもう</h3>
          <p>オイル詳細画面から「マイオイルに追加」をして、<br />作成可能なブレンドを確認できます。</p>
        </div>
      )}
    </div>
  );
};

export default FragranceBlends;