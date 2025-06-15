import React, { useState } from 'react';
import { Oil } from '../types/Oil';
import { oilsData } from '../data/oils';
import { analytics } from '../utils/analytics';
import AdvancedSearch from './AdvancedSearch';
import './OilList.css';

interface OilListProps {
  onOilSelect: (oil: Oil) => void;
}

const OilList: React.FC<OilListProps> = ({ onOilSelect }) => {
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchResults, setSearchResults] = useState<Oil[]>(oilsData);

  const sortedOils = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      citrus: '🍋',
      floral: '🌸',
      herbal: '🌿',
      blend: '🧪',
      popular: '⭐',
      'ウッディ系': '🌲',
      'スパイス系': '🌶️',
      'カンファー系': '🌬️',
      'アーシー系': '🌍',
      '感情アロマセラピー': '💝',
      'キッズコレクション': '👶',
      '季節限定': '🎄'
    };
    return icons[category] || '🌿';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      citrus: '柑橘系',
      floral: 'フローラル',
      herbal: 'ハーブ',
      blend: 'ブレンド',
      popular: '人気'
    };
    return names[category] || category;
  };

  return (
    <div className="oil-list">
      <header className="oil-list-header">
        <h1>オイル一覧</h1>
        <p>{oilsData.length}種類のオイル</p>
      </header>

      <AdvancedSearch 
        oils={oilsData}
        onSearchResults={setSearchResults}
      />

      <div className="list-controls">
        <div className="results-info">
          {searchResults.length < oilsData.length && (
            <p className="filter-info">
              {searchResults.length}件が条件に一致
            </p>
          )}
        </div>
        <div className="sort-control">
          <label htmlFor="sort-select">並び順：</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">名前順</option>
            <option value="category">カテゴリ順</option>
          </select>
        </div>
      </div>

      <div className="oils-grid">
        {sortedOils.length > 0 ? (
          sortedOils.map(oil => (
            <div key={oil.id} className="oil-item" onClick={() => {
              analytics.trackOilView(oil.id, oil.name, 'oils');
              onOilSelect(oil);
            }}>
              <div className="oil-item-header">
                <span className="oil-category-icon">{getCategoryIcon(oil.category)}</span>
                <h3>{oil.name}</h3>
              </div>
              <p className="oil-category-label">{getCategoryName(oil.category)}</p>
              <p className="oil-aroma">{oil.aroma}</p>
              <div className="oil-benefits">
                {oil.benefits.slice(0, 3).map((benefit, index) => (
                  <span key={index} className="benefit-tag">{benefit}</span>
                ))}
              </div>
              <div className="oil-safety">
                {oil.safetyInfo.pregnancy && oil.safetyInfo.children ? (
                  <span className="safety-safe">✓ 一般使用OK</span>
                ) : (
                  <span className="safety-caution">⚠️ 使用注意</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <span style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}>🔍</span>
            <p>条件に一致するオイルが見つかりませんでした</p>
            <p>フィルターを変更してお試しください</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OilList;