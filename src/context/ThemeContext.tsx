import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'Светлая',
  toggleTheme: () => {},
  setTheme: (theme: string) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<'Светлая' | 'Тёмная'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'Тёмная' || saved === 'Светлая') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'Тёмная';
    }
    return 'Светлая';
  });

  useEffect(() => {
    if (theme === 'Тёмная') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'Тёмная' ? 'Светлая' : 'Тёмная'));
  };

  const setTheme = (t: string) => {
    if (t === 'Тёмная' || t === 'Светлая') setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 