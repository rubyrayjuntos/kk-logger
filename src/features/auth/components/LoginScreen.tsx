/**
 * Login screen component
 */

import React, { useState } from 'react';
import { AlertTriangle, ClipboardList, Lock, Globe } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import type { LoginScreenProps } from '../types';
import { TRANSLATIONS } from '../../../localization/translations';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login({ username, password });
    if (success) {
      // Get the logged in user and pass to parent
      const user = JSON.parse(localStorage.getItem('kk_user_session') || '{}').data;
      onLogin(user);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    clearError();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
        className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-colors"
        aria-label="Toggle Language"
      >
        <Globe size={24} />
      </button>

      <div className="max-w-sm w-full bg-white rounded-[2.5rem] shadow-xl p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-200">
            <ClipboardList className="text-white" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{t.appTitle}</h1>
          <p className="text-slate-500 font-medium">{t.appSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.username}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={handleInputChange(setUsername)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Enter username"
                disabled={isLoading}
                autoComplete="username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={handleInputChange(setPassword)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Enter password"
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || !username || !password}
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              t.loginBtn
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">{t.demoCredentials}</p>
          <div className="flex justify-center gap-4 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => { setUsername('maria'); setPassword('pass'); }}
              className="bg-slate-100 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              disabled={isLoading}
            >
              maria / pass
            </button>
            <button
              type="button"
              onClick={() => { setUsername('sarah'); setPassword('pass'); }}
              className="bg-slate-100 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
              disabled={isLoading}
            >
              sarah / pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};