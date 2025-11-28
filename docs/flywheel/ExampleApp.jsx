import React from 'react';
import FlywheelTaskCards from './FlywheelTaskCards';

/**
 * Example App - Drop this into your project to see the component in action
 */
function ExampleApp() {
  // Sample task data - replace with your actual data source
  const sampleTasks = [
    {
      id: 1,
      title: "Sanitizer Test",
      location: "Dish Room",
      lastReading: "350 ppm",
      recorded: "Today 8:30 AM",
      hoursAgo: "18 hours ago"
    },
    {
      id: 2,
      title: "Temperature Check",
      location: "Walk-in Cooler",
      lastReading: "38°F",
      recorded: "Today 8:30 AM",
      hoursAgo: "1 hour ago"
    },
    {
      id: 3,
      title: "Oil Quality Test",
      location: "Fryer Station",
      lastReading: "3.5 TPM",
      recorded: "Today 6:45 AM",
      hoursAgo: "4 hours ago"
    },
    {
      id: 4,
      title: "pH Level Check",
      location: "Dishwasher",
      lastReading: "7.2",
      recorded: "Yesterday 5:00 PM",
      hoursAgo: "19 hours ago"
    },
    {
      id: 5,
      title: "Probe Calibration",
      location: "Prep Area",
      lastReading: "Pass",
      recorded: "Today 7:00 AM",
      hoursAgo: "3 hours ago"
    },
    {
      id: 6,
      title: "Food Temp Log",
      location: "Hot Hold",
      lastReading: "165°F",
      recorded: "Today 9:15 AM",
      hoursAgo: "30 minutes ago"
    },
    {
      id: 7,
      title: "Cleaning Verification",
      location: "Grill Area",
      lastReading: "Pass",
      recorded: "Yesterday 11:30 PM",
      hoursAgo: "12 hours ago"
    },
    {
      id: 8,
      title: "Water Hardness",
      location: "Utility Room",
      lastReading: "150 ppm",
      recorded: "Today 6:00 AM",
      hoursAgo: "5 hours ago"
    }
  ];

  // Handle when a task's action button is clicked
  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    alert(`Starting task: ${task.title} at ${task.location}`);
    
    // In a real app, you might:
    // - Navigate to task details: router.push(`/tasks/${task.id}`)
    // - Open a modal: openTaskModal(task)
    // - Start a workflow: startTaskWorkflow(task)
    // - Update backend: markTaskAsStarted(task.id)
  };

  return (
    <FlywheelTaskCards 
      tasks={sampleTasks}
      onTaskClick={handleTaskClick}
    />
  );
}

export default ExampleApp;

// ============================================================================
// CUSTOMIZATION EXAMPLES
// ============================================================================

// Example 1: Larger wheel with custom thresholds
export function ExampleLargeWheel() {
  const tasks = [...]; // your tasks

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={(task) => console.log(task)}
      config={{
        wheelRadius: 180,
        containerHeight: 450,
        cardWidth: 360,
        urgencyThresholds: {
          green: 1,  // Green if < 1 hour
          yellow: 4  // Yellow if 1-4 hours, Red if > 4 hours
        }
      }}
    />
  );
}

// Example 2: Compact wheel
export function ExampleCompactWheel() {
  const tasks = [...]; // your tasks

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={(task) => console.log(task)}
      config={{
        wheelRadius: 100,
        containerHeight: 300,
        cardWidth: 280
      }}
    />
  );
}

// Example 3: With API data
export function ExampleWithAPI() {
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        // Transform your API data to match the required format
        const formattedTasks = data.map(task => ({
          id: task.id,
          title: task.name,
          location: task.location,
          lastReading: task.value,
          recorded: formatDate(task.timestamp),
          hoursAgo: calculateHoursAgo(task.timestamp)
        }));
        setTasks(formattedTasks);
      });
  }, []);

  return (
    <FlywheelTaskCards 
      tasks={tasks}
      onTaskClick={(task) => {
        // Start the task
        fetch(`/api/tasks/${task.id}/start`, { method: 'POST' })
          .then(() => {
            window.location.href = `/tasks/${task.id}`;
          });
      }}
    />
  );
}

// Helper functions for API example
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return `Today ${date.toLocaleTimeString('en-US', { 
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
  const hours = Math.floor((Date.now() - new Date(timestamp)) / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / (1000 * 60));
    return `${minutes} minutes ago`;
  }
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}
