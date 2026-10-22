import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';

const storageKey = 'novicovs-theme';
const ThemeContext = createContext(null);
const isTheme = value => value === 'light' || value === 'dark';

function initialTheme() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (isTheme(saved)) return saved;
  } catch { /* Theme switching also works when browser storage is unavailable. */ }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem(storageKey, theme); } catch { /* Optional persistence. */ }
  }, [theme]);
  useEffect(() => {
    const sync = event => {
      if (event.key === storageKey && (isTheme(event.newValue) || event.newValue === null)) {
        setTheme(event.newValue || 'light');
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggleTheme = useCallback(() => setTheme(current => current === 'dark' ? 'light' : 'dark'), []);
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeProvider is required');
  return context;
}
