import React from 'react';
import './Navigation.css';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: 'home' | 'oils' | 'recipes' | 'blends' | 'myoils') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onScreenChange }) => {
  const navItems = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'oils', label: 'オイル一覧', icon: '🌿' },
    { id: 'recipes', label: 'レシピ', icon: '🧪' },
    { id: 'blends', label: '香りブレンド', icon: '🌸' },
    { id: 'myoils', label: 'マイオイル', icon: '💚' }
  ];

  return (
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
    </nav>
  );
};

export default Navigation;