import React, { useState, useEffect } from 'react';
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
  Mail,
  Copy,
  Globe,
  TrendingUp,
  Activity,
  FileText,
  Download,
  Filter,
  FileSpreadsheet
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
    online: "ONLINE",
    
    // Manager
    goodMorning: "Good Morning",
    dailyProgress: "Daily Progress",
    done: "Done",
    pending: "Pending",
    prioritizedTasks: "Prioritized Tasks",
    
    // Task Card
    dueNow: "Due Now",
    upcoming: "Upcoming",
    completed: "Completed",
    logTemp: "LOG TEMP",
    startTest: "START TEST",
    last: "Last",
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

    // Corrective Actions (Values)
    "Placed on hold - evaluating safety": "Placed on hold - evaluating safety",
    "Moved to working cooler": "Moved to working cooler",
    "Discarded": "Discarded",
    "Verified safe per protocol": "Verified safe per protocol",
    "Other (add note)": "Other (add note)",
    "Discarded & remixed solution": "Discarded & remixed solution",
    "Adjusted dispenser settings": "Adjusted dispenser settings",
    "Called maintenance": "Called maintenance",
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
    online: "EN LÍNEA",
    
    // Manager
    goodMorning: "Buenos Días",
    dailyProgress: "Progreso Diario",
    done: "Listo",
    pending: "Pendiente",
    prioritizedTasks: "Tareas Prioritarias",
    
    // Task Card
    dueNow: "Vence Ahora",
    upcoming: "Próximo",
    completed: "Completado",
    logTemp: "REGISTRAR TEMP",
    startTest: "INICIAR PRUEBA",
    last: "Último",
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
    thisMonth: "Este Mes",
    custom: "Rango Personalizado",
    allSchools: "Todas las Escuelas",
    allLogs: "Todos los Tipos",
    allStatuses: "Todos los Estados",
    completedOnly: "Solo Completados",
    overdueOnly: "Solo Vencidos",
    correctiveOnly: "Solo Acciones Correctivas",
    recentReports: "Informes Recientes",
    download: "Descargar",

    // Corrective Actions (Values)
    "Placed on hold - evaluating safety": "Retenido - evaluando seguridad",
    "Moved to working cooler": "Trasladado a refrigerador operativo",
    "Discarded": "Desechado",
    "Verified safe per protocol": "Verificado seguro según protocolo",
    "Other (add note)": "Otro (añadir nota)",
    "Discarded & remixed solution": "Solución desechada y preparada nuevamente",
    "Adjusted dispenser settings": "Configuración del dispensador ajustada",
    "Called maintenance": "Se llamó a mantenimiento",
  }
};

