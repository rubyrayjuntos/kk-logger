/**
 * Core TypeScript types for the KK-Logger HACCP application
 */

export type Language = 'en' | 'es';

export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'due' | 'upcoming';
export type UserRole = 'manager' | 'lead' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type ManagerRoleType = 'primary' | 'backup' | 'substitute';
export type CertificationStatus = 'certified' | 'pending' | 'expired';
export type SchoolComplianceStatus = 'good' | 'warning' | 'critical';
export type MealVolume = 'low' | 'medium' | 'high';
export type SyncStatus = 'pending' | 'uploading' | 'error' | 'completed';
export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';
export type TrainingType = 
  | 'initial_onboarding'
  | 'haccp_fundamentals'
  | 'temperature_logging'
  | 'sanitizer_testing'
  | 'thermometer_calibration'
  | 'corrective_actions'
  | 'equipment_maintenance'
  | 'food_safety_refresher'
  | 'software_tutorial'
  | 'annual_recertification';
export type TrainingFormat = 'video' | 'interactive' | 'document' | 'live_session' | 'quiz';

// HACCP-specific types
export type ChemicalType = 'quat' | 'chlorine' | 'iodine';
export type TemperatureType = 'ambient' | 'product';
export type CalibrationMethod = 'ice_point' | 'boiling_point';
export type ProductType = 'refrigerated' | 'frozen' | 'dry';
export type CorrectiveAction = 'discarded_remixed' | 'called_maintenance' | 'adjusted_dispenser' | 'other';

export type TaskType = 
  | 'sanitizer_test'
  | 'cold_holding'
  | 'hot_holding'
  | 'thermometer_calibration'
  | 'receiving_log'
  | 'warming_cabinet'
  | 'temp' // legacy
  | 'chemical' // legacy
  | 'calibration' // legacy
  | 'warming' // legacy
  | 'inventory'; // legacy

export interface Task {
  id: number;
  title: string;
  type: TaskType;
  status: TaskStatus;
  time: string;
  location: string;
  value?: string;
  range?: {
    min: number;
    max: number;
    unit: string;
  };
  lastLog?: {
    time: string;
    value: string;
  };
  units?: string[];
  lastLogs?: Record<string, { value: string; time: string }>;
  dueTime?: string;
  completedAt?: string;
  description?: string;
  requiredInterval?: number; // minutes
}

// Enhanced Multi-School Interfaces

export interface School {
  schoolId: string; // Primary key (GUID)
  schoolName: string;
  address: string;
  district: string;
  mealVolume: MealVolume;
  operatingHours: Record<string, { start: string; end: string }>; // Day of week -> hours
  activeStatus: boolean;
  timezone: string;
  contactPhone: string;
  contactEmail: string;
  createdDate: string;
  modifiedDate: string;
  // Computed fields
  compliance?: number;
  trend?: string;
  lastActive?: string;
  missingLogs?: number;
  issues?: SchoolIssue[];
}

export interface Lead {
  leadId: string; // Primary key (GUID)
  userId: string; // Foreign key to Users
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedSchools: string[]; // Array of school IDs
  notificationPreferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    teamsAlerts: boolean;
    alertTypes: Array<'overdue' | 'critical_temp' | 'data_anomaly' | 'training_expiry'>;
  };
  activeStatus: boolean;
  hiredDate: string;
  createdDate: string;
  modifiedDate: string;
}

export interface Manager {
  managerId: string; // Primary key (GUID)
  userId: string; // Foreign key to Users
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedSchoolId: string; // Primary school assignment
  backupSchoolIds: string[]; // Schools they can cover
  roleType: ManagerRoleType;
  certificationStatus: CertificationStatus;
  certificationExpiryDate?: string;
  notificationPreferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
  };
  activeStatus: boolean;
  hiredDate: string;
  createdDate: string;
  modifiedDate: string;
  reportingLeadId: string; // Which lead they report to
}

export interface TrainingRecord {
  trainingId: string; // Primary key (GUID)
  userId: string; // Foreign key to Users
  trainingType: TrainingType;
  trainingModuleName: string;
  completionStatus: TrainingStatus;
  completionDate?: string;
  expirationDate?: string;
  score?: number; // 0-100 for quizzes
  passingScoreRequired?: number;
  attempts: number;
  durationMinutes?: number;
  trainingFormat: TrainingFormat;
  trainingUrl?: string; // Link to Teams video or SharePoint doc
  trainerName?: string;
  notes?: string;
  createdDate: string;
  modifiedDate: string;
}

export interface User {
  id: string; // Updated to string for GUID
  username: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  lastLogin: string;
  schoolId?: string;
  isActive: boolean;
  // Enhanced fields
  phone?: string;
  profileImageUrl?: string;
  preferences: {
    language: Language;
    timezone: string;
    notifications: boolean;
  };
  permissions: {
    canLogTemperatures: boolean;
    canSubmitCorrectiveActions: boolean;
    canViewHistoricalLogs: boolean;
    canGenerateReports: boolean;
    canManageUsers: boolean;
  };
  createdDate: string;
  modifiedDate: string;
}

