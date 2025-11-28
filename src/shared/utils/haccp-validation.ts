import { 
  ChemicalType, 
  TemperatureType, 
  CalibrationMethod,
  SANITIZER_RANGES,
  TEMPERATURE_LIMITS,
  CALIBRATION_RANGES 
} from '../types/core';

/**
 * HACCP Validation Utilities
 * Per functional requirements FR-120 through FR-170
 */

// Sanitizer validation (FR-123)
export const validateSanitizerReading = (
  chemicalType: ChemicalType,
  ppmReading: number,
  waterTemp?: number
): { inRange: boolean; message?: string } => {
  const range = SANITIZER_RANGES[chemicalType];
  
  // Check PPM range
  if (ppmReading < range.min || ppmReading > range.max) {
    return {
      inRange: false,
      message: `${chemicalType.toUpperCase()} must be ${range.min}-${range.max} ppm. Reading: ${ppmReading} ppm`
    };
  }
  
  // Check temperature requirement if provided
  if (waterTemp && waterTemp < range.minTemp) {
    return {
      inRange: false,
      message: `Water temperature must be ≥${range.minTemp}°F for ${chemicalType.toUpperCase()}. Reading: ${waterTemp}°F`
    };
  }
  
  return { inRange: true };
};

// Cold holding validation (FR-145)
export const validateColdHolding = (
  temperature: number,
  temperatureType: TemperatureType
): { inRange: boolean; requiresProductCheck?: boolean; message?: string } => {
  const limit = TEMPERATURE_LIMITS.cold_holding.max;
  
  if (temperature <= limit) {
    return { inRange: true };
  }
  
  if (temperatureType === 'ambient' && temperature > limit) {
    return {
      inRange: false,
      requiresProductCheck: true,
      message: `Ambient air temperature is ${temperature}°F (limit: ${limit}°F). Check internal product temperature.`
    };
  }
  
  if (temperatureType === 'product' && temperature > limit) {
    return {
      inRange: false,
      message: `CRITICAL: Product temperature is ${temperature}°F (limit: ${limit}°F). Immediate corrective action required.`
    };
  }
  
  return { inRange: false, message: `Temperature ${temperature}°F exceeds ${limit}°F limit.` };
};

// Hot holding validation (FR-151-152)
export const validateHotHolding = (
  temperature: number
): { inRange: boolean; message?: string } => {
  const limit = TEMPERATURE_LIMITS.hot_holding.min;
  
  if (temperature >= limit) {
    return { inRange: true };
  }
  
  return {
    inRange: false,
    message: `Temperature ${temperature}°F is below ${limit}°F minimum. Reheat to 165°F or discard.`
  };
};

// Warming cabinet validation (FR-151-152)
export const validateWarmingCabinet = (
  temperature: number
): { readyForUse: boolean; message?: string } => {
  const limit = TEMPERATURE_LIMITS.warming_cabinet.min;
  
  if (temperature >= limit) {
    return { 
      readyForUse: true,
      message: `READY FOR USE - Cabinet at ${temperature}°F`
    };
  }
  
  return {
    readyForUse: false,
    message: `CABINET NOT READY - Temperature ${temperature}°F (minimum: ${limit}°F). Do not place food until cabinet reaches ${limit}°F.`
  };
};

// Thermometer calibration validation (FR-163-164)
export const validateThermometerCalibration = (
  method: CalibrationMethod,
  reading: number
): { status: 'pass' | 'fail'; message: string; acceptableRange: string } => {
  const range = CALIBRATION_RANGES[method];
  const min = range.target - range.tolerance;
  const max = range.target + range.tolerance;
  const acceptableRange = `${min}-${max}°F`;
  
  if (reading >= min && reading <= max) {
    return {
      status: 'pass',
      message: `PASS - Reading ${reading}°F within acceptable range`,
      acceptableRange
    };
  }
  
  return {
    status: 'fail',
    message: `FAIL - Reading ${reading}°F outside acceptable range ${acceptableRange}. Calibrate or replace thermometer.`,
    acceptableRange
  };
};

