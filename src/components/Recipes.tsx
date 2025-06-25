import React, { useState } from 'react';
import { BlendRecipe } from '../types/BlendRecipe';
import { blendRecipes } from '../data/blendRecipes';
import { Oil } from '../types/Oil';
import './Recipes.css';

interface RecipesProps {
  myOils: Oil[];
  onRecipeSelect: (recipe: BlendRecipe) => void;
}

const Recipes: React.FC<RecipesProps> = ({ myOils, onRecipeSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recipeType, setRecipeType] = useState<'therapy' | 'daily'>('therapy');

  const therapyCategories = [
    { id: 'all', label: 'すべて', icon: '🧪' },
    { id: '虫よけ', label: '虫よけ', icon: '🦟' },
    { id: '安眠', label: '安眠', icon: '😴' },
    { id: '集中力', label: '集中力', icon: '🧠' },
    { id: 'リラックス', label: 'リラックス', icon: '🧘' },
    { id: '空気清浄', label: '空気清浄', icon: '🌿' },
    { id: '気分転換', label: '気分転換', icon: '✨' }
  ];

  const dailyCategories = [
    { id: 'all', label: 'すべて', icon: '🏠' },
    { id: '洗濯', label: '洗濯', icon: '🧺' },
    { id: '掃除', label: '掃除', icon: '🧹' },
    { id: 'ボディケア', label: 'ボディケア', icon: '💆' },
    { id: '虫対策', label: '虫対策', icon: '🦟' },
    { id: 'バス', label: 'バス', icon: '🛁' },
    { id: 'その他', label: 'その他', icon: '✨' }
  ];

  const categories = recipeType === 'therapy' ? therapyCategories : dailyCategories;

  const typeFilteredRecipes = blendRecipes.filter(recipe => {
    if (recipeType === 'therapy') {
      return !['洗濯', '掃除', 'ボディケア', '虫対策', 'バス', 'その他'].includes(recipe.category);
    } else {
      return ['洗濯', '掃除', 'ボディケア', '虫対策', 'バス', 'その他', '虫よけ'].includes(recipe.category);
    }
  });

  const filteredRecipes = selectedCategory === 'all' 
    ? typeFilteredRecipes 
    : typeFilteredRecipes.filter(recipe => recipe.category === selectedCategory);

  const checkCanMake = (recipe: BlendRecipe) => {
    return recipe.oils.every(recipeOil => 
      myOils.some(myOil => myOil.id === recipeOil.oilId)
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#4caf50',
      medium: '#ff9800',
      hard: '#f44336'
    };
    return colors[difficulty as keyof typeof colors] || '#666';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: '簡単',
      medium: '普通',
      hard: '上級'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  return (
    <div className="recipes">
      <header className="recipes-header">
        <h1>🧪 ブレンドレシピ</h1>
        <p>アロマを組み合わせて新しい効能を生み出そう</p>
      </header>

      <div className="recipe-type-selector">
        <button
          className={`type-btn ${recipeType === 'therapy' ? 'active' : ''}`}
          onClick={() => {
            setRecipeType('therapy');
            setSelectedCategory('all');
          }}
        >
          <span className="type-icon">🌿</span>
          アロマブレンド
        </button>
        <button
          className={`type-btn ${recipeType === 'daily' ? 'active' : ''}`}
          onClick={() => {
            setRecipeType('daily');
            setSelectedCategory('all');
          }}
        >
          <span className="type-icon">🏠</span>
          日用品レシピ
        </button>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => {
          const canMake = checkCanMake(recipe);
          const missingOils = recipe.oils.filter(recipeOil => 
            !myOils.some(myOil => myOil.id === recipeOil.oilId)
          );

          return (
            <div 
              key={recipe.id} 
              className={`recipe-card ${canMake ? 'can-make' : 'missing-oils'}`}
              onClick={() => onRecipeSelect(recipe)}
            >
              <div className="recipe-header">
                <h3>{recipe.name}</h3>
                <div className="recipe-meta">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
                  >
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                  <span className="prep-time">⏱️ {recipe.prepTime}</span>
                </div>
              </div>

              <p className="recipe-description">{recipe.description}</p>

              <div className="recipe-oils">
                <h4>使用オイル:</h4>
                <div className="oils-list">
                  {recipe.oils.map((oil, index) => (
                    <span 
                      key={index} 
                      className={`oil-tag ${myOils.some(myOil => myOil.id === oil.oilId) ? 'have' : 'missing'}`}
                    >
                      {oil.oilName} ({oil.drops}滴)
                    </span>
                  ))}
                </div>
              </div>

              <div className="recipe-benefits">
                <h4>期待できる効果:</h4>
                <div className="benefits-preview">
                  {recipe.benefits.slice(0, 2).map((benefit, index) => (
                    <span key={index} className="benefit-tag">{benefit}</span>
                  ))}
                  {recipe.benefits.length > 2 && (
                    <span className="more-benefits">+{recipe.benefits.length - 2}</span>
                  )}
                </div>
              </div>

              <div className="recipe-status">
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
          <h3>💡 マイオイルを追加してレシピを確認しよう</h3>
          <p>オイル詳細画面から「マイオイルに追加」をして、<br />作成可能なレシピを確認できます。</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;