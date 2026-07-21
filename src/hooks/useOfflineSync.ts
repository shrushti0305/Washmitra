import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface PendingSyncItem {
  id: string;
  type: 'SERVICE_COMPLETION';
  data: any;
  timestamp: number;
}

const STORAGE_KEY = 'washmitra_sync_queue';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [queue, setQueue] = useState<PendingSyncItem[]>([]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem(STORAGE_KEY);
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Failed to parse sync queue', e);
      }
    }
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing pending tasks...');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Offline mode activated. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueTask = useCallback((id: string, type: PendingSyncItem['type'], data: any) => {
    const newItem: PendingSyncItem = {
      id,
      type,
      data,
      timestamp: Date.now(),
    };
    setQueue(prev => [...prev, newItem]);
  }, []);

  const processSync = useCallback(async (processor: (item: PendingSyncItem) => Promise<boolean>) => {
    if (!isOnline || queue.length === 0) return;

    const itemsToProcess = [...queue];
    const failedItems: PendingSyncItem[] = [];

    for (const item of itemsToProcess) {
      const success = await processor(item);
      if (!success) {
        failedItems.push(item);
      }
    }

    setQueue(failedItems);
    if (failedItems.length === 0 && itemsToProcess.length > 0) {
      toast.info('All pending tasks synced successfully.');
    }
  }, [isOnline, queue]);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    isOnline,
    queue,
    queueTask,
    processSync,
    removeFromQueue
  };
}
