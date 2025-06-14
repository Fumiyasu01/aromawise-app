// AromaWise Analytics - ユーザー行動分析システム

export interface UserSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews: string[];
  interactions: UserInteraction[];
  deviceInfo: DeviceInfo;
}

export interface UserInteraction {
  type: 'oil_view' | 'recipe_view' | 'blend_view' | 'search' | 'recommendation_click' | 'favorite_toggle' | 'navigation' | 'safety_check';
  timestamp: string;
  data: any;
  screen: string;
}

export interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
  language: string;
  timezone: string;
}

export interface UsageStats {
  totalSessions: number;
  totalTime: number;
  averageSessionTime: number;
  mostViewedOils: Array<{ oilId: string; count: number }>;
  mostUsedFeatures: Array<{ feature: string; count: number }>;
  searchTerms: Array<{ term: string; count: number; results: number }>;
  feedbackCount: number;
  lastActiveDate: string;
  installDate: string;
  favoriteOils: string[];
  preferredCategories: Array<{ category: string; score: number }>;
}

class AnalyticsManager {
  private currentSession: UserSession | null = null;
  private readonly STORAGE_KEY = 'aromawise_analytics';
  private readonly SESSION_KEY = 'aromawise_current_session';
  private readonly STATS_KEY = 'aromawise_usage_stats';

  constructor() {
    this.initializeSession();
    this.setupEventListeners();
  }

  // セッション初期化
  private initializeSession(): void {
    const sessionId = this.generateSessionId();
    const deviceInfo = this.getDeviceInfo();
    
    this.currentSession = {
      sessionId,
      startTime: new Date().toISOString(),
      pageViews: ['home'],
      interactions: [],
      deviceInfo
    };

    this.saveCurrentSession();
    this.updateStats();
  }

