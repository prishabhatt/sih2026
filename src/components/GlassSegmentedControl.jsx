import React from 'react';

/**
 * GlassSegmentedControl
 * Inspired by VisionOS / iOS 18 liquid glass pill segmented controls (as in reference image).
 * 
 * @param {Array} options - Array of objects or strings: [{ id: 'opt1', label: 'Option 1', badge?: string }]
 * @param {string} value - Currently active option id
 * @param {function} onChange - Callback on selection change: (id) => void
 * @param {string} className - Optional container styling classes
 */
export function GlassSegmentedControl({
  options = [],
  value,
  onChange,
  className = '',
  size = 'md'
}) {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3.5',
    md: 'text-xs sm:text-sm py-2 px-4 sm:px-5',
    lg: 'text-sm py-2.5 px-6',
  }[size] || 'text-xs sm:text-sm py-2 px-4 sm:px-5';

  return (
    <div
      className={`inline-flex items-center p-1.5 rounded-full glass-pill-container transition-all relative ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const optionId = typeof opt === 'string' ? opt : opt.id || opt.code;
        const optionLabel = typeof opt === 'string' ? opt : opt.label || opt.name || opt.shortName || opt.id;
        const optionBadge = typeof opt === 'object' ? opt.badge : null;
        const isSelected = value === optionId;

        return (
          <button
            key={optionId}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange && onChange(optionId)}
            className={`relative z-10 font-semibold rounded-full transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer select-none ${sizeClasses} ${
              isSelected
                ? 'glass-pill-active text-slate-900 dark:text-white font-bold scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/[0.04]'
            }`}
          >
            <span>{optionLabel}</span>
            {optionBadge && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-[#292524]/10 text-[#292524] dark:bg-[#292524]/25 dark:text-[#A8A29E]'
                    : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {optionBadge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default GlassSegmentedControl;
