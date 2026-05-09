/**
 * HACCP Manager Dashboard - Core logging functionality with traffic lights and workflow triggers
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Thermometer,
  Droplets,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  TrendingUp,
  Calendar,
  MapPin,
  Activity,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ExceptionTrainingModal, ContextualHelpButton } from '../../training/components/TrainingSystem';
import type { Language, SessionUser, TrainingRecord } from '../../../shared/types/core';

interface HACCPManagerDashboardProps {
  currentUser: SessionUser;
  lang: Language;
  onTrainingComplete: () => void;
}

type TaskType = 'temperature' | 'sanitizer' | 'warming' | 'calibration';
type TaskUrgency = 'overdue' | 'due_now' | 'due_soon' | 'routine';
type LogStatus = 'pass' | 'warning' | 'critical';

interface LogEntry {
  id: string;
  taskId: string;
  taskType: TaskType;
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  userId: string;
  status: LogStatus;
  inRange: boolean;
  range: { min: number; max: number };
  notes?: string;
  correctiveAction?: string;
}

interface TaskStatus {
  id: string;
  title: string;
  type: TaskType;
  location: string;
  urgency: TaskUrgency;
  lastReading: {
    value: number;
    unit: string;
    timestamp: string;
    status: LogStatus;
  } | null;
  nextDue: string;
  frequency: string;
  range: { min: number; max: number; unit: string };
  isOverdue: boolean;
  minutesUntilDue: number;
  estimatedTime: number; // minutes
  requiredActions: string[];
  warningTriggers?: {
    thirtyMinute: boolean;
    fifteenMinute: boolean;
  };
}

interface DashboardMetrics {
  todayLogs: number;
  complianceRate: number;
  criticalIssues: number;
  upcomingTasks: number;
  lastSync: string | null;
}

export const HACCPManagerDashboard: React.FC<HACCPManagerDashboardProps> = ({
  currentUser,
  lang,
  onTrainingComplete
}) => {
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todayLogs: 0,
    complianceRate: 0,
    criticalIssues: 0,
    upcomingTasks: 0,
    lastSync: null
  });
  const [activeTask, setActiveTask] = useState<TaskStatus | null>(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingScenario, setTrainingScenario] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for accurate due time calculations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const loadDashboardData = useCallback(() => {
    // Mock data - in real app, fetch from API
    const mockTasks: TaskStatus[] = [
      {
        id: 'morning-temp-check',
        title: 'Morning Cooler Check',
        type: 'temperature',
        location: 'Walk-in Cooler',
        urgency: 'overdue',
        lastReading: {
          value: 38,
          unit: '°F',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'pass'
        },
        nextDue: 'Overdue 15 min',
        frequency: 'Every 24 hours',
        range: { min: 33, max: 41, unit: '°F' },
        isOverdue: true,
        minutesUntilDue: -15,
        estimatedTime: 5,
        requiredActions: ['Check all cooler units', 'Log temperatures', 'Note any issues'],
        warningTriggers: {
          thirtyMinute: true,
          fifteenMinute: true
        }
      },
      {
        id: 'sanitizer-test',
        title: 'Sanitizer Test',
        type: 'sanitizer',
        location: 'Dish Room',
        urgency: 'due_now',
        lastReading: {
          value: 350,
          unit: 'ppm',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          status: 'pass'
        },
        nextDue: 'Due Now',
        frequency: 'Every 4 hours',
        range: { min: 200, max: 400, unit: 'ppm' },
        isOverdue: false,
        minutesUntilDue: 0,
        estimatedTime: 3,
        requiredActions: ['Test strip', 'Read concentration', 'Log result'],
        warningTriggers: {
          thirtyMinute: true,
          fifteenMinute: false
        }
      },
      {
        id: 'warming-cabinet',
        title: 'Warming Cabinet Check',
        type: 'warming',
        location: 'Serving Station A',
        urgency: 'due_soon',
        lastReading: {
          value: 145,
          unit: '°F',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'pass'
        },
        nextDue: 'Due in 25 min',
        frequency: 'Every 12 hours',
        range: { min: 140, max: 200, unit: '°F' },
        isOverdue: false,
        minutesUntilDue: 25,
        estimatedTime: 4,
        requiredActions: ['Check cabinet temperature', 'Verify food temps', 'Log readings'],
        warningTriggers: {
          thirtyMinute: false,
          fifteenMinute: false
        }
      },
      {
        id: 'lunch-prep',
        title: 'Lunch Service Prep',
        type: 'temperature',
        location: 'Prep Kitchen',
        urgency: 'routine',
        lastReading: null,
        nextDue: 'Due in 2 hours',
        frequency: 'Daily before service',
        range: { min: 33, max: 41, unit: '°F' },
        isOverdue: false,
        minutesUntilDue: 120,
        estimatedTime: 8,
        requiredActions: ['Check all prep areas', 'Verify holding temps', 'Document findings'],
        warningTriggers: {
          thirtyMinute: false,
          fifteenMinute: false
        }
      }
    ];

    const mockLogs: LogEntry[] = [
      {
        id: 'log-1',
        taskId: 'morning-temp-check',
        taskType: 'temperature',
        value: 38,
        unit: '°F',
        location: 'Walk-in Cooler',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: currentUser.id,
        status: 'pass',
        inRange: true,
        range: { min: 33, max: 41 }
      },
      {
        id: 'log-2',
        taskId: 'sanitizer-test',
        taskType: 'sanitizer',
        value: 150,
        unit: 'ppm',
        location: 'Dish Room',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        userId: currentUser.id,
        status: 'critical',
        inRange: false,
        range: { min: 200, max: 400 },
        notes: 'Below minimum concentration',
        correctiveAction: 'Adjusted dispenser, remixed solution'
      }
    ];

    setTasks(mockTasks);
    setRecentLogs(mockLogs);
    
    // Calculate metrics
    const todayLogs = mockLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    const criticalLogs = mockLogs.filter(log => log.status === 'critical').length;
    const totalLogs = mockLogs.length;
    const complianceRate = totalLogs > 0 ? Math.round(((totalLogs - criticalLogs) / totalLogs) * 100) : 100;
    
    setMetrics({
      todayLogs,
      complianceRate,
      criticalIssues: criticalLogs,
      upcomingTasks: mockTasks.filter(t => t.minutesUntilDue > 0 && t.minutesUntilDue <= 60).length,
      lastSync: new Date().toISOString()
    });
  }, [currentUser.id]);

  // Traffic light status helpers
  const getTaskStatusColor = (task: TaskStatus): string => {
    switch (task.urgency) {
      case 'overdue':
        return 'border-red-500 bg-red-50';
      case 'due_now':
        return 'border-orange-500 bg-orange-50';
      case 'due_soon':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const getTaskStatusIcon = (task: TaskStatus) => {
    switch (task.urgency) {
      case 'overdue':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'due_now':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'due_soon':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-5 h-5" />;
      case 'sanitizer':
        return <Droplets className="w-5 h-5" />;
      case 'warming':
        return <Flame className="w-5 h-5" />;
      case 'calibration':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  // 30-minute warning system
  const getWarningNotifications = useMemo(() => {
    return tasks.filter(task => {
      if (task.isOverdue) return false;
      return task.minutesUntilDue <= 30 && task.minutesUntilDue > 0;
    });
  }, [tasks]);

  // Start task logging
  const handleStartTask = (task: TaskStatus) => {
    setActiveTask(task);
  };

  // Handle logging completion
  const handleLogValue = async (task: TaskStatus, value: number, notes?: string) => {
    const isInRange = value >= task.range.min && value <= task.range.max;
    const status: LogStatus = isInRange ? 'pass' : 'critical';
    
    // Check if training should be triggered
    if (!isInRange || task.type === 'sanitizer' && value < task.range.min * 0.8) {
      // Trigger exception training
      let scenario: any = null;
      
      if (task.type === 'temperature' && !isInRange) {
        scenario = {
          type: 'out_of_range_temp',
          value,
          limit: value > task.range.max ? task.range.max : task.range.min
        };
      } else if (task.type === 'sanitizer' && !isInRange) {
        scenario = {
          type: 'failed_sanitizer',
          value,
          limit: task.range.min
        };
      }
      
      if (scenario) {
        setTrainingScenario(scenario);
        setShowTrainingModal(true);
      }
    }
    
    // Create log entry
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      taskId: task.id,
      taskType: task.type,
      value,
      unit: task.range.unit,
      location: task.location,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      status,
      inRange: isInRange,
      range: task.range,
      notes
    };
    
    // Update logs and task status
    setRecentLogs(prev => [newLog, ...prev]);
    setTasks(prev => prev.map(t => 
      t.id === task.id 
        ? {
            ...t,
            lastReading: {
              value,
              unit: task.range.unit,
              timestamp: new Date().toISOString(),
              status
            },
            urgency: 'routine' as TaskUrgency,
            isOverdue: false,
            minutesUntilDue: getMinutesUntilNextDue(task.frequency)
          }
        : t
    ));
    
    setActiveTask(null);
    
    // TODO: Send to API
    console.log('Logging value:', newLog);
  };

  const getMinutesUntilNextDue = (frequency: string): number => {
    if (frequency.includes('4 hours')) return 4 * 60;
    if (frequency.includes('12 hours')) return 12 * 60;
    if (frequency.includes('24 hours')) return 24 * 60;
    return 60; // Default 1 hour
  };

  const TaskLoggingModal = ({ task, onComplete, onCancel }: {
    task: TaskStatus;
    onComplete: (value: number, notes?: string) => void;
    onCancel: () => void;
  }) => {
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [showCorrectiveAction, setShowCorrectiveAction] = useState(false);

    const handleSubmit = () => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      
      onComplete(numValue, notes || undefined);
    };

    const isInRange = () => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return true;
      return numValue >= task.range.min && numValue <= task.range.max;
    };

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {getTaskTypeIcon(task.type)}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                <p className="text-slate-600">{task.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Range Info */}
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm font-medium text-slate-700 mb-1">Required Range</div>
                <div className="text-lg font-bold text-slate-900">
                  {task.range.min} - {task.range.max} {task.range.unit}
                </div>
                {task.lastReading && (
                  <div className="text-sm text-slate-500 mt-1">
                    Last: {task.lastReading.value} {task.lastReading.unit}
                  </div>
                )}
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Reading
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Enter ${task.range.unit} value`}
                    className={`flex-1 px-4 py-3 border rounded-lg text-lg font-medium ${
                      value && !isInRange() 
                        ? 'border-red-300 bg-red-50 text-red-900' 
                        : 'border-slate-300'
                    }`}
                  />
                  <span className="text-slate-600 font-medium">{task.range.unit}</span>
                </div>
                
                {value && !isInRange() && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Out of Range</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Value is outside safe limits. Corrective action required.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any observations or corrective actions taken..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="flex-1"
                disabled={!value}
              >
                Submit Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Context Help */}
      <ContextualHelpButton screenId="manager_dashboard" lang={lang} />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Good Morning, {currentUser.firstName}
            </h1>
            <p className="text-slate-600">
              {currentUser.schoolCode} • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          {/* Alert Notifications */}
          {getWarningNotifications.length > 0 && (
            <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 text-sm font-medium">
                {getWarningNotifications.length} task{getWarningNotifications.length !== 1 ? 's' : ''} due soon
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Today's Logs</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.todayLogs}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Compliance</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.complianceRate}%</div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-slate-700">Critical</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.criticalIssues}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Upcoming</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{metrics.upcomingTasks}</div>
          </div>
        </div>

        {/* Current Tasks - Traffic Light System */}
        <div className="bg-white rounded-lg border border-slate-200 mb-6">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Current Tasks</h2>
            <p className="text-slate-600 text-sm">Tasks ordered by priority and due time</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-4 transition-all hover:bg-slate-50 ${getTaskStatusColor(task)} border-l-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getTaskStatusIcon(task)}
                      {getTaskTypeIcon(task.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {task.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.nextDue}
                        </span>
                        {task.lastReading && (
                          <span>
                            Last: {task.lastReading.value} {task.lastReading.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {task.estimatedTime} min
                      </div>
                      <div className="text-xs text-slate-500">{task.frequency}</div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartTask(task)}
                      variant={task.urgency === 'overdue' || task.urgency === 'due_now' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Button>
                  </div>
                </div>
                
                {/* Warning triggers display */}
                {task.warningTriggers && (task.warningTriggers.thirtyMinute || task.warningTriggers.fifteenMinute) && (
                  <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-orange-800 text-sm font-medium">
                      ⚠️ Warning: Due within {task.warningTriggers.fifteenMinute ? '15' : '30'} minutes
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Logs</h2>
          </div>
          
          <div className="divide-y divide-slate-200">
            {recentLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTaskTypeIcon(log.taskType)}
                  <div>
                    <h4 className="font-medium text-slate-900">{log.location}</h4>
                    <p className="text-sm text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium text-slate-900">
                      {log.value} {log.unit}
                    </div>
                    <div className="text-xs text-slate-500">
                      Range: {log.range.min}-{log.range.max}
                    </div>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full ${
                    log.status === 'pass' ? 'bg-green-500' :
                    log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Logging Modal */}
      {activeTask && (
        <TaskLoggingModal
          task={activeTask}
          onComplete={(value, notes) => handleLogValue(activeTask, value, notes)}
          onCancel={() => setActiveTask(null)}
        />
      )}

      {/* Exception Training Modal */}
      {showTrainingModal && trainingScenario && (
        <ExceptionTrainingModal
          scenario={trainingScenario.type}
          value={trainingScenario.value}
          limit={trainingScenario.limit}
          onComplete={() => {
            setShowTrainingModal(false);
            setTrainingScenario(null);
            onTrainingComplete();
          }}
          onSkip={() => {
            setShowTrainingModal(false);
            setTrainingScenario(null);
          }}
        />
      )}
    </div>
  );
};