/**
 * Status badge component for displaying various states
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'soft';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  icon: Icon,
  size = 'md',
  variant = 'soft',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-bold uppercase tracking-wide';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
    lg: 'px-3 py-1.5 text-sm rounded-xl gap-2'
  };
  
  const statusClasses = {
    filled: {
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-500 text-white',
      danger: 'bg-red-600 text-white',
      info: 'bg-blue-600 text-white',
      neutral: 'bg-slate-600 text-white'
    },
    outline: {
      success: 'border-2 border-green-600 text-green-700 bg-white',
      warning: 'border-2 border-yellow-500 text-yellow-700 bg-white',
      danger: 'border-2 border-red-600 text-red-700 bg-white',
      info: 'border-2 border-blue-600 text-blue-700 bg-white',
      neutral: 'border-2 border-slate-600 text-slate-700 bg-white'
    },
    soft: {
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      neutral: 'bg-slate-100 text-slate-600'
    }
  };
  
  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${statusClasses[variant][status]} ${className}`;
  
  return (
    <span className={combinedClasses}>
      {Icon && <Icon size={iconSize} />}
      {children}
    </span>
  );
};