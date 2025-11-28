import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Wifi, ArrowLeft } from 'lucide-react';

const FlywheelTaskCards = ({ tasks = [], onTaskClick = () => {}, config = {} }) => {
  const [rotation, setRotation] = useState(Math.PI);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const animationFrame = useRef(null);
  
  const {
    wheelRadius = 120,
    containerHeight = 400,
    cardWidth = 340,
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
        animationFrame.current = requestAnimationFrame(animate);
      } else if (!isDragging && Math.abs(velocity) <= SNAP_THRESHOLD) {
        const anglePerCard = (Math.PI * 2) / CARD_COUNT;
        const normalizedRotation = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const nearestCard = Math.round(normalizedRotation / anglePerCard);
        const targetRotation = nearestCard * anglePerCard;
        const diff = targetRotation - normalizedRotation;
        
        setRotation(r => r + diff * 0.1);
        
        if (Math.abs(diff) > 0.001) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          setVelocity(0);
        }
      }
    };

    animate();
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [velocity, rotation, isDragging, CARD_COUNT]);

  const handleStart = (clientY) => {
    if (IS_FIXED) return;
    setIsDragging(true);
    setVelocity(0);
    lastY.current = clientY;
    lastTime.current = Date.now();
  };

  const handleMove = (clientY) => {
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

  const handleCardClick = (index) => {
    if (isDragging) return; // Don't trigger if user is dragging
    
    const anglePerCard = (Math.PI * 2) / CARD_COUNT;
    const targetRotation = index * anglePerCard;
    
    // Animate to the clicked card
    const startRotation = rotation;
    const distance = targetRotation - (rotation % (Math.PI * 2));
    
    // Find shortest path (account for circular nature)
    let shortestDistance = distance;
    if (Math.abs(distance + Math.PI * 2) < Math.abs(shortestDistance)) {
      shortestDistance = distance + Math.PI * 2;
    }
    if (Math.abs(distance - Math.PI * 2) < Math.abs(shortestDistance)) {
      shortestDistance = distance - Math.PI * 2;
    }
    
    const targetFinal = startRotation + shortestDistance;
    const duration = 300;
    const startTime = Date.now();
    
    const animateToCard = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newRotation = startRotation + shortestDistance * easeProgress;
      
      setRotation(newRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animateToCard);
      } else {
        setVelocity(0);
      }
    };
    
    requestAnimationFrame(animateToCard);
  };

  const getCardTransform = (index) => {
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

  const getVisibilityLevel = (scale, angle) => {
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isNearCenter = normalizedAngle > Math.PI * 0.8 && normalizedAngle < Math.PI * 1.2;
    
    if (scale > 0.85 && isNearCenter) return 4;
    if (scale > 0.7) return 3;
    if (scale > 0.5) return 2;
    if (scale > 0.35) return 1;
    return 0;
  };

  const getUrgencyStyle = (status) => {
    switch(status) {
      case 'overdue':
        return { 
          border: 'border-red-500', 
          bg: 'bg-red-500',
          button: 'bg-gradient-to-r from-red-600 to-red-700'
        };
      case 'due-now':
        return { 
          border: 'border-orange-500', 
          bg: 'bg-orange-500',
          button: 'bg-gradient-to-r from-orange-600 to-orange-700'
        };
      case 'due-soon':
        return { 
          border: 'border-yellow-500', 
          bg: 'bg-yellow-500',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700'
        };
      case 'complete':
        return { 
          border: 'border-green-500', 
          bg: 'bg-green-500',
          button: 'bg-slate-400'
        };
      default:
        return { 
          border: 'border-slate-300', 
          bg: 'bg-slate-300',
          button: 'bg-slate-400'
        };
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-slate-500 text-lg">No tasks to display</div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex flex-col select-none"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="flex-1 flex flex-col" style={{ perspective: '1000px' }}>
        <div className="relative w-full flex-1 max-w-md mx-auto flex items-center justify-center">
          <div className="relative" style={{ height: `${containerHeight}px`, width: '100%' }}>
            {tasks.map((task, index) => {
              const { y, z, scale, opacity, angle } = getCardTransform(index);
              const visibilityLevel = getVisibilityLevel(scale, angle);
              const urgencyStyle = getUrgencyStyle(task.status);
              
              return (
                <div
                  key={task.id}
                  className="absolute left-1/2 top-1/2 rounded-3xl transition-all duration-100 cursor-pointer"
                  style={{
                    width: `${cardWidth}px`,
                    transform: `translate(-50%, -50%) translate3d(0, ${y}px, ${z}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: Math.round(1000 + z),
                    pointerEvents: opacity > 0.1 ? 'auto' : 'none',
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl border-4 ${urgencyStyle.border}`}>
                    {visibilityLevel >= 1 && (
                      <div className="p-6">
                        {visibilityLevel >= 2 && (
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className={`text-sm font-bold uppercase tracking-wide ${
                              task.status === 'overdue' ? 'text-red-600' :
                              task.status === 'due-now' ? 'text-orange-600' :
                              task.status === 'due-soon' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {task.dueTime}
                            </span>
                          </div>
                        )}
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                          {task.name}
                        </h2>
                        
                        {visibilityLevel >= 2 && (
                          <div className="flex items-center gap-2 text-slate-500 mb-6">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium uppercase tracking-wide">{task.location}</span>
                          </div>
                        )}
                        
                        {visibilityLevel >= 3 && (
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">Last Reading</div>
                              <div className="text-3xl font-bold text-slate-900">{task.lastValue}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">Recorded</div>
                              <div className="text-sm text-slate-700 font-medium">{task.lastTime}</div>
                            </div>
                          </div>
                        )}
                        
                        {visibilityLevel === 4 && task.canStart && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center ${urgencyStyle.button}`}
                          >
                            Log Temp
                            <ChevronRight className="ml-2" size={24} />
                          </button>
                        )}

                        {visibilityLevel === 4 && !task.canStart && task.status === 'complete' && (
                          <div className="w-full py-4 rounded-xl font-bold text-lg bg-green-50 text-green-700 text-center border-2 border-green-200">
                            ✓ Completed
                          </div>
                        )}
                      </div>
                    )}
                    
                    {visibilityLevel === 1 && (
                      <div className={`h-16 ${urgencyStyle.bg}`}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeFilters, setActiveFilters] = useState(['overdue', 'due-now']);

  const allTasks = [
    { 
      id: 1, 
      name: 'Sanitizer Test', 
      location: 'Dish Room',
      status: 'overdue', 
      dueTime: 'Overdue (4h)',
      lastValue: '350 ppm',
      lastTime: 'Yesterday, 2:15pm',
      canStart: true
    },
    { 
      id: 2, 
      name: 'Milk Cooler Temp', 
      location: 'Cafeteria Line A',
      status: 'due-now', 
      dueTime: 'Due Now',
      lastValue: '38°F',
      lastTime: 'Yesterday, 7:00am',
      canStart: true
    },
    { 
      id: 3, 
      name: 'Thermometer Calibration', 
      location: 'All thermometers',
      status: 'due-soon', 
      dueTime: 'Due in 45 min',
      lastValue: 'Pass',
      lastTime: 'Yesterday',
      canStart: false
    },
    { 
      id: 4, 
      name: 'Warming Cabinet', 
      location: 'Serving Station',
      status: 'complete', 
      dueTime: 'Complete',
      lastValue: '142°F',
      lastTime: 'Today, 6:45am',
      canStart: false
    },
    { 
      id: 5, 
      name: 'Walk-in Refrigerator', 
      location: 'Kitchen',
      status: 'complete', 
      dueTime: 'Complete',
      lastValue: '37°F',
      lastTime: 'Today, 6:50am',
      canStart: false
    },
  ];

  const filteredTasks = allTasks.filter(task => activeFilters.includes(task.status));

  const toggleFilter = (status) => {
    setActiveFilters(prev => {
      if (prev.includes(status)) {
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const filterConfig = [
    { 
      status: 'overdue', 
      label: 'Overdue', 
      icon: '🔴',
      activeClass: 'bg-red-100 text-red-700 border-red-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: allTasks.filter(t => t.status === 'overdue').length
    },
    { 
      status: 'due-now', 
      label: 'Due', 
      icon: '⚠️',
      activeClass: 'bg-orange-100 text-orange-700 border-orange-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: allTasks.filter(t => t.status === 'due-now').length
    },
    { 
      status: 'due-soon', 
      label: 'Soon', 
      icon: '⏰',
      activeClass: 'bg-yellow-100 text-yellow-700 border-yellow-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: allTasks.filter(t => t.status === 'due-soon').length
    },
    { 
      status: 'complete', 
      label: 'Done', 
      icon: '✓',
      activeClass: 'bg-green-100 text-green-700 border-green-500',
      inactiveClass: 'bg-slate-50 text-slate-400 border-slate-200',
      count: allTasks.filter(t => t.status === 'complete').length
    },
  ];

  const handleStartTask = (task) => {
    setSelectedTask(task);
    setCurrentView('logging');
  };

  const completedCount = allTasks.filter(t => t.status === 'complete').length;
  const totalCount = allTasks.length;

  if (currentView === 'logging' && selectedTask) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto p-4">
          <div className="mb-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center text-slate-600 mb-4 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900">{selectedTask.name}</h2>
            <p className="text-slate-600">{selectedTask.location}</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Last Reading</label>
                <span className="text-sm text-slate-500">{selectedTask.lastTime}</span>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <span className="text-3xl font-bold text-slate-700">{selectedTask.lastValue}</span>
              </div>
            </div>

            {selectedTask.name === 'Sanitizer Test' && (
              <>
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Concentration (ppm)
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-4 text-2xl font-semibold text-center border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="425"
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Required: 272-700 ppm
                  </p>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Temperature (°F)
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-4 text-2xl font-semibold text-center border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="78"
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Must be ≥75°F
                  </p>
                </div>
              </>
            )}

            {selectedTask.name === 'Milk Cooler Temp' && (
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Temperature (°F)
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-4 text-2xl font-semibold text-center border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="38"
                  step="0.1"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Must be ≤41°F
                </p>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all">
              Submit Reading
            </button>

            <button className="w-full mt-3 bg-white text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors flex items-center justify-center border-2 border-slate-200">
              <span className="mr-2">📸</span>
              Add Photo (Optional)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Good Morning, Maria</h1>
            <p className="text-sm text-slate-600">Jefferson Elementary</p>
          </div>
          <div className="flex items-center text-green-600 text-sm">
            <Wifi size={16} className="mr-1" />
            <span className="font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4">
        <div className="py-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {filterConfig.map(filter => {
              const isActive = activeFilters.includes(filter.status);
              return (
                <button
                  key={filter.status}
                  onClick={() => toggleFilter(filter.status)}
                  className={`px-4 py-2 rounded-full font-semibold text-xs border-2 transition-all duration-200 transform ${
                    isActive 
                      ? `${filter.activeClass} scale-100 shadow-md` 
                      : `${filter.inactiveClass} scale-95 opacity-60 hover:opacity-80`
                  }`}
                >
                  <span className="mr-1.5">{filter.icon}</span>
                  {filter.label}
                  <span className="ml-1.5 opacity-70">({filter.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 relative">
          {filteredTasks.length > 0 ? (
            <FlywheelTaskCards 
              tasks={filteredTasks}
              onTaskClick={handleStartTask}
              config={{
                wheelRadius: 150,
                containerHeight: 480,
                cardWidth: 340
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">👍</div>
                <div className="text-lg font-medium">No tasks in selected categories</div>
                <div className="text-sm mt-1">Try selecting different filters above</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">
            {completedCount}/{totalCount} complete today
          </span>
          <button className="text-blue-600 font-semibold hover:text-blue-700">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;