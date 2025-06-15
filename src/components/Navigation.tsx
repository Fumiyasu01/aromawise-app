import React, { useState } from 'react';
import './Navigation.css';
import Feedback from './Feedback';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: 'home' | 'oils' | 'recipes' | 'blends' | 'myoils' | 'safety') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onScreenChange }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'oils', label: 'オイル一覧', icon: '🌿' },
    { id: 'recipes', label: 'レシピ', icon: '🧪' },
    { id: 'blends', label: '香りブレンド', icon: '🌸' },
    { id: 'myoils', label: 'マイオイル', icon: '💚' },
    { id: 'safety', label: '安全ガイド', icon: '🛡️' }
  ];

  return (
    <>
      <nav className="navigation">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => onScreenChange(item.id as any)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button
          className="nav-item feedback-nav-item"
          onClick={() => setShowFeedback(true)}
          title="フィードバックを送る"
        >
          <span className="nav-icon">📝</span>
          <span className="nav-label">フィードバック</span>
        </button>
      </nav>
      
      {showFeedback && (
        <Feedback onClose={() => setShowFeedback(false)} />
      )}
    </>
  );
};

export default Navigation;