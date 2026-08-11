import type { EventObject } from '#events';
import type { State } from '#states';
import { nothing } from '#utils';
import { _any } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import equal from 'fast-deep-equal';
import { FnMapR, isFunction } from '../types/primitives';
import { SubscriberBase } from './subscriber.base';

/**
 * Subscriber class that manages the subscription state and provides methods
 * to handle state changes and unsubscribe.
 *
 * @template {PrimitiveObject} Tc - Type of the context
 * @template {string} T - State path string type
 * @template {EventObject} Eo - Event object type
 */
class Subscriber<
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
> extends SubscriberBase<State<Eo, Tc, T>> {
  /**
   * Subscriber identifier getter.
   */
  get id() {
    return this._id;
  }

  /**
   * Creates an instance of type {@linkcode Subscriber}.
   * @param _subscriber - Subscriber function or object map.
   * @param equals - Function to compare two state instances for equality.
   * @param _id - Unique identifier for the subscriber.
   * @param events - The events list.
   * @param firstTime - Initial trigger execution flag.
   */
  constructor(
    _subscriber: FnMapR<Eo, Tc, T, void>,
    equals: (a: State<Eo, Tc, T>, b: State<Eo, Tc, T>) => boolean = equal,
    private _id?: string,
    events: string[] = [],
    public firstTime?: boolean,
  ) {
    const subscriber = Subscriber.transformSub(_subscriber, events);
    super(subscriber, undefined, equals, firstTime);
  }

  /**
   * Transforms subscriber function or map into a unified subscriber handler.
   *
   * @param _subscriber - Subscriber callback or event function map.
   * @param events - List of event string keys.
   *
   * @returns Unified subscriber state handling function.
   */
  private static transformSub = <
    Tc extends PrimitiveObject = PrimitiveObject,
    T extends string = string,
    Eo extends EventObject = EventObject,
  >(
    _subscriber: FnMapR<Eo, Tc, T, void>,
    events: string[],
  ) => {
    const check1 = isFunction(_subscriber);
    return check1
      ? _subscriber
      : ({ event, ...rest }: State<Eo, Tc, T>) => {
          const _else = _subscriber.else ?? nothing;
          const { type, payload } = event;

          for (const key of events) {
            const check2 = type === key;
            const func = _any(_subscriber)[key];
            const check3 = !!func;

            const check4 = check2 && check3;
            if (check4) return func({ payload, ...rest });
          }

          return _else({ event, ...rest });
        };
  };
}

export type { Subscriber };

/**
 * Options for configuring a subscriber instance.
 *
 * @template {EventObject} E - Event object type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 */
export type SubscriberOptions<
  E extends EventObject = EventObject,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  /**
   * Optional subscriber identifier string.
   */
  id?: string;
  /**
   * Optional equality comparator function.
   */
  equals?: (a: State<E, Tc, T>, b: State<E, Tc, T>) => boolean;
  /**
   * Optional initial trigger flag.
   */
  firstTime?: boolean;
};

/**
 * Function signature for subscriber creation factory.
 *
 * @template {PrimitiveObject} Tc - Context type.
 * @template {string} T - State path string type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param subscriber - Subscriber map or function.
 * @param options - Subscriber options object.
 * @param events - Machine event names list.
 *
 * @returns Instance of type {@linkcode Subscriber}.
 */
export type CreateSubscriber_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  const Eo extends EventObject = EventObject,
>(
  subscriber: FnMapR<Eo, Tc, T, void>,
  options?: SubscriberOptions<Eo, Tc, T>,
  ...events: string[]
) => Subscriber<Tc, T, Eo>;

/**
 * Creates a new instance of SubscriberMapClass.
 *
 * @param subscriber - The subscriber function that will be called with the {@linkcode State}.
 * @param options - Optional parameters for the subscriber, including equality function and ID.
 * @param events - List of events of the machine.
 * @returns A new instance of {@linkcode Subscriber} that manages the subscription state and provides methods to handle state changes and unsubscribe.
 */
export const createSubscriber: CreateSubscriber_F = (
  subscriber,
  options,
  ...events
) => {
  return new Subscriber(
    subscriber,
    options?.equals,
    options?.id,
    events,
    options?.firstTime,
  );
};
