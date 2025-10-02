import React, { createContext, useState, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  preference: 'system',
  setPreference: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    const savedPref = localStorage.getItem('theme-preference');
    if (savedPref === 'light' || savedPref === 'dark' || savedPref === 'system') {
      return savedPref as ThemePreference;
    }
    return 'system';
  });
  
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const applyTheme = (pref: ThemePreference) => {
      if (pref === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      } else {
        setTheme(pref);
      }
    };

    applyTheme(preference);
    localStorage.setItem('theme-preference', preference);
    localStorage.removeItem('theme'); // Clean up old key

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme-preference') === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  useEffect(() => {
      const root = window.document.documentElement;
      if (theme === 'dark') {
          root.classList.add('dark');
      } else {
          root.classList.remove('dark');
      }
  }, [theme]);

  const themeContextValue = useMemo(() => ({
    theme,
    preference,
    setPreference,
  }), [theme, preference]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
