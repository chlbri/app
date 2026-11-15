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
 * Unlike a native `setInterval`, no handle is scheduled once and for all: a
 * single timeout is armed per pass. The delay computer of type
 * {@linkcode IntervalFn} is invoked again after every callback, before arming
 * the next pass. Inherits from abstract class {@linkcode Timer3}.
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
      this.__schedule();
    }
    return this.state;
  };

  /**
   * Pending timeout handle, `undefined` while no pass is scheduled.
   */
  private __timer?: ReturnType<typeof setTimeout>;

  /**
   * Schedules the next pass by computing the delay and arming a single
   * timeout.
   *
   * A pass is never armed twice: the next one is scheduled from
   * {@linkcode Interval3.__cb} once the previous one has been consumed.
   *
   * @returns Current timer state of type {@linkcode Timer3.state}.
   */
  private __schedule = () => {
    const interval = this.__interval();
    const state = this.state;
    const ticks = this.__ticks;
    const pausered = this.__pauser?.({ state, ticks, interval });
    if (pausered) return this.pause();

    this.__timer = setTimeout(this.__cb, interval);
    return this.state;
  };

  /**
   * Consumes the scheduled pass: performs the callback, increments the tick
   * count, notifies subscribers and chains the next pass.
   *
   * @returns Current timer state of type {@linkcode Timer3.state}.
   */
  private __cb = () => {
    if (this.state !== 'active') return this.pause();

    this.callback();
    this.__ticks++;
    if (this.__ticks >= this.__maxTicks) return this.pause();

    this.__notifySubscribers();
    return this.__schedule();
  };

  /**
   * Pauses the currently running interval timer.
   *
   * The pass already scheduled is cancelled and no callback is performed for
   * it.
   *
   * @returns Current timer state of type {@linkcode Timer3.state}.
   */
  pause = () => {
    clearTimeout(this.__timer);
    if (this.state !== 'active') return this.state;

    return (this.state = 'paused');
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
