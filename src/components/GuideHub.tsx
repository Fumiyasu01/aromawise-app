import React from 'react';
import SafetyGuidelines from './SafetyGuidelines';
import './GuideHub.css';

const GuideHub: React.FC = () => {
  return (
    <div className="guide-hub">
      <div className="guide-hub-header">
        <h1>安全ガイド</h1>
        <p>エッセンシャルオイルの正しい使い方と安全な取り扱い方法</p>
      </div>

      <div className="guide-content">
        <SafetyGuidelines />
      </div>

      {/* 将来的に他のガイドを追加する場所 */}
      {/* 
      <div className="additional-guides">
        <div className="guide-section">
          <h2>使用方法ガイド</h2>
          <p>効果的な使用方法とテクニック</p>
        </div>
        <div className="guide-section">
          <h2>保存方法</h2>
          <p>品質を保つための正しい保存方法</p>
        </div>
      </div>
      */}
    </div>
  );
};

export default GuideHub;