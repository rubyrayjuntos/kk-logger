/**
 * Mobile Navigation Bar
 */

import React from 'react';
import { ClipboardList, BarChart3, History } from 'lucide-react';
import type { MobileNavProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  
  const navItems = [
    {
      id: 'tasks',
      icon: ClipboardList,
      label: 'Tasks'
    },
    {
      id: 'reports',
      icon: BarChart3,
      label: t.viewReports
    },
    {
      id: 'history',
      icon: History,
      label: t.history
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-6 flex justify-around items-center z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-slate-800' : 'text-slate-400'
            }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};