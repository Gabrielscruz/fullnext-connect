'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

type themeProps = 'fullnest-dark' | 'fullnest-light';

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextProps {
  theme: themeProps;
  setTheme: (theme: themeProps) => void;
  handleTheme: (theme: themeProps) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const getPreferredTheme = (): themeProps => {
    if (typeof window !== 'undefined') {
      const cookies = parseCookies();
      const cookieTheme = cookies['Theme_fullnext'] as themeProps;

      if (cookieTheme) return cookieTheme;

      const localStorageTheme = localStorage.getItem('Theme_fullnext')?.replaceAll('"', '') as themeProps;
      if (localStorageTheme) return localStorageTheme;

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'fullnest-dark' : 'fullnest-light';

      setCookie(null, 'Theme_fullnext', systemTheme, {
        path: '/',
        maxAge: 31536000, // 1 ano
      });

      return systemTheme;
    }
    return 'fullnest-light';
  };

  const [theme, setTheme] = useState<themeProps>('fullnest-light');

  useEffect(() => {
    setTheme(getPreferredTheme());
  }, []);

  const handleTheme = (newTheme: themeProps) => {
    localStorage.setItem('Theme_fullnext', JSON.stringify(newTheme));

    setCookie(null, 'Theme_fullnext', newTheme, {
      path: '/',
      maxAge: 31536000, // 1 ano
    });

    setTheme(newTheme);
  };

  useEffect(() => {
    const root = document?.documentElement;
    root.style.setProperty('--container', theme === 'fullnest-light' ? '#FFFFFF' : '#121214');
    root.style.setProperty('--text', theme === 'fullnest-light' ? '#1d232A' : '#FFFFFF');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, handleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextProps => {
  return useContext(ThemeContext);
};
