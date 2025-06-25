import React, { useState } from 'react';
import Recipes from './Recipes';
import CustomBlends from './CustomBlends';
import FragranceBlends from './FragranceBlends';
import { EffectsFinder } from './EffectsFinder';
import { Oil } from '../types/Oil';
import { BlendRecipe } from '../types/BlendRecipe';
import { BlendSuggestion } from '../types/FragranceBlend';
import './BlendsHub.css';

interface BlendsHubProps {
  onRecipeSelect: (recipe: BlendRecipe) => void;
  onBlendSelect: (blend: BlendSuggestion) => void;
}

const BlendsHub: React.FC<BlendsHubProps> = ({ onRecipeSelect, onBlendSelect }) => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'create'>('recipes');

  const myOils: Oil[] = []; // TODO: MyOilsManagerから取得

  return (
    <div className="blends-hub">

      <div className="blends-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <span className="tab-icon">📖</span>
          <span className="tab-label">レシピ集</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <span className="tab-icon">🎨</span>
          <span className="tab-label">ブレンド作成</span>
        </button>
      </div>

      <div className="blends-content">
        {activeTab === 'recipes' && (
          <Recipes 
            myOils={myOils}
            onRecipeSelect={onRecipeSelect}
          />
        )}
        {activeTab === 'create' && (
          <CustomBlends />
        )}
      </div>
    </div>
  );
};

export default BlendsHub;