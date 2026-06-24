'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderContextType {
  theme?: string;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
}

const ThemeProviderContext = React.createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  attribute = 'class',
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  attribute?: string;
  [key: string]: any;
}) {
  const [theme, setThemeState] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<string>(theme);

  const setTheme = React.useCallback((newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let finalTheme = theme;
    if (theme === 'system') {
      finalTheme = 'dark';
    }

    setResolvedTheme(finalTheme);
    root.classList.add(finalTheme);
  }, [theme]);

  // Sync initial theme on load to avoid hydration mismatches
  React.useEffect(() => {
    const root = window.document.documentElement;
    const localTheme = localStorage.getItem('theme') || defaultTheme;
    let finalTheme = localTheme;
    if (localTheme === 'system') {
      finalTheme = 'dark';
    }
    root.classList.remove('light', 'dark');
    root.classList.add(finalTheme);
  }, [defaultTheme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);
  if (!context) {
    return {
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: () => {},
    };
  }
  return context;
}
