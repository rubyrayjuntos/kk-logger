/**
 * Core TypeScript types for the KK-Logger application
 */

export type Language = 'en' | 'es';

export type TaskStatus = 'completed' | 'due' | 'upcoming';

export type TaskType = 'temp' | 'chemical' | 'calibration' | 'warming' | 'inventory';

export type UserRole = 'manager' | 'supervisor' | 'admin';

export type UserStatus = 'Active' | 'Inactive';

export type SchoolComplianceStatus = 'good' | 'warning' | 'critical';

export type SyncStatus = 'pending' | 'uploading' | 'error' | 'completed';

export interface Task {
  id: number;
  title: string;
  type: TaskType;
  status: TaskStatus;
  time: string;
  location: string;
  value?: string;
  range?: {
    min: number;
    max: number;
    unit: string;
  };
  lastLog?: {
    time: string;
    value: string;
  };
  units?: string[];
  lastLogs?: Record<string, { value: string; time: string }>;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  status: UserStatus;
  lastLogin: string;
}

export interface School {
  id: string;
  name: string;
  compliance: number;
  trend: string;
  manager: string;
  lastActive: string;
  missingLogs: number;
  issues: SchoolIssue[];
}

export interface SchoolIssue {
  id: number;
  title: string;
  desc: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SyncQueueItem {
  id: number;
  taskId: number;
  taskTitle: string;
  value: string;
  timestamp: string;
  status: SyncStatus;
  attempts: number;
  errorMsg?: string;
}

export interface ActivityLogEntry {
  id: number;
  managerId: number;
  managerName: string;
  type: 'login' | 'submit' | 'alert' | 'edit';
  details: string;
  timestamp: string;
}

export interface Report {
  id: number;
  name: string;
  date: string;
  type: 'PDF' | 'XLSX' | 'CSV';
  size: string;
}

export interface ReportConfig {
  range: string;
  school: string;
  type: string;
  status: string;
  format: string;
}

export interface CalibrationMethod {
  type: 'ice' | 'boil';
  targetTemp: number;
  tolerance: number;
}