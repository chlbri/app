import type { Equals } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  EventArgObject,
  EventObject,
  EventsMap,
  EventsR,
} from '@bemedev/app-options';

export type {
  ActorsConfigMap,
  AfterEvent,
  AllEvent,
  AlwaysEvent,
  EventArgAll,
  EventArgObject,
  EventObject,
  EventStrings,
  EventsMap,
  EventsR,
  InitEvent,
  ToEventObject,
  ToEvents,
  ToEventsR,
} from '@bemedev/app-options';

/**
 * Transforms an event map into arguments to send to the machine.
 * @template | {@linkcode EventsMap} `E` - the map of events.
 *
 * @see {@linkcode EventsR}, -- type {@linkcode EventObject}
 */
export type EventArg<E extends EventsMap> = EventArgObject<EventsR<E>>;

/**
 * Extracts the type of the event from the event map.
 * @template | {@linkcode EventsMap} `E` - the map of events
 *
 * @see {@linkcode EventsR}, -- type {@linkcode EventObject}
 */
export type EventArgT<E extends EventsMap> =
  EventsR<E> extends infer To extends EventObject ? To['type'] : never;

/**
 * Helper extracting tuple parameter list for event sender functions.
 *
 * @template | {@linkcode EventObject} `T` - Target event object.
 * @template `E` - Target event type key.
 * @template `R` - Inferred payload type.
 */
export type ExtractSender<
  T extends EventObject,
  E extends T['type'],
  R extends Extract<T, { type: E }>['payload'] = Extract<T, { type: E }>['payload'],
> =
  Equals<R, never> extends true
    ? []
    : Equals<R, undefined> extends true
      ? []
      : PrimitiveObject extends R
        ? []
        : [payload: R];
