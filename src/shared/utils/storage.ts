/**
 * Local storage utilities with error handling and type safety
 */

import type { 
  SanitizerTestEntry, 
  TemperatureEntry, 
  WarmingCabinetEntry,
  CalibrationEntry,
  ReceivingInspectionEntry
} from '../types/core';

export interface StorageOptions {
  encrypt?: boolean;
  expires?: number; // milliseconds
}

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  expires?: number;
}

/**
 * Type-safe localStorage wrapper
 */
class LocalStorage {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue || null;
      
      const parsed: StorageItem<T> = JSON.parse(item);
      
      // Check if item has expired
      if (parsed.expires && Date.now() > parsed.expires) {
        this.remove(key);
        return defaultValue || null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set item in localStorage with optional expiration
   */
  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        expires: options?.expires ? Date.now() + options.expires : undefined
      };
      
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; total: number; percentage: number } {
    let used = 0;
    const total = 5 * 1024 * 1024; // 5MB typical limit
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }
}

// Export singleton instance
export const storage = new LocalStorage();

// Storage keys constants to avoid typos
export const STORAGE_KEYS = {
  USER_SESSION: 'kk_user_session',
  SYNC_QUEUE: 'kk_sync_queue',
  OFFLINE_TASKS: 'kk_offline_tasks',
  USER_PREFERENCES: 'kk_user_preferences',
  LANGUAGE: 'kk_language',
  DRAFT_LOGS: 'kk_draft_logs',
  LAST_SYNC: 'kk_last_sync',
  APP_STATE: 'kk_app_state',
  SANITIZER_LOGS: 'kk_sanitizer_logs',
  TEMPERATURE_LOGS: 'kk_temperature_logs',
  WARMING_CABINET_LOGS: 'kk_warming_cabinet_logs',
  CALIBRATION_LOGS: 'kk_calibration_logs',
  RECEIVING_LOGS: 'kk_receiving_logs'
} as const;

/**
 * Utility functions for common storage operations
 */
