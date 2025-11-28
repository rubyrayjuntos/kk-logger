import React from 'react';
import { X, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { getTranslation } from '../../../localization/translations';
import type { SyncQueueItem, Language } from '../../../shared/types/core';

interface SyncStatusModalProps {
  queue: SyncQueueItem[];
  onRetry: (item: SyncQueueItem) => void;
  onClose: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  lang: Language;
}

export const SyncStatusModal: React.FC<SyncStatusModalProps> = ({
  queue,
  onRetry,
  onClose,
  isOnline,
  onToggleOnline,
  lang
}) => {
  const t = (key: string) => getTranslation(key, lang);
  
  const pendingItems = queue.filter(item => item.status === 'pending');
  const errorItems = queue.filter(item => item.status === 'error');
  const completedItems = queue.filter(item => item.status === 'completed');

  const getStatusIcon = (status: SyncQueueItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <h2 className="text-lg font-semibold text-slate-900">
                {t('syncStatus')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Connection Status */}
          <div className="mb-4 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                {t('connectionStatus')}
              </span>
              <span className={`text-sm font-medium ${
                isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {isOnline ? t('online') : t('offline')}
              </span>
            </div>
            
            {/* Demo toggle */}
            <div className="text-xs text-slate-500 mb-2">
              {t('demoModeToggle')}
            </div>
            <Button
              onClick={onToggleOnline}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isOnline ? t('goOffline') : t('goOnline')}
            </Button>
          </div>

          {/* Queue Summary */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{completedItems.length}</div>
              <div className="text-xs text-green-700">{t('synced')}</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-lg font-bold text-amber-600">{pendingItems.length}</div>
              <div className="text-xs text-amber-700">{t('pending')}</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{errorItems.length}</div>
              <div className="text-xs text-red-700">{t('failed')}</div>
            </div>
          </div>

          {/* Queue Items */}
          {queue.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(item.status)}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {item.taskTitle}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                      {item.status === 'error' && (
                        <div className="text-xs text-red-600">
                          {t('retryAttempts')}: {item.attempts}/3
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.status === 'error' && (
                    <Button
                      onClick={() => onRetry(item)}
                      variant="outline"
                      size="sm"
                      icon={RefreshCw}
                      className="ml-2"
                    >
                      {t('retry')}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-500 text-sm mb-2">
                {t('noSyncItems')}
              </div>
              <div className="text-xs text-slate-400">
                {t('completedTasksWillAppearHere')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};