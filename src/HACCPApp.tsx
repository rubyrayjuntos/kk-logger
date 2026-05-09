/**
 * Main HACCP Application - Unified interface with user management and logging
 */

import React, { useState, useEffect } from 'react';
import { HACCPManagerDashboard } from './features/logging/components/HACCPManagerDashboard';
import { ManagerReportDashboard } from './features/reporting/components/ManagerReportDashboard';
import { AdminDashboard } from './features/admin/components/AdminDashboard';
import { OnboardingTour } from './features/training/components/TrainingSystem';
import type { Language, SessionUser } from './shared/types/core';

interface HACCPAppProps {}

interface LoginCredentials {
  username: string;
  password: string;
}

// Mock user database - in real app, this would be from API
const MOCK_USERS: (SessionUser & { username: string; password: string })[] = [
  {
    id: 'user-1',
    username: 'maria.rodriguez',
    password: 'demo123',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@district.edu',
    role: 'manager',
    schoolCode: 'JEF001',
    phoneNumber: '(555) 123-4567',
    language: 'en',
    isActive: true,
    hireDate: '2023-01-15',
    lastLoginDate: new Date().toISOString(),
    requiredTrainingComplete: true,
    permissions: ['log_data', 'view_reports']
  },
  {
    id: 'user-2',
    username: 'david.chen',
    password: 'demo123',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@district.edu',
    role: 'manager',
    schoolCode: 'WAS002',
    phoneNumber: '(555) 234-5678',
    language: 'en',
    isActive: true,
    hireDate: '2022-08-20',
    lastLoginDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    requiredTrainingComplete: false,
    permissions: ['log_data', 'view_reports']
  },
  {
    id: 'user-3',
    username: 'admin',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@district.edu',
    role: 'admin',
    schoolCode: 'DIST',
    phoneNumber: '(555) 999-0000',
    language: 'en',
    isActive: true,
    hireDate: '2021-03-10',
    lastLoginDate: new Date().toISOString(),
    requiredTrainingComplete: true,
    permissions: ['log_data', 'view_reports', 'manage_users', 'system_admin']
  },
  {
    id: 'user-4',
    username: 'lead.supervisor',
    password: 'lead123',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@district.edu',
    role: 'lead',
    schoolCode: 'DIST',
    phoneNumber: '(555) 345-6789',
    language: 'en',
    isActive: true,
    hireDate: '2020-09-05',
    lastLoginDate: new Date().toISOString(),
    requiredTrainingComplete: true,
    permissions: ['log_data', 'view_reports', 'manage_users', 'view_analytics']
  }
];

export const HACCPApp: React.FC<HACCPAppProps> = () => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports' | 'admin'>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check for stored session
  useEffect(() => {
    const storedUser = localStorage.getItem('haccp_current_user');
    const storedLang = localStorage.getItem('haccp_language') as Language;
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        
        // Check if user needs onboarding
        const hasSeenOnboarding = localStorage.getItem(`haccp_onboarding_${user.id}`);
        if (!hasSeenOnboarding && user.role === 'manager') {
          setShowOnboarding(true);
        }
      } catch (error) {
        localStorage.removeItem('haccp_current_user');
      }
    }
    
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  // Save session data
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('haccp_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('haccp_language', language);
  }, [language]);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoginError(null);
    
    // Find user in mock database
    const user = MOCK_USERS.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );
    
    if (!user) {
      setLoginError('Invalid username or password');
      return;
    }
    
    if (!user.isActive) {
      setLoginError('Account is inactive. Please contact administrator.');
      return;
    }
    
    // Create user session (exclude password from stored data)
    const { password, ...userSession } = user;
    setCurrentUser(userSession);
    
    // Update last login
    userSession.lastLoginDate = new Date().toISOString();
    
    // Check onboarding for managers
    const hasSeenOnboarding = localStorage.getItem(`haccp_onboarding_${user.id}`);
    if (!hasSeenOnboarding && user.role === 'manager') {
      setShowOnboarding(true);
    }
    
    // TODO: In real app, make API call to authenticate and get user data
    console.log('User logged in:', userSession);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('haccp_current_user');
    // TODO: In real app, make API call to invalidate session
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (currentUser) {
      localStorage.setItem(`haccp_onboarding_${currentUser.id}`, 'completed');
    }
  };

  const handleTrainingComplete = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        requiredTrainingComplete: true
      });
    }
  };

  // Login Screen
  const LoginScreen = () => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
      username: '',
      password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin(credentials);
    };

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                HACCP Digital Compliance
              </h1>
              <p className="text-slate-600">District Food Safety Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Secure Login
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Demo Accounts:</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <strong>Manager:</strong> maria.rodriguez / demo123
                </div>
                <div>
                  <strong>Lead:</strong> lead.supervisor / lead123
                </div>
                <div>
                  <strong>Admin:</strong> admin / admin123
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {language === 'en' ? 'Español' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Header for authenticated users
  const AppNavigation = () => {
    if (!currentUser) return null;

    const getAvailableViews = (): Array<{ key: string; label: string; icon: string }> => {
      const views = [];
      
      // All users can access dashboard
      views.push({ key: 'dashboard', label: 'Dashboard', icon: '🏠' });
      
      // All users can view reports
      views.push({ key: 'reports', label: 'Reports', icon: '📊' });
      
      // Only admins and leads can access admin panel
      if (currentUser.role === 'admin' || currentUser.role === 'lead') {
        views.push({ key: 'admin', label: 'Administration', icon: '⚙️' });
      }
      
      return views;
    };

    return (
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-slate-900">
              HACCP Compliance
            </h1>
            
            <nav className="flex items-center gap-4">
              {getAvailableViews().map(view => (
                <button
                  key={view.key}
                  onClick={() => setCurrentView(view.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === view.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1">{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-slate-600 capitalize">
                {currentUser.role} • {currentUser.schoolCode}
              </p>
            </div>
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded border"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main app render
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavigation />
      
      {/* Main Content */}
      {currentView === 'dashboard' && (
        <HACCPManagerDashboard
          currentUser={currentUser}
          lang={language}
          onTrainingComplete={handleTrainingComplete}
        />
      )}
      
      {currentView === 'reports' && (
        <ManagerReportDashboard
          currentUser={currentUser}
          lang={language}
        />
      )}
      
      {currentView === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'lead') && (
        <AdminDashboard
          currentUser={currentUser}
          lang={language}
        />
      )}
      
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          userId={currentUser.id}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}
    </div>
  );
};