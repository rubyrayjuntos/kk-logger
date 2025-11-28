/**
 * Internationalization support for KK-Logger
 * Supports English and Spanish translations
 */

import type { Language } from '../shared/types/core';

export interface TranslationKeys {
  // Login
  appTitle: string;
  appSubtitle: string;
  username: string;
  password: string;
  loginBtn: string;
  demoCredentials: string;
  invalidCredentials: string;
  
  // Common
  logout: string;
  online: string;
  offline: string;
  syncing: string;
  syncError: string;
  pendingLogs: string;
  
  // Manager Dashboard
  todaysProgress: string;
  moreAttention: string;
  makingProgress: string;
  almostDone: string;
  upNext: string;
  comingUp: string;
  completedToday: string;
  startTask: string;
  viewReports: string;
  history: string;
  view: string;
  goodMorning: string;
  dailyProgress: string;
  done: string;
  pending: string;
  prioritizedTasks: string;
  
  // Task Card
  dueNow: string;
  overdue: string;
  upcoming: string;
  completed: string;
  logTemp: string;
  startTest: string;
  calibrate: string;
  last: string;
  recorded: string;
  req: string;
  
  // Logging Screen
  requiredRange: string;
  lastReading: string;
  readThermometer: string;
  scanTestStrip: string;
  manualEntry: string;
  copy: string;
  aiPreFill: string;
  submit: string;
  success: string;
  saved: string;
  loadingNext: string;
  logVerified: string;
  outOfRange: string;
  withinRange: string;
  enterValue: string;
  outOfRangeTitle: string;
  outOfRangeMsg: string;
  selectCorrectiveAction: string;
  recordAction: string;
  describeAction: string;
  typeDetails: string;
  
  // Warming Cabinet
  cabinetNotReady: string;
  cabinetNotReadyMsg: string;
  readyForUse: string;
  warmingCriticalLimit: string;
  logIssue: string;

  // Calibration
  calMethod: string;
  icePoint: string;
  boilPoint: string;
  thermometer: string;
  
  // Supervisor
  commandCenter: string;
  welcomeBack: string;
  overview: string;
  teamMgmt: string;
  reports: string;
  viewMobile: string;
  schoolCompliance: string;
  compliance: string;
  missingLogs: string;
  call: string;
  email: string;
  actionItems: string;
  recentActivity: string;
  noIssues: string;
  selectSchoolPrompt: string;
  cafeteriaManagers: string;
  manageAccess: string;
  addManager: string;
  name: string;
  role: string;
  location: string;
  status: string;
  lastLogin: string;
  actions: string;
  active: string;
  inactive: string;
  addManagerTitle: string;
  editUserTitle: string;
  firstName: string;
  lastName: string;
  cancel: string;
  createUser: string;
  saveChanges: string;
  searchSchools: string;
  filterAll: string;
  filterGood: string;
  filterWarning: string;
  filterCritical: string;
  noSchoolsFound: string;
  managerRole: string;
  supervisorRole: string;
  
  // Supervisor Activity Log
  activityLog: string;
  viewActivityLog: string;
  backToTeam: string;
  event: string;
  details: string;
  time: string;
  loginEvent: string;
  submitEvent: string;
  alertEvent: string;
  editEvent: string;
  
  // Supervisor Summary
  districtHealth: string;
  districtAvg: string;
  criticalAlerts: string;
  requiresAttention: string;
  weeklyTrend: string;
  vsLastWeek: string;

  // Reports / Query Builder
  customQueryBuilder: string;
  dateRange: string;
  schools: string;
  logType: string;
  logStatus: string;
  outputFormat: string;
  generateReport: string;
  downloading: string;
  reportReady: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  custom: string;
  allSchools: string;
  allLogs: string;
  allStatuses: string;
  completedOnly: string;
  overdueOnly: string;
  correctiveOnly: string;
  recentReports: string;
  download: string;

  // Sync
  syncDetails: string;
  itemsPending: string;
  itemsFailed: string;
  retryAll: string;
  retry: string;
  simulateOffline: string;
  simulateOnline: string;
  uploading: string;
  errorTimeout: string;
  errorServer: string;
}

