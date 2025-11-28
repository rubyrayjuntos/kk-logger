/**
 * Manager Dashboard - Main dashboard for cafeteria managers
 */

import React, { useState } from 'react';
import { 
  ClipboardList, 
  BarChart3, 
  History, 
  MapPin, 
  Globe, 
  Wifi, 
  WifiOff 
} from 'lucide-react';
import type { DashboardProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';
import { TaskCard } from '../../logging/components/TaskCard';
import { DashboardHeader } from './DashboardHeader';
import { TaskProgress } from './TaskProgress';
import { CompletedTasks } from './CompletedTasks';
import { MobileNav } from './MobileNav';

export const ManagerDashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  onStartTask, 
  lang, 
  setLang, 
  isOnline, 
  showSyncModal 
}) => {
  const t = TRANSLATIONS[lang];
  const [showHistory, setShowHistory] = useState(false);
  
  // Logic to find priority task
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  // Sort pending: Overdue > Due Now > Upcoming
  pendingTasks.sort((a, b) => {
      const getScore = (task: any) => {
          if (task.time.toLowerCase().includes('overdue')) return 3;
          if (task.time.includes('Now')) return 2;
          return 1;
      };
      return getScore(b) - getScore(a);
  });
  
  const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null;
  const otherTasks = pendingTasks.length > 1 ? pendingTasks.slice(1) : [];
  
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  
  return (
      <div className="pb-24">
          {/* Header Card */}
          <DashboardHeader 
            userName="Maria"
            schoolName="Jefferson Elementary"
            progress={progress}
            completedCount={completedCount}
            totalCount={totalCount}
            lang={lang}
            setLang={setLang}
            isOnline={isOnline}
            showSyncModal={showSyncModal}
          />

          <div className="px-4">
              {/* Hero Task */}
              {nextTask && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.upNext}</h2>
                      <TaskCard 
                        task={nextTask} 
                        onClick={() => onStartTask(nextTask)} 
                        lang={lang}
                        variant="hero"
                      />
                  </div>
              )}

              {/* Other Pending Tasks */}
              {otherTasks.length > 0 && (
                  <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.comingUp}</h2>
                      <div className="flex flex-col gap-3">
                          {otherTasks.map(task => (
                              <TaskCard 
                                key={task.id} 
                                task={task} 
                                onClick={() => onStartTask(task)} 
                                lang={lang} 
                                variant="compact"
                              />
                          ))}
                      </div>
                  </div>
              )}

              {/* History / Completed */}
              <CompletedTasks 
                tasks={completedTasks}
                lang={lang}
                isExpanded={showHistory}
                onToggleExpanded={() => setShowHistory(!showHistory)}
              />
          </div>
          
          {/* Mobile Nav */}
          <MobileNav 
            activeTab="tasks"
            onTabChange={() => {}}
            lang={lang}
          />
      </div>
  );
};