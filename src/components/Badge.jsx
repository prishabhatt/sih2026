import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = 'inline-flex items-center font-medium rounded-md tracking-wide transition-colors';
  
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1 font-semibold'
  };

  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/80',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium',
    qco: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold',
    scheme1: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium',
    scheme2: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    success: 'bg-emerald-600 text-white'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
