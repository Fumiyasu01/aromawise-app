import React, { useState, useEffect } from 'react';
import { Oil } from '../types/Oil';
import { getEnhancedOilById } from '../data/enhancedOils';
import './AdvancedSearch.css';

interface AdvancedSearchProps {
  oils: Oil[];
  onSearchResults: (results: Oil[]) => void;
  initialSearchTerm?: string;
}

interface FilterState {
  searchTerm: string;
  categories: string[];
  symptoms: string[];
  safety: {
    pregnancySafe: boolean;
    childrenSafe: boolean;
    petSafe: boolean;
  };
  usage: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ oils, onSearchResults, initialSearchTerm = '' }) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: initialSearchTerm,
    categories: [],
    symptoms: [],
    safety: {
      pregnancySafe: false,
      childrenSafe: false,
      petSafe: false
    },
    usage: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredCount, setFilteredCount] = useState(oils.length);

  // 利用可能なカテゴリーを取得
  const availableCategories = Array.from(new Set(oils.map(oil => oil.category)));
  
  // カテゴリーの日本語名マッピング
  const categoryNames: Record<string, string> = {
    citrus: '柑橘系',
    floral: 'フローラル',
    herbal: 'ハーブ',
    blend: 'ブレンド',
    popular: '人気',
    'ウッディ系': 'ウッディ系',
    'スパイス系': 'スパイス系',
    'カンファー系': 'カンファー系',
    'アーシー系': 'アーシー系',
    '感情アロマセラピー': '感情アロマセラピー',
    'キッズコレクション': 'キッズコレクション',
    '季節限定': '季節限定'
  };

  // 利用可能な症状を取得
  const availableSymptoms = Array.from(
    new Set(oils.flatMap(oil => oil.symptoms))
  ).sort();

  // 人気の症状（上位表示用）
  const popularSymptoms = [
    'ストレス',
    '不眠',
    '頭痛',
    '疲労',
    '集中力',
    '風邪',
    '筋肉痛',
    '消化不良',
    '不安',
    'リラックス'
  ];

  // 使用方法のオプション
  const usageMethods = ['アロマ', '局所塗布', '内服'];

  // フィルター適用
  useEffect(() => {
    let results = [...oils];

    // テキスト検索
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      results = results.filter(oil => 
        oil.name.toLowerCase().includes(searchLower) ||
        oil.description.toLowerCase().includes(searchLower) ||
        oil.aroma.toLowerCase().includes(searchLower) ||
        oil.benefits.some(b => b.toLowerCase().includes(searchLower)) ||
        oil.symptoms.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    // カテゴリーフィルター
    if (filters.categories.length > 0) {
      results = results.filter(oil => 
        filters.categories.includes(oil.category)
      );
    }

    // 症状フィルター
    if (filters.symptoms.length > 0) {
      results = results.filter(oil => 
        filters.symptoms.some(symptom => 
          oil.symptoms.includes(symptom)
        )
      );
    }

    // 安全性フィルター
    if (filters.safety.pregnancySafe) {
      results = results.filter(oil => oil.safetyInfo.pregnancy);
    }
    if (filters.safety.childrenSafe) {
      results = results.filter(oil => oil.safetyInfo.children);
    }
    if (filters.safety.petSafe) {
      results = results.filter(oil => {
        const enhancedOil = getEnhancedOilById(oil.id);
        if (enhancedOil) {
          return !enhancedOil.safety.petSafety.includes('猫への使用は避ける');
        }
        return true;
      });
    }

    // 使用方法フィルター
    if (filters.usage.length > 0) {
      results = results.filter(oil => 
        filters.usage.some(method => oil.usage.includes(method))
      );
    }

    setFilteredCount(results.length);
    onSearchResults(results);
  }, [filters, oils, onSearchResults]);

  // フィルターのリセット
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      categories: [],
      symptoms: [],
      safety: {
        pregnancySafe: false,
        childrenSafe: false,
        petSafe: false
      },
      usage: []
    });
  };

  // アクティブなフィルター数を計算
  const activeFilterCount = 
    filters.categories.length +
    filters.symptoms.length +
    filters.usage.length +
    (filters.safety.pregnancySafe ? 1 : 0) +
    (filters.safety.childrenSafe ? 1 : 0) +
    (filters.safety.petSafe ? 1 : 0);

  return (
    <div className="advanced-search">
      <div className="search-header">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="オイル名、効果、症状で検索..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="search-input"
          />
          <button
            className="filter-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="詳細フィルター"
          >
            <span className="filter-icon">⚙️</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
        <div className="search-stats">
          <span className="result-count">{filteredCount}件</span>
          {activeFilterCount > 0 && (
            <button className="reset-filters" onClick={resetFilters}>
              フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="filter-panel">
          {/* カテゴリーフィルター */}
          <div className="filter-section">
            <h3>カテゴリー</h3>
            <div className="filter-options">
              {availableCategories.map(category => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          categories: [...filters.categories, category]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter(c => c !== category)
                        });
                      }
                    }}
                  />
                  <span>{categoryNames[category] || category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 症状フィルター */}
          <div className="filter-section">
            <h3>症状・目的</h3>
            <div className="filter-tags">
              {popularSymptoms.map(symptom => (
                <button
                  key={symptom}
                  className={`filter-tag ${filters.symptoms.includes(symptom) ? 'active' : ''}`}
                  onClick={() => {
                    if (filters.symptoms.includes(symptom)) {
                      setFilters({
                        ...filters,
                        symptoms: filters.symptoms.filter(s => s !== symptom)
                      });
                    } else {
                      setFilters({
                        ...filters,
                        symptoms: [...filters.symptoms, symptom]
                      });
                    }
                  }}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <details className="more-symptoms">
              <summary>その他の症状を表示</summary>
              <div className="filter-tags">
                {availableSymptoms
                  .filter(s => !popularSymptoms.includes(s))
                  .map(symptom => (
                    <button
                      key={symptom}
                      className={`filter-tag ${filters.symptoms.includes(symptom) ? 'active' : ''}`}
                      onClick={() => {
                        if (filters.symptoms.includes(symptom)) {
                          setFilters({
                            ...filters,
                            symptoms: filters.symptoms.filter(s => s !== symptom)
                          });
                        } else {
                          setFilters({
                            ...filters,
                            symptoms: [...filters.symptoms, symptom]
                          });
                        }
                      }}
                    >
                      {symptom}
                    </button>
                  ))}
              </div>
            </details>
          </div>

          {/* 安全性フィルター */}
          <div className="filter-section">
            <h3>安全性</h3>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.safety.pregnancySafe}
                  onChange={(e) => setFilters({
                    ...filters,
                    safety: { ...filters.safety, pregnancySafe: e.target.checked }
                  })}
                />
                <span>🤰 妊娠中も安全</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.safety.childrenSafe}
                  onChange={(e) => setFilters({
                    ...filters,
                    safety: { ...filters.safety, childrenSafe: e.target.checked }
                  })}
                />
                <span>👶 子供も安全</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.safety.petSafe}
                  onChange={(e) => setFilters({
                    ...filters,
                    safety: { ...filters.safety, petSafe: e.target.checked }
                  })}
                />
                <span>🐾 ペットも安全</span>
              </label>
            </div>
          </div>

          {/* 使用方法フィルター */}
          <div className="filter-section">
            <h3>使用方法</h3>
            <div className="filter-options">
              {usageMethods.map(method => (
                <label key={method} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.usage.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          usage: [...filters.usage, method]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          usage: filters.usage.filter(u => u !== method)
                        });
                      }
                    }}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;