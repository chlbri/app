/**
 * Core interval creation functions and type exports.
 */
export { create, createInterval, createInterval3, type Interval3 } from './interval';

/**
 * Interval related type exports.
 */
export type {
  Cb,
  CommonTimerParams,
  IntervalFn,
  IntervalListener,
  IntervalParams,
  PauserListener,
  RenewIntervalParams,
  TimerState,
} from './types.types';

/**
 * Abstract base class for timers.
 */
export { Timer3 } from './timer';
