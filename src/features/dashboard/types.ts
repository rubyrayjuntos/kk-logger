/**
 * Dashboard-specific types and interfaces
 */

import type { Task, Language } from '../../shared/types/core';

export interface DashboardProps {
  tasks: Task[];
  onStartTask: (task: Task) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isOnline: boolean;
  showSyncModal: () => void;
}

export interface TaskProgressProps {
  tasks: Task[];
  lang: Language;
}

export interface CompletedTasksProps {
  tasks: Task[];
  lang: Language;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
}

export interface DashboardHeaderProps {
  userName: string;
  schoolName: string;
  progress: number;
  completedCount: number;
  totalCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
  isOnline: boolean;
  showSyncModal: () => void;
}