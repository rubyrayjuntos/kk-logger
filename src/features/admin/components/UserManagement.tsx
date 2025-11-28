/**
 * User Management System - Admin Interface for Lead/Supervisor View
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle,
  Download,
  Upload,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import type { User, Lead, Manager, School, TrainingRecord, Language } from '../../../shared/types/core';

interface UserManagementProps {
  currentUser: Lead;
  schools: School[];
  onClose: () => void;
  lang: Language;
}

type FilterType = 'all' | 'managers' | 'leads' | 'active' | 'inactive' | 'training_due';
type UserFormMode = 'add' | 'edit' | 'view';

interface UserWithDetails extends User {
  managerInfo?: Manager;
  leadInfo?: Lead;
  assignedSchool?: School;
  backupSchools?: School[];
  trainingStatus?: {
    completed: number;
    expired: number;
    due: number;
  };
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  schools,
  onClose,
  lang
}) => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormMode, setUserFormMode] = useState<UserFormMode>('add');
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, activeFilter]);

  const loadUsers = async () => {
    // TODO: Load from SharePoint/API
    const mockUsers: UserWithDetails[] = [
      {
        id: '1',
        username: 'mrodriguez',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'mrodriguez@district.edu',
        role: 'manager',
        status: 'active',
        lastLogin: '2025-11-25T07:15:00Z',
        schoolId: 'school1',
        isActive: true,
        phone: '(555) 123-4567',
        preferences: {
          language: 'en',
          timezone: 'America/Chicago',
          notifications: true
        },
        permissions: {
          canLogTemperatures: true,
          canSubmitCorrectiveActions: true,
          canViewHistoricalLogs: true,
          canGenerateReports: false,
          canManageUsers: false
        },
        createdDate: '2025-01-15T00:00:00Z',
        modifiedDate: '2025-11-20T00:00:00Z',
        assignedSchool: schools.find(s => s.schoolId === 'school1'),
        trainingStatus: {
          completed: 4,
          expired: 0,
          due: 1
        }
      },
      // Add more mock users...
    ];
    
    setUsers(mockUsers);
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.assignedSchool?.schoolName.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'managers':
        filtered = filtered.filter(u => u.role === 'manager');
        break;
      case 'leads':
        filtered = filtered.filter(u => u.role === 'lead');
        break;
      case 'active':
        filtered = filtered.filter(u => u.status === 'active');
        break;
      case 'inactive':
        filtered = filtered.filter(u => u.status === 'inactive');
        break;
      case 'training_due':
        filtered = filtered.filter(u => u.trainingStatus && u.trainingStatus.due > 0);
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setUserFormMode('add');
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: UserWithDetails) => {
    setUserFormMode('edit');
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleArchiveUser = async (userId: string) => {
    // TODO: Implement archive functionality
    console.log('Archive user:', userId);
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for users:', selectedUsers);
  };

  const getStatusBadge = (user: UserWithDetails) => {
    if (user.status === 'inactive') {
      return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">Inactive</span>;
    }
    
    if (user.trainingStatus?.expired && user.trainingStatus.expired > 0) {
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Training Expired</span>;
    }
    
    if (user.trainingStatus?.due && user.trainingStatus.due > 0) {
      return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">Training Due</span>;
    }
    
    return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Certified</span>;
  };

  const getTeamOverview = () => {
    const activeManagers = users.filter(u => u.role === 'manager' && u.status === 'active').length;
    const activeLeads = users.filter(u => u.role === 'lead' && u.status === 'active').length;
    const pendingTraining = users.filter(u => 
      u.trainingStatus && (u.trainingStatus.due > 0 || u.trainingStatus.expired > 0)
    ).length;

    return { activeManagers, activeLeads, pendingTraining };
  };

  const overview = getTeamOverview();

  if (showUserForm) {
    return (
      <UserForm
        mode={userFormMode}
        user={selectedUser}
        schools={schools}
        leads={users.filter(u => u.role === 'lead')}
        onSave={(userData) => {
          // TODO: Save user data
          setShowUserForm(false);
          loadUsers();
        }}
        onCancel={() => setShowUserForm(false)}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Team</h1>
            <p className="text-slate-600">Add, edit, and manage users across schools</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowBulkActions(!showBulkActions)}
              variant="outline"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              Bulk Actions
            </Button>
            <Button onClick={handleAddUser} variant="primary">
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overview.activeManagers}</p>
                <p className="text-sm text-slate-600">Active Managers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overview.activeLeads}</p>
                <p className="text-sm text-slate-600">Leads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                overview.pendingTraining > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  overview.pendingTraining > 0 ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overview.pendingTraining}</p>
                <p className="text-sm text-slate-600">Pending Training</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 mb-6">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="managers">Managers Only</option>
                  <option value="leads">Leads Only</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                  <option value="training_due">Training Due</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    {selectedUsers.length} users selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleBulkAction('assign_training')}
                      size="sm"
                      variant="outline"
                    >
                      Assign Training
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('update_certifications')}
                      size="sm"
                      variant="outline"
                    >
                      Update Certifications
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('export')}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowBulkActions(false);
                    setSelectedUsers([]);
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="divide-y divide-slate-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {showBulkActions && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                    )}
                    
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-slate-600">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-600 capitalize">
                          {user.role} • {user.assignedSchool?.schoolName || 'No assignment'}
                        </span>
                        {getStatusBadge(user)}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEditUser(user)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleArchiveUser(user.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">No users found</p>
              <p className="text-slate-500 mt-1">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first user'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Form Component (Add/Edit)
const UserForm: React.FC<{
  mode: UserFormMode;
  user: UserWithDetails | null;
  schools: School[];
  leads: UserWithDetails[];
  onSave: (userData: any) => void;
  onCancel: () => void;
  lang: Language;
}> = ({ mode, user, schools, leads, onSave, onCancel, lang }) => {
  const [formData, setFormData] = useState({
    role: user?.role || 'manager',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    assignedSchoolId: user?.schoolId || '',
    reportingLeadId: user?.managerInfo?.reportingLeadId || '',
    backupSchoolIds: user?.managerInfo?.backupSchoolIds || [],
    requiredTraining: [
      'haccp_fundamentals',
      'temperature_logging',
      'sanitizer_testing'
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {mode === 'add' ? 'Add New User' : `Edit User: ${user?.firstName} ${user?.lastName}`}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="manager"
                    checked={formData.role === 'manager'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="mr-2"
                  />
                  Manager (Cafeteria Manager)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="lead"
                    checked={formData.role === 'lead'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="mr-2"
                  />
                  Lead (Supervisor)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="mr-2"
                  />
                  Admin (District Level)
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* School Assignment (for Managers) */}
            {formData.role === 'manager' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assign to School *
                </label>
                <select
                  value={formData.assignedSchoolId}
                  onChange={(e) => setFormData({ ...formData, assignedSchoolId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a school...</option>
                  {schools.map((school) => (
                    <option key={school.schoolId} value={school.schoolId}>
                      {school.schoolName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reporting Structure */}
            {formData.role === 'manager' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reports To
                </label>
                <select
                  value={formData.reportingLeadId}
                  onChange={(e) => setFormData({ ...formData, reportingLeadId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a lead...</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} (Lead)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Training Assignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Training Required
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiredTraining.includes('haccp_fundamentals')}
                    onChange={(e) => {
                      const training = 'haccp_fundamentals';
                      setFormData({
                        ...formData,
                        requiredTraining: e.target.checked
                          ? [...formData.requiredTraining, training]
                          : formData.requiredTraining.filter(t => t !== training)
                      });
                    }}
                    className="mr-2"
                  />
                  HACCP Fundamentals
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiredTraining.includes('temperature_logging')}
                    onChange={(e) => {
                      const training = 'temperature_logging';
                      setFormData({
                        ...formData,
                        requiredTraining: e.target.checked
                          ? [...formData.requiredTraining, training]
                          : formData.requiredTraining.filter(t => t !== training)
                      });
                    }}
                    className="mr-2"
                  />
                  Temperature Logging
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.requiredTraining.includes('sanitizer_testing')}
                    onChange={(e) => {
                      const training = 'sanitizer_testing';
                      setFormData({
                        ...formData,
                        requiredTraining: e.target.checked
                          ? [...formData.requiredTraining, training]
                          : formData.requiredTraining.filter(t => t !== training)
                      });
                    }}
                    className="mr-2"
                  />
                  Sanitizer Testing
                </label>
              </div>
            </div>

            {/* Welcome Email */}
            <div>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                Send welcome email with login instructions
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {mode === 'add' ? 'Create User' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;