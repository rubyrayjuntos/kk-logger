import React from 'react';
import { LogOut, Monitor, Languages } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { getTranslation } from '../../../localization/translations';
import type { Language } from '../../../shared/types/core';

interface SupervisorDashboardProps {
  onViewMobile: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  onViewMobile,
  lang,
  setLang,
  onLogout
}) => {
  const t = (key: string) => getTranslation(key, lang);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b-2 border-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">
                {t('supervisorDashboard')}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
                <Languages className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                icon={LogOut}
              >
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-green-600 mb-2">87%</div>
              <div className="text-slate-600 text-sm">{t('overallCompliance')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">23</div>
              <div className="text-slate-600 text-sm">{t('activeStations')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-amber-600 mb-2">3</div>
              <div className="text-slate-600 text-sm">{t('pendingReviews')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl font-bold text-red-600 mb-2">1</div>
              <div className="text-slate-600 text-sm">{t('criticalAlerts')}</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {t('quickActions')}
            </h2>
            <Button
              onClick={onViewMobile}
              icon={Monitor}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('viewMobileInterface')}
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {t('recentActivity')}
            </h2>
            <div className="space-y-3">
              {[
                { time: '2:30 PM', station: 'Main Kitchen', action: 'Temperature log completed', status: 'success' },
                { time: '2:15 PM', station: 'Prep Area', action: 'Sanitizer check failed', status: 'warning' },
                { time: '1:45 PM', station: 'Dishwashing', action: 'Equipment maintenance', status: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">{activity.action}</div>
                    <div className="text-sm text-slate-500">{activity.station} • {activity.time}</div>
                  </div>
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${activity.status === 'success' ? 'bg-green-100 text-green-700' : ''}
                    ${activity.status === 'warning' ? 'bg-amber-100 text-amber-700' : ''}
                    ${activity.status === 'info' ? 'bg-blue-100 text-blue-700' : ''}
                  `}>
                    {activity.status === 'success' && 'Completed'}
                    {activity.status === 'warning' && 'Needs Attention'}
                    {activity.status === 'info' && 'In Progress'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};