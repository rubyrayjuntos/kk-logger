/**
 * Types specific to logging functionality
 */

import type { Task, Language } from '../../shared/types/core';

export type LoggingStep = 'input' | 'corrective';
export type AnimationState = 'idle' | 'success' | 'error';
export type CalibrationMethod = 'ice' | 'boil';

export interface LoggingState {
  step: LoggingStep;
  manualValue: string;
  animationState: AnimationState;
  correctiveAction: string;
  customNote: string;
  selectedUnit: string;
  unitValues: Record<string, string>;
  calMethod: CalibrationMethod;
}

export interface LoggingScreenProps {
  task: Task;
  onClose: () => void;
  onComplete: (id: number, value: string) => void;
  lang: Language;
}

export interface TaskCardProps {
  task: Task;
  onClick: () => void;
  lang: Language;
  variant?: 'hero' | 'compact' | 'completed';
}

export interface CorrectiveActionFlowProps {
  task: Task;
  value: string;
  onAction: (action: string, note?: string) => void;
  onCancel: () => void;
  lang: Language;
}

export interface ValidationRange {
  min: number;
  max: number;
  unit: string;
}

export interface LogEntry {
  id: number;
  taskId: number;
  value: string;
  timestamp: string;
  location: string;
  userId: number;
  correctiveAction?: string;
  notes?: string;
}