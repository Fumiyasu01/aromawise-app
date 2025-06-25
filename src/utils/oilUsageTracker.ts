export interface OilUsageRecord {
  oilId: string;
  date: string;
  missions: {
    missionId: string;
    completed: boolean;
    completedAt?: string;
  }[];
  notes?: string;
  photo?: string;
}

export interface UsageStats {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  favoriteOils: { oilId: string; count: number }[];
  completedMissions: number;
  totalMissions: number;
}

export class OilUsageTracker {
  private static STORAGE_KEY = 'aromawise_oil_usage';
  private static STATS_KEY = 'aromawise_usage_stats';

  static recordUsage(record: OilUsageRecord): void {
    const records = this.getAllRecords();
    const existingIndex = records.findIndex(
      r => r.date === record.date && r.oilId === record.oilId
    );
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    this.updateStats();
  }

  static updateMissionStatus(date: string, missionId: string, completed: boolean): void {
    const records = this.getAllRecords();
    const record = records.find(r => r.date === date);
    
    if (record) {
      const mission = record.missions.find(m => m.missionId === missionId);
      if (mission) {
        mission.completed = completed;
        mission.completedAt = completed ? new Date().toISOString() : undefined;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
        this.updateStats();
      }
    }
  }

  static getRecordByDate(date: string): OilUsageRecord | null {
    const records = this.getAllRecords();
    return records.find(r => r.date === date) || null;
  }

  static getAllRecords(): OilUsageRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getStats(): UsageStats {
    try {
      const data = localStorage.getItem(this.STATS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // エラー時は再計算
    }
    
    return this.calculateStats();
  }

  private static calculateStats(): UsageStats {
    const records = this.getAllRecords();
    
    // 使用日数の計算
    const uniqueDates = new Set(records.map(r => r.date));
    const totalDays = uniqueDates.size;
    
    // 連続使用日数の計算
    const { currentStreak, longestStreak } = this.calculateStreaks(Array.from(uniqueDates).sort());
    
    // お気に入りオイルの集計
    const oilCounts: Record<string, number> = {};
    records.forEach(record => {
      oilCounts[record.oilId] = (oilCounts[record.oilId] || 0) + 1;
    });
    
    const favoriteOils = Object.entries(oilCounts)
      .map(([oilId, count]) => ({ oilId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // ミッション完了数の計算
    let completedMissions = 0;
    let totalMissions = 0;
    
    records.forEach(record => {
      record.missions.forEach(mission => {
        totalMissions++;
        if (mission.completed) completedMissions++;
      });
    });
    
    const stats: UsageStats = {
      totalDays,
      currentStreak,
      longestStreak,
      favoriteOils,
      completedMissions,
      totalMissions
    };
    
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    return stats;
  }

  private static calculateStreaks(sortedDates: string[]): { currentStreak: number; longestStreak: number } {
    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }
    
    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;
    
    const today = new Date();
    const todayStr = this.formatDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.formatDate(yesterday);
    
    // 今日または昨日の記録がない場合、現在のストリークは0
    if (sortedDates[sortedDates.length - 1] !== todayStr && 
        sortedDates[sortedDates.length - 1] !== yesterdayStr) {
      currentStreak = 0;
    }
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    // 現在のストリークを計算
    if (currentStreak > 0) {
      tempStreak = 1;
      for (let i = sortedDates.length - 1; i > 0; i--) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
    }
    
    return { currentStreak, longestStreak };
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private static updateStats(): void {
    this.calculateStats();
  }

  // フォトジャーナル機能
  static addPhoto(date: string, photo: string): void {
    const records = this.getAllRecords();
    const record = records.find(r => r.date === date);
    
    if (record) {
      record.photo = photo;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }
  }

  static addNote(date: string, note: string): void {
    const records = this.getAllRecords();
    const record = records.find(r => r.date === date);
    
    if (record) {
      record.notes = note;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }
  }

  // コレクション機能
  static getUsedOils(): string[] {
    const records = this.getAllRecords();
    const oils = new Set(records.map(r => r.oilId));
    return Array.from(oils);
  }

  static getCollectionProgress(): { used: number; total: number; percentage: number } {
    const usedOils = this.getUsedOils();
    const total = 127; // 全オイル数
    const used = usedOils.length;
    const percentage = Math.round((used / total) * 100);
    
    return { used, total, percentage };
  }
}