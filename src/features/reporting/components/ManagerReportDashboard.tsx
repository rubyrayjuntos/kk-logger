/**
 * Manager Reporting Dashboard - Quick insights and actionable analytics
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Calendar,
  MapPin,
  Users,
  Target,
  Activity,
  RefreshCw,
  Eye,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import type { Language, Manager, School } from '../../../shared/types/core';

interface ManagerReportDashboardProps {
  currentUser: Manager;
  lang: Language;
  schools?: School[];
}

interface ComplianceMetrics {
  overall: number;
  temperature: number;
  sanitizer: number;
  warming: number;
  calibration: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface CriticalAlert {
  id: string;
  type: 'missed_log' | 'out_of_range' | 'equipment_failure' | 'repeated_issue';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  actionRequired: string;
  assignedTo: string;
  status: 'open' | 'in_progress' | 'resolved';
  dueDate: string;
}

interface QuickInsight {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  context: string;
  action?: string;
}

interface SchoolPerformance {
  schoolCode: string;
  schoolName: string;
  compliance: number;
  trend: 'up' | 'down' | 'stable';
  criticalIssues: number;
  lastUpdate: string;
  manager: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  riskLevel: 'low' | 'medium' | 'high';
}

export const ManagerReportDashboard: React.FC<ManagerReportDashboardProps> = ({
  currentUser,
  lang,
  schools = []
}) => {
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    overall: 0,
    temperature: 0,
    sanitizer: 0,
    warming: 0,
    calibration: 0,
    trend: 'stable',
    trendPercentage: 0
  });
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [insights, setInsights] = useState<QuickInsight[]>([]);
  const [schoolPerformance, setSchoolPerformance] = useState<SchoolPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [timeRange, selectedSchool, currentUser.id]);

  const loadReportData = () => {
    // Mock data - in real app, fetch from API based on user role and permissions
    const mockMetrics: ComplianceMetrics = {
      overall: 87,
      temperature: 92,
      sanitizer: 85,
      warming: 89,
      calibration: 78,
      trend: 'up',
      trendPercentage: 5.2
    };

    const mockAlerts: CriticalAlert[] = [
      {
        id: 'alert-1',
        type: 'missed_log',
        severity: 'high',
        title: 'Missing Temperature Logs',
        description: 'Washington Elementary - 3 consecutive missed morning temp checks',
        location: 'Washington Elementary',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionRequired: 'Contact manager immediately',
        assignedTo: 'David Chen',
        status: 'open',
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-2',
        type: 'out_of_range',
        severity: 'medium',
        title: 'Sanitizer Concentration Low',
        description: 'Lincoln Middle School - Dish sanitizer reading 150ppm (below 200ppm)',
        location: 'Lincoln Middle School',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        actionRequired: 'Verify corrective action taken',
        assignedTo: 'Sarah Johnson',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-3',
        type: 'repeated_issue',
        severity: 'high',
        title: 'Recurring Cooler Problems',
        description: 'Roosevelt High - Walk-in cooler out of range 3 times this week',
        location: 'Roosevelt High',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        actionRequired: 'Schedule maintenance inspection',
        assignedTo: 'Mike Rodriguez',
        status: 'open',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockInsights: QuickInsight[] = [
      {
        id: 'insight-1',
        title: 'Temperature Compliance',
        value: '92%',
        change: 3.5,
        trend: 'up',
        context: 'Best week this month',
        action: 'Maintain current procedures'
      },
      {
        id: 'insight-2',
        title: 'Critical Issues',
        value: '3',
        change: -2,
        trend: 'down',
        context: 'Reduced from last week',
        action: 'Continue monitoring'
      },
      {
        id: 'insight-3',
        title: 'Response Time',
        value: '14 min',
        change: -5.2,
        trend: 'up',
        context: 'Average for corrective actions',
        action: 'Target under 10 minutes'
      },
      {
        id: 'insight-4',
        title: 'Training Completion',
        value: '89%',
        change: 12,
        trend: 'up',
        context: 'District-wide progress',
        action: 'Focus on remaining 11%'
      }
    ];

    const mockSchoolPerformance: SchoolPerformance[] = [
      {
        schoolCode: 'JEF001',
        schoolName: 'Jefferson Elementary',
        compliance: 94,
        trend: 'up',
        criticalIssues: 0,
        lastUpdate: '5 minutes ago',
        manager: 'Maria Rodriguez',
        contactInfo: {
          phone: '(555) 123-4567',
          email: 'm.rodriguez@district.edu'
        },
        riskLevel: 'low'
      },
      {
        schoolCode: 'WAS002',
        schoolName: 'Washington Elementary',
        compliance: 67,
        trend: 'down',
        criticalIssues: 3,
        lastUpdate: '2 hours ago',
        manager: 'David Chen',
        contactInfo: {
          phone: '(555) 234-5678',
          email: 'd.chen@district.edu'
        },
        riskLevel: 'high'
      },
      {
        schoolCode: 'LIN003',
        schoolName: 'Lincoln Middle School',
        compliance: 85,
        trend: 'stable',
        criticalIssues: 1,
        lastUpdate: '15 minutes ago',
        manager: 'Sarah Johnson',
        contactInfo: {
          phone: '(555) 345-6789',
          email: 's.johnson@district.edu'
        },
        riskLevel: 'medium'
      }
    ];

    setMetrics(mockMetrics);
    setAlerts(mockAlerts);
    setInsights(mockInsights);
    setSchoolPerformance(mockSchoolPerformance);
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-orange-500 bg-orange-50';
      case 'low':
        return 'border-yellow-500 bg-yellow-50';
    }
  };

  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const handleContactManager = (school: SchoolPerformance, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${school.contactInfo.phone}`);
    } else {
      window.open(`mailto:${school.contactInfo.email}?subject=HACCP Compliance - ${school.schoolName}`);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // TODO: Generate and download report
    console.log(`Exporting ${format} report for ${timeRange} period`);
    setShowExportModal(false);
  };

  const ExportModal = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Report</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Schools</label>
            <select 
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            >
              <option value="all">All Schools</option>
              {schoolPerformance.map(school => (
                <option key={school.schoolCode} value={school.schoolCode}>
                  {school.schoolName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleExportReport('pdf')}
              variant="outline"
              className="w-full"
            >
              <FileText className="w-4 h-4" />
              PDF Report
            </Button>
            <Button
              onClick={() => handleExportReport('excel')}
              variant="outline"
              className="w-full"
            >
              <BarChart3 className="w-4 h-4" />
              Excel Data
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setShowExportModal(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Compliance Dashboard</h1>
            <p className="text-slate-600">
              {currentUser.role === 'admin' || currentUser.role === 'lead' 
                ? 'District Overview' 
                : `${currentUser.schoolCode} Reports`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button
              onClick={loadReportData}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overall Compliance</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.overall}%</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metrics.trend === 'up' ? 'text-green-600' : 
                metrics.trend === 'down' ? 'text-red-600' : 'text-slate-600'
              }`}>
                {metrics.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                 metrics.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                 <Target className="w-4 h-4" />}
                {metrics.trendPercentage > 0 && `+`}{metrics.trendPercentage}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-600">Temperature</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.temperature}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${metrics.temperature}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-600">Sanitizer</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.sanitizer}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${metrics.sanitizer}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-600">Warming</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.warming}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all"
                style={{ width: `${metrics.warming}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-600">Calibration</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.calibration}%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${metrics.calibration}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {insights.map(insight => (
            <div key={insight.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">{insight.title}</h3>
                <div className={`flex items-center gap-1 text-xs ${
                  insight.trend === 'up' ? 'text-green-600' : 
                  insight.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                   insight.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                   <Target className="w-3 h-3" />}
                  {insight.change > 0 && '+'}{insight.change}%
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{insight.value}</p>
              <p className="text-xs text-slate-600">{insight.context}</p>
              {insight.action && (
                <p className="text-xs text-blue-600 mt-2">{insight.action}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Critical Alerts */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Critical Alerts</h2>
              <p className="text-slate-600 text-sm">Issues requiring immediate attention</p>
            </div>
            
            <div className="divide-y divide-slate-200">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-4 ${getSeverityColor(alert.severity)} border-l-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                        <p className="text-sm text-slate-700 mt-1">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {alert.assignedTo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due: {new Date(alert.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            alert.status === 'open' ? 'bg-red-100 text-red-800' :
                            alert.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Performance */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">School Performance</h2>
              <p className="text-slate-600 text-sm">Current compliance status by location</p>
            </div>
            
            <div className="divide-y divide-slate-200">
              {schoolPerformance.map(school => (
                <div key={school.schoolCode} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{school.schoolName}</h3>
                      <p className="text-sm text-slate-600">{school.manager}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{school.compliance}%</div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(school.riskLevel)}`}>
                        {school.riskLevel} risk
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <span>Critical Issues: {school.criticalIssues}</span>
                    <span>Updated: {school.lastUpdate}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        school.compliance >= 90 ? 'bg-green-600' :
                        school.compliance >= 75 ? 'bg-orange-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${school.compliance}%` }}
                    />
                  </div>
                  
                  {/* Contact Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleContactManager(school, 'phone')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </Button>
                    <Button
                      onClick={() => handleContactManager(school, 'email')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </Button>
                    
                    {school.criticalIssues > 0 && (
                      <span className="ml-auto bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && <ExportModal />}
    </div>
  );
};