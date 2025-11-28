/**
 * HACCP Forms Dashboard - Adaptive interface with flywheel and list views
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Thermometer,
  Droplets,
  Flame,
  Settings,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  List,
  RefreshCw,
  Filter,
  MapPin,
  X,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { SanitizerTestForm } from './SanitizerTestForm';
import { ColdHoldingForm } from './ColdHoldingForm';
import { WarmingCabinetForm } from './WarmingCabinetForm';
import { CalibrationForm } from './CalibrationForm';
import { ReceivingForm } from './ReceivingForm';
import { getTranslation } from '../../../localization/translations';
import { storageUtils } from '../../../shared/utils/storage';
import type { 
  Language, 
  SanitizerTestEntry, 
  TemperatureEntry,
  WarmingCabinetEntry,
  CalibrationEntry,
  ReceivingInspectionEntry
} from '../../../shared/types/core';

interface HACCPDashboardProps {
  onClose: () => void;
  lang: Language;
  userId: string;
}

type ActiveForm = 'dashboard' | 'sanitizer' | 'cold-holding' | 'warming-cabinet' | 'calibration' | 'receiving';
type ViewMode = 'smart' | 'flywheel' | 'list';
type TaskUrgency = 'overdue' | 'high' | 'medium' | 'low';

interface DashboardStats {
  todayLogs: number;
  pendingIssues: number;
  lastSync: string | null;
  complianceScore: number;
}

interface TaskStatus {
  id: string;
  title: string;
  description: string;
  location: string;
  lastReading: string;
  recorded: string;
  hoursAgo: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  priority: 'high' | 'medium' | 'low';
  urgency: TaskUrgency;
  isOverdue: boolean;
  lastCompleted: string | null;
  frequency: string;
  estimatedTime: string;
  canStart: boolean;
}

// Enhanced Flywheel Component
const EnhancedFlywheelTaskCards = ({ 
  tasks = [], 
  onTaskClick = () => {}, 
  config = {} 
}: {
  tasks: TaskStatus[];
  onTaskClick: (task: TaskStatus) => void;
  config?: any;
}) => {
  const [rotation, setRotation] = useState(Math.PI);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [miniMapVisible, setMiniMapVisible] = useState(false);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const animationFrame = useRef<number | null>(null);
  
  const {
    wheelRadius = 120,
    containerHeight = 350,
    cardWidth = 320,
    urgencyThresholds = { green: 2, yellow: 6 }
  } = config;

  const RADIUS = wheelRadius;
  const CARD_COUNT = tasks.length;
  const FRICTION = 0.95;
  const SNAP_THRESHOLD = 0.3;
  
  const getSpeedMultiplier = () => {
    if (CARD_COUNT === 1) return 0;
    if (CARD_COUNT <= 10) return 1.0;
    if (CARD_COUNT <= 20) return 0.85;
    return 0.7;
  };
  
  const SPEED_MULTIPLIER = getSpeedMultiplier();
  const IS_FIXED = CARD_COUNT === 1;

  useEffect(() => {
    const animate = () => {
      if (!isDragging && Math.abs(velocity) > 0.01) {
        setVelocity(v => v * FRICTION);
        setRotation(r => r + velocity);
      } else if (!isDragging && Math.abs(velocity) <= SNAP_THRESHOLD) {
        // Snap to nearest card
        const anglePerCard = (Math.PI * 2) / CARD_COUNT;
        const normalizedRotation = rotation % (Math.PI * 2);
        const cardIndex = Math.round(normalizedRotation / anglePerCard);
        const targetRotation = cardIndex * anglePerCard;
        const distance = targetRotation - normalizedRotation;
        
        if (Math.abs(distance) > 0.01) {
          setRotation(r => r + distance * 0.1);
        } else {
          setVelocity(0);
        }
      }
      
      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [velocity, rotation, isDragging, CARD_COUNT]);

  const handleStart = (clientY: number) => {
    if (IS_FIXED) return;
    setIsDragging(true);
    setVelocity(0);
    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = clientY - lastY.current;
    const deltaTime = Date.now() - lastTime.current;
    
    if (deltaTime > 0) {
      const speed = deltaY / deltaTime;
      setVelocity(speed * 0.5 * SPEED_MULTIPLIER);
      setRotation(r => r - deltaY * 0.005 * SPEED_MULTIPLIER);
    }
    
    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const getCurrentCenterIndex = () => {
    const anglePerCard = (Math.PI * 2) / CARD_COUNT;
    const normalizedRotation = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return Math.round(normalizedRotation / anglePerCard) % CARD_COUNT;
  };

  const snapToTask = (index: number) => {
    const anglePerCard = (Math.PI * 2) / CARD_COUNT;
    const targetRotation = index * anglePerCard;
    setRotation(targetRotation);
    setVelocity(0);
  };

  const getCardTransform = (index: number) => {
    const anglePerCard = (Math.PI * 2) / CARD_COUNT;
    const angle = (index * anglePerCard) - rotation;
    
    const y = Math.sin(angle) * RADIUS;
    const z = Math.cos(angle) * RADIUS - RADIUS;
    
    const normalizedZForScale = (z + 2 * RADIUS) / (2 * RADIUS);
    const scale = Math.max(0.2, 0.3 + normalizedZForScale * 0.7);
    
    const normalizedZ = (z + 2 * RADIUS) / (2 * RADIUS);
    let opacity = 0;
    
    if (normalizedZ > 0.5) {
      opacity = Math.pow((normalizedZ - 0.5) * 2, 0.7);
    }
    
    return { y, z, scale, opacity, angle };
  };

  const getVisibilityLevel = (scale: number, angle: number) => {
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isNearCenter = normalizedAngle > Math.PI * 0.8 && normalizedAngle < Math.PI * 1.2;
    
    if (scale > 0.85 && isNearCenter) return 4;
    if (scale > 0.7) return 3;
    if (scale > 0.5) return 2;
    if (scale > 0.35) return 1;
    return 0;
  };

  const getUrgencyStyle = (urgency: TaskUrgency) => {
    switch(urgency) {
      case 'overdue':
        return { 
          border: 'border-red-500', 
          bg: 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700',
          badge: 'bg-red-100 text-red-700'
        };
      case 'high':
        return { 
          border: 'border-orange-500', 
          bg: 'bg-orange-50',
          button: 'bg-orange-600 hover:bg-orange-700',
          badge: 'bg-orange-100 text-orange-700'
        };
      case 'medium':
        return { 
          border: 'border-yellow-500', 
          bg: 'bg-yellow-50',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          badge: 'bg-yellow-100 text-yellow-700'
        };
      default:
        return { 
          border: 'border-slate-300', 
          bg: 'bg-white',
          button: 'bg-slate-600 hover:bg-slate-700',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  const getUrgencyText = (urgency: TaskUrgency) => {
    switch (urgency) {
      case 'overdue': return 'OVERDUE';
      case 'high': return 'DUE NOW';
      case 'medium': return 'DUE SOON';
      case 'low': return 'ROUTINE';
      default: return '';
    }
  };

  const getNextDueText = (task: TaskStatus) => {
    const intervals: { [key: string]: string } = {
      sanitizer: '4 hours',
      'cold-holding': '24 hours', 
      'warming-cabinet': '12 hours',
      calibration: '1 week',
      receiving: 'on delivery'
    };
    
    return `Next: ${intervals[task.id] || 'varies'}`;
  };

  // Mini-map component
  const MiniMap = () => (
    <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg transition-opacity ${miniMapVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-slate-600 mb-1">Task Overview</div>
        {tasks.map((task, index) => {
          const isActive = index === getCurrentCenterIndex();
          const style = getUrgencyStyle(task.urgency);
          
          return (
            <button
              key={task.id}
              onClick={() => snapToTask(index)}
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition-all ${
                isActive 
                  ? `${style.bg} ${style.border} border scale-105` 
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${style.border} border-2`} />
              <span className={isActive ? 'font-medium' : ''}>{task.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Task breadcrumb
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

  // Smart notification
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

  if (tasks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-slate-400 text-lg">No tasks to display</div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full select-none"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
        <div className="relative w-full max-w-md" style={{ height: `${containerHeight}px` }}>
          {tasks.map((task, index) => {
            const { y, z, scale, opacity, angle } = getCardTransform(index);
            const visibilityLevel = getVisibilityLevel(scale, angle);
            const style = getUrgencyStyle(task.urgency);
            const IconComponent = task.icon;
            
            return (
              <div
                key={task.id}
                className={`absolute transition-all duration-300 ${style.border} border-2`}
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${cardWidth}px`,
                  transform: `translateX(-50%) translateY(${y}px) translateZ(${z}px) scale(${scale}) translateY(-50%)`,
                  opacity,
                  zIndex: Math.round(scale * 100)
                }}
              >
                <div className={`${style.bg} rounded-xl shadow-lg overflow-hidden`}>
                  {/* Priority indicator bar */}
                  <div className={`h-1 ${style.border.replace('border-', 'bg-')}`} />
                  
                  <div className="p-4">
                    {visibilityLevel >= 3 && (
                      <>
                        {/* Header with urgency badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-slate-700" />
                            <h3 className="font-semibold text-slate-900 flex-1">{task.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.badge}`}>
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
                          <span className="font-medium text-slate-900">
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
                    
                    {visibilityLevel >= 4 && (
                      <button
                        onClick={() => onTaskClick(task)}
                        disabled={!task.canStart}
                        className={`w-full py-2 rounded-lg font-medium transition-colors text-white ${
                          task.canStart
                            ? style.button
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {task.canStart ? 'Start Task' : 'Not Available'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* UX Enhancements */}
      <TaskBreadcrumb />
      <MiniMap />
      <SmartNotification />
      
      {/* Quick actions overlay */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setMiniMapVisible(!miniMapVisible)}
          className="bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-white transition-colors"
        >
          <MapPin className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      
      {/* Center line indicator */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20 pointer-events-none"></div>
    </div>
  );
};

export const HACCPDashboard: React.FC<HACCPDashboardProps> = ({
  onClose,
  lang,
  userId
}) => {
  const t = (key: string) => getTranslation(key, lang);
  
  const [activeForm, setActiveForm] = useState<ActiveForm>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('smart');
  const [activeFilters, setActiveFilters] = useState<TaskUrgency[]>(['overdue', 'high']);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    todayLogs: 0,
    pendingIssues: 0,
    lastSync: null,
    complianceScore: 0
  });
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([]);
  const [attentionItems, setAttentionItems] = useState<any[]>([]);
  
  // Load dashboard data
  useEffect(() => {
    loadDashboardStats();
    loadTaskStatuses();
    loadAttentionItems();
  }, []);
  
  const loadDashboardStats = () => {
    const sanitizerReadings = storageUtils.getRecentReadings('sanitizer');
    const tempReadings = storageUtils.getRecentReadings('temperature');
    const warmingReadings = storageUtils.getRecentReadings('warming');
    
    const totalLogs = sanitizerReadings.length + tempReadings.length + warmingReadings.length;
    const failedLogs = [
      ...sanitizerReadings.filter(r => !r.inRange),
      ...tempReadings.filter(r => !r.inRange),
      ...warmingReadings.filter(r => !r.inRange)
    ];
    
    const complianceScore = totalLogs > 0 ? Math.round(((totalLogs - failedLogs.length) / totalLogs) * 100) : 100;
    
    setStats({
      todayLogs: totalLogs,
      pendingIssues: failedLogs.length,
      lastSync: null,
      complianceScore
    });
  };
  
  const loadTaskStatuses = () => {
    const tasks: TaskStatus[] = [
      {
        id: 'sanitizer',
        title: t('sanitizerTest'),
        description: t('testChemicalConcentration'),
        location: 'Dish Room',
        lastReading: '350 ppm',
        recorded: 'Today 8:30 AM',
        hoursAgo: '4 hours ago',
        icon: Droplets,
        priority: 'high',
        urgency: isTaskOverdue('sanitizer', 4) ? 'overdue' : 'high',
        isOverdue: isTaskOverdue('sanitizer', 4),
        lastCompleted: getLastTaskTime('sanitizer'),
        frequency: t('every4Hours'),
        estimatedTime: '3-5 min',
        canStart: true
      },
      {
        id: 'cold-holding',
        title: t('coldHoldingCheck'),
        description: t('refrigerationUnitsCheck'),
        location: 'Walk-in Cooler',
        lastReading: '38°F',
        recorded: 'Today 6:00 AM',
        hoursAgo: '6 hours ago',
        icon: Thermometer,
        priority: 'high',
        urgency: isTaskOverdue('temperature', 24) ? 'overdue' : 'medium',
        isOverdue: isTaskOverdue('temperature', 24),
        lastCompleted: getLastTaskTime('temperature'),
        frequency: t('daily'),
        estimatedTime: '5-8 min',
        canStart: true
      },
      {
        id: 'warming-cabinet',
        title: t('warmingCabinetCheck'),
        description: t('hotHoldingUnitsCheck'),
        location: 'Serving Station',
        lastReading: '142°F',
        recorded: 'Today 6:45 AM',
        hoursAgo: '5 hours ago',
        icon: Flame,
        priority: 'medium',
        urgency: isTaskOverdue('warming', 12) ? 'overdue' : 'medium',
        isOverdue: isTaskOverdue('warming', 12),
        lastCompleted: getLastTaskTime('warming'),
        frequency: t('twiceDaily'),
        estimatedTime: '4-6 min',
        canStart: true
      },
      {
        id: 'calibration',
        title: t('thermometerCalibration'),
        description: t('calibrateThermometers'),
        location: 'All Thermometers',
        lastReading: 'Pass',
        recorded: 'Yesterday',
        hoursAgo: '1 day ago',
        icon: Settings,
        priority: 'low',
        urgency: isTaskOverdue('calibration', 24 * 7) ? 'overdue' : 'low',
        isOverdue: isTaskOverdue('calibration', 24 * 7),
        lastCompleted: getLastTaskTime('calibration'),
        frequency: t('weekly'),
        estimatedTime: '8-10 min',
        canStart: true
      },
      {
        id: 'receiving',
        title: t('receivingLog'),
        description: t('foodDeliveryInspection'),
        location: 'Loading Dock',
        lastReading: 'Pass',
        recorded: 'Today 6:30 AM',
        hoursAgo: '6 hours ago',
        icon: FileText,
        priority: 'medium',
        urgency: 'medium',
        isOverdue: false,
        lastCompleted: getLastTaskTime('receiving'),
        frequency: t('asNeeded'),
        estimatedTime: '2-4 min',
        canStart: false
      }
    ];
    
    // Sort by urgency and priority
    tasks.sort((a, b) => {
      const urgencyOrder = { overdue: 0, high: 1, medium: 2, low: 3 };
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setTaskStatuses(tasks);
  };
  
  const loadAttentionItems = () => {
    const items = storageUtils.getAttentionItems();
    setAttentionItems(items);
  };
  
  const isTaskOverdue = (type: string, hoursInterval: number): boolean => {
    let lastReading: any = null;
    
    switch (type) {
      case 'sanitizer':
        const sanitizerReadings = storageUtils.getSanitizerReadings(1);
        lastReading = sanitizerReadings[0];
        break;
      case 'temperature':
        const tempReadings = storageUtils.getTemperatureReadings(1);
        lastReading = tempReadings[0];
        break;
      case 'warming':
        const warmingReadings = storageUtils.getWarmingCabinetReadings(1);
        lastReading = warmingReadings[0];
        break;
      case 'calibration':
        const calibrationReadings = storageUtils.getCalibrationReadings(1);
        lastReading = calibrationReadings[0];
        break;
      default:
        return false;
    }
    
    if (!lastReading) return true;
    
    const lastTime = new Date(lastReading.timestamp);
    const now = new Date();
    const hoursSince = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
    
    return hoursSince > hoursInterval;
  };
  
  const getLastTaskTime = (type: string): string | null => {
    let lastReading: any = null;
    
    switch (type) {
      case 'sanitizer':
        const sanitizerReadings = storageUtils.getSanitizerReadings(1);
        lastReading = sanitizerReadings[0];
        break;
      case 'temperature':
        const tempReadings = storageUtils.getTemperatureReadings(1);
        lastReading = tempReadings[0];
        break;
      case 'warming':
        const warmingReadings = storageUtils.getWarmingCabinetReadings(1);
        lastReading = warmingReadings[0];
        break;
      case 'calibration':
        const calibrationReadings = storageUtils.getCalibrationReadings(1);
        lastReading = calibrationReadings[0];
        break;
      case 'receiving':
        const receivingReadings = storageUtils.getReceivingReadings(1);
        lastReading = receivingReadings[0];
        break;
      default:
        return null;
    }
    
    return lastReading ? new Date(lastReading.timestamp).toLocaleString() : null;
  };

  const getSmartViewMode = (): 'flywheel' | 'list' => {
    const urgentTasks = taskStatuses.filter(t => t.urgency === 'overdue' || t.urgency === 'high');
    const totalTasks = taskStatuses.length;
    
    // Use flywheel when few tasks or mixed urgency levels
    if (totalTasks <= 3 || urgentTasks.length <= 2) {
      return 'flywheel';
    }
    
    // Use list when many urgent tasks need triage
    return 'list';
  };

  const currentViewMode = viewMode === 'smart' ? getSmartViewMode() : viewMode;

  const filteredTasks = taskStatuses.filter(task => 
    activeFilters.length === 0 || activeFilters.includes(task.urgency)
  );

  const handleTaskClick = (task: TaskStatus) => {
    switch (task.id) {
      case 'sanitizer':
        setActiveForm('sanitizer');
        break;
      case 'cold-holding':
        setActiveForm('cold-holding');
        break;
      case 'warming-cabinet':
        setActiveForm('warming-cabinet');
        break;
      case 'calibration':
        setActiveForm('calibration');
        break;
      case 'receiving':
        setActiveForm('receiving');
        break;
      default:
        break;
    }
  };
  
  const handleFormComplete = (entries: any[]) => {
    loadDashboardStats();
    loadTaskStatuses();
    loadAttentionItems();
    setActiveForm('dashboard');
  };

  const toggleFilter = (urgency: TaskUrgency) => {
    setActiveFilters(prev => {
      if (prev.includes(urgency)) {
        return prev.filter(f => f !== urgency);
      } else {
        return [...prev, urgency];
      }
    });
  };

  const filterConfig = [
    { 
      urgency: 'overdue' as TaskUrgency, 
      label: 'Overdue', 
      icon: '🔴',
      activeClass: 'bg-red-100 text-red-700 border-red-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: taskStatuses.filter(t => t.urgency === 'overdue').length
    },
    { 
      urgency: 'high' as TaskUrgency, 
      label: 'Urgent', 
      icon: '⚠️',
      activeClass: 'bg-orange-100 text-orange-700 border-orange-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: taskStatuses.filter(t => t.urgency === 'high').length
    },
    { 
      urgency: 'medium' as TaskUrgency, 
      label: 'Soon', 
      icon: '⏰',
      activeClass: 'bg-yellow-100 text-yellow-700 border-yellow-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: taskStatuses.filter(t => t.urgency === 'medium').length
    },
    { 
      urgency: 'low' as TaskUrgency, 
      label: 'Routine', 
      icon: '✓',
      activeClass: 'bg-green-100 text-green-700 border-green-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: taskStatuses.filter(t => t.urgency === 'low').length
    },
  ];
  
  // Render active form
  if (activeForm === 'sanitizer') {
    return (
      <SanitizerTestForm
        onComplete={(entries: SanitizerTestEntry[]) => handleFormComplete(entries)}
        onCancel={() => setActiveForm('dashboard')}
        lang={lang}
        userId={userId}
      />
    );
  }
  
  if (activeForm === 'cold-holding') {
    return (
      <ColdHoldingForm
        onComplete={(entries: TemperatureEntry[]) => handleFormComplete(entries)}
        onCancel={() => setActiveForm('dashboard')}
        lang={lang}
        userId={userId}
      />
    );
  }
  
  if (activeForm === 'warming-cabinet') {
    return (
      <WarmingCabinetForm
        onComplete={(entries: WarmingCabinetEntry[]) => handleFormComplete(entries)}
        onCancel={() => setActiveForm('dashboard')}
        lang={lang}
        userId={userId}
      />
    );
  }
  
  if (activeForm === 'calibration') {
    return (
      <CalibrationForm
        onComplete={(entries: CalibrationEntry[]) => handleFormComplete(entries)}
        onCancel={() => setActiveForm('dashboard')}
        lang={lang}
        userId={userId}
      />
    );
  }
  
  if (activeForm === 'receiving') {
    return (
      <ReceivingForm
        onComplete={(entries: ReceivingInspectionEntry[]) => handleFormComplete(entries)}
        onCancel={() => setActiveForm('dashboard')}
        lang={lang}
        userId={userId}
      />
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            {t('close')}
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-900">{t('haccpDashboard')}</h1>
            <p className="text-sm text-slate-600">
              {currentViewMode === 'flywheel' ? 'Flywheel View' : 'List View'}
              {viewMode === 'smart' && ' (Auto)'}
            </p>
          </div>
          <div className="w-16" />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Overdue</span>
            </div>
            <div className="text-xl font-bold text-red-900">
              {taskStatuses.filter(t => t.urgency === 'overdue').length}
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Urgent</span>
            </div>
            <div className="text-xl font-bold text-amber-900">
              {taskStatuses.filter(t => t.urgency === 'high').length}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Score</span>
            </div>
            <div className="text-xl font-bold text-blue-900">{stats.complianceScore}%</div>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={() => setViewMode('smart')}
            variant={viewMode === 'smart' ? 'primary' : 'outline'}
            size="sm"
          >
            <Zap className="w-4 h-4" />
            Smart
          </Button>
          <Button
            onClick={() => setViewMode('flywheel')}
            variant={viewMode === 'flywheel' ? 'primary' : 'outline'}
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
          >
            <List className="w-4 h-4" />
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

        {/* Filter Pills */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3">Filter by Urgency</h3>
            <div className="flex flex-wrap gap-2">
              {filterConfig.map(filter => (
                <button
                  key={filter.urgency}
                  onClick={() => toggleFilter(filter.urgency)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    activeFilters.includes(filter.urgency)
                      ? filter.activeClass
                      : filter.inactiveClass
                  }`}
                >
                  <span className="mr-1">{filter.icon}</span>
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="mt-2 text-xs text-slate-500 hover:text-slate-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

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
            <EnhancedFlywheelTaskCards 
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
          /* List View */
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const IconComponent = task.icon;
              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`w-full p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                    task.urgency === 'overdue'
                      ? 'border-red-200 bg-red-50'
                      : task.urgency === 'high'
                      ? 'border-orange-200 bg-orange-50'
                      : task.urgency === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${
                        task.urgency === 'overdue'
                          ? 'bg-red-100 text-red-600'
                          : task.urgency === 'high'
                          ? 'bg-orange-100 text-orange-600'
                          : task.urgency === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{task.title}</h3>
                        <p className="text-sm text-slate-600">{task.description}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.frequency}
                          </span>
                          <span>{task.estimatedTime}</span>
                          {task.lastCompleted && (
                            <span className="text-green-600">
                              ✓ {new Date(task.lastCompleted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.urgency === 'overdue' && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          OVERDUE
                        </span>
                      )}
                      {task.urgency === 'high' && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                          DUE NOW
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-600 mb-3">{t('quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {/* TODO: Export data */}}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {t('exportData')}
            </Button>
            <Button
              onClick={() => {/* TODO: View reports */}}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {t('viewReports')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};