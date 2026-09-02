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
    primary: 'bg-[#292524]/10 text-[#292524] dark:text-[#A8A29E] border border-[#292524]/20',
    qco: 'bg-[#059669]/10 text-emerald-700 dark:text-emerald-300 border border-[#059669]/20',
    scheme1: 'bg-[#1C1917]/10 text-[#1C1917] dark:text-[#A8A29E] border border-[#1C1917]/20',
    scheme2: 'bg-[#292524]/15 text-[#292524] dark:text-[#A8A29E] border border-[#292524]/30',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20',
    active: 'bg-[#059669]/15 text-emerald-700 dark:text-emerald-300 border border-[#059669]/30',
    success: 'bg-emerald-600 text-white shadow-sm'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
