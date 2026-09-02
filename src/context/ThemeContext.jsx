import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('bis_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  const applyTheme = (currentTheme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (currentTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      body.classList.add('dark', 'bg-[#0E121B]', 'text-[#E8E6E3]');
      body.classList.remove('bg-[#F7F6F3]', 'bg-[#F1F5F9]', 'text-[#1A1A1A]', 'text-slate-900', 'bg-slate-50', 'bg-[#090D16]');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      body.classList.remove('dark', 'bg-[#0E121B]', 'bg-[#090A0F]', 'bg-[#090D16]', 'text-[#E8E6E3]', 'text-slate-100');
      body.classList.add('bg-[#F7F6F3]', 'text-[#1A1A1A]');
    }

    try {
      localStorage.setItem('bis_theme', currentTheme);
    } catch (e) {}
  };

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  };

  const setLightTheme = () => {
    setTheme('light');
    applyTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
    applyTheme('dark');
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        toggleTheme, 
        setLightTheme, 
        setDarkTheme, 
        isDark: theme === 'dark' 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
