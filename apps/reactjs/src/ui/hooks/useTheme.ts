import { useEffect, useState } from 'react';

export const MAPPER = {
  auto: 'auto  ❤️',
  dark: 'dark  🌙',
  light: 'light  ☀️',
} as const;

export type ThemeMode = keyof typeof MAPPER;

export const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'auto';
  const stored = window.localStorage.getItem('theme');

  const check =
    stored === 'light' || stored === 'dark' || stored === 'auto';

  if (check) return stored;
  return 'auto';
};

export const applyThemeMode = (mode: ThemeMode): void => {
  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  const resolved =
    mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;

  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolved);

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }

  document.documentElement.style.colorScheme = resolved;
};

export const useTheme = (initialMode: ThemeMode = 'auto') => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    const currentMode = getInitialMode();
    setMode(currentMode);
    applyThemeMode(currentMode);
  }, []);

  const mediaListener = () => applyThemeMode('auto');
  useEffect(() => {
    if (mode !== 'auto') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', mediaListener);

    return () => {
      media.removeEventListener('change', mediaListener);
    };
  }, [mode]);

  const toggleMode = () => {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light';

    setMode(nextMode);
    applyThemeMode(nextMode);
    window.localStorage.setItem('theme', nextMode);
  };

  return { mode, toggleMode };
};
