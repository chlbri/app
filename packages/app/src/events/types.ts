import type { EventObject } from '@bemedev/app-options';
import type { Equals } from '@bemedev/app-options/bemedev';
import type { PrimitiveObject } from '@bemedev/app-contract/typings';

export type {
  ActorsConfigMap,
  AfterEvent,
  AllEvent,
  AlwaysEvent,
  EventArgAll,
  EventArgObject,
  EventObject,
  EventsMap,
  EventsR,
  EventStrings,
  InitEvent,
  ToEventObject,
  ToEvents,
  ToEventsR,
} from '@bemedev/app-options';

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