export const storageUtils = {
  /**
   * Save user session
   */
  saveUserSession: (user: any) => {
    return storage.set(STORAGE_KEYS.USER_SESSION, user, {
      expires: 24 * 60 * 60 * 1000 // 24 hours
    });
  },

  /**
   * Get user session
   */
  getUserSession: () => {
    return storage.get(STORAGE_KEYS.USER_SESSION);
  },

  /**
   * Clear user session
   */
  clearUserSession: () => {
    return storage.remove(STORAGE_KEYS.USER_SESSION);
  },

  /**
   * Save sync queue
   */
  saveSyncQueue: (queue: any[]) => {
    return storage.set(STORAGE_KEYS.SYNC_QUEUE, queue);
  },

  /**
   * Get sync queue
   */
  getSyncQueue: (): any[] => {
    return storage.get(STORAGE_KEYS.SYNC_QUEUE, []);
  },

  /**
   * Save user language preference
   */
  saveLanguage: (lang: 'en' | 'es') => {
    return storage.set(STORAGE_KEYS.LANGUAGE, lang);
  },

  /**
   * Get user language preference
   */
  getLanguage: (): 'en' | 'es' => {
    return storage.get(STORAGE_KEYS.LANGUAGE, 'en') as 'en' | 'es';
  },

  // =====================
  // HACCP Form Storage
  // =====================

  /**
   * Save sanitizer test reading
   */
  saveSanitizerReading: (reading: SanitizerTestEntry) => {
    const readings = storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []);
    readings.push(reading);
    
    // Keep only last 500 entries (5-year retention managed server-side)
    if (readings.length > 500) {
      readings.splice(0, readings.length - 500);
    }
    
    return storage.set(STORAGE_KEYS.SANITIZER_LOGS, readings);
  },

  /**
   * Get all sanitizer readings
   */
  getSanitizerReadings: (limit?: number): SanitizerTestEntry[] => {
    const readings = storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []);
    return limit ? readings.slice(-limit) : readings;
  },

  /**
   * Get last sanitizer reading for a specific station
   */
  getLastSanitizerReading: (stationId: string): SanitizerTestEntry | null => {
    const readings = storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []);
    const stationReadings = readings
      .filter(r => r.stationId === stationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return stationReadings[0] || null;
  },

  /**
   * Save temperature reading
   */
  saveTemperatureReading: (reading: TemperatureEntry) => {
    const readings = storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []);
    readings.push(reading);
    
    // Keep only last 1000 entries
    if (readings.length > 1000) {
      readings.splice(0, readings.length - 1000);
    }
    
    return storage.set(STORAGE_KEYS.TEMPERATURE_LOGS, readings);
  },

  /**
   * Get all temperature readings
   */
  getTemperatureReadings: (limit?: number): TemperatureEntry[] => {
    const readings = storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []);
    return limit ? readings.slice(-limit) : readings;
  },

  /**
   * Get last temperature reading for a specific unit
   */
  getLastTemperatureReading: (unitId: string): TemperatureEntry | null => {
    const readings = storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []);
    const unitReadings = readings
      .filter(r => r.unitName.toLowerCase().includes(unitId.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return unitReadings[0] || null;
  },

  /**
   * Save warming cabinet reading
   */
  saveWarmingCabinetReading: (reading: WarmingCabinetEntry) => {
    const readings = storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []);
    readings.push(reading);
    
    // Keep only last 500 entries
    if (readings.length > 500) {
      readings.splice(0, readings.length - 500);
    }
    
    return storage.set(STORAGE_KEYS.WARMING_CABINET_LOGS, readings);
  },

  /**
   * Get all warming cabinet readings
   */
  getWarmingCabinetReadings: (limit?: number): WarmingCabinetEntry[] => {
    const readings = storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []);
    return limit ? readings.slice(-limit) : readings;
  },

  /**
   * Get last warming cabinet reading for a specific cabinet
   */
  getLastWarmingCabinetReading: (cabinetId: string): WarmingCabinetEntry | null => {
    const readings = storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []);
    const cabinetReadings = readings
      .filter(r => r.cabinetName.toLowerCase().includes(cabinetId.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return cabinetReadings[0] || null;
  },

  /**
   * Get readings from the last 24 hours for trend analysis
   */
  getRecentReadings: (type: 'sanitizer' | 'temperature' | 'warming'): any[] => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    let readings: any[] = [];
    
    switch (type) {
      case 'sanitizer':
        readings = storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []);
        break;
      case 'temperature':
        readings = storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []);
        break;
      case 'warming':
        readings = storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []);
        break;
    }
    
    return readings.filter(r => new Date(r.timestamp) >= yesterday);
  },

  /**
   * Get readings requiring attention (failures, overdue checks)
   */
  getAttentionItems: () => {
    const sanitizerReadings = storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []);
    const tempReadings = storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []);
    const warmingReadings = storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []);
    
    const attentionItems: Array<{
      type: string;
      message: string;
      timestamp: string;
      severity: 'high' | 'medium' | 'low';
    }> = [];
    
    // Check for recent failures
    const recentFailures = [
      ...sanitizerReadings.filter(r => !r.inRange && new Date(r.timestamp).getTime() > Date.now() - 60 * 60 * 1000),
      ...tempReadings.filter(r => !r.inRange && new Date(r.timestamp).getTime() > Date.now() - 60 * 60 * 1000),
      ...warmingReadings.filter(r => !r.inRange && new Date(r.timestamp).getTime() > Date.now() - 60 * 60 * 1000)
    ];
    
    recentFailures.forEach(failure => {
      attentionItems.push({
        type: 'failure',
        message: `Recent failure: ${failure.stationId || failure.unitName || failure.cabinetName}`,
        timestamp: failure.timestamp,
        severity: 'high'
      });
    });
    
    return attentionItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /**
   * Export all HACCP data for backup/sync
   */
  exportHACCPData: () => {
    return {
      sanitizer: storage.get<SanitizerTestEntry[]>(STORAGE_KEYS.SANITIZER_LOGS, []),
      temperature: storage.get<TemperatureEntry[]>(STORAGE_KEYS.TEMPERATURE_LOGS, []),
      warmingCabinet: storage.get<WarmingCabinetEntry[]>(STORAGE_KEYS.WARMING_CABINET_LOGS, []),
      exportedAt: new Date().toISOString()
    };
  },

  /**
   * Clear all HACCP data (for testing/reset)
   */
  clearHACCPData: () => {
    storage.remove(STORAGE_KEYS.SANITIZER_LOGS);
    storage.remove(STORAGE_KEYS.TEMPERATURE_LOGS);
    storage.remove(STORAGE_KEYS.WARMING_CABINET_LOGS);
    storage.remove(STORAGE_KEYS.CALIBRATION_LOGS);
    storage.remove(STORAGE_KEYS.RECEIVING_LOGS);
    return true;
  },

  // =====================
  // Calibration Storage
  // =====================

  /**
   * Save calibration reading
   */
  saveCalibrationReading: (reading: CalibrationEntry) => {
    const readings = storage.get<CalibrationEntry[]>(STORAGE_KEYS.CALIBRATION_LOGS, []);
    readings.push(reading);
    
    // Keep only last 200 entries
    if (readings.length > 200) {
      readings.splice(0, readings.length - 200);
    }
    
    return storage.set(STORAGE_KEYS.CALIBRATION_LOGS, readings);
  },

  /**
   * Get all calibration readings
   */
  getCalibrationReadings: (limit?: number): CalibrationEntry[] => {
    const readings = storage.get<CalibrationEntry[]>(STORAGE_KEYS.CALIBRATION_LOGS, []);
    return limit ? readings.slice(-limit) : readings;
  },

  /**
   * Get last calibration reading for a specific thermometer
   */
  getLastCalibrationReading: (thermometerId: string): CalibrationEntry | null => {
    const readings = storage.get<CalibrationEntry[]>(STORAGE_KEYS.CALIBRATION_LOGS, []);
    const thermometerReadings = readings
      .filter(r => r.thermometerId === thermometerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return thermometerReadings[0] || null;
  },

  // =====================
  // Receiving Storage
  // =====================

  /**
   * Save receiving inspection reading
   */
  saveReceivingReading: (reading: ReceivingInspectionEntry) => {
    const readings = storage.get<ReceivingInspectionEntry[]>(STORAGE_KEYS.RECEIVING_LOGS, []);
    readings.push(reading);
    
    // Keep only last 300 entries
    if (readings.length > 300) {
      readings.splice(0, readings.length - 300);
    }
    
    return storage.set(STORAGE_KEYS.RECEIVING_LOGS, readings);
  },

  /**
   * Get all receiving readings
   */
  getReceivingReadings: (limit?: number): ReceivingInspectionEntry[] => {
    const readings = storage.get<ReceivingInspectionEntry[]>(STORAGE_KEYS.RECEIVING_LOGS, []);
    return limit ? readings.slice(-limit) : readings;
  },

  /**
   * Get recent receiving readings for a supplier
   */
  getSupplierReceivingHistory: (supplier: string, limit: number = 10): ReceivingInspectionEntry[] => {
    const readings = storage.get<ReceivingInspectionEntry[]>(STORAGE_KEYS.RECEIVING_LOGS, []);
    return readings
      .filter(r => r.supplier.toLowerCase().includes(supplier.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
};