export const TRANSLATIONS: Record<Language, TranslationKeys> = {
  en: {
    // Login
    appTitle: "Cafeteria Log",
    appSubtitle: "District Compliance System",
    username: "Username",
    password: "Password",
    loginBtn: "SECURE LOGIN",
    demoCredentials: "DEMO CREDENTIALS",
    invalidCredentials: "Invalid credentials",
    
    // Common
    logout: "Logout",
    online: "Online",
    offline: "Offline",
    syncing: "Syncing...",
    syncError: "Sync Error",
    pendingLogs: "Pending Logs",
    
    // Manager Dashboard New
    todaysProgress: "Today's Progress",
    moreAttention: "⚠️ More tasks need attention",
    makingProgress: "👍 Making progress",
    almostDone: "🎉 Almost done!",
    upNext: "Up Next",
    comingUp: "Coming Up",
    completedToday: "Completed Today",
    startTask: "Start Task",
    viewReports: "View Reports",
    history: "History",
    view: "View",
    
    // Manager (Legacy keys kept for safety)
    goodMorning: "Good Morning",
    dailyProgress: "Daily Progress",
    done: "Done",
    pending: "Pending",
    prioritizedTasks: "Prioritized Tasks",
    
    // Task Card
    dueNow: "Due Now",
    overdue: "Overdue",
    upcoming: "Upcoming",
    completed: "Completed",
    logTemp: "Log Temp",
    startTest: "Start Test",
    calibrate: "Calibrate",
    last: "Last reading",
    recorded: "Recorded",
    req: "Req",
    
    // Logging Screen
    requiredRange: "Required Range",
    lastReading: "Last Reading",
    readThermometer: "READ THERMOMETER",
    scanTestStrip: "SCAN TEST STRIP",
    manualEntry: "Manual Entry",
    copy: "Copy",
    aiPreFill: "AI PRE-FILL",
    submit: "SUBMIT",
    success: "Success!",
    saved: "Saved",
    loadingNext: "Loading next unit...",
    logVerified: "Log Verified & Saved",
    outOfRange: "OUT OF RANGE",
    withinRange: "WITHIN RANGE",
    enterValue: "ENTER VALUE",
    outOfRangeTitle: "Out of Range",
    outOfRangeMsg: "Value is outside safe limits",
    selectCorrectiveAction: "Select Corrective Action:",
    recordAction: "RECORD ACTION",
    describeAction: "Describe Action Taken",
    typeDetails: "Type details here...",
    
    // Warming Cabinet
    cabinetNotReady: "CABINET NOT READY",
    cabinetNotReadyMsg: "Do not place food until 140°F is reached.",
    readyForUse: "READY FOR USE",
    warmingCriticalLimit: "Critical Limit: 140°F",
    logIssue: "LOG ISSUE",

    // Calibration
    calMethod: "Calibration Method",
    icePoint: "Ice Point (32°F)",
    boilPoint: "Boiling Point (212°F)",
    thermometer: "Thermometer",
    
    // Supervisor
    commandCenter: "District Command Center",
    welcomeBack: "Welcome back, Supervisor",
    overview: "Overview",
    teamMgmt: "Team Mgmt",
    reports: "Reports",
    viewMobile: "View Mobile App",
    schoolCompliance: "School Compliance Status",
    compliance: "Compliance",
    missingLogs: "MISSING LOGS",
    call: "CALL",
    email: "EMAIL",
    actionItems: "Action Items",
    recentActivity: "Recent Activity",
    noIssues: "No outstanding issues.",
    selectSchoolPrompt: "Select a school to view details",
    cafeteriaManagers: "Cafeteria Managers",
    manageAccess: "Manage access and user roles",
    addManager: "ADD USER",
    name: "Name",
    role: "Role",
    location: "Location",
    status: "Status",
    lastLogin: "Last Login",
    actions: "Actions",
    active: "Active",
    inactive: "Inactive",
    addManagerTitle: "Add New User",
    editUserTitle: "Edit User",
    firstName: "First Name",
    lastName: "Last Name",
    cancel: "CANCEL",
    createUser: "CREATE USER",
    saveChanges: "SAVE CHANGES",
    searchSchools: "Search Schools...",
    filterAll: "All",
    filterGood: "Good",
    filterWarning: "Warning",
    filterCritical: "Critical",
    noSchoolsFound: "No schools found matching filters.",
    managerRole: "Manager",
    supervisorRole: "Supervisor",
    
    // Supervisor Activity Log
    activityLog: "Manager Activity Log",
    viewActivityLog: "View Activity Log",
    backToTeam: "Back to Team",
    event: "Event",
    details: "Details",
    time: "Time",
    loginEvent: "Login",
    submitEvent: "Submission",
    alertEvent: "System Alert",
    editEvent: "Edit",
    
    // Supervisor Summary
    districtHealth: "District Health",
    districtAvg: "District Average",
    criticalAlerts: "Critical Alerts",
    requiresAttention: "Requires Attention",
    weeklyTrend: "Weekly Trend",
    vsLastWeek: "vs Last Week",

    // Reports / Query Builder
    customQueryBuilder: "Custom Query Builder",
    dateRange: "Date Range",
    schools: "Schools",
    logType: "Log Type",
    logStatus: "Log Status",
    outputFormat: "Output Format",
    generateReport: "GENERATE REPORT",
    downloading: "Generating Report...",
    reportReady: "Report Generated Successfully",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    custom: "Custom Range",
    allSchools: "All Schools",
    allLogs: "All Log Types",
    allStatuses: "All Statuses",
    completedOnly: "Completed Only",
    overdueOnly: "Overdue Only",
    correctiveOnly: "Corrective Actions Only",
    recentReports: "Recent Reports",
    download: "Download",

    // Sync
    syncDetails: "Sync Status",
    itemsPending: "items pending upload",
    itemsFailed: "items failed",
    retryAll: "RETRY ALL",
    retry: "Retry",
    simulateOffline: "Simulate Offline Mode",
    simulateOnline: "Go Online",
    uploading: "Uploading",
    errorTimeout: "Network Timeout",
    errorServer: "Server Error (500)",
  },
  es: {
    // Login
    appTitle: "Registro de Cafetería",
    appSubtitle: "Sistema de Cumplimiento Distrital",
    username: "Usuario",
    password: "Contraseña",
    loginBtn: "INICIO SEGURO",
    demoCredentials: "CREDENCIALES DE DEMO",
    invalidCredentials: "Credenciales inválidas",
    
    // Common
    logout: "Salir",
    online: "En línea",
    offline: "Sin conexión",
    syncing: "Sincronizando...",
    syncError: "Error Sinc",
    pendingLogs: "Registros Pendientes",
    
    // Manager Dashboard New
    todaysProgress: "Progreso de Hoy",
    moreAttention: "⚠️ Se requiere atención",
    makingProgress: "👍 Progresando",
    almostDone: "🎉 ¡Casi listo!",
    upNext: "Siguiente Tarea",
    comingUp: "Próximas Tareas",
    completedToday: "Completado Hoy",
    startTask: "Iniciar Tarea",
    viewReports: "Ver Informes",
    history: "Historial",
    view: "Ver",
    
    // Manager (Legacy)
    goodMorning: "Buenos Días",
    dailyProgress: "Progreso Diario",
    done: "Listo",
    pending: "Pendiente",
    prioritizedTasks: "Tareas Prioritarias",
    
    // Task Card
    dueNow: "Vence Ahora",
    overdue: "Atrasado",
    upcoming: "Próximo",
    completed: "Completado",
    logTemp: "Reg Temp",
    startTest: "Iniciar",
    calibrate: "Calibrar",
    last: "Última lectura",
    recorded: "Grabado",
    req: "Req",
    
    // Logging Screen
    requiredRange: "Rango Requerido",
    lastReading: "Última Lectura",
    readThermometer: "LEER TERMÓMETRO",
    scanTestStrip: "ESCANEAR TIRA",
    manualEntry: "Entrada Manual",
    copy: "Copiar",
    aiPreFill: "AUTO-COM (IA)",
    submit: "ENVIAR",
    success: "¡Éxito!",
    saved: "Guardado",
    loadingNext: "Cargando siguiente unidad...",
    logVerified: "Registro Verificado y Guardado",
    outOfRange: "FUERA DE RANGO",
    withinRange: "DENTRO DE RANGO",
    enterValue: "INGRESAR VALOR",
    outOfRangeTitle: "Fuera de Rango",
    outOfRangeMsg: "El valor está fuera de los límites seguros",
    selectCorrectiveAction: "Seleccionar Acción Correctiva:",
    recordAction: "REGISTRAR ACCIÓN",
    describeAction: "Describir Acción Tomada",
    typeDetails: "Escriba detalles aquí...",

    // Warming Cabinet
    cabinetNotReady: "GABINETE NO LISTO",
    cabinetNotReadyMsg: "No coloque comida hasta que alcance 140°F.",
    readyForUse: "LISTO PARA USAR",
    warmingCriticalLimit: "Límite Crítico: 140°F",
    logIssue: "REGISTRAR PROBLEMA",

    // Calibration
    calMethod: "Método de Calibración",
    icePoint: "Punto de Hielo (32°F)",
    boilPoint: "Punto de Ebullición (212°F)",
    thermometer: "Termómetro",
    
    // Supervisor
    commandCenter: "Centro de Comando Distrital",
    welcomeBack: "Bienvenido, Supervisor",
    overview: "Resumen",
    teamMgmt: "Gestión Equipo",
    reports: "Informes",
    viewMobile: "Ver App Móvil",
    schoolCompliance: "Estado de Cumplimiento Escolar",
    compliance: "Cumplimiento",
    missingLogs: "REGISTROS FALTANTES",
    call: "LLAMAR",
    email: "ENVIAR CORREO",
    actionItems: "Elementos de Acción",
    recentActivity: "Actividad Reciente",
    noIssues: "Sin problemas pendientes.",
    selectSchoolPrompt: "Seleccione una escuela para ver detalles",
    cafeteriaManagers: "Gerentes de Cafetería",
    manageAccess: "Gestionar acceso y roles",
    addManager: "AGREGAR USUARIO",
    name: "Nombre",
    role: "Rol",
    location: "Ubicación",
    status: "Estado",
    lastLogin: "Último Acceso",
    actions: "Acciones",
    active: "Activo",
    inactive: "Inactivo",
    addManagerTitle: "Agregar Nuevo Usuario",
    editUserTitle: "Editar Usuario",
    firstName: "Nombre",
    lastName: "Apellido",
    cancel: "CANCELAR",
    createUser: "CREAR USUARIO",
    saveChanges: "GUARDAR CAMBIOS",
    searchSchools: "Buscar Escuelas...",
    filterAll: "Todos",
    filterGood: "Bueno",
    filterWarning: "Advertencia",
    filterCritical: "Crítico",
    noSchoolsFound: "No se encontraron escuelas.",
    managerRole: "Gerente",
    supervisorRole: "Supervisor",
    
    // Supervisor Activity Log
    activityLog: "Registro de Actividad",
    viewActivityLog: "Ver Actividad",
    backToTeam: "Volver al Equipo",
    event: "Evento",
    details: "Detalles",
    time: "Hora",
    loginEvent: "Inicio de Sesión",
    submitEvent: "Envío",
    alertEvent: "Alerta",
    editEvent: "Edición",
    
    // Supervisor Summary
    districtHealth: "Salud del Distrito",
    districtAvg: "Promedio del Distrito",
    criticalAlerts: "Alertas Críticas",
    requiresAttention: "Requiere Atención",
    weeklyTrend: "Tendencia Semanal",
    vsLastWeek: "vs Semana Pasada",

    // Reports / Query Builder
    customQueryBuilder: "Constructor de Consultas",
    dateRange: "Rango de Fechas",
    schools: "Escuelas",
    logType: "Tipo de Registro",
    logStatus: "Estado del Registro",
    outputFormat: "Formato de Salida",
    generateReport: "GENERAR INFORME",
    downloading: "Generando Informe...",
    reportReady: "Informe Generado con Éxito",
    today: "Hoy",
    thisWeek: "Esta Semana",
    thisMonth: "Esta Mes",
    custom: "Rango Personalizado",
    allSchools: "Todas las Escuelas",
    allLogs: "Todos los Tipos",
    allStatuses: "Todos los Estados",
    completedOnly: "Solo Completados",
    overdueOnly: "Solo Vencidos",
    correctiveOnly: "Solo Acciones Correctivas",
    recentReports: "Informes Recientes",
    download: "Descargar",

    // Sync
    syncDetails: "Estado de Sincronización",
    itemsPending: "elementos pendientes",
    itemsFailed: "elementos fallidos",
    retryAll: "REINTENTAR TODOS",
    retry: "Reintentar",
    simulateOffline: "Simular Modo Offline",
    simulateOnline: "Ir Online",
    uploading: "Subiendo",
    errorTimeout: "Tiempo de espera agotado",
    errorServer: "Error del servidor (500)",
  }
};

