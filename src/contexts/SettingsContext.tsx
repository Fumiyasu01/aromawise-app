import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  isPregnant: boolean;
  pregnancyTrimester?: 1 | 2 | 3;
  isNursing: boolean;
  hasPets: boolean;
  petTypes: ('dog' | 'cat' | 'other')[];
  allergies: string[];
  medicalConditions: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  notifications: {
    expirationAlerts: boolean;
    lowStockAlerts: boolean;
    usageReminders: boolean;
    pushEnabled: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReportingEnabled: boolean;
  };
}

export interface SafetySettings {
  alwaysCheckPregnancy: boolean;
  alwaysCheckChildren: boolean;
  alwaysCheckPets: boolean;
  childrenAges: number[];
  photosensitivityWarning: boolean;
}

interface SettingsContextType {
  userProfile: UserProfile;
  appSettings: AppSettings;
  safetySettings: SafetySettings;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  updateSafetySettings: (updates: Partial<SafetySettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (data: string) => boolean;
}

const defaultUserProfile: UserProfile = {
  name: '',
  email: '',
  age: 25,
  isPregnant: false,
  isNursing: false,
  hasPets: false,
  petTypes: [],
  allergies: [],
  medicalConditions: []
};

const defaultAppSettings: AppSettings = {
  theme: 'auto',
  language: 'ja',
  notifications: {
    expirationAlerts: true,
    lowStockAlerts: true,
    usageReminders: false,
    pushEnabled: false
  },
  privacy: {
    analyticsEnabled: true,
    crashReportingEnabled: true
  }
};

const defaultSafetySettings: SafetySettings = {
  alwaysCheckPregnancy: false,
  alwaysCheckChildren: false,
  alwaysCheckPets: false,
  childrenAges: [],
  photosensitivityWarning: true
};

const SETTINGS_STORAGE_KEY = 'aromawise_settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [safetySettings, setSafetySettings] = useState<SafetySettings>(defaultSafetySettings);

  // 設定の読み込み
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          if (settings.userProfile) setUserProfile(settings.userProfile);
          if (settings.appSettings) setAppSettings(settings.appSettings);
          if (settings.safetySettings) setSafetySettings(settings.safetySettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  // 設定の保存
  useEffect(() => {
    const settings = {
      userProfile,
      appSettings,
      safetySettings
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [userProfile, appSettings, safetySettings]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const updateAppSettings = (updates: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...updates }));
  };

  const updateSafetySettings = (updates: Partial<SafetySettings>) => {
    setSafetySettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setUserProfile(defaultUserProfile);
    setAppSettings(defaultAppSettings);
    setSafetySettings(defaultSafetySettings);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  const exportSettings = () => {
    const settings = {
      userProfile,
      appSettings,
      safetySettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (data: string): boolean => {
    try {
      const settings = JSON.parse(data);
      if (settings.userProfile) setUserProfile(settings.userProfile);
      if (settings.appSettings) setAppSettings(settings.appSettings);
      if (settings.safetySettings) setSafetySettings(settings.safetySettings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{
      userProfile,
      appSettings,
      safetySettings,
      updateUserProfile,
      updateAppSettings,
      updateSafetySettings,
      resetSettings,
      exportSettings,
      importSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};