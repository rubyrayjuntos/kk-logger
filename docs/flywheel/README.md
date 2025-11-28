# 🎡 FlywheelTaskCards Component

A stunning 3D rotating carousel for displaying and interacting with task cards. Perfect for cafeteria compliance logging, maintenance schedules, or any task management system.

![Status](https://img.shields.io/badge/status-production--ready-green)
![React](https://img.shields.io/badge/react-16.8%2B-blue)
![TypeScript](https://img.shields.io/badge/typescript-supported-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎯 **Physical Flywheel Feel** - Momentum-based scrolling with realistic friction
- 🎨 **Smart Color Coding** - Automatic urgency indicators (green/yellow/red)
- 📱 **Touch & Mouse Support** - Works on desktop and mobile devices
- ⚡ **Performance Optimized** - Automatic speed throttling based on task count
- 🔧 **Fully Customizable** - Configure wheel size, colors, thresholds
- 🎭 **Progressive Detail** - Shows more/less info based on card position
- 📦 **Zero Dependencies** - Only React + Tailwind CSS required
- 🔌 **Drop-in Ready** - Just pass your data and go!

## 📦 What's Included

```
FlywheelTaskCards/
├── FlywheelTaskCards.jsx       # Main component (drop this in your project)
├── FlywheelTaskCards.d.ts      # TypeScript definitions
├── ExampleApp.jsx              # Ready-to-use example
├── INTEGRATION-GUIDE.md        # Detailed integration patterns
├── QUICK-REFERENCE.md          # Quick lookup guide
└── COLOR-CODING-GUIDE.md       # Urgency system explained
```

## 🚀 Quick Start

### 1. Copy the Component

Copy `FlywheelTaskCards.jsx` into your project:

```bash
cp FlywheelTaskCards.jsx src/components/
```

### 2. Use It

```jsx
import FlywheelTaskCards from './components/FlywheelTaskCards';

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
    // ... more tasks
  ];

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={(task) => console.log('Start:', task)}
    />
  );
}
```

### 3. Done! 🎉

That's it. The component handles everything else automatically.

## 📊 Data Format

Your tasks must have this structure:

```javascript
{
  id: 1,                        // Unique ID (number or string)
  title: "Temperature Check",   // Task name
  location: "Kitchen",          // Where it's done
  lastReading: "38°F",          // Latest measurement
  recorded: "Today 9:00 AM",    // When recorded (display text)
  hoursAgo: "2 hours ago"       // Time elapsed (must include number)
}
```

## 🎨 Color Coding System

The component automatically applies colored borders based on task age:

| Color | Age | Status |
|-------|-----|--------|
| 🟢 Green | < 2 hours | Fresh, all good |
| 🟡 Yellow | 2-6 hours | Needs attention soon |
| 🔴 Red | > 6 hours | Urgent, overdue |

Customize thresholds via config:

```jsx
<FlywheelTaskCards 
  tasks={tasks}
  config={{
    urgencyThresholds: {
      green: 1,   // Green if < 1 hour
      yellow: 4   // Yellow if 1-4 hours, Red if > 4 hours
    }
  }}
/>
```

## ⚙️ Configuration Options

All configuration is optional:

```jsx
<FlywheelTaskCards 
  tasks={tasks}
  onTaskClick={handleClick}
  config={{
    wheelRadius: 120,           // Wheel size (default: 120)
    containerHeight: 350,        // Container height (default: 350)
    cardWidth: 320,             // Card width (default: 320)
    urgencyThresholds: {
      green: 2,                 // Green threshold (default: 2 hours)
      yellow: 6                 // Yellow threshold (default: 6 hours)
    }
  }}
/>
```

## 🔌 Integration Examples

### With REST API

```jsx
const [tasks, setTasks] = useState([]);

useEffect(() => {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(t => ({
        id: t.id,
        title: t.name,
        location: t.location,
        lastReading: t.value,
        recorded: formatDate(t.timestamp),
        hoursAgo: getTimeAgo(t.timestamp)
      }));
      setTasks(formatted);
    });
}, []);

return <FlywheelTaskCards tasks={tasks} />;
```

### With Real-time Updates

```jsx
useEffect(() => {
  const ws = new WebSocket('wss://your-server.com/tasks');
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === update.id ? update : t)
    );
  };

  return () => ws.close();
}, []);
```

See [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) for more patterns.

## 🎯 User Interactions

### Scrolling Behavior
- **Swipe up/down** or **drag** to rotate the wheel
- **Fling** for momentum scrolling with realistic physics
- **Auto-snap** to center nearest card when stopped
- **Single task** = Fixed in place (no rotation)

### Progressive Detail Levels
Based on card position, different amounts of info are shown:

1. **Far from center**: Just a colored bar
2. **Approaching**: Title only
3. **Near center**: Title + location + time badge
4. **Centered**: Full details + action button

### Performance
Automatic speed throttling based on task count:
- 1 task: Fixed (no rotation)
- 2-10 tasks: Full speed
- 11-20 tasks: 85% speed
- 21+ tasks: 70% speed

## 🛠️ Helper Functions

Transform your data easily:

```javascript
// Format timestamp to "Today 8:30 AM"
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
  
  return date.toLocaleDateString();
}

// Calculate "X hours ago"
function calculateHoursAgo(timestamp) {
  const hours = Math.floor((Date.now() - new Date(timestamp)) / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / (1000 * 60));
    return `${minutes} minutes ago`;
  }
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}
```

## 📋 Requirements

- **React** 16.8 or higher (uses hooks)
- **Tailwind CSS** (for styling)

That's it! No other dependencies.

### Setting up Tailwind

If you don't have Tailwind yet:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

## 🎬 Live Example

Check out [ExampleApp.jsx](./ExampleApp.jsx) for a complete working example with sample data.

## 📚 Documentation

- **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Quick lookup guide
- **[INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md)** - Detailed integration patterns
- **[COLOR-CODING-GUIDE.md](./COLOR-CODING-GUIDE.md)** - Urgency system explained
- **[FlywheelTaskCards.d.ts](./FlywheelTaskCards.d.ts)** - TypeScript definitions

## 💡 Use Cases

Perfect for:
- 🍽️ Cafeteria compliance logging
- 🔧 Maintenance task tracking  
- 📋 Daily checklist systems
- 🏥 Healthcare rounds
- 🏭 Factory inspections
- 🏫 School facility management
- 🚚 Delivery schedules
- Any task-based workflow!

## 🎨 Customization Examples

### Large Wheel
```jsx
<FlywheelTaskCards 
  tasks={tasks}
  config={{
    wheelRadius: 180,
    containerHeight: 450,
    cardWidth: 360
  }}
/>
```

### Compact Wheel
```jsx
<FlywheelTaskCards 
  tasks={tasks}
  config={{
    wheelRadius: 100,
    containerHeight: 300,
    cardWidth: 280
  }}
/>
```

### Strict Urgency
```jsx
<FlywheelTaskCards 
  tasks={tasks}
  config={{
    urgencyThresholds: {
      green: 0.5,  // Green only if < 30 minutes
      yellow: 2    // Yellow if 30min-2hrs, Red after 2hrs
    }
  }}
/>
```

## 🐛 Troubleshooting

**Cards not showing?**
- Check that `hoursAgo` contains a number (e.g., "4 hours ago")
- Verify all required fields are present

**Scrolling feels choppy with many tasks?**
- The component automatically throttles speed for 20+ tasks
- This is intentional for performance

**Colors not appearing?**
- Ensure Tailwind CSS is properly configured
- Check that color classes (border-green-500, etc.) are available

## 📄 License

MIT - Use freely in your projects!

## 🤝 Support

For detailed integration help, see the guides:
- [Quick Reference](./QUICK-REFERENCE.md)
- [Integration Guide](./INTEGRATION-GUIDE.md)
- [Example App](./ExampleApp.jsx)

---

**Made with ❤️ for task management interfaces**

*Drop this component into your project and start spinning! 🎡*