// Task title translations
export const TASK_TITLES: Record<string, Record<Language, string>> = {
  "Morning Cooler Check": { 
    en: "Morning Cooler Check", 
    es: "Revisión Matutina de Refrigerador" 
  },
  "Sanitizer Test": { 
    en: "Sanitizer Test", 
    es: "Prueba de Desinfectante" 
  },
  "Refrigerator Temperature Log": { 
    en: "Refrigerator Temperature Log", 
    es: "Registro Temp. Refrigerador" 
  },
  "Milk Cooler Temp": { 
    en: "Milk Cooler Temp", 
    es: "Temp. Enfriador de Leche" 
  },
  "Serving Line Checks": { 
    en: "Serving Line Checks", 
    es: "Revisiones Línea de Servicio" 
  },
  "Warming Cabinet Temperature Log": { 
    en: "Warming Cabinet Temperature Log", 
    es: "Registro Temp. Gabinete Térmico" 
  },
  "Thermometer Calibration Log": { 
    en: "Thermometer Calibration Log", 
    es: "Calibración de Termómetros" 
  }
};

// Location translations
export const LOCATION_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    "Kitchen Main": "Kitchen Main",
    "Dish Room": "Dish Room",
    "Kitchen": "Kitchen",
    "Cafeteria Line A": "Cafeteria Line A",
    "Cafeteria Main": "Cafeteria Main",
    "Kitchen Office": "Kitchen Office",
    "Serving Line": "Serving Line",
    "Pizza Station": "Pizza Station",
    "Cabinet A": "Cabinet A",
    "Cabinet B": "Cabinet B",
    "Pizza Warmer 1": "Pizza Warmer 1",
    "Pizza Warmer 2": "Pizza Warmer 2",
    "Walk-in Cooler": "Walk-in Cooler",
    "Reach-in Cooler": "Reach-in Cooler",
    "Milk Cooler": "Milk Cooler",
    "Line Cooler 1": "Line Cooler 1",
    "Line Cooler 2": "Line Cooler 2",
    "Salad Bar": "Salad Bar",
    "Thermometer #1": "Thermometer #1",
    "Thermometer #2": "Thermometer #2",
    "Thermometer #3": "Thermometer #3"
  },
  es: {
    "Kitchen Main": "Cocina Principal",
    "Dish Room": "Cuarto de Lavado",
    "Kitchen": "Cocina",
    "Cafeteria Line A": "Cafetería Línea A",
    "Cafeteria Main": "Cafetería Principal",
    "Kitchen Office": "Oficina de Cocina",
    "Serving Line": "Línea de Servicio",
    "Pizza Station": "Estación de Pizza",
    "Cabinet A": "Gabinete A",
    "Cabinet B": "Gabinete B",
    "Pizza Warmer 1": "Calentador Pizza 1",
    "Pizza Warmer 2": "Calentador Pizza 2",
    "Walk-in Cooler": "Refrigerador Principal",
    "Reach-in Cooler": "Refrigerador de Alcance",
    "Milk Cooler": "Enfriador de Leche",
    "Line Cooler 1": "Enfriador Línea 1",
    "Line Cooler 2": "Enfriador Línea 2",
    "Salad Bar": "Barra de Ensaladas",
    "Thermometer #1": "Termómetro #1",
    "Thermometer #2": "Termómetro #2",
    "Thermometer #3": "Termómetro #3"
  }
};

