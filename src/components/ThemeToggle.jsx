import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme';

export default function ThemeToggle({ variant = 'plain' }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
  const Icon = theme === 'dark' ? Sun : Moon;
  return <button type="button" className={`theme-toggle theme-toggle--${variant}`} onClick={toggleTheme}
    aria-label={label} title={label} aria-pressed={theme === 'dark'}>
    <Icon size={28} aria-hidden="true" />
  </button>;
}
