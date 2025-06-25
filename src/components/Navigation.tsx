import React from 'react';
import './Navigation.css';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onScreenChange }) => {
  const navItems = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'oils', label: 'オイル', icon: '🌿' },
    { id: 'blends', label: 'ブレンド', icon: '🧪' },
    { id: 'guide', label: 'ガイド', icon: '🛡️' },
    { id: 'settings', label: '設定', icon: '⚙️' }
  ];

  console.log('Navigation rendered with currentScreen:', currentScreen);
  
  // Debug: Check if onScreenChange is properly passed
  React.useEffect(() => {
    console.log('Navigation mounted, onScreenChange function:', typeof onScreenChange);
  }, []);

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
          onClick={() => {
            console.log('Navigation button clicked:', item.id);
            onScreenChange(item.id);
          }}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;