// Receiving temperature validation with 130°F rule (FR-171-174)
export const validateReceivingTemperature = (
  productType: 'refrigerated' | 'frozen',
  temperature: number
): { 
  acceptable: boolean; 
  requiresRapidReheat?: boolean; 
  mustReject?: boolean; 
  message: string;
} => {
  if (productType === 'refrigerated') {
    const limit = TEMPERATURE_LIMITS.receiving_cold.max;
    
    if (temperature <= limit) {
      return {
        acceptable: true,
        message: `ACCEPT - Refrigerated product at ${temperature}°F (limit: ${limit}°F)`
      };
    }
    
    // The 130°F rule for hot transport from central kitchen
    if (temperature >= 130 && temperature < 135) {
      return {
        acceptable: true,
        requiresRapidReheat: true,
        message: `CONDITIONAL ACCEPT - Temperature ${temperature}°F requires rapid reheat to 165°F within 2 hours per SOP-003`
      };
    }
    
    return {
      acceptable: false,
      mustReject: true,
      message: `REJECT - Temperature ${temperature}°F exceeds safe receiving limits`
    };
  }
  
  if (productType === 'frozen') {
    if (temperature <= 0) {
      return {
        acceptable: true,
        message: `ACCEPT - Frozen product at ${temperature}°F`
      };
    }
    
    return {
      acceptable: false,
      mustReject: true,
      message: `REJECT - Frozen product at ${temperature}°F shows signs of thawing`
    };
  }
  
  return {
    acceptable: false,
    message: 'Invalid product type'
  };
};

// Time validation for backdating (FR-127-128)
export const validateTimestamp = (
  recordTime: string,
  currentTime: string = new Date().toISOString()
): { valid: boolean; message?: string } => {
  const recordDate = new Date(recordTime);
  const currentDate = new Date(currentTime);
  const fourHoursAgo = new Date(currentDate.getTime() - 4 * 60 * 60 * 1000);
  
  // Block future timestamps
  if (recordDate > currentDate) {
    return {
      valid: false,
      message: 'Cannot enter logs with future timestamps'
    };
  }
  
  // Allow backdating up to 4 hours
  if (recordDate < fourHoursAgo) {
    return {
      valid: false,
      message: 'Cannot backdate logs more than 4 hours'
    };
  }
  
  return { valid: true };
};

// Equipment pattern validation (helps detect falsification per FR-340)
export const detectAnomalousPattern = (
  readings: number[],
  timestamps: string[]
): { suspicious: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  
  // Check for identical readings (7+ consecutive)
  let identicalCount = 1;
  for (let i = 1; i < readings.length; i++) {
    if (readings[i] === readings[i - 1]) {
      identicalCount++;
    } else {
      identicalCount = 1;
    }
    
    if (identicalCount >= 7) {
      reasons.push(`Temperature recorded as exactly ${readings[i]}°F for ${identicalCount} consecutive entries`);
      break;
    }
  }
  
  // Check for "perfect" temperatures (always at ideal values)
  const perfectCold = readings.filter(r => r === 38 || r === 39).length;
  const perfectHot = readings.filter(r => r === 165 || r === 140).length;
  
  if (perfectCold > readings.length * 0.8) {
    reasons.push('Temperature consistently at "perfect" cold values (38-39°F)');
  }
  
  if (perfectHot > readings.length * 0.8) {
    reasons.push('Temperature consistently at "perfect" hot values (140°F, 165°F)');
  }
  
  // Check for identical timing patterns
  if (timestamps.length > 5) {
    const times = timestamps.map(ts => new Date(ts).getHours() * 60 + new Date(ts).getMinutes());
    const uniqueTimes = new Set(times);
    
    if (uniqueTimes.size === 1) {
      reasons.push('All logs entered at exactly the same time of day');
    }
  }
  
  return {
    suspicious: reasons.length > 0,
    reasons
  };
};