# FlywheelTaskCards - Integration Guide

## Quick Start

### 1. Basic Usage

```jsx
import FlywheelTaskCards from './FlywheelTaskCards';

function App() {
  const tasks = [
    {
      id: 1,
      title: "Sanitizer Test",
      location: "Dish Room",
      lastReading: "350 ppm",
      recorded: "Today 8:30 AM",
      hoursAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Temperature Check",
      location: "Walk-in Cooler",
      lastReading: "38°F",
      recorded: "Today 6:00 AM",
      hoursAgo: "5 hours ago"
    }
  ];

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task);
    // Navigate to task details, start task, etc.
  };

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={handleTaskClick}
    />
  );
}
```

### 2. With Custom Configuration

```jsx
<FlywheelTaskCards 
  tasks={tasks}
  onTaskClick={handleTaskClick}
  config={{
    wheelRadius: 150,           // Larger wheel, more spacing
    containerHeight: 400,        // Taller container
    cardWidth: 360,             // Wider cards
    urgencyThresholds: {
      green: 1,                 // Green if < 1 hour old
      yellow: 4,                // Yellow if 1-4 hours old
    }                           // Red if > 4 hours old
  }}
/>
```

## Integration Patterns

### Pattern 1: Fetching Data from API

```jsx
import { useState, useEffect } from 'react';
import FlywheelTaskCards from './FlywheelTaskCards';

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      
      // Transform API data to match component structure
      const formattedTasks = data.map(task => ({
        id: task.task_id,
        title: task.name,
        location: task.location_name,
        lastReading: task.latest_value,
        recorded: formatTimestamp(task.recorded_at),
        hoursAgo: calculateHoursAgo(task.recorded_at)
      }));
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (task) => {
    // Navigate or open modal
    window.location.href = `/tasks/${task.id}/start`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={handleTaskClick}
    />
  );
}

// Helper functions
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return `Today ${date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })}`;
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })}`;
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function calculateHoursAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const hours = Math.floor((now - then) / (1000 * 60 * 60));
  
  if (hours < 1) {
    const minutes = Math.floor((now - then) / (1000 * 60));
    return `${minutes} minutes ago`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
}
```

### Pattern 2: Real-time Updates with WebSocket

```jsx
import { useState, useEffect } from 'react';
import FlywheelTaskCards from './FlywheelTaskCards';

function RealtimeTaskWheel() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchInitialTasks();

    // WebSocket for real-time updates
    const ws = new WebSocket('wss://your-server.com/tasks');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      if (update.type === 'TASK_UPDATED') {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === update.task.id 
              ? formatTask(update.task)
              : task
          )
        );
      }
      
      if (update.type === 'TASK_COMPLETED') {
        setTasks(prevTasks => 
          prevTasks.filter(task => task.id !== update.taskId)
        );
      }
    };

    return () => ws.close();
  }, []);

  const fetchInitialTasks = async () => {
    const response = await fetch('/api/tasks/pending');
    const data = await response.json();
    setTasks(data.map(formatTask));
  };

  const formatTask = (apiTask) => ({
    id: apiTask.id,
    title: apiTask.title,
    location: apiTask.location,
    lastReading: apiTask.lastReading,
    recorded: apiTask.recordedAt,
    hoursAgo: apiTask.hoursAgo
  });

  const handleTaskClick = (task) => {
    // Open task in modal or navigate
    openTaskModal(task);
  };

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={handleTaskClick}
    />
  );
}
```

### Pattern 3: Filtering and Sorting

```jsx
import { useState } from 'react';
import FlywheelTaskCards from './FlywheelTaskCards';

