import type { Fn } from './libs/bemedev/globals/types';

export type { Fn, NotUndefined } from './libs/bemedev/globals/types';

/**
 * Callback function type with no arguments returning any result.
 */
export type Cb = Fn<[], void>;

/**
 * Function computing the delay, in milliseconds, between two passes.
 *
 * It takes no parameter and is invoked again on every pass, so the delay can
 * adapt to a changing environment.
 *
 * @returns The next delay in milliseconds of type `number`.
 */
export type IntervalFn = Fn<[], number>;

/**
 * Common parameters shared by all timers.
 */
export type CommonTimerParams = {
  /** Unique string identifier for the timer. */
  id: string;
  /** Execution callback function of type {@linkcode Cb}. */
  callback: Cb;
};

/**
 * Listener function to determine if the interval should pause based on state
 * and tick count.
 *
 * @param state - Current timer state of type {@linkcode TimerState}.
 * @param ticks - Current tick count.
 *
 * @returns Boolean indicating whether the interval should pause.
 */
export type PauserListener = (state: TimerState, ticks: number) => boolean;

/**
 * Configuration parameters for creating an interval timer.
 */
export type IntervalParams = CommonTimerParams & {
  /** Delay computer of type {@linkcode IntervalFn}, invoked on every pass. */
  interval: IntervalFn;
  /** Maximum tick count before automatic pause, defaults to 10000. */
  maxTicks?: number;
  /** Custom pauser predicate function of type {@linkcode PauserListener}. */
  pauser?: PauserListener;
};

/**
 * Represents the lifecycle state of a timer instance.
 */
export type TimerState = 'idle' | 'active' | 'paused' | 'disposed';

/**
 * Listener callback signature for interval state changes.
 *
 * @param state - Current interval state of type {@linkcode TimerState}.
 * @param ticks - Current tick count of interval execution.
 */
export type IntervalListener = (state: TimerState, ticks: number) => any;

/**
 * Configuration parameters for renewing an interval instance based on type
 * {@linkcode IntervalParams}.
 */
export type RenewIntervalParams = Pick<IntervalParams, 'id'> &
  Partial<Omit<IntervalParams, 'id'>>;
