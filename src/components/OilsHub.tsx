import React, { useState } from 'react';
import OilList from './OilList';
import MyOilsEnhanced from './MyOilsEnhanced';
import { Oil } from '../types/Oil';
import './OilsHub.css';

interface OilsHubProps {
  onOilSelect: (oil: Oil) => void;
}

const OilsHub: React.FC<OilsHubProps> = ({ onOilSelect }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'myoils'>('list');

  return (
    <div className="oils-hub">
      <div className="oils-hub-header">
        <h1>エッセンシャルオイル</h1>
        <p>オイルの情報を確認し、個人コレクションを管理</p>
      </div>

      <div className="oils-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <span className="tab-icon">🌿</span>
          <span className="tab-label">オイル一覧</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'myoils' ? 'active' : ''}`}
          onClick={() => setActiveTab('myoils')}
        >
          <span className="tab-icon">💚</span>
          <span className="tab-label">マイオイル</span>
        </button>
      </div>

      <div className="oils-content">
        {activeTab === 'list' && (
          <OilList onOilSelect={onOilSelect} />
        )}
        {activeTab === 'myoils' && (
          <MyOilsEnhanced onOilSelect={onOilSelect} />
        )}
      </div>
    </div>
  );
};

export default OilsHub;