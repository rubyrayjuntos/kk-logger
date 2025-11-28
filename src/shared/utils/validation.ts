/**
 * Validation utilities for form inputs and business logic
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a temperature reading against range requirements
 */
export const validateTemperature = (
  value: string | number,
  min: number,
  max: number
): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const errors: string[] = [];

  if (isNaN(numValue)) {
    errors.push('Temperature must be a valid number');
    return { isValid: false, errors };
  }

  if (numValue < min || numValue > max) {
    errors.push(`Temperature must be between ${min}°F and ${max}°F`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate chemical sanitizer concentration
 */
export const validateSanitizerPPM = (
  value: string | number,
  min: number = 272,
  max: number = 700
): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const errors: string[] = [];

  if (isNaN(numValue)) {
    errors.push('Sanitizer concentration must be a valid number');
    return { isValid: false, errors };
  }

  if (numValue < min || numValue > max) {
    errors.push(`Sanitizer concentration must be between ${min}ppm and ${max}ppm`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate required fields
 */
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    errors.push(`${fieldName} is required`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Generic field validation
 */
export const validateField = (
  value: any,
  rules: ValidationRule
): ValidationResult => {
  const errors: string[] = [];

  // Required check
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push(rules.message || 'This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] };
  }

  // Min/Max for numbers
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);
    if (rules.min !== undefined && numValue < rules.min) {
      errors.push(rules.message || `Value must be at least ${rules.min}`);
    }
    if (rules.max !== undefined && numValue > rules.max) {
      errors.push(rules.message || `Value must be no more than ${rules.max}`);
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Invalid format');
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.message || 'Invalid value');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate an entire form object
 */
export const validateForm = (
  formData: Record<string, any>,
  rules: Record<string, ValidationRule>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.keys(rules).forEach(fieldName => {
    const result = validateField(formData[fieldName], rules[fieldName]);
    if (!result.isValid) {
      errors[fieldName] = result.errors;
      isValid = false;
    }
  });

  return { isValid, errors };
};