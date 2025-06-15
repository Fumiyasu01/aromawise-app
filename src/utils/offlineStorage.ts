// オフラインストレージ管理ユーティリティ

interface OfflineData {
  myOils: any[];
  settings: any;
  lastSync: string;
}

class OfflineStorage {
  private dbName = 'AromaWiseOffline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // IndexedDBの初期化
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // MyOilsストア
        if (!db.objectStoreNames.contains('myOils')) {
          const myOilsStore = db.createObjectStore('myOils', { keyPath: 'id' });
          myOilsStore.createIndex('oilId', 'oilId', { unique: false });
          myOilsStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        // 設定ストア
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // 同期キューストア
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // MyOilsデータの保存
  async saveMyOils(oils: any[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['myOils'], 'readwrite');
    const store = transaction.objectStore('myOils');

    // 既存のデータをクリア
    await this.clearStore('myOils');

    // 新しいデータを保存
    for (const oil of oils) {
      store.add({
        ...oil,
        lastModified: new Date().toISOString()
      });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // MyOilsデータの取得
  async getMyOils(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['myOils'], 'readonly');
      const store = transaction.objectStore('myOils');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 設定の保存
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    store.put({ key, value, lastModified: new Date().toISOString() });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 設定の取得
  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 同期キューに追加
  async addToSyncQueue(action: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    store.add({
      action,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        // バックグラウンド同期をトリガー
        if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration) => {
            return (registration as any).sync.register('sync-data');
          });
        }
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // 同期キューの取得
  async getSyncQueue(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('timestamp');
      const request = index.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 同期済みアイテムの削除
  async removeSyncedItems(ids: number[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    for (const id of ids) {
      store.delete(id);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // ストアのクリア
  private async clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // オフライン状態の検出
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // ネットワーク状態の監視
  watchNetworkStatus(callback: (isOnline: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
    
    // 初期状態を通知
    callback(navigator.onLine);
  }

  // キャッシュサイズの取得
  async getCacheSize(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  // キャッシュのクリア
  async clearCache(): Promise<void> {
    // Service Workerのキャッシュをクリア
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }

    // IndexedDBのデータをクリア
    if (this.db) {
      await this.clearStore('myOils');
      await this.clearStore('settings');
      await this.clearStore('syncQueue');
    }
  }
}

// シングルトンインスタンス
export const offlineStorage = new OfflineStorage();

// オフライン対応のMyOilsManager
export class OfflineMyOilsManager {
  static async saveOils(oils: any[]): Promise<void> {
    // LocalStorageに保存（既存の処理）
    localStorage.setItem('myOils', JSON.stringify(oils));
    
    // IndexedDBにも保存（オフライン対応）
    await offlineStorage.saveMyOils(oils);
    
    // 同期キューに追加
    if (offlineStorage.isOffline()) {
      await offlineStorage.addToSyncQueue('updateMyOils', oils);
    }
  }

  static async getOils(): Promise<any[]> {
    // オンラインの場合はLocalStorageから
    if (navigator.onLine) {
      const data = localStorage.getItem('myOils');
      return data ? JSON.parse(data) : [];
    }
    
    // オフラインの場合はIndexedDBから
    return await offlineStorage.getMyOils();
  }

  static async syncWithServer(): Promise<void> {
    if (!navigator.onLine) return;
    
    const syncQueue = await offlineStorage.getSyncQueue();
    const syncedIds: number[] = [];
    
    for (const item of syncQueue) {
      try {
        // サーバーと同期（実装必要）
        // await api.sync(item.action, item.data);
        syncedIds.push(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }
    
    // 同期済みアイテムを削除
    if (syncedIds.length > 0) {
      await offlineStorage.removeSyncedItems(syncedIds);
    }
  }
}