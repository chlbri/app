import type { Contract, State } from '@bemedev/app-contract';
import { _any } from '@bemedev/app-utils-bemedev';
import { nothing } from '@bemedev/app-plugins/internal';
import equal from 'fast-deep-equal';
import { FnMapR, isFunction } from '../types/primitives';
import { SubscriberBase } from './subscriber.base';

/**
 * Subscriber class that manages the subscription state and provides methods
 * to handle state changes and unsubscribe.
 *
 * The subscriber is contract-first: the state it receives is built from the
 * contract events, context and tags.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the observed machine.
 */
class Subscriber<const Ct extends Contract = Contract> extends SubscriberBase<
  State<Ct>
> {
  /**
   * Subscriber identifier getter.
   *
   * @returns The optional identifier string of this subscriber.
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
    _subscriber: FnMapR<Ct, void>,
    equals: (a: State<Ct>, b: State<Ct>) => boolean = equal,
    private _id?: string,
    events: string[] = [],
    public firstTime?: boolean,
  ) {
    const subscriber = Subscriber.transformSub<Ct>(_subscriber, events);
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
  private static transformSub = <const Ct extends Contract = Contract>(
    _subscriber: FnMapR<Ct, void>,
    events: string[],
  ) => {
    const check1 = isFunction(_subscriber);
    return check1
      ? _subscriber
      : ({ event, ...rest }: State<Ct>) => {
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
 * @template | {@linkcode Contract} `Ct` - Contract of the observed machine.
 */
export type SubscriberOptions<Ct extends Contract = Contract> = {
  /**
   * Optional subscriber identifier string.
   */
  id?: string;
  /**
   * Optional equality comparator function.
   */
  equals?: (a: State<Ct>, b: State<Ct>) => boolean;
  /**
   * Optional initial trigger flag.
   */
  firstTime?: boolean;
};

/**
 * Function signature for subscriber creation factory.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the observed machine.
 *
 * @param subscriber - Subscriber map or function.
 * @param options - Subscriber options object.
 * @param events - Machine event names list.
 *
 * @returns Instance of type {@linkcode Subscriber}.
 */
export type CreateSubscriber_F = <const Ct extends Contract = Contract>(
  subscriber: FnMapR<Ct, void>,
  options?: SubscriberOptions<Ct>,
  ...events: string[]
) => Subscriber<Ct>;

/**
 * Creates a new instance of SubscriberMapClass.
 *
 * @param subscriber - The subscriber function that will be called with the {@linkcode State}.
 * @param options - Optional parameters for the subscriber, including equality function and ID.
 * @param events - List of events of the machine.
 *
 * @returns A new instance of class {@linkcode Subscriber} that manages the subscription state and provides methods to handle state changes and unsubscribe.
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
