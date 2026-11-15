import { sleep } from '@bemedev/sleep';
import { Timer3 } from './timer';
import type {
  IntervalFn,
  IntervalListener,
  IntervalParams,
  PauserListener,
  RenewIntervalParams,
} from './types.types';

/**
 * Class representing a cancellable interval whose delay is recomputed on
 * every pass.
 *
 * Unlike a native `setInterval`, no handle is scheduled once and for all:
 * a `while` loop awaits type {@linkcode IntervalFn} result before invoking the
 * callback, then starts the next pass. Inherits from abstract class
 * {@linkcode Timer3}.
 */
class Interval3 extends Timer3<IntervalListener> {
  /**
   * Delay computer of type {@linkcode IntervalFn}, invoked on every pass.
   */
  private __interval: IntervalFn;

  /**
   * Counter tracking executed tick count.
   */
  private __ticks = 0;

  /**
   * Maximum tick count allowed before auto-pausing.
   */
  private __maxTicks: number;

  /**
   * Optional custom pauser listener of type {@linkcode PauserListener}.
   */
  private __pauser?: PauserListener;

  /**
   * Private constructor initializing a new instance of class
   * {@linkcode Interval3}.
   *
   * @param params - Interval parameters of type {@linkcode IntervalParams}.
   * @param params.callback - Callback function of type
   * {@linkcode IntervalParams.callback}.
   * @param params.id - Unique string identifier.
   * @param params.interval - Delay computer of type {@linkcode IntervalFn}.
   * @param params.maxTicks - Maximum tick limit before pausing.
   * @param params.pauser - Custom pauser predicate function.
   */
  private constructor({
    callback,
    id,
    interval,
    maxTicks = 10_000,
    pauser,
  }: IntervalParams) {
    super(callback, id);
    this.__interval = interval;
    this.__maxTicks = Math.max(1, maxTicks);
    this.__pauser = pauser;
  }

  /**
   * Static factory method to instantiate a new class {@linkcode Interval3}
   * instance.
   *
   * @param config - Interval parameters of type {@linkcode IntervalParams}.
   * @returns A new instance of class {@linkcode Interval3}.
   */
  static create = (config: IntervalParams) => new Interval3(config);

  /**
   * Gets the current tick count.
   *
   * @returns Current tick count.
   */
  get ticks() {
    return this.__ticks;
  }

  /**
   * Gets the delay computer invoked on every pass.
   *
   * @returns Delay computer of type {@linkcode IntervalFn}.
   */
  get interval() {
    return this.__interval;
  }

  /**
   * Gets the maximum ticks configuration value.
   *
   * @returns Maximum tick count allowed before auto-pausing.
   */
  get maxTicks() {
    return this.__maxTicks;
  }

  /**
   * Gets the custom pauser listener function if defined.
   *
   * @returns Custom pauser function of type {@linkcode PauserListener} or
   * `undefined`.
   */
  get pauser() {
    return this.__pauser;
  }

  /**
   * Renews the interval instance with updated parameters.
   *
   * @param params - Renew parameters of type {@linkcode RenewIntervalParams}.
   * @returns A new instance of class {@linkcode Interval3}.
   */
  renew = ({
    id,
    callback = this.callback,
    interval = this.__interval,
    maxTicks = this.__maxTicks,
    pauser = this.__pauser,
  }: RenewIntervalParams) =>
    new Interval3({ id, callback, interval, maxTicks, pauser });

  /**
   * Notifies subscribers of state changes and current ticks.
   */
  protected __notifySubscribers = () => {
    return this.__subscribers.forEach(listener =>
      listener(this.state, this.__ticks),
    );
  };

  /**
   * Starts or resumes the interval timer.
   *
   * @returns Current timer state of type {@linkcode Timer3.state}.
   */
  start = () => {
    if (this.__canStart) {
      this.state = 'active';
      void this.__build();
    }
    return this.state;
  };

  /**
   * Internal loop awaiting the delay computer result before each callback.
   */
  private __build = async () => {
    while (this.state === 'active') {
      const interval = this.__interval();
      await sleep(interval);
      if (this.state !== 'active') return;

      this.callback();
      this.__ticks++;

      const paused = this.__pauser?.(this.state, this.__ticks);
      if (paused === true || this.__ticks >= this.__maxTicks) {
        this.pause();
        return;
      }
      this.__notifySubscribers();
    }
  };

  /**
   * Pauses the currently running interval timer.
   *
   * The pass already sleeping is not interrupted: it is discarded as soon as
   * it wakes up.
   *
   * @returns Current timer state of type {@linkcode Timer3.state}.
   */
  pause = () => {
    if (this.state !== 'active') return this.state;
    this.state = 'paused';
    return this.state;
  };
}

/**
 * Type alias for class {@linkcode Interval3}.
 */
export type { Interval3 };

/**
 * Creates a new instance of class {@linkcode Interval3}.
 *
 * @param config - Configuration parameters of type {@linkcode IntervalParams}.
 * @returns A new instance of class {@linkcode Interval3}.
 */
export const createInterval3 = Interval3.create;

/**
 * Alias for {@linkcode createInterval3}.
 */
export const create = createInterval3;

/**
 * Alias for {@linkcode createInterval3}.
 */
export const createInterval = createInterval3;