export interface SchoolIssue {
  id: number;
  title: string;
  desc: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SyncQueueItem {
  id: number;
  taskId: number;
  taskTitle: string;
  value: string;
  timestamp: string;
  status: SyncStatus;
  attempts: number;
  errorMsg?: string;
}

export interface ActivityLogEntry {
  id: number;
  managerId: number;
  managerName: string;
  type: 'login' | 'submit' | 'alert' | 'edit';
  details: string;
  timestamp: string;
}

export interface Report {
  id: number;
  name: string;
  date: string;
  type: 'PDF' | 'XLSX' | 'CSV';
  size: string;
}

export interface ReportConfig {
  range: string;
  school: string;
  type: string;
  status: string;
  format: string;
}

// HACCP Form Interfaces
export interface SanitizerTestEntry {
  id: string;
  timestamp: string;
  recordTime?: string; // For backdating
  location: string;
  chemicalType: ChemicalType;
  ppmReading: number;
  waterTemperature?: number;
  inRange: boolean;
  correctiveAction?: CorrectiveAction;
  correctiveActionNotes?: string;
  clothsStored: boolean;
  userId: string;
  deviceId?: string;
  gpsCoords?: string;
  photoUrl?: string;
}

export interface TemperatureEntry {
  id: string;
  timestamp: string;
  recordTime?: string;
  unitName: string;
  temperatureType: TemperatureType;
  temperature: number;
  criticalLimit: number;
  inRange: boolean;
  correctiveAction?: string;
  userId: string;
  deviceId?: string;
  gpsCoords?: string;
}

export interface WarmingCabinetEntry {
  id: string;
  timestamp: string;
  recordTime?: string;
  cabinetName: string;
  temperature: number;
  criticalLimit: number;
  readyForUse: boolean;
  correctiveAction?: string;
  userId: string;
  deviceId?: string;
}

export interface CalibrationEntry {
  id: string;
  timestamp: string;
  thermometerId: string;
  thermometerType: 'probe' | 'infrared' | 'bimetallic';
  calibrationMethod: 'ice_point' | 'boiling_point';
  expectedTemperature: number;
  actualReading: number;
  variance: number;
  withinTolerance: boolean;
  toleranceRange: { min: number; max: number };
  adjustmentMade?: number;
  calibrationStatus: 'pass' | 'fail' | 'adjusted';
  nextCalibrationDue: string;
  userId: string;
  deviceId: string;
}

export interface ReceivingInspectionEntry {
  id: string;
  timestamp: string;
  deliveryId: string;
  supplier: string;
  driverName?: string;
  vehicleInfo?: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    temperature?: number;
    temperatureRequired?: { min: number; max: number };
    condition: 'acceptable' | 'rejected';
    rejectionReason?: string;
  }>;
  overallTemperature?: number;
  vehicleTemperature?: number;
  packagingCondition: 'good' | 'damaged' | 'compromised';
  deliveryCondition: 'onTime' | 'late' | 'early';
  issues: string[];
  correctiveActions: string[];
  inspectorSignature: string;
  acceptanceStatus: 'accepted' | 'partial' | 'rejected';
  userId: string;
  deviceId: string;
}

export interface ThermometerCalibrationEntry {
  id: string;
  date: string;
  thermometerId: string;
  calibrationMethod: CalibrationMethod;
  reading: number;
  acceptableRange: string;
  status: 'pass' | 'fail';
  actionTaken?: string;
  userId: string;
}

export interface ReceivingEntry {
  id: string;
  timestamp: string;
  recordTime?: string;
  vendorName: string;
  invoiceNumber: string;
  productDescription: string;
  productType: ProductType;
  temperature?: number;
  conditionChecks: {
    packagingIntact: boolean;
    noPests: boolean;
    cleanTransport: boolean;
    properLabeling: boolean;
    withinDateCode: boolean;
  };
  acceptReject: 'accept' | 'reject';
  rejectReason?: string;
  userId: string;
  photoUrl?: string;
}

// Validation ranges for sanitizers (per FR-120-125)
export const SANITIZER_RANGES = {
  quat: { min: 200, max: 400, minTemp: 75 },
  chlorine: { min: 50, max: 100, minTemp: 75 },
  iodine: { min: 12.5, max: 25, minTemp: 68 }
} as const;

// Temperature critical limits (per FR-140-155)
export const TEMPERATURE_LIMITS = {
  cold_holding: { max: 41 },
  hot_holding: { min: 135 },
  warming_cabinet: { min: 140 },
  receiving_cold: { max: 41 },
  receiving_frozen: { max: 0 },
  rapid_reheat: { min: 165 } // For 130°F rule
} as const;

// Calibration ranges (per FR-160-165)
export const CALIBRATION_RANGES = {
  ice_point: { target: 32, tolerance: 2 },
  boiling_point: { target: 212, tolerance: 2 }
} as const;

// Training and Context-Aware Help Interfaces

export interface ContextualHelp {
  screenId: string;
  title: string;
  quickTips: string[];
  videoUrl?: string;
  pdfUrl?: string;
  searchable: boolean;
}

export interface TrainingAssignment {
  assignmentId: string;
  userId: string;
  trainingType: TrainingType;
  assignedBy: string;
  assignedDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason?: string; // Why this training was assigned
}

export interface ExceptionTrainingTrigger {
  triggerId: string;
  scenarioType: 'out_of_range_temp' | 'failed_sanitizer' | 'repeated_errors' | 'first_time_error';
  condition: {
    parameter: string;
    operator: 'gt' | 'lt' | 'eq' | 'count';
    value: number;
    timeWindow?: number; // In hours
  };
  trainingModules: TrainingType[];
  blockSubmission: boolean;
  escalateToLead: boolean;
}

export interface OnboardingStep {
  stepId: string;
  title: string;
  description: string;
  targetElement?: string;
  actionRequired: boolean;
  completed: boolean;
  order: number;
}

export interface UserOnboardingProgress {
  userId: string;
  onboardingCompleted: boolean;
  currentStep: number;
  stepsCompleted: OnboardingStep[];
  canReplay: boolean;
  lastAccessed: string;
}