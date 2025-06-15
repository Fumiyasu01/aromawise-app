import React, { useMemo, useCallback, useRef, useEffect } from 'react';

// デバウンス用フック
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// スロットル用フック
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const lastRan = useRef<number>(0);
  
  return useCallback((...args: any[]) => {
    if (Date.now() - lastRan.current >= delay) {
      func(...args);
      lastRan.current = Date.now();
    }
  }, [func, delay]) as T;
}

// 仮想化リスト用の計算
export function useVirtualList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number = 0
) {
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;
    
    return {
      visibleItems,
      startIndex,
      endIndex,
      offsetY,
      totalHeight
    };
  }, [items, containerHeight, itemHeight, scrollTop]);
}

// メモ化されたフィルタリング
export function useMemoizedFilter<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  dependencies: any[]
): T[] {
  return useMemo(() => {
    return items.filter(filterFn);
  }, [items, ...dependencies]);
}

// メモ化されたソート
export function useMemoizedSort<T>(
  items: T[],
  compareFn: (a: T, b: T) => number,
  dependencies: any[]
): T[] {
  return useMemo(() => {
    return [...items].sort(compareFn);
  }, [items, ...dependencies]);
}

// 画像の遅延読み込み
export function useLazyImage(src: string, options: IntersectionObserverInit = {}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  return { imgRef, isLoaded, isInView };
}

// LocalStorage操作の最適化
export class OptimizedStorage {
  private static cache: Map<string, any> = new Map();
  private static pendingWrites: Map<string, any> = new Map();
  private static writeTimeout: NodeJS.Timeout | null = null;

  // キャッシュ付きread
  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      const parsed = JSON.parse(item);
      this.cache.set(key, parsed);
      return parsed;
    } catch {
      return defaultValue || null;
    }
  }

  // バッチ書き込み
  static setItem(key: string, value: any): void {
    this.cache.set(key, value);
    this.pendingWrites.set(key, value);
    
    // デバウンスされた書き込み
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
    }
    
    this.writeTimeout = setTimeout(() => {
      this.flushWrites();
    }, 100); // 100ms後にまとめて書き込み
  }

  // 即座に書き込み
  static setItemImmediate(key: string, value: any): void {
    this.cache.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage write failed:', error);
    }
  }

  // 保留中の書き込みを実行
  private static flushWrites(): void {
    this.pendingWrites.forEach((value, key) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to write ${key} to localStorage:`, error);
      }
    });
    this.pendingWrites.clear();
    this.writeTimeout = null;
  }

  // キャッシュクリア
  static clearCache(): void {
    this.cache.clear();
  }

  // 特定キーのキャッシュ削除
  static invalidateCache(key: string): void {
    this.cache.delete(key);
  }
}

// 検索の最適化
export class SearchOptimizer {
  private static searchIndexes: Map<string, Map<string, Set<any>>> = new Map();

  // 検索インデックスを作成
  static createIndex<T>(
    indexName: string,
    items: T[],
    getSearchableText: (item: T) => string[]
  ): void {
    const index = new Map<string, Set<T>>();
    
    items.forEach(item => {
      const searchableTexts = getSearchableText(item);
      searchableTexts.forEach(text => {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length >= 2) { // 2文字以上の単語のみインデックス化
            if (!index.has(word)) {
              index.set(word, new Set());
            }
            index.get(word)!.add(item);
          }
        });
      });
    });

    this.searchIndexes.set(indexName, index);
  }

  // インデックスを使用した高速検索
  static search<T>(indexName: string, query: string): T[] {
    const index = this.searchIndexes.get(indexName);
    if (!index) return [];

    const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (words.length === 0) return [];

    let results: Set<T> | null = null;

    words.forEach(word => {
      const wordResults = index.get(word) || new Set();
      
      if (results === null) {
        results = new Set(Array.from(wordResults));
      } else {
        // AND検索（全ての単語を含む結果のみ）
        const resultsArray = Array.from(results).filter(item => wordResults.has(item));
        results = new Set(resultsArray);
      }
    });

    return results ? Array.from(results) : [];
  }

  // インデックス更新
  static updateIndex<T>(
    indexName: string,
    items: T[],
    getSearchableText: (item: T) => string[]
  ): void {
    this.createIndex(indexName, items, getSearchableText);
  }

  // インデックス削除
  static clearIndex(indexName: string): void {
    this.searchIndexes.delete(indexName);
  }
}

// パフォーマンス測定
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  static startMeasurement(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      
      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }
      
      const measurements = this.measurements.get(name)!;
      measurements.push(duration);
      
      // 最新100件のみ保持
      if (measurements.length > 100) {
        measurements.shift();
      }
      
      // 開発環境でのみログ出力
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      }
    };
  }

  static getAverageTime(name: string): number {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return 0;
    
    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
  }

  static getStats(name: string) {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      count: measurements.length,
      average: this.getAverageTime(name),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }

  static getAllStats() {
    const stats: { [key: string]: any } = {};
    this.measurements.forEach((_, name) => {
      stats[name] = this.getStats(name);
    });
    return stats;
  }
}

