import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import ProfileSettings from './settings/ProfileSettings';
import AppPreferences from './settings/AppPreferences';
import SafetySettings from './settings/SafetySettings';
import DataManagement from './settings/DataManagement';
import Support from './settings/Support';
import AppInfo from './settings/AppInfo';
import MobileTestSuite from './MobileTestSuite';
import './Settings.css';

type SettingsSection = 'profile' | 'preferences' | 'safety' | 'data' | 'support' | 'info';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const { userProfile } = useSettings();
  const [showMobileTestSuite, setShowMobileTestSuite] = useState(false);

  const sections = [
    { id: 'profile' as SettingsSection, icon: '👤', label: 'アカウント', badge: null },
    { id: 'preferences' as SettingsSection, icon: '🎨', label: 'アプリ設定', badge: null },
    { id: 'safety' as SettingsSection, icon: '🛡️', label: '安全設定', badge: null },
    { id: 'data' as SettingsSection, icon: '📊', label: 'データ管理', badge: null },
    { id: 'support' as SettingsSection, icon: '💬', label: 'サポート', badge: null },
    { id: 'info' as SettingsSection, icon: 'ℹ️', label: 'アプリ情報', badge: null }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'preferences':
        return <AppPreferences />;
      case 'safety':
        return <SafetySettings />;
      case 'data':
        return <DataManagement />;
      case 'support':
        return <Support />;
      case 'info':
        return <AppInfo />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>設定</h1>
        {userProfile.name && (
          <p className="user-greeting">こんにちは、{userProfile.name}さん</p>
        )}
        {process.env.NODE_ENV === 'development' && (
          <button 
            className="mobile-test-btn"
            onClick={() => setShowMobileTestSuite(true)}
          >
            📱 Mobile Test
          </button>
        )}
      </header>

      <div className="settings-container">
        <nav className="settings-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
              {section.badge && (
                <span className="nav-badge">{section.badge}</span>
              )}
              <span className="nav-arrow">›</span>
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {renderSection()}
        </div>
      </div>

      {showMobileTestSuite && (
        <MobileTestSuite onClose={() => setShowMobileTestSuite(false)} />
      )}
    </div>
  );
};

export default Settings;