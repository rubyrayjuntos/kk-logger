/**
 * Adaptive Dashboard - Context-aware interface that switches between flywheel and list views
 */

import React, { useState, useEffect } from 'react';
import { List, RefreshCw, Filter, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { HACCPDashboard } from './HACCPDashboard';
import FlywheelTaskCards from './FlywheelTaskCards';
import type { Language } from '../../../shared/types/core';
import { storageUtils } from '../../../shared/utils/storage';

interface AdaptiveDashboardProps {
  onClose: () => void;
  lang: Language;
  userId: string;
}

type ViewMode = 'smart' | 'flywheel' | 'list';

interface TaskSummary {
  id: string;
  title: string;
  location: string;
  lastReading: string;
  recorded: string;
  hoursAgo: string;
  urgency: 'low' | 'medium' | 'high' | 'overdue';
  type: 'sanitizer' | 'temperature' | 'warming' | 'calibration' | 'receiving';
}

export const AdaptiveDashboard: React.FC<AdaptiveDashboardProps> = ({
  onClose,
  lang,
  userId
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('smart');
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['high', 'overdue']);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const taskList: TaskSummary[] = [];
    
    // Get sanitizer readings
    const sanitizerReadings = storageUtils.getSanitizerReadings(1);
    if (sanitizerReadings.length > 0) {
      const reading = sanitizerReadings[0];
      const hoursAgo = Math.floor((Date.now() - new Date(reading.timestamp).getTime()) / (1000 * 60 * 60));
      taskList.push({
        id: 'sanitizer',
        title: 'Sanitizer Test',
        location: 'Dish Area',
        lastReading: `${reading.concentration} ppm`,
        recorded: new Date(reading.timestamp).toLocaleString(),
        hoursAgo: `${hoursAgo} hours ago`,
        urgency: hoursAgo > 4 ? 'overdue' : hoursAgo > 3 ? 'high' : 'medium',
        type: 'sanitizer'
      });
    }
    
    // Get temperature readings
    const tempReadings = storageUtils.getTemperatureReadings(1);
    if (tempReadings.length > 0) {
      const reading = tempReadings[0];
      const hoursAgo = Math.floor((Date.now() - new Date(reading.timestamp).getTime()) / (1000 * 60 * 60));
      taskList.push({
        id: 'temperature',
        title: 'Cold Holding Check',
        location: reading.unit,
        lastReading: `${reading.temperature}°F`,
        recorded: new Date(reading.timestamp).toLocaleString(),
        hoursAgo: `${hoursAgo} hours ago`,
        urgency: hoursAgo > 24 ? 'overdue' : hoursAgo > 20 ? 'high' : 'medium',
        type: 'temperature'
      });
    }
    
    // Similar for other task types...
    
    setTasks(taskList);
  };

  const getSmartViewMode = (): 'flywheel' | 'list' => {
    const urgentTasks = tasks.filter(t => t.urgency === 'overdue' || t.urgency === 'high');
    const totalTasks = tasks.length;
    
    // Use flywheel when:
    // - Few tasks (<=3) - prevents overwhelming interface
    // - Most tasks are routine (not urgent) - encourages exploration
    // - Mixed urgency levels - helps focus on one at a time
    if (totalTasks <= 3 || urgentTasks.length <= 2) {
      return 'flywheel';
    }
    
    // Use list when:
    // - Many urgent tasks - need overview for triage
    // - Many total tasks - need scanning capability
    return 'list';
  };

  const currentViewMode = viewMode === 'smart' ? getSmartViewMode() : viewMode;

  const filteredTasks = tasks.filter(task => 
    activeFilters.length === 0 || activeFilters.includes(task.urgency)
  );

  const handleTaskClick = (task: any) => {
    // Convert flywheel task format to dashboard task and trigger action
    console.log('Starting task:', task);
    // TODO: Integrate with existing dashboard task handling
  };

  const TaskStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-800">Overdue</span>
        </div>
        <div className="text-xl font-bold text-red-900">
          {tasks.filter(t => t.urgency === 'overdue').length}
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Urgent</span>
        </div>
        <div className="text-xl font-bold text-amber-900">
          {tasks.filter(t => t.urgency === 'high').length}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Total</span>
        </div>
        <div className="text-xl font-bold text-blue-900">{tasks.length}</div>
      </div>
    </div>
  );

  const ViewToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <Button
        onClick={() => setViewMode('smart')}
        variant={viewMode === 'smart' ? 'primary' : 'outline'}
        size="sm"
      >
        Smart
      </Button>
      <Button
        onClick={() => setViewMode('flywheel')}
        variant={viewMode === 'flywheel' ? 'primary' : 'outline'}
        size="sm"
      >
        <RefreshCw className="w-4 h-4" />
        Wheel
      </Button>
      <Button
        onClick={() => setViewMode('list')}
        variant={viewMode === 'list' ? 'primary' : 'outline'}
        size="sm"
      >
        <List className="w-4 h-4" />
        List
      </Button>
      
      <div className="ml-auto">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          size="sm"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const FilterPanel = () => showFilters && (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
      <h3 className="font-medium mb-3">Filter by Urgency</h3>
      <div className="flex flex-wrap gap-2">
        {['overdue', 'high', 'medium', 'low'].map(urgency => (
          <Button
            key={urgency}
            onClick={() => {
              setActiveFilters(prev => 
                prev.includes(urgency) 
                  ? prev.filter(f => f !== urgency)
                  : [...prev, urgency]
              );
            }}
            variant={activeFilters.includes(urgency) ? 'primary' : 'outline'}
            size="sm"
          >
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
            {' '}({tasks.filter(t => t.urgency === urgency).length})
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-semibold">Task Management</h1>
            <p className="text-sm text-slate-600">
              {currentViewMode === 'flywheel' ? 'Flywheel View' : 'List View'}
              {viewMode === 'smart' && ' (Auto)'}
            </p>
          </div>
          <div className="w-16" />
        </div>

        <TaskStats />
        <ViewToggle />
        <FilterPanel />

        {/* Context Helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-sm text-blue-800">
            {currentViewMode === 'flywheel' ? (
              <>🎡 <strong>Flywheel Mode:</strong> Focus on one task at a time. Swipe to explore.</>
            ) : (
              <>📋 <strong>List Mode:</strong> Overview of all tasks. Best for urgent situations.</>
            )}
          </div>
        </div>

        {/* Main Content */}
        {currentViewMode === 'flywheel' ? (
          <div className="h-96">
            <FlywheelTaskCards 
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              config={{
                wheelRadius: 120,
                containerHeight: 350,
                cardWidth: 320,
                urgencyThresholds: {
                  green: 2,
                  yellow: 6
                }
              }}
            />
          </div>
        ) : (
          <HACCPDashboard 
            onClose={() => {}}
            lang={lang}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
};