  // デバイス情報取得
  private getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // セッションID生成
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // イベントリスナー設定
  private setupEventListeners(): void {
    // ページ離脱時にセッション終了
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // バックグラウンド移行時
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.endSession();
      } else {
        this.initializeSession();
      }
    });
  }

  // ページビュー記録
  trackPageView(screen: string): void {
    if (!this.currentSession) return;

    this.currentSession.pageViews.push(screen);
    this.trackInteraction('navigation', { screen }, screen);
    this.saveCurrentSession();
  }

  // インタラクション記録
  trackInteraction(type: UserInteraction['type'], data: any, screen: string): void {
    if (!this.currentSession) return;

    const interaction: UserInteraction = {
      type,
      timestamp: new Date().toISOString(),
      data,
      screen
    };

    this.currentSession.interactions.push(interaction);
    this.saveCurrentSession();
    this.updateUsageStats(type, data);
  }

  // オイル閲覧記録
  trackOilView(oilId: string, oilName: string, screen: string): void {
    this.trackInteraction('oil_view', { oilId, oilName }, screen);
  }

  // 検索記録
  trackSearch(searchTerm: string, resultsCount: number, screen: string): void {
    this.trackInteraction('search', { searchTerm, resultsCount }, screen);
  }

  // 推奨クリック記録
  trackRecommendationClick(itemType: string, itemId: string, score: number, screen: string): void {
    this.trackInteraction('recommendation_click', { itemType, itemId, score }, screen);
  }

  // お気に入り切り替え記録
  trackFavoriteToggle(oilId: string, action: 'add' | 'remove', screen: string): void {
    this.trackInteraction('favorite_toggle', { oilId, action }, screen);
  }

  // 安全性チェック記録
  trackSafetyCheck(oilId: string, profile: any, warnings: string[], screen: string): void {
    this.trackInteraction('safety_check', { oilId, profile, warningCount: warnings.length }, screen);
  }

  // 使用統計更新
  private updateUsageStats(type: UserInteraction['type'], data: any): void {
    const stats = this.getUsageStats();
    
    // 機能使用回数更新
    const featureIndex = stats.mostUsedFeatures.findIndex(f => f.feature === type);
    if (featureIndex >= 0) {
      stats.mostUsedFeatures[featureIndex].count++;
    } else {
      stats.mostUsedFeatures.push({ feature: type, count: 1 });
    }

    // オイル閲覧回数更新
    if (type === 'oil_view' && data.oilId) {
      const oilIndex = stats.mostViewedOils.findIndex(o => o.oilId === data.oilId);
      if (oilIndex >= 0) {
        stats.mostViewedOils[oilIndex].count++;
      } else {
        stats.mostViewedOils.push({ oilId: data.oilId, count: 1 });
      }
    }

    // 検索語句記録
    if (type === 'search' && data.searchTerm) {
      const searchIndex = stats.searchTerms.findIndex(s => s.term === data.searchTerm);
      if (searchIndex >= 0) {
        stats.searchTerms[searchIndex].count++;
      } else {
        stats.searchTerms.push({ term: data.searchTerm, count: 1, results: data.resultsCount || 0 });
      }
    }

    stats.lastActiveDate = new Date().toISOString();
    this.saveUsageStats(stats);
  }

  // セッション終了
  endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = new Date(this.currentSession.endTime).getTime() - 
                                   new Date(this.currentSession.startTime).getTime();

    // セッション履歴に保存
    this.saveSessionHistory();
    
    // 統計更新
    const stats = this.getUsageStats();
    stats.totalSessions++;
    stats.totalTime += this.currentSession.duration;
    stats.averageSessionTime = stats.totalTime / stats.totalSessions;
    this.saveUsageStats(stats);

    this.currentSession = null;
    localStorage.removeItem(this.SESSION_KEY);
  }

  // 使用統計取得
  getUsageStats(): UsageStats {
    const stored = localStorage.getItem(this.STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // 初期統計
    return {
      totalSessions: 0,
      totalTime: 0,
      averageSessionTime: 0,
      mostViewedOils: [],
      mostUsedFeatures: [],
      searchTerms: [],
      feedbackCount: 0,
      lastActiveDate: new Date().toISOString(),
      installDate: new Date().toISOString(),
      favoriteOils: [],
      preferredCategories: []
    };
  }

  // 分析レポート生成
  generateReport(): any {
    const stats = this.getUsageStats();
    const sessions = this.getSessionHistory();
    
    return {
      overview: {
        totalSessions: stats.totalSessions,
        totalTimeMinutes: Math.round(stats.totalTime / 60000),
        averageSessionMinutes: Math.round(stats.averageSessionTime / 60000),
        daysActive: this.calculateActiveDays(),
        feedbackSubmitted: stats.feedbackCount
      },
      engagement: {
        topOils: stats.mostViewedOils.sort((a, b) => b.count - a.count).slice(0, 10),
        topFeatures: stats.mostUsedFeatures.sort((a, b) => b.count - a.count).slice(0, 10),
        searchActivity: stats.searchTerms.sort((a, b) => b.count - a.count).slice(0, 10)
      },
      device: sessions.length > 0 ? sessions[sessions.length - 1].deviceInfo : null,
      retention: {
        installDate: stats.installDate,
        lastActiveDate: stats.lastActiveDate,
        isActiveUser: this.isActiveUser()
      }
    };
  }

  // アクティブユーザー判定
  private isActiveUser(): boolean {
    const lastActive = new Date(this.getUsageStats().lastActiveDate);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActive <= 7; // 7日以内にアクティブ
  }

  // アクティブ日数計算
  private calculateActiveDays(): number {
    const installDate = new Date(this.getUsageStats().installDate);
    const lastActive = new Date(this.getUsageStats().lastActiveDate);
    return Math.ceil((lastActive.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // プライベートメソッド
  private updateStats(): void {
    const stats = this.getUsageStats();
    if (!stats.installDate) {
      stats.installDate = new Date().toISOString();
      this.saveUsageStats(stats);
    }
  }

  private saveCurrentSession(): void {
    if (this.currentSession) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.currentSession));
    }
  }

  private saveUsageStats(stats: UsageStats): void {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  private saveSessionHistory(): void {
    if (!this.currentSession) return;
    
    const history = this.getSessionHistory();
    history.push(this.currentSession);
    
    // 最新50セッションのみ保持
    const recentHistory = history.slice(-50);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentHistory));
  }

  private getSessionHistory(): UserSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

// グローバルインスタンス
export const analytics = new AnalyticsManager();