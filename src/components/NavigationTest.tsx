import React from 'react';

const NavigationTest: React.FC = () => {
  const handleTestClick = (id: string) => {
    console.log('Test navigation clicked:', id);
    alert(`Navigation to ${id} works!`);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '0',
      right: '0',
      background: 'yellow',
      padding: '10px',
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'space-around'
    }}>
      <button onClick={() => handleTestClick('home')} style={{ padding: '10px', background: 'white', border: '1px solid black' }}>
        Test Home
      </button>
      <button onClick={() => handleTestClick('oils')} style={{ padding: '10px', background: 'white', border: '1px solid black' }}>
        Test Oils
      </button>
      <button onClick={() => handleTestClick('blends')} style={{ padding: '10px', background: 'white', border: '1px solid black' }}>
        Test Blends
      </button>
    </div>
  );
};

export default NavigationTest;