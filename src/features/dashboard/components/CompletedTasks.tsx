/**
 * Completed Tasks section with expandable history
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { CompletedTasksProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';
import { TaskCard } from '../../logging/components/TaskCard';

export const CompletedTasks: React.FC<CompletedTasksProps> = ({
  tasks,
  lang,
  isExpanded,
  onToggleExpanded
}) => {
  const t = TRANSLATIONS[lang];
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
      <button 
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 hover:text-slate-600 transition-colors"
      >
        <span>{t.completedToday} ({completedTasks.length})</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="flex flex-col gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {completedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              lang={lang}
              variant="completed"
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};