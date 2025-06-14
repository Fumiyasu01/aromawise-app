import React from 'react';
import './BackHeader.css';

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  backLabel: string;
  onBack: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title, subtitle, backLabel, onBack }) => {
  return (
    <header className="back-header">
      <button className="back-button" onClick={onBack}>
        <span className="back-icon">←</span>
        <span className="back-label">{backLabel}</span>
      </button>
      <div className="header-title-section">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export default BackHeader;