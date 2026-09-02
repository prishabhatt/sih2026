import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = 'inline-flex items-center font-bold rounded-full tracking-wide transition-all shadow-xs';
  
  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-xs px-3.5 py-1.5'
  };

  const variants = {
    default: 'glass-pill-container text-slate-700 dark:text-slate-300',
    primary: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
    qco: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    scheme1: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20',
    scheme2: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20',
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    success: 'bg-emerald-600 text-white shadow-sm'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
