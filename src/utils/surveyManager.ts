// AromaWise Satisfaction Survey Manager

export class SurveyManager {
  private static readonly STORAGE_KEY = 'aromawise_surveys';
  private static readonly NEXT_SURVEY_KEY = 'aromawise_next_survey';
  private static readonly SURVEY_INTERVAL_DAYS = 30;
  private static readonly MIN_SESSIONS_FOR_SURVEY = 5;

  // サーベイを表示すべきかチェック
  static shouldShowSurvey(): boolean {
    const nextSurveyDate = localStorage.getItem(this.NEXT_SURVEY_KEY);
    const stats = JSON.parse(localStorage.getItem('aromawise_usage_stats') || '{}');
    
    // 初回利用から十分な使用実績があるか
    if (!stats.totalSessions || stats.totalSessions < this.MIN_SESSIONS_FOR_SURVEY) {
      return false;
    }

    // 次回サーベイ日が設定されていない場合（初回）
    if (!nextSurveyDate) {
      // インストールから7日経過していればサーベイ表示
      const installDate = new Date(stats.installDate || Date.now());
      const daysSinceInstall = this.daysBetween(installDate, new Date());
      return daysSinceInstall >= 7;
    }

    // 次回サーベイ日を過ぎているか
    const nextDate = new Date(nextSurveyDate);
    return new Date() >= nextDate;
  }

  // サーベイ延期（1週間後に再表示）
  static postponeSurvey(): void {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    localStorage.setItem(this.NEXT_SURVEY_KEY, nextDate.toISOString());
  }

  // サーベイスキップ（次回通常スケジュールで表示）
  static skipSurvey(): void {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + this.SURVEY_INTERVAL_DAYS);
    localStorage.setItem(this.NEXT_SURVEY_KEY, nextDate.toISOString());
  }

  // 保存されたサーベイ結果を取得
  static getSurveyResults(): any[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  // サーベイ統計を生成
  static generateSurveyStats(): any {
    const surveys = this.getSurveyResults();
    
    if (surveys.length === 0) {
      return {
        totalSurveys: 0,
        averageUsability: 0,
        averageRecommendationAccuracy: 0,
        averageInformationAmount: 0,
        mostUsedFeature: null,
        improvementSuggestions: []
      };
    }

    const usabilityRatings = surveys.map(s => s.answers[0]).filter(r => r);
    const recommendationRatings = surveys.map(s => s.answers[1]).filter(r => r);
    const informationRatings = surveys.map(s => s.answers[3]).filter(r => r);
    const features = surveys.map(s => s.answers[2]).filter(f => f);
    const suggestions = surveys.map(s => s.answers[4]).filter(s => s && s.trim());

    // 最頻機能を計算
    const featureCounts: Record<string, number> = {};
    features.forEach(feature => {
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });

    const mostUsedFeature = Object.keys(featureCounts).length > 0
      ? Object.entries(featureCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : null;

    return {
      totalSurveys: surveys.length,
      averageUsability: usabilityRatings.length > 0 
        ? Math.round((usabilityRatings.reduce((a, b) => a + b, 0) / usabilityRatings.length) * 10) / 10
        : 0,
      averageRecommendationAccuracy: recommendationRatings.length > 0 
        ? Math.round((recommendationRatings.reduce((a, b) => a + b, 0) / recommendationRatings.length) * 10) / 10
        : 0,
      averageInformationAmount: informationRatings.length > 0 
        ? Math.round((informationRatings.reduce((a, b) => a + b, 0) / informationRatings.length) * 10) / 10
        : 0,
      mostUsedFeature,
      featureUsage: featureCounts,
      improvementSuggestions: suggestions.slice(-5), // 最新5件
      latestSurveyDate: surveys.length > 0 ? surveys[surveys.length - 1].timestamp : null
    };
  }

  // 満足度トレンドを取得
  static getSatisfactionTrend(): any[] {
    const surveys = this.getSurveyResults();
    
    return surveys.map(survey => ({
      date: survey.timestamp,
      usability: survey.answers[0] || 0,
      recommendationAccuracy: survey.answers[1] || 0,
      informationAmount: survey.answers[3] || 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 次回サーベイ予定日を取得
  static getNextSurveyDate(): string | null {
    return localStorage.getItem(this.NEXT_SURVEY_KEY);
  }

  // 日数差を計算
  private static daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  }

  // サーベイデータをエクスポート
  static exportSurveyData(): string {
    const surveys = this.getSurveyResults();
    const stats = this.generateSurveyStats();
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalSurveys: surveys.length,
      surveys,
      statistics: stats
    }, null, 2);
  }

  // 開発/テスト用：強制的にサーベイを表示可能にする
  static forceEnableSurvey(): void {
    localStorage.removeItem(this.NEXT_SURVEY_KEY);
    const stats = JSON.parse(localStorage.getItem('aromawise_usage_stats') || '{}');
    stats.totalSessions = this.MIN_SESSIONS_FOR_SURVEY;
    stats.installDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(); // 8日前
    localStorage.setItem('aromawise_usage_stats', JSON.stringify(stats));
  }
}