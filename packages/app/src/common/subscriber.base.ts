import { deepEqual, identity } from '#utils';
import { type Fn } from '../bemedev';

/**
 * Function signature for a selector function mapping state of type `T` to selected value `R`.
 *
 * @template T - Type of input state.
 * @template R - Type of selected value.
 *
 * @param val - Input state value of type `T`.
 *
 * @returns Selected value of type `R`.
 *
 * @see -- type {@linkcode Fn}
 */
export type Selector_F<T, R = any> = Fn<[T], R>;

/**
 * Represents the lifecycle state of a subscriber node.
 */
export type SubscriberState = 'paused' | 'active' | 'disposed' | 'inactive';

/**
 * Function signature for a subscriber callback receiving state updates of type `T`.
 *
 * @template T - Type of data passed to the subscriber.
 *
 * @see -- type {@linkcode Fn}
 */
export type Subscriber_F<T> = Fn<[T], void>;

/**
 * Function signature for comparing two values of type `T` for equality.
 *
 * @template T - Type of values compared.
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 *
 * @returns type {@linkcode boolean} indicating whether `a` and `b` are equal.
 *
 * @see -- type {@linkcode Fn}
 */
export type Equals_F<T> = Fn<[T, T], boolean>;

/**
 * Base class representing an active subscriber node that manages subscription state,
 * equality checking, child subscriber notifications, and explicit disposal.
 *
 * Serves as the common parent class for class {@linkcode SubscriberClass} and class {@linkcode ManagedSubscriberClass}.
 *
 * @template T - Type of data emitted by the source.
 * @template R - Type of selected value derived from state, defaulting to `T`.
 */
export class SubscriberBase<T, R = T> implements Disposable, AsyncDisposable {
  /**
   * Current lifecycle state of the subscriber of type {@linkcode SubscriberState}.
   */
  protected __state: SubscriberState = 'active';

  /**
   * Getter for the equality comparator function.
   *
   * @returns type {@linkcode Equals_F} comparator function or `undefined` if disposed.
   */
  // get equals(): Equals_F<R> {
  //   return this.__equals;
  // }

  /**
   * Getter for the selector function.
   *
   * @returns type {@linkcode Selector_F} selector function or `undefined`.
   */
  // get selector(): Selector_F<T, R> | undefined {
  //   return this._selector;
  // }

  /**
   * Previous value processed by the subscriber.
   */
  protected __previousValue?: T;

  /**
   * Current value processed by the subscriber.
   */
  protected __currenValue!: T;

  /**
   * Creates an active instance of class {@linkcode SubscriberBase}.
   *
   * @param _subscriber - Subscriber callback function of type {@linkcode Subscriber_F}.
   * @param _selector - Optional selector function of type {@linkcode Selector_F}.
   * @param __equals - Optional equality comparator function of type {@linkcode Equals_F}.
   *
   * @see {@linkcode normalEquals}
   */
  constructor(
    protected _subscriber: Subscriber_F<T>,
    protected _selector: Selector_F<T, R> = identity,
    protected __equals: Equals_F<R> = deepEqual,
    private __firstTime = true,
  ) {}

  /**
   * Protected getter indicating whether the subscriber is prevented from performing actions.
   *
   * @returns type {@linkcode boolean} indicating if state is not `'active'`.
   */
  protected get __cannotPerform() {
    return !(this.__state === 'active');
  }

  /**
   * Function handling state changes and notifying subscribers if states differ.
   * This will be called by the source subscribable or manually by managed subscribers.
   *
   * @param currenValue - Next state value.
   */
  fn: Fn<[T], void> = currenValue => {
    this.__previousValue = this.__currenValue ?? currenValue;
    this.__currenValue = currenValue;
    if (this.__firstTime) {
      this.__firstTime = false;
      return this._subscriber(this.__currenValue);
    }
    if (this.__cannotPerform) return;

    const _equals = this.__equals(
      this._selector(this.__previousValue),
      this._selector(this.__currenValue),
    );

    if (_equals) return;
    return this._subscriber(this.__currenValue);
  };

  /**
   * Getter for the current subscriber state.
   *
   * @returns type {@linkcode SubscriberState} current lifecycle state.
   */
  get state() {
    return this.__state;
  }

  /**
   * Getter checking if subscriber is not disposed or inactive.
   *
   * @returns type {@linkcode boolean} indicating if state is not `'disposed'` or `'inactive'`.
   */
  get isNotInactive() {
    return this.state !== 'disposed' && this.state !== 'inactive';
  }

  /**
   * Pauses the subscriber by transitioning state to `'paused'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  close = (): SubscriberState => {
    if (this.isNotInactive) {
      this.__previousValue = this.__currenValue;
      return (this.__state = 'paused');
    }
    return this.__state;
  };

  /**
   * Activates the subscriber by transitioning state to `'active'`.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  open = (): SubscriberState => {
    if (this.__state === 'paused') {
      if (this.__previousValue !== this.__currenValue) {
        this._subscriber(this.__currenValue);
      }
      return (this.__state = 'active');
    }
    return this.__state;
  };

  /**
   * Internal implementation for unsubscribing.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  protected _unsubscribe = (): SubscriberState => {
    this.close();
    this.__state = 'inactive';
    return this.__state;
  };

  /**
   * Unsubscribes the subscriber from the source.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  unsubscribe = this._unsubscribe;

  /**
   * Internal implementation for disposing subscriber resources.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  protected _dispose = (): SubscriberState => {
    this._unsubscribe();
    (this._subscriber as any) = undefined;
    (this.__equals as any) = undefined;
    (this._selector as any) = undefined;
    return (this.__state = 'disposed');
  };

  /**
   * Disposes the subscriber and releases its resources.
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  dispose = this._dispose;

  /**
   * Resource management disposal handler (`Symbol.dispose`).
   *
   * @returns type {@linkcode SubscriberState} updated state.
   */
  [Symbol.dispose] = this._dispose;

  /**
   * Asynchronous resource management disposal handler (`Symbol.asyncDispose`).
   *
   * @returns type {@linkcode Promise} resolving to type {@linkcode SubscriberState}.
   */
  [Symbol.asyncDispose] = async () => {
    this[Symbol.dispose]();
  };
}