const TASK_TITLES: Record<string, { en: string, es: string }> = {
    "Morning Cooler Check": { en: "Morning Cooler Check", es: "Revisión Matutina de Refrigerador" },
    "Sanitizer Test": { en: "Sanitizer Test", es: "Prueba de Desinfectante" },
    "Refrigerator Temperature Log": { en: "Refrigerator Temperature Log", es: "Registro Temp. Refrigerador" },
    "Milk Cooler Temp": { en: "Milk Cooler Temp", es: "Temp. Enfriador de Leche" },
    "Serving Line Checks": { en: "Serving Line Checks", es: "Revisiones Línea de Servicio" },
    "Warming Cabinet": { en: "Warming Cabinet", es: "Gabinete de Calentamiento" }
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
    time: "7:15am",
    location: "Kitchen Main",
    value: "38°F"
  },
  {
    id: 2,
    title: "Sanitizer Test",
    type: "chemical",
    status: "due",
    time: "Due Now",
    location: "Dish Room",
    range: { min: 272, max: 700, unit: "ppm" },
    lastLog: { time: "8:00am", value: "350 ppm" }
  },
  {
    id: 4,
    title: "Refrigerator Temperature Log",
    type: "temp",
    status: "due",
    time: "Due Now",
    location: "Walk-in Cooler",
    range: { min: 33, max: 41, unit: "°F" },
    lastLog: { time: "Yesterday, 3:30pm", value: "39°F" }
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
    status: "due",
    time: "Due Now",
    location: "Cafeteria Main",
    range: { min: 33, max: 41, unit: "°F" },
    lastLog: { time: "Yesterday, 11:00am", value: "All OK" },
    units: ["Line Cooler 1", "Line Cooler 2", "Salad Bar"]
  },
  {
    id: 3,
    title: "Warming Cabinet",
    type: "temp",
    status: "upcoming",
    time: "Due: 11:00am",
    location: "Serving Line",
    dueTime: "11:00 AM"
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

// FR-202: Color coding logic
// Green: >=90% compliance, no overdue logs
// Yellow: 75-89% compliance OR 1-2 overdue logs
// Red: <75% compliance OR 3+ overdue logs
const getSchoolStatus = (school: any) => {
  if (school.compliance < 75 || school.missingLogs >= 3) return 'critical';
  if (school.compliance < 90 || school.missingLogs > 0) return 'warning';
  return 'good';
};

// --- UTILITY COMPONENTS ---

const StatusBadge = ({ status, text, lang }: { status: string, text: string, lang: 'en' | 'es' }) => {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-800 border-green-200",
    good: "bg-green-100 text-green-800 border-green-200",
    due: "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse-slow",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    upcoming: "bg-gray-100 text-gray-600 border-gray-200",
    critical: "bg-red-100 text-red-800 border-red-200 font-bold",
  };
  
  const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 w-fit";
  
  // Translate status text if it matches known keys
  let displayText = text;
  if (text === "Due Now") displayText = TRANSLATIONS[lang].dueNow;
  if (text.includes("Due:")) displayText = text.replace("Due:", TRANSLATIONS[lang].upcoming + ":");

  return (
    <span className={`${baseClass} ${styles[status] || styles.upcoming}`}>
      {status === 'completed' && <Check size={12} strokeWidth={3} />}
      {status === 'due' && <Clock size={12} />}
      {(status === 'warning' || status === 'critical') && <AlertTriangle size={12} />}
      {displayText}
    </span>
  );
};

// --- SUB-COMPONENTS ---

