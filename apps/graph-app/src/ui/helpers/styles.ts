import type { CSSProperties } from 'react';

export const calculateHandlePosition = (index: number, length: number) => {
  const step = 100 / (length + 1);
  const position = step * (index + 1);
  return `${position}%`;
};

export const sizeHandle = (size: number) => {
  const padding = -(size / 2) - 0.5;
  const css: CSSProperties = { width: size, height: size };
  return [css, padding] as const;
};
