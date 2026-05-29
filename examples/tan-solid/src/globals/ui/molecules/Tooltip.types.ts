import type { JSX } from 'solid-js';
import type { POSITIONS } from './Tooltip.constants';
import type { OmitPropsOf } from '../types';

export type Position = (typeof POSITIONS)[number];

export type ToolTipProps = {
  tooltip: JSX.Element;
  showDelay?: number;
  hideDelay?: number;
  position?: Position;
} & OmitPropsOf<'div'>;
