import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/touch-improvements.css';
import './styles/dark-mode.css';
import './styles/app-header.css';
import './styles/mobile-optimizations.css';
import './styles/effects-analyzer.css';
import './styles/elegant-theme.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './components/Home';
import OilDetail from './components/OilDetail';
import RecipeDetail from './components/RecipeDetail';
import BlendDetail from './components/BlendDetail';
import Navigation from './components/Navigation';
import SatisfactionSurvey from './components/SatisfactionSurvey';
import Settings from './components/Settings';
import AuthModal from './components/auth/AuthModal';
import Pricing from './components/subscription/Pricing';
import SubscriptionManagement from './components/subscription/SubscriptionManagement';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPrompt, { InstallBanner } from './components/InstallPrompt';
import SharedBlend from './components/SharedBlend';
import OilsHub from './components/OilsHub';
import BlendsHub from './components/BlendsHub';
import GuideHub from './components/GuideHub';
import NavigationDebug from './components/NavigationDebug';
import NavigationTest from './components/NavigationTest';
import { Oil } from './types/Oil';
import { BlendRecipe } from './types/BlendRecipe';
import { BlendSuggestion } from './types/FragranceBlend';
import { SymptomCategory, RecommendationResult } from './types/Recommendation';
import { blendRecipes } from './data/blendRecipes';
import { blendSuggestions } from './data/blendCompatibility';
import { analytics } from './utils/analytics';
import { SurveyManager } from './utils/surveyManager';
import { MyOilsManager } from './utils/myOilsManager';

type Screen = 'home' | 'oils' | 'detail' | 'blends' | 'recipe-detail' | 'blend-detail' | 'guide' | 'settings' | 'pricing' | 'subscription';

