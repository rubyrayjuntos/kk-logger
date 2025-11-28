/**
 * Formatting utilities for display values
 */

/**
 * Format temperature with unit
 */
export const formatTemperature = (
  value: number | string, 
  unit: string = '°F',
  precision: number = 1
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '--';
  
  return `${numValue.toFixed(precision)}${unit}`;
};

/**
 * Format chemical concentration
 */
export const formatChemicalConcentration = (
  value: number | string,
  unit: string = 'ppm'
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '--';
  
  return `${Math.round(numValue)} ${unit}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  precision: number = 0
): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(precision)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Format name (first letter uppercase)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format initials from full name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Format currency (for future inventory features)
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format task status for display
 */
export const formatTaskStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Completed';
    case 'due':
      return 'Due Now';
    case 'upcoming':
      return 'Upcoming';
    case 'overdue':
      return 'Overdue';
    default:
      return status;
  }
};

/**
 * Format compliance score with color class
 */
export const formatComplianceScore = (score: number): { 
  text: string; 
  colorClass: string 
} => {
  const text = `${score}%`;
  let colorClass = 'text-green-600';
  
  if (score < 75) colorClass = 'text-red-600';
  else if (score < 90) colorClass = 'text-yellow-600';
  
  return { text, colorClass };
};