const TaskCard: React.FC<{ task: any, onClick: () => void, lang: 'en' | 'es' }> = ({ task, onClick, lang }) => {
  const isDue = task.status === 'due';
  const isCompleted = task.status === 'completed';
  const isUrgent = task.time.includes('Now');
  const t = TRANSLATIONS[lang];
  
  // Dynamic button label based on task type
  const actionLabel = task.type === 'temp' ? t.logTemp : t.startTest;

  // Translate Title
  const title = TASK_TITLES[task.title]?.[lang] || task.title;

  return (
    <div 
      onClick={isDue ? onClick : undefined}
      className={`relative p-4 rounded-2xl mb-3 transition-all duration-200 ${
        isDue 
          ? 'bg-white shadow-lg border-l-4 border-yellow-400 translate-y-0' 
          : 'bg-slate-50 border border-slate-100 opacity-90'
      } ${isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`font-bold text-lg ${isDue ? 'text-slate-900' : 'text-slate-600'}`}>
            {title}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <MapPin size={12} /> {task.location}
          </p>
        </div>
        <StatusBadge status={task.status} text={task.time} lang={lang} />
      </div>

      <div className="flex items-center justify-between mt-3">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-700 font-semibold bg-green-50 px-3 py-1.5 rounded-lg w-full">
            <Check size={18} />
            {t.completed}: {task.value}
          </div>
        ) : isDue ? (
          <div className="w-full flex items-center gap-3">
             {/* Display Last Log and Requirements inline for context */}
             <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                {task.lastLog && (
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                    {t.last}: {task.lastLog.value}
                  </span>
                )}
                {task.range && (
                   <span className="text-slate-400">
                    {t.req}: {task.range.min}-{task.range.max}{task.range.unit}
                   </span>
                )}
              </div>
            </div>
            <button className={`bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2 ${isUrgent ? 'animate-pulse-slow' : ''}`}>
              {actionLabel} <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
             <div className="w-0 h-full bg-slate-400" />
          </div>
        )}
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
  
  // Multi-unit logic
  const [selectedUnit, setSelectedUnit] = useState(task.units?.[0] || '');
  const [unitValues, setUnitValues] = useState<Record<string, string>>({});

  // Dynamic Corrective Actions based on Task Type
  const correctiveActionsRaw = task.type === 'temp' 
    ? [
        "Placed on hold - evaluating safety",
        "Moved to working cooler",
        "Discarded",
        "Verified safe per protocol",
        "Other (add note)"
      ]
    : [
        "Discarded & remixed solution",
        "Adjusted dispenser settings",
        "Called maintenance",
        "Other (add note)"
      ];

  const handleMagicFill = () => {
    // Simulates AI prediction based on history
    setManualValue(task.type === 'temp' ? '38' : '350');
  };

  const handleUnitSelect = (unit: string) => {
    // If we have a value for this unit in history, load it? 
    // For now, simpler to just allow jumping between units if needed, but primarily we want sequential.
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
    const min = task.range?.min || 0;
    const max = task.range?.max || 1000;
    const valueNum = parseFloat(val);

    if (!val) return;

    if (valueNum >= min && valueNum <= max) {
      setAnimationState('success');
      
      // Save the value for the current unit
      const newUnitValues = { ...unitValues, [selectedUnit]: val };
      setUnitValues(newUnitValues);

      setTimeout(() => {
        // Multi-unit: Check if there's a next unit
        if (task.units) {
          const currentIndex = task.units.indexOf(selectedUnit);
          if (currentIndex < task.units.length - 1) {
            // Move to next unit
            const nextUnit = task.units[currentIndex + 1];
            setSelectedUnit(nextUnit);
            setManualValue('');
            setAnimationState('idle');
            // Toast or visual cue could go here
            return;
          } else {
             // All units done
             onComplete(task.id, `${Object.keys(newUnitValues).length} Units OK`);
             return;
          }
        }

        // Single unit completion
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
  
  // Calculate gauge position
  const min = task.range?.min || 0;
  const max = task.range?.max || 100;
  const currentVal = parseFloat(manualValue) || min;
  // Clamp percentage between 0 and 100
  const percentage = Math.min(Math.max(((currentVal - (min * 0.5)) / ((max * 1.5) - (min * 0.5))) * 100, 0), 100);
  
  // Gauge Status Text
  const isOutOfRange = (parseFloat(manualValue) < min || parseFloat(manualValue) > max) && manualValue !== '';
  const isSafe = !isOutOfRange && manualValue !== '';

  // Get index for copy previous button logic
  const unitIndex = task.units ? task.units.indexOf(selectedUnit) : -1;
  const showCopyButton = unitIndex > 0;
  const previousUnitName = showCopyButton ? task.units[unitIndex - 1] : '';
  const previousUnitValue = showCopyButton ? unitValues[previousUnitName] : '';
  
  // Translate title
  const title = TASK_TITLES[task.title]?.[lang] || task.title;

  if (animationState === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-green-500 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-full p-8 mb-6 shadow-2xl animate-bounce">
          <Check size={64} className="text-green-600" strokeWidth={4} />
        </div>
        <h2 className="text-4xl font-bold mb-2">{t.success}</h2>
        <p className="text-green-100 text-xl">
            {task.units && unitIndex < task.units.length - 1 
                ? `${t.saved} ${selectedUnit}` 
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
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-500">{task.location}</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {step === 'input' ? (
          <>
            {/* Context Card (Simplified) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.requiredRange}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.lastReading}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-slate-800">
                  {task.range.min} - {task.range.max} <span className="text-base font-normal text-slate-400">{task.range.unit}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-600">{task.lastLog?.value || '--'}</div>
                  <div className="text-xs text-slate-400">{task.lastLog?.time || 'Never'}</div>
                </div>
              </div>
            </div>

            {/* Simulated Action Button */}
            <button 
                onClick={() => handleMagicFill()} // For demo, Scan button also fills
                className="bg-slate-900 text-white rounded-2xl py-8 flex flex-col items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
            >
              <ScanLine size={48} className="opacity-80" />
              <span className="font-bold tracking-widest text-sm opacity-90">
                {task.type === 'temp' ? t.readThermometer : t.scanTestStrip}
              </span>
            </button>

            {/* Manual Entry Section */}
            <div className="mt-auto">
               
               {/* Multi-Unit Selector */}
               {task.units && (
                 <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {task.units.map((unit: string, idx: number) => {
                            const isDone = unitValues[unit];
                            const isCurrent = unit === selectedUnit;
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
                                    {unit}
                                </button>
                            );
                        })}
                    </div>
                 </div>
               )}

              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-500 uppercase">{t.manualEntry}</label>
                
                {/* Copy Previous Button */}
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
                    animationState === 'error' 
                      ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-200' 
                      : isSafe 
                        ? 'border-green-300 bg-green-50 text-green-900'
                        : 'border-slate-200 bg-white text-slate-800 focus:border-slate-400'
                  }`}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                  {task.range.unit}
                </span>
                
                {/* Visual Gauge Integrated Here */}
                <div className="mt-4 px-2">
                   <div className="relative h-3 bg-slate-200 rounded-full w-full overflow-hidden">
                      {/* Safe Zone Marker (approximate) */}
                      <div 
                        className="absolute top-0 bottom-0 bg-green-400 opacity-30" 
                        style={{
                            left: `${((min - (min*0.5)) / ((max*1.5) - (min*0.5))) * 100}%`,
                            width: `${((max - min) / ((max*1.5) - (min*0.5))) * 100}%`
                        }} 
                      />
                      
                      {/* Current Value Indicator */}
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
                   
                   {/* Feedback Text */}
                   <div className={`text-center mt-2 text-xs font-bold tracking-widest ${isSafe ? 'text-green-600' : isOutOfRange ? 'text-red-500' : 'text-slate-300'}`}>
                      {isSafe ? t.withinRange : isOutOfRange ? t.outOfRange : t.enterValue}
                   </div>
                </div>

              </div>

              <button
                onClick={handleLogSubmit}
                disabled={!manualValue}
                className="w-full bg-slate-900 text-white text-xl font-bold py-5 rounded-2xl shadow-xl disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
              >
                {t.submit} {task.units && selectedUnit ? `- ${selectedUnit}` : ''}
              </button>
            </div>
          </>
        ) : (
          /* CORRECTIVE ACTION SCREEN */
          <div className="flex flex-col h-full animate-in slide-in-from-right">
            <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 mb-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-red-900 font-bold text-2xl mb-1">{t.outOfRangeTitle}</h3>
              <p className="text-red-700">{t.outOfRangeMsg} ({task.range.min}-{task.range.max}).</p>
            </div>

            <h4 className="font-bold text-slate-700 mb-4 px-2">{t.selectCorrectiveAction}</h4>
            
            <div className="flex flex-col gap-3">
              {correctiveActionsRaw.map((action) => {
                  // Translate the action
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
    </div>
  );
};

// --- REPORTS VIEW COMPONENT ---
const ReportsView = ({ lang }: { lang: 'en' | 'es' }) => {
    const t = TRANSLATIONS[lang];
    const [generating, setGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: 'today',
        school: 'all',
        logType: 'all',
        status: 'all',
        format: 'pdf'
    });

    const handleGenerate = () => {
        setGenerating(true);
        setReportReady(false);
        // Simulate API call
        setTimeout(() => {
            setGenerating(false);
            setReportReady(true);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <Filter size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{t.customQueryBuilder}</h2>
                        <p className="text-sm text-slate-500">Select parameters to generate compliance reports</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.dateRange}</label>
                        <select 
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="today">{t.today}</option>
                            <option value="week">{t.thisWeek}</option>
                            <option value="month">{t.thisMonth}</option>
                            <option value="custom">{t.custom}</option>
                        </select>
                    </div>

                    {/* Schools */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.schools}</label>
                        <select 
                            value={filters.school}
                            onChange={(e) => setFilters({...filters, school: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="all">{t.allSchools}</option>
                            {DISTRICT_SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    {/* Log Type */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.logType}</label>
                        <select 
                            value={filters.logType}
                            onChange={(e) => setFilters({...filters, logType: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="all">{t.allLogs}</option>
                            <option value="temp">Temperature</option>
                            <option value="sanitizer">Sanitizer</option>
                            <option value="calibration">Calibration</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.logStatus}</label>
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="all">{t.allStatuses}</option>
                            <option value="completed">{t.completedOnly}</option>
                            <option value="overdue">{t.overdueOnly}</option>
                            <option value="corrective">{t.correctiveOnly}</option>
                        </select>
                    </div>

                    {/* Output Format */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.outputFormat}</label>
                        <div className="flex gap-2">
                            {['pdf', 'xlsx', 'csv'].map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setFilters({...filters, format: fmt})}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase border-2 transition-all ${
                                        filters.format === fmt 
                                            ? 'border-purple-600 bg-purple-50 text-purple-700' 
                                            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6 flex justify-end">
                    <button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className={`bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${generating ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {generating ? (
                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> {t.downloading}</>
                        ) : (
                            <><Download size={20} /> {t.generateReport}</>
                        )}
                    </button>
                </div>
            </div>

            {reportReady && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 fade-in">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <Check size={20} className="text-green-600" />
                        </div>
                        <span className="font-bold">{t.reportReady}</span>
                    </div>
                    <button className="text-sm font-bold underline hover:text-green-900">{t.download} Report.{filters.format}</button>
                </div>
            )}

            {/* Recent Reports Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">{t.recentReports}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {MOCK_RECENT_REPORTS.map(report => (
                        <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : report.type === 'XLSX' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {report.type === 'PDF' ? <FileText size={20} /> : report.type === 'XLSX' ? <FileSpreadsheet size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{report.name}</div>
                                    <div className="text-xs text-slate-400">{report.date} • {report.size}</div>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-purple-600 p-2">
                                <Download size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'manager' | 'supervisor'>('manager');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<any>(null);
  
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loginStep, setLoginStep] = useState(0); // 0: Login, 1: App
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Localization State
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const t = TRANSLATIONS[lang];

  const toggleLang = () => setLang(l => l === 'en' ? 'es' : 'en');

  // Supervisor State
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [supervisorView, setSupervisorView] = useState<'dashboard' | 'team' | 'reports'>('dashboard');
  const [teamMembers, setTeamMembers] = useState(USERS_DB.filter(u => u.role === 'manager'));
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', location: '' });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = USERS_DB.find(u => u.username === username && u.password === password);
    if (foundUser) {
        setUser(foundUser);
        setLoginStep(1);
        setLoginError('');
        // Set default view based on role
        setActiveTab(foundUser.role === 'supervisor' ? 'supervisor' : 'manager');
    } else {
        setLoginError(t.invalidCredentials);
    }
  };

  const handleLogout = () => {
      setUser(null);
      setLoginStep(0);
      setUsername('');
      setPassword('');
      setActiveTask(null);
      setSelectedSchool(null);
  };

  // User Management Functions
  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      const id = teamMembers.length + 10;
      const createdUser = {
          id,
          username: newUser.email.split('@')[0],
          password: 'pass', // Default
          role: 'manager',
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          location: newUser.location,
          email: newUser.email,
          status: 'Active',
          lastLogin: 'Never'
      };
      setTeamMembers([...teamMembers, createdUser]);
      setShowAddUserModal(false);
      setNewUser({ firstName: '', lastName: '', email: '', location: '' });
  };

  const handleDeleteUser = (id: number) => {
      if(confirm('Are you sure you want to remove this user?')) {
          setTeamMembers(teamMembers.filter(m => m.id !== id));
      }
  };

  const toggleTask = (id: number, val: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: 'completed', value: val } : t
    ));
    setActiveTask(null);
  };
  
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  // Filter tasks for current user's location if manager
  const visibleTasks = user?.role === 'manager' 
    ? tasks.filter(t => t.location.includes(user.location) || true) // Show all for demo
    : tasks;

  if (loginStep === 0) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
              
              {/* Language Switcher */}
              <button 
                onClick={toggleLang}
                className="fixed top-6 right-6 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2 px-4"
              >
                  <Globe size={16} />
                  <span className="text-sm font-bold">{lang.toUpperCase()}</span>
              </button>

              <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
                        <ClipboardList className="text-white" size={32} />
                      </div>
                      <h1 className="text-2xl font-bold text-slate-800">{t.appTitle}</h1>
                      <p className="text-slate-500">{t.appSubtitle}</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t.username}</label>
                          <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                type="text" 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                placeholder={t.username}
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t.password}</label>
                          <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                placeholder="••••••••"
                              />
                          </div>
                      </div>
                      
                      {loginError && (
                          <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                              {loginError}
                          </div>
                      )}

                      <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-4">
                          {t.loginBtn}
                      </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                      <p className="text-xs text-slate-400 mb-2">{t.demoCredentials}</p>
                      <div className="flex gap-2 justify-center text-xs">
                          <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-100">Manager: maria / pass</span>
                          <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded border border-purple-100">Supervisor: sarah / pass</span>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- MANAGER VIEW ---
  if (activeTab === 'manager') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pb-20 max-w-md mx-auto shadow-2xl relative overflow-hidden">
        {/* Mobile Status Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 pb-8 rounded-b-[2.5rem] shadow-xl relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                 <UserIcon size={20} className="text-white" />
               </div>
               <div>
                  <h1 className="text-lg font-bold leading-tight">{t.goodMorning}, {user.firstName}</h1>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={10} /> {user.location}
                  </p>
               </div>
            </div>
            <div className="flex gap-2">
                {/* Language Toggle Mobile */}
                <button onClick={toggleLang} className="text-slate-400 hover:text-white transition-colors p-1">
                    <Globe size={20} />
                </button>
                <div className="flex items-center gap-1 text-[10px] bg-green-500/20 px-2 py-1 rounded-full text-green-300 border border-green-500/30">
                    <Wifi size={10} />
                    <span>{t.online}</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex justify-between text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <span>{t.dailyProgress}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex gap-4 text-xs font-medium text-slate-300">
               <span className="flex items-center gap-1"><Check size={12} className="text-green-400"/> {completedCount} {t.done}</span>
               <span className="flex items-center gap-1"><Clock size={12} className="text-yellow-400"/> {tasks.length - completedCount} {t.pending}</span>
            </div>
          </div>
        </div>

        {/* Task Feed */}
        <div className="px-4 -mt-6 relative z-20">
           <div className="flex justify-between items-center px-2 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.prioritizedTasks}</span>
              <span className="text-xs text-slate-400">{new Date().toLocaleDateString()}</span>
           </div>
           
           <div className="space-y-1 pb-24">
            {visibleTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => setActiveTask(task)} 
                  lang={lang}
                />
            ))}
           </div>
        </div>

        {/* Logging Modal */}
        {activeTask && (
          <LoggingScreen 
            task={activeTask} 
            onClose={() => setActiveTask(null)}
            onComplete={toggleTask}
            lang={lang}
          />
        )}

        {/* Supervisor Toggle (Dev Only) */}
        {user.role === 'supervisor' && (
            <button 
                onClick={() => setActiveTab('supervisor')}
                className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg z-50 hover:scale-105 transition-transform"
            >
                <BarChart3 size={24} />
            </button>
        )}
      </div>
    );
  }

  // --- SUPERVISOR VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Supervisor Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-2 rounded-lg">
             <BarChart3 className="text-purple-700" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{t.commandCenter}</h1>
            <p className="text-sm text-slate-500">{t.welcomeBack} {user.lastName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            
            {/* View Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => setSupervisorView('dashboard')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${supervisorView === 'dashboard' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t.overview}
                </button>
                <button 
                    onClick={() => setSupervisorView('team')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${supervisorView === 'team' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t.teamMgmt}
                </button>
                <button 
                    onClick={() => setSupervisorView('reports')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${supervisorView === 'reports' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t.reports}
                </button>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            {/* Language Toggle Desktop */}
            <button 
                onClick={toggleLang}
                className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors text-sm font-bold bg-slate-100 px-3 py-1.5 rounded-lg"
            >
                <Globe size={16} /> {lang.toUpperCase()}
            </button>
            
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium">
                <LogOut size={16} /> {t.logout}
            </button>
            
            {/* Mobile View Toggle */}
            <button 
                onClick={() => setActiveTab('manager')}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-800 transition-colors"
            >
                {t.viewMobile}
            </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        
        {supervisorView === 'reports' ? (
            <ReportsView lang={lang} />
        ) : supervisorView === 'dashboard' ? (
        <div className="space-y-8">
            {/* Summary Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* District Health Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">{t.districtHealth}</span>
                    </div>
                    <div>
                         {/* Calculate Average Compliance */}
                         <div className="text-4xl font-bold text-slate-800 mb-1">
                             {Math.round(DISTRICT_SCHOOLS.reduce((acc, s) => acc + s.compliance, 0) / DISTRICT_SCHOOLS.length)}%
                         </div>
                         <div className="text-sm text-slate-500 font-medium">{t.districtAvg}</div>
                    </div>
                    <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${Math.round(DISTRICT_SCHOOLS.reduce((acc, s) => acc + s.compliance, 0) / DISTRICT_SCHOOLS.length)}%` }}></div>
                    </div>
                </div>

                {/* Critical Alerts Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-xs font-bold text-red-100 bg-red-600 px-2 py-1 rounded uppercase animate-pulse">{t.requiresAttention}</span>
                    </div>
                    <div>
                         {/* Calculate Total Critical Alerts */}
                         <div className="text-4xl font-bold text-slate-800 mb-1">
                             {DISTRICT_SCHOOLS.reduce((acc, s) => acc + (getSchoolStatus(s) === 'critical' || getSchoolStatus(s) === 'warning' ? 1 : 0), 0)}
                         </div>
                         <div className="text-sm text-slate-500 font-medium">{t.criticalAlerts}</div>
                    </div>
                </div>

                 {/* Weekly Trend Card */}
                 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded">{t.weeklyTrend}</span>
                    </div>
                    <div>
                         <div className="text-4xl font-bold text-green-600 mb-1 flex items-center gap-2">
                             +4.2%
                         </div>
                         <div className="text-sm text-slate-500 font-medium">{t.vsLastWeek}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Col: School List */}
                <div className="col-span-7 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-slate-700 text-lg">{t.schoolCompliance}</h2>
                    <button className="text-slate-400 hover:text-purple-600 transition-colors"><Search size={20} /></button>
                    </div>
                    
                    {DISTRICT_SCHOOLS.map((school) => {
                        // Get Dynamic Status
                        const status = getSchoolStatus(school);
                        
                        return (
                            <div 
                            key={school.id}
                            onClick={() => setSelectedSchool(school)}
                            className={`bg-white p-5 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                                status === 'critical' ? 'border-red-500' :
                                status === 'warning' ? 'border-yellow-400' : 'border-green-500'
                            } ${selectedSchool?.id === school.id ? 'ring-2 ring-purple-500' : ''}`}
                            >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition-colors">{school.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><UserIcon size={14}/> {school.manager}</span>
                                        <span className="flex items-center gap-1"><Clock size={14}/> {t.active} {school.lastActive}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-bold ${
                                        status === 'critical' ? 'text-red-600' : 
                                        status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                        {school.compliance}%
                                    </span>
                                    <div className="text-xs font-bold text-slate-400 uppercase">{t.compliance}</div>
                                </div>
                            </div>
                            
                            {/* Health Bar */}
                            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        status === 'critical' ? 'bg-red-500' : 
                                        status === 'warning' ? 'bg-yellow-400' : 'bg-green-500'
                                    }`} 
                                    style={{ width: `${school.compliance}%` }} 
                                />
                            </div>

                            {/* Alerts */}
                            {school.missingLogs > 0 && (
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                                    <AlertTriangle size={14} />
                                    {school.missingLogs} {t.missingLogs}
                                </div>
                            )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Col: Detail View */}
                <div className="col-span-5">
                    {selectedSchool ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-28 animate-in slide-in-from-right duration-300">
                            <div className="bg-slate-900 text-white p-6">
                                <h2 className="text-xl font-bold">{selectedSchool.name}</h2>
                                <p className="text-slate-400 text-sm">Manager: {selectedSchool.manager}</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex gap-2 mb-6">
                                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                        <Phone size={16} /> {t.call}
                                    </button>
                                    <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                        <Send size={16} /> {t.email}
                                    </button>
                                </div>

                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-red-500" />
                                    {t.actionItems}
                                </h3>
                                
                                {selectedSchool.issues.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedSchool.issues.map((issue: any) => (
                                            <div key={issue.id} className="border border-slate-200 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-slate-800 text-sm">{issue.title}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                        issue.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {issue.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">{issue.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <Check size={48} className="mx-auto mb-2 text-green-200" />
                                        <p>{t.noIssues}</p>
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-700 mb-2 text-sm">{t.recentActivity}</h4>
                                    <div className="text-sm text-slate-500 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Morning Cooler Check</span>
                                            <span className="text-green-600 font-medium">Completed 7:15 AM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sanitizer Test</span>
                                            <span className="text-slate-400">{t.pending}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl p-8">
                            <BarChart3 size={64} className="mb-4 opacity-50" />
                            <p className="font-medium">{t.selectSchoolPrompt}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        ) : (
            // TEAM MANAGEMENT VIEW
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{t.cafeteriaManagers}</h2>
                        <p className="text-sm text-slate-500">{t.manageAccess}</p>
                    </div>
                    <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-purple-700 transition-colors"
                    >
                        <Plus size={16} /> {t.addManager}
                    </button>
                </div>
                
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">{t.name}</th>
                            <th className="px-6 py-4">{t.location}</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">{t.status}</th>
                            <th className="px-6 py-4">{t.lastLogin}</th>
                            <th className="px-6 py-4 text-right">{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teamMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {member.firstName[0]}{member.lastName[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{member.firstName} {member.lastName}</div>
                                            <div className="text-xs text-slate-400">@{member.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{member.location}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{member.email}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{t.active}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{member.lastLogin}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(member.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-slate-800">{t.addManagerTitle}</h3>
                      <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={24} />
                      </button>
                  </div>
                  <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.firstName}</label>
                              <input 
                                required
                                value={newUser.firstName}
                                onChange={e => setNewUser({...newUser, firstName: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-purple-500" 
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.lastName}</label>
                              <input 
                                required
                                value={newUser.lastName}
                                onChange={e => setNewUser({...newUser, lastName: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-purple-500" 
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                          <input 
                            required type="email"
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-purple-500" 
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.location}</label>
                          <select 
                            required
                            value={newUser.location}
                            onChange={e => setNewUser({...newUser, location: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-purple-500"
                          >
                              <option value="">Select School...</option>
                              {DISTRICT_SCHOOLS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                      </div>
                      <div className="pt-4 flex gap-3">
                          <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">{t.cancel}</button>
                          <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors">{t.createUser}</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}