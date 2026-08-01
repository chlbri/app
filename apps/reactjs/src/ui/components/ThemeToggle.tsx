import type { FC } from 'react';

import { MAPPER, useTheme, type ThemeMode } from '../hooks';

export { MAPPER, type ThemeMode };

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useTheme();
  const text = MAPPER[mode];

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`;

  return (
    <button
      type='button'
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className='w-20 cursor-pointer rounded-full border border-slate-200 bg-white/50 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:scale-105 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100'
    >
      {text}
    </button>
  );
};
