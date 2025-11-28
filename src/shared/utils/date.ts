/**
 * Date and time utility functions
 */

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format a time to a human-readable string
 */
export const formatTime = (date: Date | string, use24Hour: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  });
};

/**
 * Format a datetime to a human-readable string
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Get relative time string ("2 minutes ago", "Just now")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(dateObj);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is within a range
 */
export const isWithinRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return dateObj >= startDateObj && dateObj <= endDateObj;
};

/**
 * Get the start and end of a day
 */
export const getDateBounds = (date: Date | string): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

/**
 * Add business logic for overdue calculations
 */
export const getTaskUrgency = (dueTime: string): 'overdue' | 'due-now' | 'upcoming' => {
  if (dueTime.toLowerCase().includes('overdue')) return 'overdue';
  if (dueTime.toLowerCase().includes('now') || dueTime.toLowerCase().includes('due now')) return 'due-now';
  return 'upcoming';
};

/**
 * Generate timestamp for logging
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Parse time string to minutes (for scheduling)
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3]?.toUpperCase();
  
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};