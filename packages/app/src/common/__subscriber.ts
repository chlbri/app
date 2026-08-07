import type { EventObject } from '#events';
import type { State } from '#states';
import { nothing } from '#utils';
import { _any } from '@bemedev/app-utils-bemedev';
import type { TimerState } from '@bemedev/interval2/types';
import equal from 'fast-deep-equal';
import { FnMapR, isFunction } from '../types/primitives';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Subscriber class that manages the subscription state and provides methods
 * to handle state changes and unsubscribe.
 *
 * @template : {@linkcode PrimitiveObject} [Tc] - Type of the context
 * @template : [R] - Type of the return value
 *
 */
class SubscriberClass<
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  St extends State<Eo, Tc, T> = State<Eo, Tc, T>,
> {
  #subscriber: FnMapR<Eo, Tc, T, void>;
  #events: string[];

  #state: TimerState = 'idle';

  /**
   * Function to compare two {@linkcode State}s for equality.
   * @param previous of type {@linkcode State} - First state to compare
   * @param next of type {@linkcode State} - Second state to compare
   */
  #equals: (previous: St, next: St) => boolean;

  get id() {
    return this._id;
  }

  /**
   * Creates an instance of SubscriberMapClass.
   * @param subscriber - The {@linkcode FnSubReduced} subscriber function or object.
   * @param equals - Function to compare two {@linkcode State}s for equality (optional).
   * @param _id - Unique identifier for the subscriber (optional).
   * @param events - The events list.
   */
  constructor(
    subscriber: FnMapR<Eo, Tc, T, void>,
    equals: (a: St, b: St) => boolean = equal,
    private _id?: string,
    events: string[] = [],
  ) {
    this.#subscriber = subscriber;
    this.#events = events;
    this.#equals = equals;

    this.#state = 'active';
  }

  /**
   * Function that returns a reduced function based on the subscriber's logic.
   * @returns A function that reduces the state based on the subscriber's logic.
   *
   * @see {@linkcode isFunction} to check if the subscriber is a function.
   * @see {@linkcode nothing} to provide a default action if no event matches.
   */
  get #reduceFn() {
    const sub = this.#subscriber;
    const check1 = isFunction(sub);
    if (check1) return _any(sub);

    const keys = this.#events;

    return ({ event, ...rest }: St) => {
      const _else = sub.else ?? nothing;
      const { type, payload } = event;

      for (const key of keys) {
        const check2 = type === key;
        const func = _any(sub)[key];
        const check3 = !!func;

        const check4 = check2 && check3;
        if (check4) return func({ payload, ...rest });
      }

      return _any(_else({ event, ...rest }));
    };
  }

  get #cannotPerform() {
    return !(this.#state === 'active');
  }

  /**
   * Function to handle state changes.
   * @param previous of type {@linkcode State} - Previous state
   * @param next of type {@linkcode State} - Next state
   *
   * @remarks
   * This function checks if the subscriber can perform its action,
   * compares the previous and next states using the provided equality function,
   * and if they are not equal, it calls the subscriber with the next state.
   */
  fn = (previous: St, next: St) => {
    if (this.#cannotPerform) return;

    const _equals = this.#equals(previous, next);
    if (_equals) return;

    return this.#reduceFn(next);
  };

  get state() {
    return this.#state;
  }

  close = () => {
    if (this.state !== 'disposed') this.#state = 'paused';
  };

  open = () => {
    if (this.state !== 'disposed') this.#state = 'active';
  };

  unsubscribe = () => {
    this.close();
    this.#state = 'disposed';
  };
}

export type { SubscriberClass };

export type SubscriberOptions<
  E extends EventObject = EventObject,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  id?: string;
  equals?: (a: State<E, Tc, T>, b: State<E, Tc, T>) => boolean;
};

export type CreateSubscriber_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  const Eo extends EventObject = EventObject,
>(
  subscriber: FnMapR<Eo, Tc, T, void>,
  options?: SubscriberOptions<Eo, Tc, T>,
  ...events: string[]
) => SubscriberClass<Tc, T, Eo>;

/**
 * Creates a new instance of SubscriberMapClass.
 *
 * @param subscriber - The subscriber function that will be called with the {@linkcode State}.
 * @param options - Optional parameters for the subscriber, including equality function and ID.
 * @param events - List of events of the machine.
 * @returns A new instance of {@linkcode SubscriberClass} that manages the subscription state and provides methods to handle state changes and unsubscribe.
 */
export const createSubscriber: CreateSubscriber_F = (
  subscriber,
  options,
  ...events
) => {
  return new SubscriberClass(
    subscriber,
    options?.equals,
    options?.id,
    events,
  );
};
