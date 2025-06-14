import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/touch-improvements.css';
import Home from './components/Home';
import OilList from './components/OilList';
import OilDetail from './components/OilDetail';
import MyOils from './components/MyOils';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import FragranceBlends from './components/FragranceBlends';
import BlendDetail from './components/BlendDetail';
import Navigation from './components/Navigation';
import SatisfactionSurvey from './components/SatisfactionSurvey';
import { Oil } from './types/Oil';
import { BlendRecipe } from './types/BlendRecipe';
import { BlendSuggestion } from './types/FragranceBlend';
import { SymptomCategory, RecommendationResult } from './types/Recommendation';
import { blendRecipes } from './data/blendRecipes';
import { blendSuggestions } from './data/blendCompatibility';
import { analytics } from './utils/analytics';
import { SurveyManager } from './utils/surveyManager';

type Screen = 'home' | 'oils' | 'detail' | 'myoils' | 'recipes' | 'recipe-detail' | 'blends' | 'blend-detail';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<BlendRecipe | null>(null);
  const [selectedBlend, setSelectedBlend] = useState<BlendSuggestion | null>(null);
  const [myOils, setMyOils] = useState<Oil[]>([]);
  const [showSurvey, setShowSurvey] = useState<boolean>(false);
  
  // ナビゲーション統合状態
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['home']);
  const [homeState, setHomeState] = useState<{
    selectedSymptoms: SymptomCategory[];
    currentRecommendations: RecommendationResult | null;
    searchTerm: string;
  }>({ selectedSymptoms: [], currentRecommendations: null, searchTerm: '' });

  // ページ遷移時に一番上にスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  // サーベイ表示チェック
  useEffect(() => {
    const timer = setTimeout(() => {
      if (SurveyManager.shouldShowSurvey()) {
        setShowSurvey(true);
      }
    }, 10000); // 10秒後にチェック

    return () => clearTimeout(timer);
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
    if (!myOils.find(o => o.id === oil.id)) {
      setMyOils([...myOils, oil]);
    }
  };

  const handleRemoveFromMyOils = (oilId: string) => {
    setMyOils(myOils.filter(oil => oil.id !== oilId));
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
          setCurrentScreen('recipes');
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
            myOils={myOils}
            homeState={homeState}
            onHomeStateChange={setHomeState}
          />
        );
      case 'oils':
        return <OilList onOilSelect={handleOilSelect} />;
      case 'detail':
        return selectedOil ? (
          <OilDetail 
            oil={selectedOil} 
            onAddToMyOils={handleAddToMyOils}
            isInMyOils={myOils.some(o => o.id === selectedOil.id)}
            onBack={handleBack}
          />
        ) : null;
      case 'myoils':
        return <MyOils oils={myOils} onRemoveOil={handleRemoveFromMyOils} onOilSelect={handleOilSelect} />;
      case 'recipes':
        return (
          <Recipes 
            myOils={myOils} 
            onRecipeSelect={handleRecipeSelect} 
          />
        );
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetail recipe={selectedRecipe} myOils={myOils} onBack={handleBack} />
        ) : null;
      case 'blends':
        return (
          <FragranceBlends 
            myOils={myOils} 
            onBlendSelect={handleBlendSelect} 
          />
        );
      case 'blend-detail':
        return selectedBlend ? (
          <BlendDetail blend={selectedBlend} myOils={myOils} onBack={handleBack} />
        ) : null;
      default:
        return (
          <Home 
            onOilSelect={handleOilSelect}
            onRecipeSelect={handleRecipeSelect}
            onBlendSelect={handleBlendSelect}
            myOils={myOils}
            homeState={homeState}
            onHomeStateChange={setHomeState}
          />
        );
    }
  };

  return (
    <div className="App">
      <main className="main-content">
        {renderScreen()}
      </main>
      <Navigation 
        currentScreen={currentScreen} 
        onScreenChange={(screen) => {
          analytics.trackPageView(screen);
          setCurrentScreen(screen);
        }} 
      />
      
      {showSurvey && (
        <SatisfactionSurvey onClose={() => setShowSurvey(false)} />
      )}
    </div>
  );
}

export default App;
