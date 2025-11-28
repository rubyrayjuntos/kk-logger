import React, { useState, useRef, useEffect } from 'react';

/**
 * FlywheelTaskCards - A 3D rotating carousel for task cards with urgency-based color coding
 * 
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onTaskClick - Callback when task action button is clicked
 * @param {Object} props.config - Optional configuration overrides
 * 
 * Task object structure:
 * {
 *   id: number | string,          // Unique identifier
 *   title: string,                 // Task name
 *   location: string,              // Where the task is performed
 *   lastReading: string,           // Latest measurement/result
 *   recorded: string,              // When it was recorded (display)
 *   hoursAgo: string,              // Time elapsed (e.g., "4 hours ago")
 * }
 * 
 * Config options:
 * {
 *   wheelRadius: number,           // Default: 120
 *   containerHeight: number,       // Default: 350
 *   cardWidth: number,             // Default: 320
 *   urgencyThresholds: {
 *     green: number,               // Hours threshold for green (default: 2)
 *     yellow: number,              // Hours threshold for yellow (default: 6)
 *   }
 * }
 */
const FlywheelTaskCards = ({ 
  tasks = [], 
  onTaskClick = () => {},
  config = {}
}) => {
  const [rotation, setRotation] = useState(Math.PI);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const animationFrame = useRef(null);
  
  // Merge config with defaults
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
  
  // Speed throttling based on card count to allow React to update data in time
  const getSpeedMultiplier = () => {
    if (CARD_COUNT === 1) return 0; // Fixed in place
    if (CARD_COUNT <= 10) return 1.0; // Full speed
    if (CARD_COUNT <= 20) return 0.85; // 15% reduction
    return 0.7; // 30% reduction for 21+ cards
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
        // Snap to nearest card
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
    if (IS_FIXED) return; // Don't allow dragging with single card
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

  const getCardTransform = (index) => {
    const anglePerCard = (Math.PI * 2) / CARD_COUNT;
    const angle = (index * anglePerCard) - rotation;
    
    // Calculate position on the wheel
    const y = Math.sin(angle) * RADIUS;
    const z = Math.cos(angle) * RADIUS - RADIUS;
    
    // Scale based on z position (perspective) - more dramatic scaling
    // Use proper normalization: z=0 (front) should be scale=1, z=-2*RADIUS (back) should be smaller
    const normalizedZForScale = (z + 2 * RADIUS) / (2 * RADIUS);
    const scale = Math.max(0.2, 0.3 + normalizedZForScale * 0.7);
    
    // Opacity based on position - hide back-facing cards
    // z ranges from 0 (front, closest to viewer) to -2*RADIUS (back)
    // Normalize so 1 = front, 0 = back
    const normalizedZ = (z + 2 * RADIUS) / (2 * RADIUS);
    let opacity = 0;
    
    // Only show cards in front half of wheel
    if (normalizedZ > 0.5) {
      opacity = Math.pow((normalizedZ - 0.5) * 2, 0.7);
    }
    
    return { y, z, scale, opacity, angle };
  };

  const getVisibilityLevel = (scale, angle) => {
    // Determine how much information to show based on scale and position
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isNearCenter = normalizedAngle > Math.PI * 0.8 && normalizedAngle < Math.PI * 1.2;
    
    if (scale > 0.85 && isNearCenter) return 4; // Full detail
    if (scale > 0.7) return 3; // Most info
    if (scale > 0.5) return 2; // Some info
    if (scale > 0.35) return 1; // Minimal info
    return 0; // Just a sliver
  };

  const getBorderColor = (hoursAgo) => {
    // Extract number from "X hours ago" string
    const hours = parseInt(hoursAgo?.match(/\d+/)?.[0] || '0');
    
    if (hours < urgencyThresholds.green) return 'border-green-500'; // Fresh - all good
    if (hours < urgencyThresholds.yellow) return 'border-yellow-500'; // Warning - needs attention soon
    return 'border-red-500'; // Critical - overdue
  };

  // Handle empty state
  if (tasks.length === 0) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg opacity-60">No tasks to display</div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center select-none"
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-60 pointer-events-none">
        {IS_FIXED ? 'Only one task' : 'Swipe to spin the wheel'}
      </div>
      
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
        <div className="relative w-full max-w-md" style={{ height: `${containerHeight}px` }}>
          {tasks.map((task, index) => {
            const { y, z, scale, opacity, angle } = getCardTransform(index);
            const visibilityLevel = getVisibilityLevel(scale, angle);
            const borderColor = getBorderColor(task.hoursAgo);
            
            return (
              <div
                key={task.id}
                className="absolute left-1/2 top-1/2 rounded-2xl shadow-2xl transition-all duration-100"
                style={{
                  width: `${cardWidth}px`,
                  transform: `translate(-50%, -50%) translate3d(0, ${y}px, ${z}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: Math.round(1000 + z),
                  pointerEvents: visibilityLevel === 4 ? 'auto' : 'none',
                }}
              >
                <div className={`bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${borderColor}`}>
                  {visibilityLevel >= 1 && (
                    <div className="p-5">
                      {/* Header - Time badge */}
                      {visibilityLevel >= 2 && (
                        <div className="flex items-start gap-2 mb-3">
                          <div className="flex items-center gap-2 text-xs text-red-500">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="font-medium">{task.hoursAgo}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      
                      {/* Location */}
                      {visibilityLevel >= 2 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{task.location}</span>
                        </div>
                      )}
                      
                      {/* Details */}
                      {visibilityLevel >= 3 && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Last Reading</div>
                            <div className="text-2xl font-bold text-gray-900">{task.lastReading}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Recorded</div>
                            <div className="text-sm text-gray-700">{task.recorded}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Action button */}
                      {visibilityLevel === 4 && (
                        <button 
                          onClick={() => onTaskClick(task)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                          <span>Start Task</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Minimal view - colored bar matching urgency */}
                  {visibilityLevel === 1 && (
                    <div className={`h-16 ${borderColor.replace('border-', 'bg-')}`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Center indicator line */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20 pointer-events-none"></div>
    </div>
  );
};

export default FlywheelTaskCards;
