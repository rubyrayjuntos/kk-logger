/**
 * Dashboard Header with progress and controls
 */

import React from 'react';
import { MapPin, Globe, Wifi, WifiOff } from 'lucide-react';
import type { DashboardHeaderProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  schoolName,
  progress,
  completedCount,
  totalCount,
  lang,
  setLang,
  isOnline,
  showSyncModal
}) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-b-[2.5rem] shadow-xl p-6 mb-8 text-white relative z-10 mx-[-1px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.goodMorning}, {userName}</h1>
          <div className="flex items-center text-slate-300 text-sm">
            <MapPin size={14} className="mr-1" />
            {schoolName}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="bg-slate-700/50 hover:bg-slate-700 p-2 rounded-lg transition-colors"
            aria-label="Toggle Language"
          >
            <Globe size={20} />
          </button>
          <button 
            onClick={showSyncModal}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 font-bold text-xs ${
              isOnline 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isOnline ? t.online : t.offline}
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">
            {t.todaysProgress}
          </span>
          <span className="text-3xl font-bold">{completedCount}/{totalCount}</span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
                progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-xs font-medium text-slate-400 flex items-center gap-1.5">
          {progress < 50 ? t.moreAttention : progress < 90 ? t.makingProgress : t.almostDone}
        </div>
      </div>
    </div>
  );
};