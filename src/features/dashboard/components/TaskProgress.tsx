/**
 * Task Progress visualization component
 */

import React from 'react';
import type { TaskProgressProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';
import { formatPercentage } from '../../../shared/utils/formatting';

export const TaskProgress: React.FC<TaskProgressProps> = ({ tasks, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => task.time.toLowerCase().includes('overdue')).length;
  const dueTasks = tasks.filter(task => task.time.toLowerCase().includes('now')).length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getProgressColor = () => {
    if (completionRate >= 90) return 'bg-green-500';
    if (completionRate >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getStatusMessage = () => {
    if (overdueTasks > 0) return t.moreAttention;
    if (completionRate >= 90) return t.almostDone;
    if (completionRate >= 50) return t.makingProgress;
    return t.moreAttention;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{t.dailyProgress}</h3>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">{t.completed}</span>
            <span className="text-lg font-bold text-slate-800">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-right mt-1 text-sm text-slate-500">
            {formatPercentage(completionRate)}
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{completedTasks}</div>
            <div className="text-xs text-green-600 font-medium">{t.completed}</div>
          </div>
          
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-700">{dueTasks}</div>
            <div className="text-xs text-orange-600 font-medium">{t.dueNow}</div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-700">{overdueTasks}</div>
            <div className="text-xs text-red-600 font-medium">{t.overdue}</div>
          </div>
        </div>
        
        {/* Status Message */}
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600">{getStatusMessage()}</p>
        </div>
      </div>
    </div>
  );
};