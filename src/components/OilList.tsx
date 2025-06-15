import React, { useState, useMemo } from 'react';
import { Oil } from '../types/Oil';
import { oilsData } from '../data/oils';
import { analytics } from '../utils/analytics';
import AdvancedSearch from './AdvancedSearch';
import VirtualizedList from './VirtualizedList';
import { useDebounce, PerformanceMonitor } from '../utils/performanceOptimizer';
import './OilList.css';

interface OilListProps {
  onOilSelect: (oil: Oil) => void;
}

const OilList: React.FC<OilListProps> = ({ onOilSelect }) => {
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchResults, setSearchResults] = useState<Oil[]>(oilsData);
  const [useVirtualization, setUseVirtualization] = useState(false);

  // パフォーマンス測定とメモ化されたソート
  const sortedOils = useMemo(() => {
    const endMeasurement = PerformanceMonitor.startMeasurement('oil-sort');
    
    const sorted = [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    
    endMeasurement();
    return sorted;
  }, [searchResults, sortBy]);
  
  // 大量データの場合は仮想化を自動有効化
  React.useEffect(() => {
    setUseVirtualization(sortedOils.length > 50);
  }, [sortedOils.length]);

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

      {/* 仮想化オプション（開発用） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="virtualization-toggle">
          <label>
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
            />
            仮想化リストを使用 ({sortedOils.length}件)
          </label>
        </div>
      )}

      {useVirtualization ? (
        <VirtualizedList
          items={sortedOils}
          itemHeight={200}
          containerHeight={600}
          renderItem={(oil, index) => (
            <OilListItem
              key={oil.id}
              oil={oil}
              onSelect={onOilSelect}
              getCategoryIcon={getCategoryIcon}
              getCategoryName={getCategoryName}
            />
          )}
          className="oils-virtualized"
        />
      ) : (
        <div className="oils-grid">
          {sortedOils.length > 0 ? (
            sortedOils.map(oil => (
              <OilListItem
                key={oil.id}
                oil={oil}
                onSelect={onOilSelect}
                getCategoryIcon={getCategoryIcon}
                getCategoryName={getCategoryName}
              />
            ))
          ) : (
            <div className="no-results">
              <span style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}>🔍</span>
              <p>条件に一致するオイルが見つかりませんでした</p>
              <p>フィルターを変更してお試しください</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// オイルアイテムコンポーネントの分離（メモ化のため）
const OilListItem: React.FC<{
  oil: Oil;
  onSelect: (oil: Oil) => void;
  getCategoryIcon: (category: string) => string;
  getCategoryName: (category: string) => string;
}> = React.memo(({ oil, onSelect, getCategoryIcon, getCategoryName }) => {
  const handleClick = () => {
    analytics.trackOilView(oil.id, oil.name, 'oils');
    onSelect(oil);
  };

  return (
    <div className="oil-item" onClick={handleClick}>
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
  );
});

export default OilList;