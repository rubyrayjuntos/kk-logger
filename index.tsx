import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Check,
  AlertTriangle,
  Clock,
  ChevronRight,
  BarChart3,
  Phone,
  Send,
  ArrowLeft,
  Thermometer,
  Droplets,
  ClipboardList,
  Sparkles,
  ScanLine,
  X,
  Menu,
  MoreVertical,
  Calendar,
  Search,
  Users,
  LogOut,
  Plus,
  Trash2,
  Lock,
  User as UserIcon,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  Mail,
  Copy,
  Globe,
  TrendingUp,
  Activity,
  FileText,
  Download,
  Filter,
  FileSpreadsheet,
  CloudOff,
  CloudLightning,
  Snowflake,
  Flame,
  Soup,
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  History
} from 'lucide-react';

// --- TRANSLATIONS ---

const TRANSLATIONS = {
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
    addManager: "ADD MANAGER",
    name: "Name",
    location: "Location",
    status: "Status",
    lastLogin: "Last Login",
    actions: "Actions",
    active: "Active",
    addManagerTitle: "Add New Manager",
    firstName: "First Name",
    lastName: "Last Name",
    cancel: "CANCEL",
    createUser: "CREATE USER",
    
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

    // Corrective Actions (Values)
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

    // Data Values (Locations & Units)
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
    addManager: "AGREGAR GERENTE",
    name: "Nombre",
    location: "Ubicación",
    status: "Estado",
    lastLogin: "Último Acceso",
    actions: "Acciones",
    active: "Activo",
    addManagerTitle: "Agregar Nuevo Gerente",
    firstName: "Nombre",
    lastName: "Apellido",
    cancel: "CANCELAR",
    createUser: "CREAR USUARIO",
    
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

    // Corrective Actions (Values)
    "Placed on hold - evaluating safety": "Retenido - evaluando seguridad",
    "Moved to working cooler": "Trasladado a refrigerador operativo",
    "Discarded": "Desechado",
    "Verified safe per protocol": "Verificado seguro según protocolo",
    "Other (add note)": "Otro (añadir nota)",
    "Discarded & remixed solution": "Solución desechada y preparada nuevamente",
    "Adjusted dispenser settings": "Configuración del dispensador ajustada",
    "Called maintenance": "Se llamó a mantenimiento",
    "Adjusted and re-tested": "Ajustado y probado nuevamente",
    "Discarded - replaced with new unit": "Desechado - reemplazado con nueva unidad",
    "Sent for repair": "Enviado a reparación",
    "Continue heating - Recheck later": "Continuar calentando - Revisar más tarde",

    // Data Values (Locations & Units)
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

const TASK_TITLES: Record<string, { en: string, es: string }> = {
    "Morning Cooler Check": { en: "Morning Cooler Check", es: "Revisión Matutina de Refrigerador" },
    "Sanitizer Test": { en: "Sanitizer Test", es: "Prueba de Desinfectante" },
    "Refrigerator Temperature Log": { en: "Refrigerator Temperature Log", es: "Registro Temp. Refrigerador" },
    "Milk Cooler Temp": { en: "Milk Cooler Temp", es: "Temp. Enfriador de Leche" },
    "Serving Line Checks": { en: "Serving Line Checks", es: "Revisiones Línea de Servicio" },
    "Warming Cabinet Temperature Log": { en: "Warming Cabinet Temperature Log", es: "Registro Temp. Gabinete Térmico" },
    "Thermometer Calibration Log": { en: "Thermometer Calibration Log", es: "Calibración de Termómetros" }
};

// --- MOCK DATA ---

const USERS_DB = [
  { id: 1, username: 'maria', password: 'pass', role: 'manager', firstName: 'Maria', lastName: 'Rodriguez', location: 'Jefferson Elementary', email: 'm.rodriguez@school.edu', status: 'Active', lastLogin: 'Today, 7:10 AM' },
  { id: 2, username: 'david', password: 'pass', role: 'manager', firstName: 'David', lastName: 'Chen', location: 'Washington Elementary', email: 'd.chen@school.edu', status: 'Active', lastLogin: 'Yesterday, 2:30 PM' },
  { id: 3, username: 'sarah', password: 'pass', role: 'supervisor', firstName: 'Sarah', lastName: 'Connor', location: 'North District', email: 's.connor@district.edu', status: 'Active', lastLogin: 'Just now' }
];

const INITIAL_TASKS = [
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
    time: "Overdue (15m)", // Made urgent to feature in Hero Card
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

// Removed hardcoded 'status' to implement FR-202 logic dynamically
const DISTRICT_SCHOOLS = [
  {
    id: "jefferson",
    name: "Jefferson Elementary",
    compliance: 92,
    manager: "Maria Rodriguez",
    lastActive: "2 mins ago",
    missingLogs: 0,
    issues: []
  },
  {
    id: "washington",
    name: "Washington Elementary",
    compliance: 65,
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
    manager: "New Manager",
    lastActive: "15 mins ago",
    missingLogs: 1,
    issues: [
      { id: 201, title: "Dishwasher Temp", desc: "1 Overdue log", severity: "medium" }
    ]
  }
];

const MOCK_RECENT_REPORTS = [
    { id: 1, name: "District Compliance - Oct", date: "Oct 31, 2023", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Sanitizer Audit", date: "Oct 28, 2023", type: "XLSX", size: "156 KB" },
    { id: 3, name: "Washington Elem Corrective Actions", date: "Oct 25, 2023", type: "CSV", size: "42 KB" },
];

// --- BUSINESS LOGIC HELPERS ---

const getSchoolStatus = (school: any) => {
  if (school.compliance < 75 || school.missingLogs >= 3) return 'critical';
  if (school.compliance < 90 || school.missingLogs > 0) return 'warning';
  return 'good';
};

// --- UTILITY COMPONENTS ---

const getStatusBadgeStyles = (status: string, timeText: string) => {
  if (timeText.includes('Now') || status === 'due') return { bg: 'bg-orange-100', text: 'text-orange-700', icon: <AlertTriangle size={12} strokeWidth={3} /> };
  if (timeText.toLowerCase().includes('overdue')) return { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertTriangle size={12} strokeWidth={3} /> };
  if (status === 'completed') return { bg: 'bg-green-100', text: 'text-green-700', icon: <Check size={12} strokeWidth={3} /> };
  return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} strokeWidth={3} /> };
};

const StatusBadge = ({ status, text, lang }: { status: string, text: string, lang: 'en' | 'es' }) => {
  const styles = getStatusBadgeStyles(status, text);
  
  let displayText = text;
  if (text === "Due Now") displayText = TRANSLATIONS[lang].dueNow;
  if (text.includes("Due:")) displayText = text.replace("Due:", TRANSLATIONS[lang].upcoming + ":");
  if (status === 'completed') displayText = TRANSLATIONS[lang].completed;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold gap-1.5 ${styles.bg} ${styles.text}`}>
      {styles.icon} {displayText}
    </span>
  );
};

// --- SUB-COMPONENTS ---

const HeroTaskCard = ({ task, onClick, lang }: { task: any, onClick: () => void, lang: 'en' | 'es' }) => {
  const t = TRANSLATIONS[lang];
  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  // Translate Location (if available in dict, else use raw)
  const location = (t as any)[task.location] || task.location;
  
  // Determine urgency styles based on time text
  let borderClass = 'border-yellow-500';
  let btnGradient = 'bg-gradient-to-r from-blue-600 to-blue-700';
  
  if (task.time.toLowerCase().includes('overdue')) {
    borderClass = 'border-red-500';
    btnGradient = 'bg-gradient-to-r from-red-600 to-red-700';
  } else if (task.time.includes('Now')) {
    borderClass = 'border-orange-500';
    btnGradient = 'bg-gradient-to-r from-orange-600 to-orange-700';
  }

  let actionLabel = task.type === 'temp' || task.type === 'warming' ? t.logTemp : t.startTest;
  if (task.type === 'calibration') actionLabel = t.calibrate;

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden border-2 bg-white ${borderClass} mb-6`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <StatusBadge status={task.status} text={task.time} lang={lang} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
              <MapPin size={14} /> {location}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase">{t.last}</span>
            <span className="font-bold text-slate-700">{task.lastLog?.value || '--'}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500 font-bold uppercase">{t.recorded}</span>
            <span className="font-medium text-slate-600">{task.lastLog?.time || '--'}</span>
          </div>
        </div>

        <button 
          onClick={onClick}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center ${btnGradient}`}
        >
          {actionLabel}
          <ChevronRight className="ml-2" size={24} />
        </button>
      </div>
    </div>
  );
};

const CompactTaskCard = ({ task, onClick, lang }: { task: any, onClick: () => void, lang: 'en' | 'es' }) => {
  const t = TRANSLATIONS[lang];
  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  // Translate Location
  const location = (t as any)[task.location] || task.location;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-1">
             <StatusBadge status={task.status} text={task.time} lang={lang} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{location}</p>
        </div>
        <button 
          onClick={onClick}
          className="ml-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-sm text-slate-700 transition-colors"
        >
          {t.startTask.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};

const CompletedTaskCard = ({ task, lang }: { task: any, lang: 'en' | 'es' }) => {
    const title = TASK_TITLES[task.title]?.[lang] || task.title;
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100 opacity-75">
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                <CheckCircle className="text-green-500 mr-3" size={20} strokeWidth={3} />
                <div>
                    <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{task.value} • {task.lastLog?.time || 'Today'}</p>
                </div>
                </div>
            </div>
        </div>
    );
};

const LoggingScreen = ({ task, onClose, onComplete, lang }: { task: any, onClose: () => void, onComplete: (id: number, val: string) => void, lang: 'en' | 'es' }) => {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState<'input' | 'corrective'>('input');
  const [manualValue, setManualValue] = useState('');
  const [animationState, setAnimationState] = useState<'idle' | 'success' | 'error'>('idle');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [customNote, setCustomNote] = useState('');
  
  const [selectedUnit, setSelectedUnit] = useState(task.units?.[0] || '');
  const [unitValues, setUnitValues] = useState<Record<string, string>>({});
  
  // Calibration specific state
  const [calMethod, setCalMethod] = useState<'ice' | 'boil'>('ice');

  let correctiveActionsRaw: string[] = [];
  if (task.type === 'calibration') {
    correctiveActionsRaw = [
      "Adjusted and re-tested",
      "Discarded - replaced with new unit",
      "Sent for repair",
      "Other (add note)"
    ];
  } else if (task.type === 'warming') {
    correctiveActionsRaw = [
      "Continue heating - Recheck later",
      "Called maintenance",
      "Other (add note)"
    ];
  } else if (task.type === 'temp') {
    correctiveActionsRaw = [
      "Placed on hold - evaluating safety",
      "Moved to working cooler",
      "Discarded",
      "Verified safe per protocol",
      "Other (add note)"
    ];
  } else {
    correctiveActionsRaw = [
        "Discarded & remixed solution",
        "Adjusted dispenser settings",
        "Called maintenance",
        "Other (add note)"
      ];
  }

  const handleMagicFill = () => {
    // If unit-specific history is available, use it for "prediction"
    if (task.units && selectedUnit && task.lastLogs && task.lastLogs[selectedUnit]) {
        const lastValStr = task.lastLogs[selectedUnit].value;
        const num = lastValStr.replace(/[^0-9.-]/g, '');
        if (num) {
            setManualValue(num);
            setAnimationState('idle');
            return;
        }
    }
    // Fallback based on type
    if (task.type === 'calibration') {
        setManualValue(calMethod === 'ice' ? '32' : '212');
    } else if (task.type === 'warming') {
        setManualValue('145');
    } else {
        setManualValue(task.type === 'temp' ? '38' : '350');
    }
    setAnimationState('idle');
  };

  const handleUnitSelect = (unit: string) => {
    setSelectedUnit(unit);
    setManualValue(unitValues[unit] || '');
    setStep('input');
    setAnimationState('idle');
  };
  
  const copyPreviousValue = () => {
    if (!task.units) return;
    const currentIndex = task.units.indexOf(selectedUnit);
    if (currentIndex > 0) {
      const prevUnit = task.units[currentIndex - 1];
      const prevVal = unitValues[prevUnit];
      if (prevVal) {
        setManualValue(prevVal);
      }
    }
  };

  const handleLogSubmit = () => {
    const val = manualValue;
    // Determine range dynamically
    let min = task.range?.min || 0;
    let max = task.range?.max || 1000;
    
    if (task.type === 'calibration') {
        if (calMethod === 'ice') { min = 30; max = 34; }
        else { min = 210; max = 214; }
    }

    const valueNum = parseFloat(val);

    if (!val) return;

    if (valueNum >= min && valueNum <= max) {
      setAnimationState('success');
      
      const newUnitValues = { ...unitValues, [selectedUnit]: val };
      setUnitValues(newUnitValues);

      setTimeout(() => {
        if (task.units) {
          const currentIndex = task.units.indexOf(selectedUnit);
          if (currentIndex < task.units.length - 1) {
            const nextUnit = task.units[currentIndex + 1];
            setSelectedUnit(nextUnit);
            setManualValue('');
            setAnimationState('idle');
            return;
          } else {
             onComplete(task.id, `${Object.keys(newUnitValues).length} Units OK`);
             return;
          }
        }

        onComplete(task.id, `${val}${task.range?.unit || ''}`);
      }, 1200);
    } else {
      setAnimationState('error');
      setTimeout(() => setStep('corrective'), 1000);
    }
  };

  const handleCorrectionSubmit = () => {
    if (!correctiveAction) return;
    const finalNote = correctiveAction === "Other (add note)" ? customNote : correctiveAction;
    onComplete(task.id, `Corrected: ${finalNote}`);
  };
  
  // Determine ranges for UI display
  let min = task.range?.min || 0;
  let max = task.range?.max || 100;
  if (task.type === 'calibration') {
    if (calMethod === 'ice') { min = 30; max = 34; }
    else { min = 210; max = 214; }
  }

  const currentVal = parseFloat(manualValue) || min;
  const percentage = Math.min(Math.max(((currentVal - (min * 0.5)) / ((max * 1.5) - (min * 0.5))) * 100, 0), 100);
  
  const isOutOfRange = (parseFloat(manualValue) < min || parseFloat(manualValue) > max) && manualValue !== '';
  const isSafe = !isOutOfRange && manualValue !== '';
  const isWarming = task.type === 'warming';

  const unitIndex = task.units ? task.units.indexOf(selectedUnit) : -1;
  const showCopyButton = unitIndex > 0;
  const previousUnitName = showCopyButton ? task.units[unitIndex - 1] : '';
  const previousUnitValue = showCopyButton ? unitValues[previousUnitName] : '';
  
  const title = TASK_TITLES[task.title]?.[lang] || task.title;
  // Translate Location
  const location = (t as any)[task.location] || task.location;
  // Translate Unit
  const unitName = (t as any)[selectedUnit] || selectedUnit;
  const specificLastLog = task.lastLogs?.[selectedUnit] || task.lastLog;

  if (animationState === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-green-500 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-full p-8 mb-6 shadow-2xl animate-bounce">
          <Check size={64} className="text-green-600" strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-bold mb-2">{t.success}</h2>
        <p className="text-green-100 text-xl">
            {task.units && unitIndex < task.units.length - 1 
                ? `${t.saved} ${unitName}` 
                : t.logVerified}
        </p>
        {task.units && unitIndex < task.units.length - 1 && (
            <p className="mt-4 text-green-50 font-semibold animate-pulse">{t.loadingNext}</p>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-full animate-in slide-in-from-bottom duration-300">
      <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500">{location}</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {step === 'input' ? (
          <>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.requiredRange}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.lastReading}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-slate-800">
                  {min} - {max} <span className="text-base font-normal text-slate-400">{task.range.unit}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-600">{specificLastLog?.value || '--'}</div>
                  <div className="text-xs text-slate-400">{specificLastLog?.time || 'Never'}</div>
                </div>
              </div>
            </div>

            {task.type === 'calibration' ? (
               <div className="flex gap-4 mb-2">
                 <button 
                    onClick={() => setCalMethod('ice')}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                        calMethod === 'ice' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                 >
                    <Snowflake size={24} />
                    <span className="text-xs font-bold">{t.icePoint}</span>
                 </button>
                 <button 
                    onClick={() => setCalMethod('boil')}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                        calMethod === 'boil' 
                        ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                 >
                    <Flame size={24} />
                    <span className="text-xs font-bold">{t.boilPoint}</span>
                 </button>
               </div>
            ) : task.type === 'warming' ? (
                 <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-center gap-4 text-orange-800 font-bold">
                    <Soup size={24} />
                    <span>{t.warmingCriticalLimit}</span>
                 </div>
            ) : (
                <button 
                    onClick={() => handleMagicFill()}
                    className="bg-slate-900 text-white rounded-2xl py-8 flex flex-col items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                >
                <ScanLine size={48} className="opacity-80" />
                <span className="font-bold tracking-widest text-sm opacity-90">
                    {task.type === 'temp' ? t.readThermometer : t.scanTestStrip}
                </span>
                </button>
            )}

            <div className="mt-auto">
               
               {task.units && (
                 <div className="mb-4">
                    {task.type === 'calibration' && <div className="text-xs font-bold text-slate-400 mb-2 uppercase">{t.thermometer}</div>}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {task.units.map((unit: string, idx: number) => {
                            const isDone = unitValues[unit];
                            const isCurrent = unit === selectedUnit;
                            const translatedUnit = (t as any)[unit] || unit;
                            return (
                                <button
                                    key={unit}
                                    onClick={() => handleUnitSelect(unit)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-2 ${
                                        isCurrent 
                                            ? 'bg-slate-800 text-white shadow-md' 
                                            : isDone 
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-white border border-slate-200 text-slate-500'
                                    }`}
                                >
                                    {isDone && <Check size={14} />}
                                    {translatedUnit}
                                </button>
                            );
                        })}
                    </div>
                 </div>
               )}

              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-500 uppercase">{t.manualEntry}</label>
                
                {showCopyButton && previousUnitValue && (
                  <button 
                    onClick={copyPreviousValue}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:bg-blue-100 transition-colors"
                  >
                    <Copy size={12} />
                    {t.copy} {previousUnitName.split(' ').pop()} ({previousUnitValue})
                  </button>
                )}
                
                <button 
                  onClick={handleMagicFill}
                  className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg"
                >
                  <Sparkles size={12} />
                  {t.aiPreFill}
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={manualValue}
                  onChange={(e) => {
                      setManualValue(e.target.value);
                      setAnimationState('idle');
                  }}
                  placeholder="000"
                  className={`w-full text-5xl font-bold text-center py-6 rounded-2xl border-2 outline-none transition-all ${
                    animationState === 'error' || (isWarming && !isSafe)
                      ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-200' 
                      : isSafe 
                        ? 'border-green-300 bg-green-50 text-green-900'
                        : 'border-slate-200 bg-white text-slate-800 focus:border-slate-400'
                  }`}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                  {task.range.unit}
                </span>
                
                <div className="mt-4 px-2">
                   {isWarming && !isSafe ? (
                     <div className="text-center animate-in fade-in slide-in-from-top-2">
                       <div className="text-red-600 font-black text-sm tracking-widest uppercase mb-1">{t.cabinetNotReady}</div>
                       <div className="text-xs text-red-400 font-medium">{t.cabinetNotReadyMsg}</div>
                     </div>
                   ) : (
                     <>
                        <div className="relative h-3 bg-slate-200 rounded-full w-full overflow-hidden">
                            <div 
                              className="absolute top-0 bottom-0 bg-green-400 opacity-30" 
                              style={{
                                  left: `${((min - (min*0.5)) / ((max*1.5) - (min*0.5))) * 100}%`,
                                  width: `${((max - min) / ((max*1.5) - (min*0.5))) * 100}%`
                              }} 
                            />
                            
                            {manualValue && (
                              <div 
                                  className={`absolute top-0 bottom-0 w-1.5 transition-all duration-300 ${isSafe ? 'bg-green-600' : 'bg-red-500'}`}
                                  style={{ left: `${percentage}%` }}
                              />
                            )}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium font-mono">
                            <span>{Math.floor(min * 0.5)}</span>
                            <span className="text-green-600">{min} (MIN)</span>
                            <span className="text-green-600">{max} (MAX)</span>
                            <span>{Math.floor(max * 1.5)}</span>
                        </div>
                        
                        <div className={`text-center mt-2 text-xs font-bold tracking-widest ${isSafe ? 'text-green-600' : isOutOfRange ? 'text-red-500' : 'text-slate-300'}`}>
                            {isSafe ? (isWarming ? t.readyForUse : t.withinRange) : isOutOfRange ? t.outOfRange : t.enterValue}
                        </div>
                     </>
                   )}
                </div>

              </div>

              <button
                onClick={handleLogSubmit}
                disabled={!manualValue}
                className={`w-full text-xl font-bold py-5 rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all ${
                  isWarming && !isSafe 
                    ? 'bg-red-500 text-white shadow-red-200' 
                    : 'bg-slate-900 text-white'
                }`}
              >
                {isWarming && !isSafe ? t.logIssue : t.submit} {task.units && selectedUnit ? `- ${unitName}` : ''}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full animate-in slide-in-from-right">
            <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 mb-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {isWarming ? <Soup size={32} /> : <AlertTriangle size={32} />}
              </div>
              <h3 className="text-red-900 font-bold text-2xl mb-1">{isWarming ? t.cabinetNotReady : t.outOfRangeTitle}</h3>
              <p className="text-red-700">
                {isWarming ? t.cabinetNotReadyMsg : `${t.outOfRangeMsg} (${min}-${max}).`}
              </p>
            </div>

            <h4 className="font-bold text-slate-700 mb-4 px-2">{t.selectCorrectiveAction}</h4>
            
            <div className="flex flex-col gap-3">
              {correctiveActionsRaw.map((action) => {
                  const displayAction = (TRANSLATIONS[lang] as any)[action] || action;
                  return (
                    <button
                    key={action}
                    onClick={() => setCorrectiveAction(action)}
                    className={`p-4 rounded-xl text-left border-2 font-medium transition-all ${
                        correctiveAction === action 
                        ? 'border-slate-800 bg-slate-800 text-white shadow-lg' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    >
                    {displayAction}
                    </button>
                  );
              })}
            </div>

            {correctiveAction === "Other (add note)" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.describeAction}</label>
                    <textarea 
                        className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-slate-700 font-medium"
                        rows={3}
                        placeholder={t.typeDetails}
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                    />
                </div>
            )}

            <div className="mt-auto pt-6">
              <button
                onClick={handleCorrectionSubmit}
                disabled={!correctiveAction || (correctiveAction === "Other (add note)" && !customNote)}
                className="w-full bg-red-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
              >
                {t.recordAction}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const ManagerDashboardNew = ({ tasks, onStartTask, lang }: { tasks: any[], onStartTask: (task: any) => void, lang: 'en' | 'es' }) => {
    const t = TRANSLATIONS[lang];
    const [showHistory, setShowHistory] = useState(false);
    
    // Logic to find priority task
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    // Sort pending: Overdue > Due Now > Upcoming
    pendingTasks.sort((a, b) => {
        const getScore = (task: any) => {
            if (task.time.toLowerCase().includes('overdue')) return 3;
            if (task.time.includes('Now')) return 2;
            return 1;
        };
        return getScore(b) - getScore(a);
    });
    
    const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null;
    const otherTasks = pendingTasks.length > 1 ? pendingTasks.slice(1) : [];
    
    const completedCount = completedTasks.length;
    const totalCount = tasks.length;
    const progress = Math.round((completedCount / totalCount) * 100);
    
    return (
        <div className="pb-24">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-b-[2.5rem] shadow-xl p-6 mb-8 text-white relative z-10 mx-[-1px]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{t.goodMorning}, Maria</h1>
                        <div className="flex items-center text-slate-300 text-sm">
                            <MapPin size={14} className="mr-1" />
                            Jefferson Elementary
                        </div>
                    </div>
                </div>
                
                <div className="mb-2">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t.todaysProgress}</span>
                        <span className="text-3xl font-bold">{completedCount}/{totalCount}</span>
                     </div>
                     <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${
                                progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                     </div>
                     <div className="mt-2 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        {progress < 50 ? t.moreAttention : progress < 90 ? t.makingProgress : t.almostDone}
                     </div>
                </div>
            </div>

            <div className="px-4">
                {/* Hero Task */}
                {nextTask && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.upNext}</h2>
                        <HeroTaskCard task={nextTask} onClick={() => onStartTask(nextTask)} lang={lang} />
                    </div>
                )}

                {/* Other Pending Tasks */}
                {otherTasks.length > 0 && (
                    <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{t.comingUp}</h2>
                        <div className="flex flex-col gap-3">
                            {otherTasks.map(task => (
                                <CompactTaskCard key={task.id} task={task} onClick={() => onStartTask(task)} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}

                {/* History / Completed */}
                {completedTasks.length > 0 && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1"
                        >
                            <span>{t.completedToday} ({completedCount})</span>
                            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        {showHistory && (
                            <div className="flex flex-col gap-3 mb-8">
                                {completedTasks.map(task => (
                                    <CompletedTaskCard key={task.id} task={task} lang={lang} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Mobile Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-6 flex justify-around items-center z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                 <button className="flex flex-col items-center gap-1 text-slate-800">
                    <ClipboardList size={24} />
                    <span className="text-[10px] font-bold">Tasks</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 text-slate-400">
                    <BarChart3 size={24} />
                    <span className="text-[10px] font-bold">{t.viewReports}</span>
                 </button>
                 <button className="flex flex-col items-center gap-1 text-slate-400">
                    <History size={24} />
                    <span className="text-[10px] font-bold">{t.history}</span>
                 </button>
            </div>
        </div>
    );
  };
  
  // --- SUPERVISOR COMPONENTS ---

  const SupervisorDashboard = ({ onViewMobile, lang }: { onViewMobile: () => void, lang: 'en' | 'es' }) => {
    const t = TRANSLATIONS[lang];
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
    const [view, setView] = useState<'overview' | 'team' | 'reports'>('overview');
    
    // Team Management State
    const [showAddManager, setShowAddManager] = useState(false);
    const [users, setUsers] = useState(USERS_DB.filter(u => u.role === 'manager'));
    const [newManager, setNewManager] = useState({ firstName: '', lastName: '', location: '' });

    // Reports State
    const [reportConfig, setReportConfig] = useState({
        range: 'week',
        school: 'all',
        type: 'all',
        status: 'all',
        format: 'pdf'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationSuccess, setGenerationSuccess] = useState(false);

    // Calculate Summary Metrics
    const avgCompliance = Math.round(DISTRICT_SCHOOLS.reduce((acc, curr) => acc + curr.compliance, 0) / DISTRICT_SCHOOLS.length);
    const totalIssues = DISTRICT_SCHOOLS.reduce((acc, curr) => acc + curr.missingLogs, 0);

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const handleAddUser = () => {
        const newUser = {
            id: users.length + 5,
            username: newManager.firstName.toLowerCase(),
            password: 'pass', // Default temp password
            role: 'manager',
            firstName: newManager.firstName,
            lastName: newManager.lastName,
            location: newManager.location || 'Unassigned',
            email: `${newManager.firstName.charAt(0).toLowerCase()}.${newManager.lastName.toLowerCase()}@school.edu`,
            status: 'Active',
            lastLogin: 'Never'
        };
        setUsers([...users, newUser]);
        setShowAddManager(false);
        setNewManager({ firstName: '', lastName: '', location: '' });
    };

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setGenerationSuccess(false);
        setTimeout(() => {
            setIsGenerating(false);
            setGenerationSuccess(true);
        }, 2000);
    };
    
    const selectedSchool = DISTRICT_SCHOOLS.find(s => s.id === selectedSchoolId);
  
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold tracking-tight">{t.commandCenter}</h1>
            <p className="text-slate-400 text-sm mt-1">{t.welcomeBack}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setView('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">{t.overview}</span>
            </button>
            <button 
                onClick={() => setView('team')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === 'team' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users size={20} />
              <span className="font-medium">{t.teamMgmt}</span>
            </button>
            <button 
                onClick={() => setView('reports')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === 'reports' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <FileSpreadsheet size={20} />
              <span className="font-medium">{t.reports}</span>
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={onViewMobile}
              className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm transition-colors border border-slate-700"
            >
              <Phone size={16} />
              <span>{t.viewMobile}</span>
            </button>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
            
            {view === 'overview' && (
                <>
                {/* Summary Section */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${avgCompliance >= 90 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-bold uppercase tracking-wide">{t.districtHealth}</div>
                            <div className="text-2xl font-bold text-slate-800">{avgCompliance}% <span className="text-sm text-slate-400 font-normal">{t.districtAvg}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${totalIssues > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-bold uppercase tracking-wide">{t.criticalAlerts}</div>
                            <div className="text-2xl font-bold text-slate-800">{totalIssues} <span className="text-sm text-slate-400 font-normal">{t.requiresAttention}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-bold uppercase tracking-wide">{t.weeklyTrend}</div>
                            <div className="text-2xl font-bold text-green-600 flex items-center">
                                +4.2% <span className="text-sm text-slate-400 font-normal ml-2">{t.vsLastWeek}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="text-slate-400" />
                        {t.schoolCompliance}
                    </h2>
                    <div className="grid gap-4">
                        {DISTRICT_SCHOOLS.map(school => {
                        const status = getSchoolStatus(school);
                        const isSelected = selectedSchoolId === school.id;
                        return (
                            <div 
                            key={school.id}
                            onClick={() => setSelectedSchoolId(school.id)}
                            className={`group bg-white rounded-2xl p-5 cursor-pointer transition-all border-2 ${
                                isSelected ? 'border-blue-500 shadow-md ring-4 ring-blue-50' : 'border-transparent shadow-sm hover:border-slate-200'
                            }`}
                            >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                    status === 'good' ? 'bg-green-100 text-green-700' :
                                    status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {school.compliance}%
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{school.name}</h3>
                                    <p className="text-slate-500 text-sm">Manager: {school.manager} • {school.lastActive}</p>
                                </div>
                                </div>
                                <ChevronRight className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90 text-blue-500' : 'group-hover:text-slate-400'}`} />
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                className={`h-full rounded-full ${
                                    status === 'good' ? 'bg-green-500' :
                                    status === 'warning' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}
                                style={{ width: `${school.compliance}%` }}
                                />
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    </div>
        
                    {/* Detail Panel */}
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-[600px] sticky top-8">
                    {selectedSchool ? (
                        <>
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 mb-1">{selectedSchool.name}</h2>
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                                    getSchoolStatus(selectedSchool) === 'good' ? 'bg-green-500' :
                                    getSchoolStatus(selectedSchool) === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></span>
                                <span className="uppercase font-bold tracking-wider text-xs">{t.compliance}: {selectedSchool.compliance}%</span>
                            </div>
                        </div>
                        
                        <div className="p-6 flex-1 overflow-y-auto">
                            {selectedSchool.missingLogs > 0 ? (
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 text-red-600 mb-4 bg-red-50 p-3 rounded-lg">
                                <AlertTriangle size={20} />
                                <span className="font-bold text-sm">{selectedSchool.missingLogs} {t.missingLogs}</span>
                                </div>
                                <div className="space-y-3">
                                {selectedSchool.issues.map(issue => (
                                    <div key={issue.id} className="flex items-start p-3 bg-white border border-red-100 rounded-xl shadow-sm">
                                    <div className={`mt-1 w-2 h-2 rounded-full mr-3 shrink-0 ${issue.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{issue.title}</h4>
                                        <p className="text-slate-500 text-xs mt-0.5">{issue.desc}</p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                            ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                                </div>
                                <p className="text-slate-500 font-medium">{t.noIssues}</p>
                            </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.actionItems}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center space-x-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                        <Phone size={16} />
                                        <span>{t.call}</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-slate-300 transition-colors">
                                        <Mail size={16} />
                                        <span>{t.email}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t.recentActivity}</h3>
                                <div className="space-y-4">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="flex items-center text-sm">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 text-xs font-bold">
                                                {12-i}:00
                                            </div>
                                            <div>
                                                <p className="text-slate-700 font-medium">Log verified by manager</p>
                                                <p className="text-slate-400 text-xs">Cooler Check #{i}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                        <MapPin size={48} className="mb-4 opacity-20" />
                        <p>{t.selectSchoolPrompt}</p>
                        </div>
                    )}
                    </div>
                </div>
                </>
            )}

            {view === 'team' && (
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{t.cafeteriaManagers}</h2>
                            <p className="text-slate-500">{t.manageAccess}</p>
                        </div>
                        <button 
                            onClick={() => setShowAddManager(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Plus size={20} />
                            {t.addManager}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.name}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.location}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.email}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.status}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.lastLogin}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-slate-500">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">{user.location}</td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                {t.active}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{user.lastLogin}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Lock size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'reports' && (
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">{t.customQueryBuilder}</h2>
                        <p className="text-slate-500">{t.generateReport}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Config Panel */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.dateRange}</label>
                                        <select 
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:border-blue-500 outline-none"
                                            value={reportConfig.range}
                                            onChange={(e) => setReportConfig({...reportConfig, range: e.target.value})}
                                        >
                                            <option value="today">{t.today}</option>
                                            <option value="week">{t.thisWeek}</option>
                                            <option value="month">{t.thisMonth}</option>
                                            <option value="custom">{t.custom}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.schools}</label>
                                        <select 
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:border-blue-500 outline-none"
                                            value={reportConfig.school}
                                            onChange={(e) => setReportConfig({...reportConfig, school: e.target.value})}
                                        >
                                            <option value="all">{t.allSchools}</option>
                                            {DISTRICT_SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.logType}</label>
                                        <select 
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:border-blue-500 outline-none"
                                            value={reportConfig.type}
                                            onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                                        >
                                            <option value="all">{t.allLogs}</option>
                                            <option value="temp">Temperature Logs</option>
                                            <option value="chemical">Sanitizer Logs</option>
                                            <option value="calibration">Calibration Logs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.logStatus}</label>
                                        <select 
                                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:border-blue-500 outline-none"
                                            value={reportConfig.status}
                                            onChange={(e) => setReportConfig({...reportConfig, status: e.target.value})}
                                        >
                                            <option value="all">{t.allStatuses}</option>
                                            <option value="completed">{t.completedOnly}</option>
                                            <option value="overdue">{t.overdueOnly}</option>
                                            <option value="corrective">{t.correctiveOnly}</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.outputFormat}</label>
                                    <div className="flex gap-4">
                                        {['PDF', 'Excel', 'CSV'].map(fmt => (
                                            <button 
                                                key={fmt}
                                                onClick={() => setReportConfig({...reportConfig, format: fmt.toLowerCase()})}
                                                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                                                    reportConfig.format === fmt.toLowerCase()
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                                }`}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button 
                                        onClick={handleGenerateReport}
                                        disabled={isGenerating}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw className="animate-spin" />
                                                {t.downloading}
                                            </>
                                        ) : (
                                            <>
                                                <Download />
                                                {t.generateReport}
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                {generationSuccess && (
                                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle className="shrink-0" />
                                        <span className="font-medium">{t.reportReady}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Reports */}
                        <div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock size={18} className="text-slate-400" />
                                    {t.recentReports}
                                </h3>
                                <div className="space-y-3">
                                    {MOCK_RECENT_REPORTS.map(report => (
                                        <div key={report.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer border border-slate-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">{report.name}</div>
                                                <div className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-slate-500 border border-slate-200">{report.type}</div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-400">
                                                <span>{report.date}</span>
                                                <span>{report.size}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 text-sm font-bold text-blue-600 hover:text-blue-800 py-2">
                                    View All History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Add Manager Modal */}
        {showAddManager && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{t.addManagerTitle}</h2>
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.firstName}</label>
                                <input 
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={newManager.firstName}
                                    onChange={e => setNewManager({...newManager, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.lastName}</label>
                                <input 
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={newManager.lastName}
                                    onChange={e => setNewManager({...newManager, lastName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.location}</label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                value={newManager.location}
                                onChange={e => setNewManager({...newManager, location: e.target.value})}
                            >
                                <option value="">Select School...</option>
                                <option value="Lincoln MS">Lincoln MS</option>
                                <option value="North High">North High</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowAddManager(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button 
                            onClick={handleAddUser}
                            disabled={!newManager.firstName || !newManager.lastName}
                            className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                        >
                            {t.createUser}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };
  
  // --- MAIN APP COMPONENT ---

  const App = () => {
    const [user, setUser] = useState<any>(null); 
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [activeTask, setActiveTask] = useState<any>(null);
    
    // Global State
    const [lang, setLang] = useState<'en' | 'es'>('en');

    // Sync Simulation State
    const [isOnline, setIsOnline] = useState(true);
    const [pendingLogs, setPendingLogs] = useState<any[]>([]);
    const [failedLogs, setFailedLogs] = useState<any[]>([]);
    const [syncProgress, setSyncProgress] = useState(0);
    const [showSyncModal, setShowSyncModal] = useState(false);
    
    // Login Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    // Sync Logic
    useEffect(() => {
        let interval: any;
        if (isOnline && pendingLogs.length > 0) {
            processSyncQueue();
        }
        return () => clearInterval(interval);
    }, [isOnline, pendingLogs]);

    const processSyncQueue = async () => {
        if (pendingLogs.length === 0) return;
        
        // Take first item
        const itemToSync = pendingLogs[0];
        setSyncProgress(10); // Start

        // Simulate upload delay
        const duration = 1500;
        const steps = 10;
        let step = 0;
        
        const progressInterval = setInterval(() => {
            step++;
            setSyncProgress(10 + (step/steps) * 80);
        }, duration / steps);

        setTimeout(() => {
            clearInterval(progressInterval);
            
            // Random failure simulation (10% chance) or purely success for demo
            const shouldFail = Math.random() < 0.1; 
            
            if (shouldFail) {
                setFailedLogs(prev => [...prev, { ...itemToSync, error: TRANSLATIONS[lang].errorTimeout }]);
                setPendingLogs(prev => prev.slice(1));
            } else {
                setPendingLogs(prev => prev.slice(1));
            }
            
            setSyncProgress(0);
        }, duration);
    };

    const retryFailedLog = (logId: number) => {
        const log = failedLogs.find(l => l.taskId === logId);
        if (log) {
            setFailedLogs(prev => prev.filter(l => l.taskId !== logId));
            setPendingLogs(prev => [...prev, log]);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const foundUser = USERS_DB.find(u => u.username === username.toLowerCase() && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    const handleTaskComplete = (id: number, val: string) => {
      // Optimistic update
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, status: 'completed', value: val, lastLog: { time: 'Just now', value: val } } : t
      ));
      
      // Add to sync queue
      setPendingLogs(prev => [...prev, { taskId: id, value: val, timestamp: new Date() }]);
      
      setActiveTask(null);
    };

    const toggleLang = () => setLang(prev => prev === 'en' ? 'es' : 'en');
    const t = TRANSLATIONS[lang];

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <button 
                        onClick={toggleLang}
                        className="absolute top-4 right-4 flex items-center gap-1 text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <Globe size={14} />
                        {lang.toUpperCase()}
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 transform rotate-3">
                            <ClipboardList size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t.appTitle}</h1>
                        <p className="text-slate-500 font-medium">{t.appSubtitle}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">{t.username}</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input 
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                                    placeholder={t.username}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">{t.password}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-left-2">
                                <AlertTriangle size={16} />
                                {t.invalidCredentials}
                            </div>
                        )}

                        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all mt-4">
                            {t.loginBtn}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.demoCredentials}</p>
                        <div className="flex justify-center gap-4 text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-xl inline-block w-full">
                            <span>Manager: <span className="text-slate-900 font-bold">maria / pass</span></span>
                            <span>Supervisor: <span className="text-slate-900 font-bold">sarah / pass</span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
  
    return (
      <div className="h-screen flex flex-col font-sans bg-slate-50 text-slate-900 overflow-hidden">
        {/* Top Bar for Demo */}
        <div className="bg-slate-900 text-slate-400 py-2 px-4 flex justify-between items-center text-xs font-bold z-50 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {user.role === 'manager' ? 'MANAGER VIEW (MOBILE)' : 'SUPERVISOR VIEW (DESKTOP)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user.role === 'manager' && (
                <button 
                    onClick={() => setShowSyncModal(true)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                        !isOnline || failedLogs.length > 0 
                        ? 'bg-red-500/20 text-red-400' 
                        : syncProgress > 0 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                >
                    {!isOnline ? (
                        <><CloudOff size={12} /> {t.offline} ({pendingLogs.length})</>
                    ) : failedLogs.length > 0 ? (
                        <><AlertTriangle size={12} /> {failedLogs.length} {t.syncError}</>
                    ) : syncProgress > 0 ? (
                        <><RefreshCw size={12} className="animate-spin" /> {t.syncing} {Math.round(syncProgress)}%</>
                    ) : (
                        <><CloudLightning size={12} /> {t.online}</>
                    )}
                </button>
            )}
            
            <button 
                onClick={toggleLang}
                className="flex items-center gap-1 hover:text-white transition-colors"
            >
                <Globe size={14} />
                {lang.toUpperCase()}
            </button>
            <div className="w-px h-4 bg-slate-700 mx-2" />
            <button onClick={() => setUser(null)} className="flex items-center gap-1 hover:text-white transition-colors">
                <LogOut size={14} />
                {t.logout}
            </button>
          </div>
        </div>
  
        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
            {user.role === 'supervisor' ? (
                <SupervisorDashboard onViewMobile={() => {}} lang={lang} />
            ) : (
                <div className="h-full overflow-y-auto bg-slate-50 max-w-md mx-auto border-x border-slate-200 shadow-2xl relative">
                    <ManagerDashboardNew 
                        tasks={tasks} 
                        onStartTask={setActiveTask} 
                        lang={lang}
                    />
                    
                    {activeTask && (
                        <LoggingScreen 
                            task={activeTask} 
                            onClose={() => setActiveTask(null)}
                            onComplete={handleTaskComplete}
                            lang={lang}
                        />
                    )}
                </div>
            )}
        </div>

        {/* Sync Modal */}
        {showSyncModal && (
            <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CloudLightning size={18} className="text-blue-500" />
                            {t.syncDetails}
                        </h3>
                        <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="p-4">
                        {/* Status Toggle */}
                        <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
                            <button 
                                onClick={() => setIsOnline(true)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${isOnline ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                {t.simulateOnline}
                            </button>
                            <button 
                                onClick={() => setIsOnline(false)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!isOnline ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400'}`}
                            >
                                {t.simulateOffline}
                            </button>
                        </div>

                        {/* Queue Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="border border-slate-100 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-slate-700">{pendingLogs.length}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{t.itemsPending}</div>
                            </div>
                            <div className="border border-red-100 bg-red-50 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-red-600">{failedLogs.length}</div>
                                <div className="text-[10px] font-bold text-red-400 uppercase">{t.itemsFailed}</div>
                            </div>
                        </div>

                        {/* Failed Items List */}
                        {failedLogs.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-red-500 uppercase mb-2">Failed Uploads</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {failedLogs.map(log => {
                                        const task = tasks.find(t => t.id === log.taskId);
                                        return (
                                            <div key={log.taskId} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-700">{task?.title}</div>
                                                    <div className="text-[10px] text-red-500 font-medium">{log.error}</div>
                                                </div>
                                                <button onClick={() => retryFailedLog(log.taskId)} className="p-1.5 bg-white rounded-md text-slate-500 hover:text-blue-600 shadow-sm">
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => setIsOnline(prev => !prev)} // Just toggles for effect here
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
                        >
                            {isOnline ? 'Test Connection' : 'Reconnect Now'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);