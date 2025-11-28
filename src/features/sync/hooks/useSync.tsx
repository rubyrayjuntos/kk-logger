import { useState, useCallback } from 'react';
import type { SyncQueueItem } from '../../../shared/types/core';

export const useSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Simulate sync operation
  const syncItem = useCallback(async (item: SyncQueueItem): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate success/failure based on online status and random chance
    if (!isOnline || Math.random() < 0.2) {
      return false; // Fail
    }
    
    return true; // Success
  }, [isOnline]);

  const addToSyncQueue = useCallback((item: Omit<SyncQueueItem, 'id'>) => {
    const newItem: SyncQueueItem = {
      ...item,
      id: Date.now() + Math.random() // Simple ID generation
    };
    
    setSyncQueue(prev => [...prev, newItem]);
    
    // Attempt immediate sync if online
    if (isOnline) {
      syncItem(newItem).then(success => {
        setSyncQueue(prev => prev.map(qItem => 
          qItem.id === newItem.id
            ? { 
                ...qItem, 
                status: success ? 'completed' : 'error',
                attempts: success ? qItem.attempts : qItem.attempts + 1
              }
            : qItem
        ));
      });
    }
  }, [isOnline, syncItem]);

  const retrySync = useCallback(async (item: SyncQueueItem) => {
    if (item.attempts >= 3) {
      return; // Max attempts reached
    }

    // Update status to pending for retry
    setSyncQueue(prev => prev.map(qItem => 
      qItem.id === item.id
        ? { ...qItem, status: 'pending' }
        : qItem
    ));

    const success = await syncItem(item);
    
    setSyncQueue(prev => prev.map(qItem => 
      qItem.id === item.id
        ? { 
            ...qItem, 
            status: success ? 'completed' : 'error',
            attempts: qItem.attempts + 1
          }
        : qItem
    ));
  }, [syncItem]);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => !prev);
  }, []);

  return {
    isOnline,
    syncQueue,
    showSyncModal,
    setShowSyncModal,
    addToSyncQueue,
    retrySync,
    toggleOnline
  };
};