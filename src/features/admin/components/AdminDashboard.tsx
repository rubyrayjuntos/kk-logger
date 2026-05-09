/**
 * Admin Dashboard - Central hub for system administration
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  School,
  BookOpen,
  Shield,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { UserManagement } from './UserManagement';
import { BulkOperations } from './BulkOperations';
import { TrainingDashboard } from '../../training/components/TrainingSystem';
import type {
  School as SchoolType,
  SessionUser,
  UserRole,
  Language,
  TrainingRecord
} from '../../../shared/types/core';

interface AdminDashboardProps {
  currentUser: SessionUser;
  lang: Language;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  trainingCompliance: number;
  recentAlerts: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'training_completed' | 'system_alert' | 'compliance_issue';
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, 
  lang 
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'training' | 'schools' | 'settings'>('overview');
  const [selectedUsers, setSelectedUsers] = useState<SessionUser[]>([]);
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data - in real app, fetch from SharePoint/API
    const mockMetrics: SystemMetrics = {
      totalUsers: 342,
      activeUsers: 318,
      totalSchools: 15,
      trainingCompliance: 87,
      recentAlerts: 3,
      systemHealth: 'good'
    };

    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'user_created',
        description: 'New manager John Smith added to Lincoln Elementary',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
      },
      {
        id: '2',
        type: 'training_completed',
        description: '25 users completed HACCP Fundamentals training',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        severity: 'info'
      },
      {
        id: '3',
        type: 'compliance_issue',
        description: 'Roosevelt Middle School: 3 overdue temperature logs',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        severity: 'warning'
      }
    ];

    setMetrics(mockMetrics);
    setRecentActivity(mockActivity);
  };

  const handleBulkOperationComplete = (operation: string, results: any) => {
    setShowBulkOps(false);
    setSelectedUsers([]);
    // TODO: Refresh data, show notification
    console.log('Bulk operation completed:', operation, results);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
          <p className="text-slate-600">Monitor compliance across all schools</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {/* TODO: Download system report */}}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button
            onClick={() => setActiveView('users')}
            variant="primary"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{metrics.totalUsers}</p>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-xs text-green-600">{metrics.activeUsers} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <School className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{metrics.totalSchools}</p>
                <p className="text-sm text-slate-600">Schools</p>
                <p className="text-xs text-slate-500">All active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{metrics.trainingCompliance}%</p>
                <p className="text-sm text-slate-600">Training Compliance</p>
                <p className="text-xs text-amber-600">13% need updates</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                metrics.systemHealth === 'good' ? 'bg-green-100' :
                metrics.systemHealth === 'warning' ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                <Shield className={`w-6 h-6 ${
                  metrics.systemHealth === 'good' ? 'text-green-600' :
                  metrics.systemHealth === 'warning' ? 'text-amber-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{metrics.recentAlerts}</p>
                <p className="text-sm text-slate-600">Active Alerts</p>
                <p className="text-xs capitalize text-slate-500">{metrics.systemHealth} status</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  activity.severity === 'critical' ? 'bg-red-100' :
                  activity.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'user_created' && <Users className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'training_completed' && <BookOpen className="w-4 h-4 text-green-600" />}
                  {activity.type === 'compliance_issue' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {activity.type === 'system_alert' && <Bell className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900">{activity.description}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setActiveView('users')}
            variant="outline"
            className="justify-start h-16"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Add New Users</p>
                <p className="text-sm text-slate-500">Create accounts for staff</p>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveView('training')}
            variant="outline"
            className="justify-start h-16"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Assign Training</p>
                <p className="text-sm text-slate-500">Manage training modules</p>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveView('schools')}
            variant="outline"
            className="justify-start h-16"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-slate-500">Compliance analytics</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSchoolManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Management</h1>
          <p className="text-slate-600">Manage schools and their compliance status</p>
        </div>
        <Button variant="primary">
          <School className="w-4 h-4" />
          Add School
        </Button>
      </div>

      {/* School Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock school cards */}
        {[
          { name: 'Lincoln Elementary', code: 'LIN001', users: 12, compliance: 95 },
          { name: 'Roosevelt Middle School', code: 'ROO002', users: 18, compliance: 87 },
          { name: 'Washington High School', code: 'WAS003', users: 25, compliance: 92 }
        ].map((school) => (
          <div key={school.code} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">{school.name}</h3>
                <p className="text-sm text-slate-500">{school.code}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                school.compliance >= 95 ? 'bg-green-100 text-green-700' :
                school.compliance >= 85 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {school.compliance}% compliant
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Users:</span>
                <span className="text-slate-900">{school.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last audit:</span>
                <span className="text-slate-900">2 days ago</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-4">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
              
              <nav className="flex items-center gap-6">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'overview' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('users')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'users' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveView('training')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'training' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Training
                </button>
                <button
                  onClick={() => setActiveView('schools')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'schools' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Schools
                </button>
                <button
                  onClick={() => setActiveView('settings')}
                  className={`text-sm font-medium transition-colors ${
                    activeView === 'settings' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-5 h-5" />
                {metrics?.recentAlerts && metrics.recentAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {metrics.recentAlerts}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && renderOverview()}
        
        {activeView === 'users' && (
          <UserManagement
            currentUser={currentUser}
            lang={lang}
            onBulkOperations={(users) => {
              setSelectedUsers(users);
              setShowBulkOps(true);
            }}
          />
        )}
        
        {activeView === 'training' && (
          <TrainingDashboard
            userId={currentUser.id}
            userRole={currentUser.role}
            lang={lang}
          />
        )}
        
        {activeView === 'schools' && renderSchoolManagement()}
        
        {activeView === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">System Settings</h2>
            <p className="text-slate-600">Configuration panel coming soon</p>
          </div>
        )}
      </div>

      {/* Bulk Operations Modal */}
      {showBulkOps && (
        <BulkOperations
          selectedUsers={selectedUsers}
          onClose={() => setShowBulkOps(false)}
          onComplete={handleBulkOperationComplete}
        />
      )}
    </div>
  );
};