function FilteredTaskWheel({ allTasks }) {
  const [filter, setFilter] = useState('all'); // 'all', 'urgent', 'today'
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency', 'location', 'name'

  const getFilteredTasks = () => {
    let filtered = [...allTasks];

    // Apply filter
    switch (filter) {
      case 'urgent':
        filtered = filtered.filter(task => {
          const hours = parseInt(task.hoursAgo.match(/\d+/)?.[0] || '0');
          return hours >= 6;
        });
        break;
      case 'today':
        filtered = filtered.filter(task => 
          task.recorded.includes('Today')
        );
        break;
    }

    // Apply sort
    switch (sortBy) {
      case 'urgency':
        filtered.sort((a, b) => {
          const hoursA = parseInt(a.hoursAgo.match(/\d+/)?.[0] || '0');
          const hoursB = parseInt(b.hoursAgo.match(/\d+/)?.[0] || '0');
          return hoursB - hoursA; // Most urgent first
        });
        break;
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  };

  const handleTaskClick = (task) => {
    console.log('Starting task:', task);
  };

  return (
    <div className="relative">
      {/* Filter controls overlay */}
      <div className="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-3">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="mr-2 px-3 py-1 border rounded"
        >
          <option value="all">All Tasks</option>
          <option value="urgent">Urgent Only</option>
          <option value="today">Today Only</option>
        </select>
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="urgency">By Urgency</option>
          <option value="location">By Location</option>
          <option value="name">By Name</option>
        </select>
      </div>

      <FlywheelTaskCards 
        tasks={getFilteredTasks()}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
```

### Pattern 4: Multi-School Dashboard

```jsx
import { useState } from 'react';
import FlywheelTaskCards from './FlywheelTaskCards';

function MultiSchoolDashboard() {
  const [selectedSchool, setSelectedSchool] = useState('school1');
  const [schoolTasks, setSchoolTasks] = useState({
    school1: [...],
    school2: [...],
    // ... other schools
  });

  const handleTaskClick = (task) => {
    // Task action with school context
    startTaskAtSchool(selectedSchool, task);
  };

  return (
    <div className="relative">
      {/* School selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <select 
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="bg-white px-6 py-2 rounded-full shadow-lg text-lg font-semibold"
        >
          <option value="school1">Lincoln Elementary</option>
          <option value="school2">Washington Middle</option>
          <option value="school3">Roosevelt High</option>
        </select>
      </div>

      <FlywheelTaskCards 
        tasks={schoolTasks[selectedSchool]}
        onTaskClick={handleTaskClick}
        key={selectedSchool} // Force remount on school change
      />
    </div>
  );
}
```

## Props Reference

### `tasks` (required)
Array of task objects. Each task must have:

```typescript
{
  id: number | string;          // Unique identifier
  title: string;                // Task name (e.g., "Sanitizer Test")
  location: string;             // Location (e.g., "Dish Room")
  lastReading: string;          // Latest measurement (e.g., "350 ppm")
  recorded: string;             // Timestamp display (e.g., "Today 8:30 AM")
  hoursAgo: string;             // Time elapsed (e.g., "4 hours ago")
}
```

### `onTaskClick` (optional)
Callback function triggered when the action button is clicked on a centered card.

```javascript
(task) => {
  // task is the full task object
  // Handle navigation, start task workflow, etc.
}
```

### `config` (optional)
Configuration object to customize the wheel behavior:

```javascript
{
  wheelRadius: 120,              // Radius of the wheel in pixels
  containerHeight: 350,           // Height of the container in pixels
  cardWidth: 320,                // Width of cards in pixels
  urgencyThresholds: {
    green: 2,                    // Hours threshold for green border
    yellow: 6,                   // Hours threshold for yellow border
  }                              // Anything >= yellow is red
}
```

## Color Coding

The component automatically applies colored borders based on task age:

- **🟢 Green**: < 2 hours (fresh, all good)
- **🟡 Yellow**: 2-6 hours (needs attention soon)
- **🔴 Red**: > 6 hours (urgent, overdue)

Customize thresholds via the `config.urgencyThresholds` prop.

## Performance Considerations

The component automatically throttles rotation speed based on task count:
- **1 task**: Fixed in place (no rotation)
- **2-10 tasks**: Full speed
- **11-20 tasks**: 85% speed
- **21+ tasks**: 70% speed

This ensures smooth rendering even with many tasks.

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind is configured in your project. If using a different CSS framework, you'll need to convert the class names.

## Dependencies

- React (v16.8+ for hooks)
- Tailwind CSS (for styling)

No other external dependencies required!
