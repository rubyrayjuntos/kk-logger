# FlywheelTaskCards - Quick Reference

## Required Data Format

```javascript
const tasks = [
  {
    id: 1,                        // ✅ Required: number or string
    title: "Sanitizer Test",      // ✅ Required: string
    location: "Dish Room",        // ✅ Required: string
    lastReading: "350 ppm",       // ✅ Required: string
    recorded: "Today 8:30 AM",    // ✅ Required: string
    hoursAgo: "4 hours ago"       // ✅ Required: string (must include number)
  }
];
```

## Component Usage

```javascript
<FlywheelTaskCards 
  tasks={tasks}                   // ✅ Required: array of task objects
  onTaskClick={handleClick}       // ⚙️ Optional: function
  config={customConfig}           // ⚙️ Optional: object
/>
```

## Event Handler

```javascript
const handleClick = (task) => {
  // task = the full task object that was clicked
  console.log(task.id, task.title);
};
```

## Custom Configuration (All Optional)

```javascript
const customConfig = {
  wheelRadius: 120,              // Default: 120px
  containerHeight: 350,          // Default: 350px
  cardWidth: 320,                // Default: 320px
  urgencyThresholds: {
    green: 2,                    // Default: 2 hours
    yellow: 6                    // Default: 6 hours
  }
};
```

## Color Coding Rules

| Border Color | Condition | Meaning |
|--------------|-----------|---------|
| 🟢 Green | < 2 hours | Fresh, all good |
| 🟡 Yellow | 2-6 hours | Warning, needs attention |
| 🔴 Red | > 6 hours | Critical, overdue |

*Thresholds customizable via `config.urgencyThresholds`*

## Rotation Speed (Automatic)

| Task Count | Speed | Reason |
|------------|-------|--------|
| 1 task | Fixed (no rotation) | Nothing to scroll |
| 2-10 tasks | 100% | Full speed |
| 11-20 tasks | 85% | Smoother updates |
| 21+ tasks | 70% | Performance optimization |

## Minimal Example

```javascript
import FlywheelTaskCards from './FlywheelTaskCards';

function App() {
  const tasks = [
    {
      id: 1,
      title: "Temperature Check",
      location: "Kitchen",
      lastReading: "38°F",
      recorded: "Today 9:00 AM",
      hoursAgo: "2 hours ago"
    }
  ];

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={(task) => alert(task.title)}
    />
  );
}
```

## Common Transformations

### From Database Query

```javascript
// Database returns:
const dbTasks = [
  {
    task_id: 123,
    task_name: "Sanitizer Test",
    location_name: "Dish Room",
    latest_value: "350 ppm",
    recorded_timestamp: "2024-01-15T08:30:00Z"
  }
];

// Transform to component format:
const tasks = dbTasks.map(t => ({
  id: t.task_id,
  title: t.task_name,
  location: t.location_name,
  lastReading: t.latest_value,
  recorded: formatTimestamp(t.recorded_timestamp),
  hoursAgo: calculateHoursAgo(t.recorded_timestamp)
}));
```

### From REST API

```javascript
// API returns:
{
  "tasks": [
    {
      "id": 1,
      "name": "Temp Check",
      "site": "Kitchen",
      "value": "38°F",
      "timestamp": 1705311000000
    }
  ]
}

// Transform:
const tasks = apiResponse.tasks.map(t => ({
  id: t.id,
  title: t.name,
  location: t.site,
  lastReading: t.value,
  recorded: formatDate(t.timestamp),
  hoursAgo: getTimeAgo(t.timestamp)
}));
```

## Helper Functions

```javascript
// Format timestamp to "Today 8:30 AM" or "Yesterday 5:00 PM"
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

// Calculate "X hours ago" string
function calculateHoursAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}
```

## Empty State Handling

The component automatically handles empty arrays:

```javascript
// This will show "No tasks to display"
<FlywheelTaskCards tasks={[]} />
```

## Dependencies

✅ **React 16.8+** (uses hooks)  
✅ **Tailwind CSS** (for styling)  
❌ No other dependencies!

---

**Need more help?** See [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) for detailed patterns and examples.
