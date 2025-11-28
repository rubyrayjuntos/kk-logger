/**
 * Task card components for different display contexts
 */

import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  CheckCircle 
} from 'lucide-react';
import type { TaskCardProps } from '../types';
import { 
  TRANSLATIONS, 
  TASK_TITLES, 
  getLocationTranslation 
} from '../../../localization/translations';
import { getTaskUrgency } from '../../../shared/utils/date';

/**
 * Hero-style task card for the main priority task
 */
export const HeroTaskCard: React.FC<TaskCardProps> = ({ task, onClick, lang }) => {
  const t = TRANSLATIONS[lang];
  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  const location = getLocationTranslation(task.location, lang);
  
  // Urgency Logic for "Traffic Light" colors
  let cardBorder = 'border-slate-200';
  let badgeBg = 'bg-slate-100';
  let badgeText = 'text-slate-600';
  let btnGradient = 'bg-gradient-to-r from-blue-600 to-blue-700';
  let icon = <Clock size={16} />;
  
  const urgency = getTaskUrgency(task.time);
  
  if (urgency === 'overdue') {
    cardBorder = 'border-red-500 ring-2 ring-red-100';
    badgeBg = 'bg-red-100';
    badgeText = 'text-red-700';
    btnGradient = 'bg-gradient-to-r from-red-600 to-red-700';
    icon = <AlertTriangle size={16} strokeWidth={3} />;
  } else if (urgency === 'due-now') {
    cardBorder = 'border-orange-400';
    badgeBg = 'bg-orange-100';
    badgeText = 'text-orange-800';
    btnGradient = 'bg-gradient-to-r from-orange-500 to-orange-600';
    icon = <AlertTriangle size={16} strokeWidth={3} />;
  } else if (task.time.includes('min')) {
    cardBorder = 'border-yellow-400';
    badgeBg = 'bg-yellow-100';
    badgeText = 'text-yellow-800';
    btnGradient = 'bg-gradient-to-r from-yellow-500 to-yellow-600';
  }

  const getActionLabel = () => {
    if (task.type === 'temp' || task.type === 'warming') return t.logTemp;
    if (task.type === 'calibration') return t.calibrate;
    return t.startTest;
  };

  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 mb-6 transition-all transform hover:scale-[1.01] ${cardBorder}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide gap-1.5 mb-2 ${badgeBg} ${badgeText}`}>
               {icon} {task.time}
            </span>
            <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wide">
              <MapPin size={14} /> {location}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex justify-between items-center">
             <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.last}</div>
                <div className="text-xl font-bold text-slate-800">{task.lastLog?.value || '--'}</div>
             </div>
             <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.recorded}</div>
                <div className="text-sm font-bold text-slate-600">{task.lastLog?.time || '--'}</div>
             </div>
        </div>

        <button 
          onClick={onClick}
          className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${btnGradient}`}
        >
          {getActionLabel()}
          <ChevronRight className="bg-white/20 rounded-full p-1" size={28} />
        </button>
      </div>
    </div>
  );
};

/**
 * Compact task card for secondary tasks
 */
export const CompactTaskCard: React.FC<TaskCardProps> = ({ task, onClick, lang }) => {
  const t = TRANSLATIONS[lang];
  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  const location = getLocationTranslation(task.location, lang);

  // Simplified Status Visuals
  let statusColor = "bg-slate-100 text-slate-500";
  let statusIcon = <Clock size={16} />;
  
  if (task.time.includes('Due:')) {
     statusColor = "bg-yellow-100 text-yellow-700";
  }

  const actionLabel = t.startTask ? t.startTask.split(' ')[0] : 'Start';

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusColor}`}>
           {statusIcon}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate pr-2">{title}</h3>
          <p className="text-xs text-slate-500 font-medium truncate">{location} • {task.time}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className="shrink-0 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

/**
 * Completed task card showing completion status
 */
export const CompletedTaskCard: React.FC<TaskCardProps> = ({ task, lang }) => {
    const title = TASK_TITLES[task.title]?.[lang] || task.title;
    return (
        <div className="bg-white/50 rounded-xl p-3 border border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 gap-3">
                    <CheckCircle className="text-green-500 shrink-0" size={18} strokeWidth={3} />
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-700 text-sm truncate">{title}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{task.value} • {task.lastLog?.time || 'Today'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Main TaskCard component that renders the appropriate variant
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, lang, variant = 'compact' }) => {
  if (variant === 'hero') {
    return <HeroTaskCard task={task} onClick={onClick} lang={lang} />;
  }
  
  if (variant === 'completed') {
    return <CompletedTaskCard task={task} lang={lang} />;
  }
  
  return <CompactTaskCard task={task} onClick={onClick} lang={lang} />;
};