// Corrective action translations
export const CORRECTIVE_ACTIONS: Record<Language, Record<string, string>> = {
  en: {
    "Placed on hold - evaluating safety": "Placed on hold - evaluating safety",
    "Moved to working cooler": "Moved to working cooler",
    "Discarded": "Discarded",
    "Verified safe per protocol": "Verified safe per protocol",
    "Other (add note)": "Other (add note)",
    "Discarded & remixed solution": "Discarded & remixed solution",
    "Adjusted dispenser settings": "Adjusted dispenser settings",
    "Called maintenance": "Called maintenance",
    "Adjusted and re-tested": "Adjusted and re-tested",
    "Discarded - replaced with new unit": "Discarded - replaced with new unit",
    "Sent for repair": "Sent for repair",
    "Continue heating - Recheck later": "Continue heating - Recheck later",
  },
  es: {
    "Placed on hold - evaluating safety": "Retenido - evaluando seguridad",
    "Moved to working cooler": "Trasladado a refrigerador operativo",
    "Discarded": "Desechado",
    "Verified safe per protocol": "Verified safe per protocol",
    "Other (add note)": "Otro (añadir nota)",
    "Discarded & remixed solution": "Solución desechada y preparada nuevamente",
    "Adjusted dispenser settings": "Configuración del dispensador ajustada",
    "Called maintenance": "Se llamó a mantenimiento",
    "Adjusted and re-tested": "Ajustado y probado nuevamente",
    "Discarded - replaced with new unit": "Desechado - reemplazado con nueva unidad",
    "Sent for repair": "Enviado a reparación",
    "Continue heating - Recheck later": "Continue heating - Recheck later",
  }
};

// Translation utility functions
export const getTranslation = (key: keyof TranslationKeys, lang: Language): string => {
  return TRANSLATIONS[lang][key];
};

export const getTaskTitle = (taskKey: string, lang: Language): string => {
  return TASK_TITLES[taskKey]?.[lang] || taskKey;
};

export const getLocationTranslation = (location: string, lang: Language): string => {
  return LOCATION_TRANSLATIONS[lang][location] || location;
};

export const getCorrectiveActionTranslation = (action: string, lang: Language): string => {
  return CORRECTIVE_ACTIONS[lang][action] || action;
};