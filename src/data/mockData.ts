/**
 * Mock data for development and testing
 * This will eventually be replaced by real API calls
 */

import type { 
  User, 
  Task, 
  School, 
  ActivityLogEntry, 
  Report 
} from '../shared/types/core';

export const MOCK_USERS: User[] = [
  { 
    id: 1, 
    username: 'maria', 
    password: 'pass', 
    role: 'manager', 
    firstName: 'Maria', 
    lastName: 'Rodriguez', 
    location: 'Jefferson Elementary', 
    email: 'm.rodriguez@school.edu', 
    status: 'Active', 
    lastLogin: 'Today, 7:10 AM' 
  },
  { 
    id: 2, 
    username: 'david', 
    password: 'pass', 
    role: 'manager', 
    firstName: 'David', 
    lastName: 'Chen', 
    location: 'Washington Elementary', 
    email: 'd.chen@school.edu', 
    status: 'Active', 
    lastLogin: 'Yesterday, 2:30 PM' 
  },
  { 
    id: 3, 
    username: 'sarah', 
    password: 'pass', 
    role: 'supervisor', 
    firstName: 'Sarah', 
    lastName: 'Connor', 
    location: 'North District', 
    email: 's.connor@district.edu', 
    status: 'Active', 
    lastLogin: 'Just now' 
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Morning Cooler Check",
    type: "temp",
    status: "completed",
    time: "Due: 7:15am",
    location: "Kitchen Main",
    value: "38°F",
    lastLog: { time: "Yesterday", value: "37°F" }
  },
  {
    id: 4,
    title: "Refrigerator Temperature Log",
    type: "temp",
    status: "due",
    time: "Overdue (15m)", 
    location: "Kitchen",
    range: { min: 33, max: 41, unit: "°F" },
    lastLog: { time: "Yesterday, 3:30pm", value: "39°F" },
    units: ["Walk-in Cooler", "Reach-in Cooler", "Milk Cooler"],
    lastLogs: {
        "Walk-in Cooler": { value: "39°F", time: "Yesterday, 3:30pm" },
        "Reach-in Cooler": { value: "36°F", time: "Yesterday, 3:35pm" },
        "Milk Cooler": { value: "38°F", time: "Yesterday, 3:40pm" }
    }
  },
  {
    id: 2,
    title: "Sanitizer Test",
    type: "chemical",
    status: "due",
    time: "Due Now",
    location: "Dish Room",
    range: { min: 272, max: 700, unit: "ppm" },
    lastLog: { time: "Yesterday 2:15 PM", value: "350 ppm" }
  },
  {
    id: 7,
    title: "Thermometer Calibration Log",
    type: "calibration",
    status: "due",
    time: "Due in 45 min",
    location: "Kitchen Office",
    range: { min: 30, max: 34, unit: "°F" },
    lastLog: { time: "Last Month", value: "Pass" },
    units: ["Thermometer #1", "Thermometer #2", "Thermometer #3"],
    lastLogs: {
        "Thermometer #1": { value: "Pass", time: "Oct 15 (Ice)" },
        "Thermometer #2": { value: "Pass", time: "Sep 01 (Boil)" },
        "Thermometer #3": { value: "Fail", time: "Yesterday (Ice)" }
    }
  },
  {
    id: 3,
    title: "Warming Cabinet Temperature Log",
    type: "warming",
    status: "due",
    time: "Due Now",
    location: "Serving Line",
    range: { min: 140, max: 200, unit: "°F" },
    units: ["Cabinet A", "Cabinet B"],
    lastLog: { time: "Yesterday, 6:45 AM", value: "155°F" },
    lastLogs: {
        "Cabinet A": { value: "155°F", time: "Yesterday" },
        "Cabinet B": { value: "148°F", time: "Yesterday" }
    }
  },
  {
    id: 8,
    title: "Warming Cabinet Temperature Log",
    type: "warming",
    status: "due",
    time: "Due Now",
    location: "Pizza Station",
    range: { min: 140, max: 200, unit: "°F" },
    units: ["Pizza Warmer 1", "Pizza Warmer 2"],
    lastLog: { time: "Yesterday", value: "142°F" },
    lastLogs: {
        "Pizza Warmer 1": { value: "142°F", time: "Yesterday" },
        "Pizza Warmer 2": { value: "145°F", time: "Yesterday" }
    }
  },
  {
    id: 5,
    title: "Milk Cooler Temp",
    type: "temp",
    status: "due",
    time: "Due Now",
    location: "Cafeteria Line A",
    range: { min: 33, max: 41, unit: "°F" },
    lastLog: { time: "Yesterday, 3:35pm", value: "38°F" }
  },
  {
    id: 6,
    title: "Serving Line Checks",
    type: "temp",
    status: "upcoming",
    time: "Due: 11:30am",
    location: "Cafeteria Main",
    range: { min: 33, max: 41, unit: "°F" },
    lastLog: { time: "Yesterday, 11:00am", value: "All OK" },
    units: ["Line Cooler 1", "Line Cooler 2", "Salad Bar"],
    lastLogs: {
        "Line Cooler 1": { value: "38°F", time: "Yesterday" },
        "Line Cooler 2": { value: "40°F", time: "Yesterday" },
        "Salad Bar": { value: "36°F", time: "Yesterday" }
    }
  }
];

