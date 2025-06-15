import React from 'react';
import './Navigation.css';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: 'home' | 'oils' | 'recipes' | 'blends' | 'myoils' | 'safety' | 'settings' | 'pricing' | 'subscription' | 'custom-blends') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onScreenChange }) => {
  const navItems = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'oils', label: 'オイル一覧', icon: '🌿' },
    { id: 'myoils', label: 'マイオイル', icon: '💚' },
    { id: 'recipes', label: 'レシピ', icon: '🧪' },
    { id: 'custom-blends', label: 'カスタム', icon: '✨' },
    { id: 'blends', label: '香り', icon: '🌸' },
    { id: 'safety', label: '安全', icon: '🛡️' },
    { id: 'settings', label: '設定', icon: '⚙️' }
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