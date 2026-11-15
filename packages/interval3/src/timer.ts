import type { Cb, TimerState } from './types.types';

/**
 * Abstract base class providing common state management and disposal
 * functionality for timers.
 *
 * @template T - Subscriber listener type.
 */
export abstract class Timer3<T> {
  /**
   * Internal timer state value of type {@linkcode TimerState}.
   */
  private __stateValue: TimerState = 'idle';

  /**
   * Set of subscribed listeners of type `T`.
   */
  protected __subscribers = new Set<T>();

  /**
   * Constructs a new instance of abstract class {@linkcode Timer3}.
   *
   * @param callback - Execution callback function of type {@linkcode Cb}.
   * @param id - Unique timer string identifier.
   */
  protected constructor(
    public readonly callback: Cb,
    public readonly id: string,
  ) {}

  /**
   * Evaluates if the timer can transition to active state.
   *
   * @returns `true` if state is `'idle'` or `'paused'`, otherwise `false`.
   */
  protected get __canStart(): boolean {
    return this.__stateValue === 'idle' || this.__stateValue === 'paused';
  }

  /**
   * Current lifecycle state of the timer of type {@linkcode TimerState}.
   *
   * @returns Current timer state of type {@linkcode TimerState}.
   */
  get state(): TimerState {
    return this.__stateValue;
  }

  /**
   * Internal state setter that triggers subscriber notifications on change.
   *
   * @param nextState - Target timer state of type {@linkcode TimerState}.
   */
  protected set state(nextState: TimerState) {
    /* v8 ignore else */
    if (this.__stateValue !== nextState) {
      this.__stateValue = nextState;
      this.__notifySubscribers();
    }
  }

  /**
   * Abstract notification handler invoked when timer state or tick counts
   * change.
   */
  protected abstract __notifySubscribers: () => any;

  /**
   * Subscribes a listener callback to handle state changes.
   *
   * @param listener - Listener function of type `T`.
   * @returns Unsubscribe cleanup function.
   */
  subscribe = (listener: T) => {
    this.__subscribers.add(listener);
    return () => this.__subscribers.delete(listener);
  };

  /**
   * Starts the timer lifecycle.
   *
   * @returns Current state of type {@linkcode TimerState}.
   */
  abstract start: () => TimerState;

  /**
   * Pauses the timer lifecycle.
   *
   * @returns Current state of type {@linkcode TimerState}.
   */
  abstract pause: () => TimerState;

  /**
   * Resumes the timer lifecycle by invoking {@linkcode Timer3.start}.
   *
   * @returns Current state of type {@linkcode TimerState}.
   */
  resume = () => this.start();

  /**
   * Returns true if the timer has any active subscribers.
   *
   * @returns `true` if active subscribers exist, otherwise `false`.
   */
  get subscribed() {
    return this.__subscribers.size > 0;
  }

  /**
   * Disposes the timer by resetting its state and clearing subscribers.
   */
  dispose = () => {
    this.state = 'disposed';
    this.__subscribers.clear();
  };

  /**
   * Synchronous dispose symbol implementation referencing
   * {@linkcode Timer3.dispose}.
   */
  [Symbol.dispose] = this.dispose;

  /**
   * Asynchronous dispose symbol implementation referencing
   * {@linkcode Timer3.dispose}.
   */
  [Symbol.asyncDispose] = async () => {
    return this[Symbol.dispose]();
  };
}