export const MOCK_SCHOOLS: School[] = [
  {
    id: "jefferson",
    name: "Jefferson Elementary",
    compliance: 92,
    trend: "+2%",
    manager: "Maria Rodriguez",
    lastActive: "2 mins ago",
    missingLogs: 0,
    issues: []
  },
  {
    id: "washington",
    name: "Washington Elementary",
    compliance: 65,
    trend: "-5%",
    manager: "David Chen",
    lastActive: "4 hours ago",
    missingLogs: 3,
    issues: [
      { id: 101, title: "Cooler #2 Temp", desc: "Missed 2 days consecutive", severity: "high" },
      { id: 102, title: "Lunch Temp Log", desc: "Not submitted today", severity: "medium" },
      { id: 103, title: "Sanitizer Log", desc: "Reading out of range (ignored)", severity: "high" }
    ]
  },
  {
    id: "lincoln",
    name: "Lincoln MS",
    compliance: 78,
    trend: "+1%",
    manager: "New Manager",
    lastActive: "15 mins ago",
    missingLogs: 1,
    issues: [
      { id: 201, title: "Dishwasher Temp", desc: "1 Overdue log", severity: "medium" }
    ]
  }
];

export const MOCK_RECENT_REPORTS: Report[] = [
    { id: 1, name: "District Compliance - Oct", date: "Oct 31, 2023", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Sanitizer Audit", date: "Oct 28, 2023", type: "XLSX", size: "156 KB" },
    { id: 3, name: "Washington Elem Corrective Actions", date: "Oct 25, 2023", type: "CSV", size: "42 KB" }
];

export const MOCK_ACTIVITY_LOG: ActivityLogEntry[] = [
    { id: 1, managerId: 1, managerName: "Maria Rodriguez", type: "login", details: "Successful login via Mobile App", timestamp: "Today, 7:10 AM" },
    { id: 2, managerId: 2, managerName: "David Chen", type: "submit", details: "Submitted 'Morning Cooler Check' (38°F)", timestamp: "Today, 7:15 AM" },
    { id: 3, managerId: 1, managerName: "Maria Rodriguez", type: "alert", details: "Triggered Warning: Warming Cabinet < 140°F", timestamp: "Today, 10:45 AM" },
    { id: 4, managerId: 2, managerName: "David Chen", type: "edit", details: "Corrected 'Sanitizer Test' value from 150 to 250", timestamp: "Today, 11:00 AM" },
    { id: 5, managerId: 3, managerName: "Sarah Connor", type: "login", details: "Supervisor Access granted", timestamp: "Today, 11:30 AM" },
];

// Future inventory data structure (placeholder)
export const MOCK_INVENTORY_ITEMS = [
  {
    id: 1,
    item: "2% Milk",
    currentStock: 45,
    units: "gallons",
    expirationDate: "2025-11-30",
    location: "Milk Cooler",
    lastDelivery: "2025-11-24",
    reorderPoint: 20
  },
  {
    id: 2,
    item: "Chocolate Milk",
    currentStock: 12,
    units: "gallons",
    expirationDate: "2025-11-28",
    location: "Milk Cooler",
    lastDelivery: "2025-11-24",
    reorderPoint: 15
  }
];

// Future training data structure (placeholder)
export const MOCK_TRAINING_MODULES = [
  {
    id: 1,
    title: "Thermometer Calibration",
    duration: "5 minutes",
    required: true,
    completed: false,
    dueDate: "2025-12-01"
  },
  {
    id: 2,
    title: "Chemical Sanitizer Safety",
    duration: "8 minutes",
    required: true,
    completed: true,
    completedDate: "2025-11-20"
  }
];