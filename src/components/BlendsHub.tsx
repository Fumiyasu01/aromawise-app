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
  const [activeTab, setActiveTab] = useState<'recipes' | 'custom' | 'fragrance' | 'effects'>('recipes');

  const myOils: Oil[] = []; // TODO: MyOilsManagerから取得

  return (
    <div className="blends-hub">

      <div className="blends-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <span className="tab-icon">📖</span>
          <span className="tab-label">レシピ</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          <span className="tab-icon">✨</span>
          <span className="tab-label">カスタム</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fragrance' ? 'active' : ''}`}
          onClick={() => setActiveTab('fragrance')}
        >
          <span className="tab-icon">🌸</span>
          <span className="tab-label">香り</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveTab('effects')}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">効果</span>
        </button>
      </div>

      <div className="blends-content">
        {activeTab === 'recipes' && (
          <Recipes 
            myOils={myOils}
            onRecipeSelect={onRecipeSelect}
          />
        )}
        {activeTab === 'custom' && (
          <CustomBlends />
        )}
        {activeTab === 'fragrance' && (
          <FragranceBlends 
            myOils={myOils}
            onBlendSelect={onBlendSelect}
          />
        )}
        {activeTab === 'effects' && (
          <EffectsFinder />
        )}
      </div>
    </div>
  );
};

export default BlendsHub;