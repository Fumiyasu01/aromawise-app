import React from 'react';
import './Navigation.css';
import './navigation-fix.css';

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
    
    // Check for overlapping elements
    const navElement = document.querySelector('.navigation');
    if (navElement) {
      const rect = navElement.getBoundingClientRect();
      console.log('Navigation position:', rect);
      
      // Check what element is at the center of the first nav button
      const firstButton = navElement.querySelector('.nav-item');
      if (firstButton) {
        const btnRect = firstButton.getBoundingClientRect();
        const centerX = btnRect.left + btnRect.width / 2;
        const centerY = btnRect.top + btnRect.height / 2;
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        console.log('Element at nav button center:', elementAtPoint);
        console.log('Expected element:', firstButton);
        
        // Check computed styles
        const computedStyle = window.getComputedStyle(firstButton);
        console.log('Nav button computed styles:', {
          pointerEvents: computedStyle.pointerEvents,
          zIndex: computedStyle.zIndex,
          position: computedStyle.position,
          display: computedStyle.display
        });
      }
    }
  }, []);

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
          onClick={(e) => {
            console.log('Navigation button clicked:', item.id);
            console.log('Click event:', e);
            console.log('Event target:', e.target);
            console.log('Current target:', e.currentTarget);
            e.stopPropagation();
            onScreenChange(item.id);
          }}
          onPointerDown={(e) => {
            console.log('Pointer down on:', item.id);
          }}
          onTouchStart={(e) => {
            console.log('Touch start on:', item.id);
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