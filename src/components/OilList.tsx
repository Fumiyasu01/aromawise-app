import React, { useState } from 'react';
import { Oil } from '../types/Oil';
import { oilsData } from '../data/oils';
import { analytics } from '../utils/analytics';
import './OilList.css';

interface OilListProps {
  onOilSelect: (oil: Oil) => void;
}

const OilList: React.FC<OilListProps> = ({ onOilSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const categories = [
    { id: 'all', label: 'すべて', count: oilsData.length },
    { id: 'citrus', label: '柑橘系', count: oilsData.filter(oil => oil.category === 'citrus').length },
    { id: 'floral', label: 'フローラル', count: oilsData.filter(oil => oil.category === 'floral').length },
    { id: 'herbal', label: 'ハーブ系', count: oilsData.filter(oil => oil.category === 'herbal').length },
    { id: 'blend', label: 'ブレンド', count: oilsData.filter(oil => oil.category === 'blend').length },
    { id: 'popular', label: '人気単品', count: oilsData.filter(oil => oil.category === 'popular').length }
  ];

  const filteredOils = selectedCategory === 'all' 
    ? oilsData 
    : oilsData.filter(oil => oil.category === selectedCategory);

  const sortedOils = [...filteredOils].sort((a, b) => {
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
      popular: '⭐'
    };
    return icons[category] || '🌿';
  };

  return (
    <div className="oil-list">
      <header className="oil-list-header">
        <h1>オイル一覧</h1>
        <p>{filteredOils.length}種類のオイル</p>
      </header>

      <div className="filters">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        <div className="sort-filter">
          <select 
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
        {sortedOils.map(oil => (
          <div key={oil.id} className="oil-item" onClick={() => {
            analytics.trackOilView(oil.id, oil.name, 'oils');
            onOilSelect(oil);
          }}>
            <div className="oil-item-header">
              <span className="oil-category-icon">{getCategoryIcon(oil.category)}</span>
              <h3>{oil.name}</h3>
            </div>
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
        ))}
      </div>
    </div>
  );
};

export default OilList;