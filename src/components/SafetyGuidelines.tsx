import React, { useState } from 'react';
import { safetyGuidelines, SafetyGuideline } from '../data/safetyGuidelines';
import './SafetyGuidelines.css';

const SafetyGuidelines: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SafetyGuideline['category'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categoryIcons: Record<SafetyGuideline['category'], string> = {
    age_restrictions: '👶',
    pregnancy: '🤰',
    photosensitivity: '☀️',
    hot_oils: '🔥',
    pet_safety: '🐾'
  };

  const categoryColors: Record<SafetyGuideline['category'], string> = {
    age_restrictions: '#FF6B6B',
    pregnancy: '#FF9F40',
    photosensitivity: '#FFD93D',
    hot_oils: '#FF4757',
    pet_safety: '#6C5CE7'
  };

  const filteredGuidelines = safetyGuidelines.map(guideline => ({
    ...guideline,
    oils: guideline.oils.filter(oil =>
      oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oil.restriction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (oil.notes && oil.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(guideline => 
    !selectedCategory || guideline.category === selectedCategory
  ).filter(guideline => 
    guideline.oils.length > 0
  );

  const handleCategoryClick = (category: SafetyGuideline['category']) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="safety-guidelines">
      <header className="safety-header">
        <h1>🛡️ 安全ガイドライン</h1>
        <p>エッセンシャルオイルを安全に使用するための重要な情報</p>
      </header>

      <div className="safety-search">
        <input
          type="text"
          placeholder="オイル名や注意事項を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-filters">
        {Object.entries(categoryIcons).map(([category, icon]) => {
          const guideline = safetyGuidelines.find(g => g.category === category);
          return (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category as SafetyGuideline['category'])}
              style={{
                borderColor: selectedCategory === category ? categoryColors[category as SafetyGuideline['category']] : 'transparent',
                backgroundColor: selectedCategory === category ? `${categoryColors[category as SafetyGuideline['category']]}10` : 'transparent'
              }}
            >
              <span className="category-icon">{icon}</span>
              <span className="category-name">{guideline?.title}</span>
            </button>
          );
        })}
      </div>

      <div className="guidelines-content">
        {filteredGuidelines.length === 0 ? (
          <div className="no-results">
            <p>該当する安全情報が見つかりませんでした</p>
          </div>
        ) : (
          filteredGuidelines.map((guideline) => (
            <div key={guideline.category} className="guideline-section">
              <div 
                className="guideline-header"
                style={{ borderLeftColor: categoryColors[guideline.category] }}
              >
                <span className="guideline-icon">{categoryIcons[guideline.category]}</span>
                <div>
                  <h2>{guideline.title}</h2>
                  <p className="guideline-description">{guideline.description}</p>
                </div>
              </div>
              
              <div className="oils-grid">
                {guideline.oils.map((oil, index) => (
                  <div key={index} className="oil-safety-card">
                    <h3>{oil.name}</h3>
                    <p className="restriction">{oil.restriction}</p>
                    {oil.notes && <p className="notes">{oil.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="safety-footer">
        <div className="important-notes">
          <h3>⚠️ 重要な注意事項</h3>
          <ul>
            <li>この情報は一般的なガイドラインです。個人差があることをご理解ください。</li>
            <li>持病がある方、薬を服用中の方は、使用前に医師にご相談ください。</li>
            <li>初めて使用するオイルは必ずパッチテストを行ってください。</li>
            <li>異常を感じた場合は直ちに使用を中止し、医師にご相談ください。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;