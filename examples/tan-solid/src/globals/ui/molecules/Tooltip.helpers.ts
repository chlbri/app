import type { Position } from './Tooltip.types';

export const getPositionClass = (
  position: Position = 'top',
  computedPosition?: 'top' | 'bottom',
) => {
  const positions: Record<Position, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2',
    'top-left': 'bottom-full right-0 -translate-y-2',
    'top-right': 'bottom-full left-0 -translate-y-2',
    'bottom-left': 'top-full right-0 translate-y-2',
    'bottom-right': 'top-full left-0 translate-y-2',
    'viewport-relative':
      computedPosition === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 translate-y-2'
        : 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
  };

  return positions[position];
};
