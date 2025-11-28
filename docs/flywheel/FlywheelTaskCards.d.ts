/**
 * TypeScript definitions for FlywheelTaskCards component
 * 
 * If you're using TypeScript, save this as FlywheelTaskCards.d.ts
 * If you're using JavaScript, you can ignore this file (JSDoc comments in the component provide IntelliSense)
 */

export interface Task {
  /** Unique identifier for the task */
  id: number | string;
  
  /** Display name of the task (e.g., "Sanitizer Test") */
  title: string;
  
  /** Location where task is performed (e.g., "Dish Room") */
  location: string;
  
  /** Latest measurement or reading (e.g., "350 ppm", "38°F") */
  lastReading: string;
  
  /** Human-readable timestamp (e.g., "Today 8:30 AM", "Yesterday 5:00 PM") */
  recorded: string;
  
  /** Time elapsed since recording (e.g., "4 hours ago", "30 minutes ago")
   *  Must contain a number that can be parsed with regex
   */
  hoursAgo: string;
}

export interface UrgencyThresholds {
  /** Hours threshold for green border (default: 2)
   *  Tasks recorded less than this many hours ago will have green borders
   */
  green: number;
  
  /** Hours threshold for yellow border (default: 6)
   *  Tasks recorded between green and yellow thresholds will have yellow borders
   *  Tasks recorded after this threshold will have red borders
   */
  yellow: number;
}

export interface FlywheelConfig {
  /** Radius of the wheel in pixels (default: 120) */
  wheelRadius?: number;
  
  /** Height of the container in pixels (default: 350) */
  containerHeight?: number;
  
  /** Width of each card in pixels (default: 320) */
  cardWidth?: number;
  
  /** Urgency color thresholds */
  urgencyThresholds?: Partial<UrgencyThresholds>;
}

export interface FlywheelTaskCardsProps {
  /** Array of tasks to display on the wheel */
  tasks: Task[];
  
  /** Callback fired when a task's action button is clicked
   *  Only called when task is centered and fully visible
   */
  onTaskClick?: (task: Task) => void;
  
  /** Optional configuration to customize wheel behavior and appearance */
  config?: FlywheelConfig;
}

declare const FlywheelTaskCards: React.FC<FlywheelTaskCardsProps>;

export default FlywheelTaskCards;

// ============================================================================
// USAGE EXAMPLES IN TYPESCRIPT
// ============================================================================

/*

Example 1: Basic usage with types

```typescript
import React from 'react';
import FlywheelTaskCards, { Task } from './FlywheelTaskCards';

const MyComponent: React.FC = () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Temperature Check",
      location: "Kitchen",
      lastReading: "38°F",
      recorded: "Today 9:00 AM",
      hoursAgo: "2 hours ago"
    }
  ];

  const handleTaskClick = (task: Task): void => {
    console.log('Starting task:', task.title);
  };

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={handleTaskClick}
    />
  );
};
```

Example 2: With custom configuration

```typescript
import FlywheelTaskCards, { Task, FlywheelConfig } from './FlywheelTaskCards';

const config: FlywheelConfig = {
  wheelRadius: 150,
  containerHeight: 400,
  urgencyThresholds: {
    green: 1,
    yellow: 4
  }
};

const tasks: Task[] = [...];

<FlywheelTaskCards 
  tasks={tasks}
  onTaskClick={(task) => console.log(task)}
  config={config}
/>
```

Example 3: Fetching from API with type safety

```typescript
import React, { useState, useEffect } from 'react';
import FlywheelTaskCards, { Task } from './FlywheelTaskCards';

interface ApiTask {
  task_id: number;
  task_name: string;
  location_name: string;
  latest_value: string;
  recorded_timestamp: string;
}

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    const response = await fetch('/api/tasks');
    const data: ApiTask[] = await response.json();
    
    const formattedTasks: Task[] = data.map(apiTask => ({
      id: apiTask.task_id,
      title: apiTask.task_name,
      location: apiTask.location_name,
      lastReading: apiTask.latest_value,
      recorded: formatTimestamp(apiTask.recorded_timestamp),
      hoursAgo: calculateHoursAgo(apiTask.recorded_timestamp)
    }));
    
    setTasks(formattedTasks);
  };

  const handleTaskClick = (task: Task): void => {
    window.location.href = `/tasks/${task.id}/start`;
  };

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={handleTaskClick}
    />
  );
};

function formatTimestamp(timestamp: string): string {
  // Implementation
  return "Today 8:30 AM";
}

function calculateHoursAgo(timestamp: string): string {
  // Implementation
  return "2 hours ago";
}
```

Example 4: Strict task validation

```typescript
import { Task } from './FlywheelTaskCards';

function isValidTask(task: any): task is Task {
  return (
    task &&
    (typeof task.id === 'number' || typeof task.id === 'string') &&
    typeof task.title === 'string' &&
    typeof task.location === 'string' &&
    typeof task.lastReading === 'string' &&
    typeof task.recorded === 'string' &&
    typeof task.hoursAgo === 'string' &&
    /\d+/.test(task.hoursAgo)
  );
}

const validateTasks = (tasks: unknown[]): Task[] => {
  return tasks.filter(isValidTask);
};

// Usage
const rawData: unknown[] = await fetchFromAPI();
const validTasks = validateTasks(rawData);

<FlywheelTaskCards tasks={validTasks} />
```

*/
