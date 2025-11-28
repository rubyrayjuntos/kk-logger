/**
 * Constants for logging functionality
 */

import type { TaskType } from '../../shared/types/core';

// Temperature ranges by task type
export const TEMPERATURE_RANGES = {
  temp: { min: 33, max: 41, unit: '°F' },
  warming: { min: 140, max: 200, unit: '°F' },
  calibration_ice: { min: 30, max: 34, unit: '°F' },
  calibration_boil: { min: 210, max: 214, unit: '°F' }
} as const;

// Chemical concentration ranges
export const CHEMICAL_RANGES = {
  sanitizer: { min: 272, max: 700, unit: 'ppm' }
} as const;

// Corrective actions by task type
export const CORRECTIVE_ACTIONS: Record<TaskType, string[]> = {
  calibration: [
    "Adjusted and re-tested",
    "Discarded - replaced with new unit",
    "Sent for repair",
    "Other (add note)"
  ],
  warming: [
    "Continue heating - Recheck later",
    "Called maintenance",
    "Other (add note)"
  ],
  temp: [
    "Placed on hold - evaluating safety",
    "Moved to working cooler",
    "Discarded",
    "Verified safe per protocol",
    "Other (add note)"
  ],
  chemical: [
    "Discarded & remixed solution",
    "Adjusted dispenser settings",
    "Called maintenance",
    "Other (add note)"
  ],
  inventory: [
    "Updated count",
    "Checked expiration dates",
    "Other (add note)"
  ]
};

// Task action labels
export const TASK_ACTIONS = {
  temp: 'logTemp',
  warming: 'logTemp',
  chemical: 'startTest',
  calibration: 'calibrate',
  inventory: 'checkStock'
} as const;

// Critical limits for different equipment types
export const CRITICAL_LIMITS = {
  warming_cabinet: 140,
  refrigerator_max: 41,
  refrigerator_min: 33,
  sanitizer_min: 272,
  sanitizer_max: 700
} as const;

// Time constants (in milliseconds)
export const TIMING = {
  success_display: 1200,
  error_display: 1000,
  sync_retry_delay: 2500,
  auto_logout: 15 * 60 * 1000, // 15 minutes
  session_extend: 2 * 60 * 1000 // 2 minutes
} as const;