function AppInner() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<BlendRecipe | null>(null);
  const [selectedBlend, setSelectedBlend] = useState<BlendSuggestion | null>(null);
  // MyOilsEnhancedで管理するため削除
  // const [myOils, setMyOils] = useState<Oil[]>([]);
  const [showSurvey, setShowSurvey] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [sharedBlendData, setSharedBlendData] = useState<string | null>(null);
  
  // ナビゲーション統合状態
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['home']);
  const [homeState, setHomeState] = useState<{
    selectedSymptoms: SymptomCategory[];
    currentRecommendations: RecommendationResult | null;
  }>({ selectedSymptoms: [], currentRecommendations: null });

  // ページ遷移時に一番上にスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);
  
  // カスタムイベントリスナー（ナビゲーションの代替）
  useEffect(() => {
    const handleNavigateTo = (event: CustomEvent) => {
      const screen = event.detail as Screen;
      console.log('Custom navigation event received:', screen);
      if (['home', 'oils', 'blends', 'guide', 'settings'].includes(screen)) {
        setCurrentScreen(screen);
        analytics.trackPageView(screen);
      }
    };
    
    window.addEventListener('navigate-to', handleNavigateTo as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to', handleNavigateTo as EventListener);
    };
  }, []);

  // サーベイ表示チェック
  useEffect(() => {
    const timer = setTimeout(() => {
      if (SurveyManager.shouldShowSurvey()) {
        setShowSurvey(true);
      }
    }, 10000); // 10秒後にチェック

    return () => clearTimeout(timer);
  }, []);

  // URLパラメータをチェックして共有ブレンドを処理
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/shared-blend/')) {
      const encodedData = path.substring('/shared-blend/'.length);
      setSharedBlendData(encodedData);
    }
  }, []);

  const handleOilSelect = (oil: Oil) => {
    analytics.trackOilView(oil.id, oil.name, currentScreen);
    setSelectedOil(oil);
    setCurrentScreen('detail');
  };

  const handleRecipeSelect = (recipeOrId: BlendRecipe | string) => {
    const recipe = typeof recipeOrId === 'string' 
      ? blendRecipes.find(r => r.id === recipeOrId) || null
      : recipeOrId;
    
    if (recipe) {
      setSelectedRecipe(recipe);
      setNavigationHistory(prev => [...prev, currentScreen, 'recipe-detail']);
      setCurrentScreen('recipe-detail');
    }
  };

  const handleBlendSelect = (blendOrId: BlendSuggestion | string) => {
    const blend = typeof blendOrId === 'string'
      ? blendSuggestions.find(b => b.id === blendOrId) || null
      : blendOrId;
    
    if (blend) {
      setSelectedBlend(blend);
      setNavigationHistory(prev => [...prev, currentScreen, 'blend-detail']);
      setCurrentScreen('blend-detail');
    }
  };

  const handleAddToMyOils = (oil: Oil) => {
    // シンプルに追加（デフォルトの在庫情報で）
    MyOilsManager.addOil(oil, {
      quantity: 1,
      unit: 'bottles',
      purchaseDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1年後
    });
    
    // 追加成功のフィードバック
    alert(`${oil.name}をマイオイルに追加しました！`);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // 現在の画面を削除
      const previousScreen = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      // フォールバック
      switch (currentScreen) {
        case 'detail':
          setCurrentScreen('oils');
          break;
        case 'recipe-detail':
          setCurrentScreen('blends');
          break;
        case 'blend-detail':
          setCurrentScreen('blends');
          break;
        default:
          setCurrentScreen('home');
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home 
            onOilSelect={handleOilSelect}
            onRecipeSelect={handleRecipeSelect}
            onBlendSelect={handleBlendSelect}
            myOils={[]} // TODO: MyOilsManagerから取得
            homeState={homeState}
            onHomeStateChange={setHomeState}
            onScreenChange={setCurrentScreen}
          />
        );
      case 'oils':
        return <OilsHub onOilSelect={handleOilSelect} />;
      case 'detail':
        return selectedOil ? (
          <OilDetail 
            oil={selectedOil} 
            onAddToMyOils={handleAddToMyOils}
            isInMyOils={MyOilsManager.getMyOils().some(myOil => myOil.oilId === selectedOil.id)}
            onBack={handleBack}
          />
        ) : null;
      case 'blends':
        return <BlendsHub onRecipeSelect={handleRecipeSelect} onBlendSelect={handleBlendSelect} />;
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetail recipe={selectedRecipe} myOils={[]} onBack={handleBack} />
        ) : null;
      case 'blend-detail':
        return selectedBlend ? (
          <BlendDetail blend={selectedBlend} myOils={[]} onBack={handleBack} />
        ) : null;
      case 'guide':
        return <GuideHub />;
      case 'settings':
        return <Settings />;
      case 'pricing':
        return <Pricing onClose={() => setCurrentScreen('home')} />;
      case 'subscription':
        return <SubscriptionManagement />;
      default:
        return (
          <Home 
            onOilSelect={handleOilSelect}
            onRecipeSelect={handleRecipeSelect}
            onBlendSelect={handleBlendSelect}
            myOils={[]} // TODO: MyOilsManagerから取得
            homeState={homeState}
            onHomeStateChange={setHomeState}
            onScreenChange={setCurrentScreen}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="decorative-circles"></div>
        {/* PWAコンポーネント */}
        <OfflineIndicator />
        <InstallBanner />
        <NavigationDebug />
        <NavigationTest />
        
        {/* ヘッダー部分 */}
        <div className="app-header">
          {/* ダークモード切り替えボタン */}
          <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="ダークモード切り替え">
            <span className="dark-mode-toggle-icon">{isDarkMode ? '☀️' : '🌙'}</span>
          </button>
          
          {/* 認証状態表示 */}
          <div className="auth-status">
            {user && (
              <span className="user-welcome">
                {user.isGuest ? 'ゲスト' : user.name}
              </span>
            )}
            {user?.isGuest && (
              <button 
                className="btn-secondary auth-button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setShowAuthModal(true);
                }}
              >
                アカウント作成
              </button>
            )}
          </div>
        </div>
        
        <ErrorBoundary>
          <main className="main-content">
            {renderScreen()}
          </main>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Navigation 
            currentScreen={currentScreen} 
            onScreenChange={(screen) => {
              console.log('Navigation clicked:', screen);
              // ナビゲーション可能な画面のみ処理
              const validScreens: Screen[] = ['home', 'oils', 'blends', 'guide', 'settings'];
              if (validScreens.includes(screen as Screen)) {
                analytics.trackPageView(screen);
                setCurrentScreen(screen as Screen);
                // ナビゲーション履歴を更新
                setNavigationHistory(prev => [...prev, screen as Screen]);
              } else {
                console.error('Invalid screen:', screen);
              }
            }} 
          />
        </ErrorBoundary>
        
        {showSurvey && (
          <ErrorBoundary>
            <SatisfactionSurvey onClose={() => setShowSurvey(false)} />
          </ErrorBoundary>
        )}
        
        <ErrorBoundary>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        </ErrorBoundary>
        
        {/* PWAインストールプロンプト */}
        <ErrorBoundary>
          <InstallPrompt />
        </ErrorBoundary>
        
        {/* 共有ブレンド */}
        {sharedBlendData && (
          <ErrorBoundary>
            <SharedBlend
              encodedData={sharedBlendData}
              onClose={() => {
                setSharedBlendData(null);
                window.history.pushState({}, '', '/');
              }}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <SettingsProvider>
            <AppInner />
          </SettingsProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
