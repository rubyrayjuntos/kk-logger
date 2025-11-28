/**
 * Enhanced Flywheel with UX improvements for task management
 */

import React, { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

const EnhancedFlywheelTaskCards = ({ tasks = [], onTaskClick = () => {}, config = {} }) => {
  // ... existing flywheel logic ...
  
  const [miniMapVisible, setMiniMapVisible] = useState(false);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);
  
  // Add mini-map for task overview
  const MiniMap = () => (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
      <div className="flex flex-col gap-1">
        {tasks.map((task, index) => {
          const isActive = index === getCurrentCenterIndex();
          const urgencyColor = getUrgencyColor(task.urgency);
          
          return (
            <button
              key={task.id}
              onClick={() => snapToTask(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                isActive 
                  ? `${urgencyColor} scale-125` 
                  : `${urgencyColor} opacity-50 hover:opacity-75`
              }`}
            />
          );
        })}
      </div>
    </div>
  );
  
  // Add breadcrumb navigation
  const TaskBreadcrumb = () => {
    const currentIndex = getCurrentCenterIndex();
    const currentTask = tasks[currentIndex];
    
    return (
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">
            {currentIndex + 1} of {tasks.length}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium">{currentTask?.title}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {getUrgencyText(currentTask?.urgency)}
        </div>
      </div>
    );
  };
  
  // Add smart notifications
  const SmartNotification = () => {
    const overdueCount = tasks.filter(t => t.urgency === 'overdue').length;
    const urgentCount = tasks.filter(t => t.urgency === 'high').length;
    
    if (overdueCount === 0 && urgentCount === 0) return null;
    
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>
            {overdueCount > 0 && `${overdueCount} overdue`}
            {overdueCount > 0 && urgentCount > 0 && ', '}
            {urgentCount > 0 && `${urgentCount} urgent`}
          </span>
        </div>
      </div>
    );
  };
  
  // Enhanced card with better information hierarchy
  const EnhancedTaskCard = ({ task, visibility, style }) => (
    <div 
      className={`absolute transition-all duration-300 ${getBorderStyle(task.urgency)}`}
      style={style}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Priority indicator bar */}
        <div className={`h-1 ${getPriorityBarColor(task.urgency)}`} />
        
        <div className="p-4">
          {visibility >= 3 && (
            <>
              {/* Header with urgency badge */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 flex-1">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBadgeStyle(task.urgency)}`}>
                  {getUrgencyText(task.urgency)}
                </span>
              </div>
              
              {/* Location with icon */}
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{task.location}</span>
              </div>
              
              {/* Last reading with visual indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">Last Reading:</span>
                <span className={`font-medium ${getReadingStyle(task)}`}>
                  {task.lastReading}
                </span>
              </div>
              
              {/* Time info with urgency context */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <Clock className="w-3 h-3" />
                <span>{task.hoursAgo}</span>
                <span className="text-slate-300">•</span>
                <span>{getNextDueText(task)}</span>
              </div>
            </>
          )}
          
          {visibility >= 4 && (
            <button
              onClick={() => onTaskClick(task)}
              disabled={!task.canStart}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                task.canStart
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {task.canStart ? 'Start Task' : 'Not Available'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="relative w-full h-full">
      {/* Existing flywheel content */}
      {/* ... */}
      
      {/* UX Enhancements */}
      <TaskBreadcrumb />
      <MiniMap />
      <SmartNotification />
      
      {/* Quick actions overlay */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setMiniMapVisible(!miniMapVisible)}
          className="bg-white/90 backdrop-blur rounded-full p-3 shadow-lg"
        >
          <span className="text-sm">📍</span>
        </button>
      </div>
    </div>
  );
};

// Helper functions for enhanced UX
function getUrgencyText(urgency) {
  switch (urgency) {
    case 'overdue': return 'OVERDUE';
    case 'high': return 'DUE NOW';
    case 'medium': return 'DUE SOON';
    case 'low': return 'ROUTINE';
    default: return '';
  }
}

function getNextDueText(task) {
  // Calculate when task will be due next based on type
  const intervals = {
    sanitizer: '4 hours',
    temperature: '24 hours', 
    warming: '12 hours',
    calibration: '1 week',
    receiving: 'on delivery'
  };
  
  return `Next: ${intervals[task.type] || 'varies'}`;
}

export default EnhancedFlywheelTaskCards;