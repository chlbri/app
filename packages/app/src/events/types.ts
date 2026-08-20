import type { Equals, NotUndefined, Unionize } from '@bemedev/app-utils-bemedev';
import type { EmitterConfigMap } from '#emitters';
import type { ChildConfigMap } from '#common/machine';
import { EmptyObject } from '@bemedev/decompose';
import type { AFTER_EVENT, ALWAYS_EVENT, INIT_EVENT } from './constants';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Represents a map of events where the keys are event names and the values are the payloads.
 *
 * @see {@linkcode PrimitiveObject} for the type of the payload.
 */
export type EventsMap = Record<string, PrimitiveObject>;

/**
 * Type alias for initial machine event string type.
 */
export type InitEvent = typeof INIT_EVENT;

/**
 * Type alias for always machine event string type.
 */
export type AlwaysEvent = `${string}/${typeof ALWAYS_EVENT}`;

/**
 * Type alias for always machine event string type.
 */
export type AfterEvent = `${string}/${typeof AFTER_EVENT}`;

/**
 * Represents a union of all event strings.
 */
export type EventStrings = InitEvent | AlwaysEvent | AfterEvent;

/**
 * Represents an event object with a type and payload.
 * @template T - The type of the payload.
 * @returns An object with a type and payload.
 */
export type EventObject<T = any> = { type: string; payload: T };

/**
 * Union type representing an event object or event string.
 */
export type AllEvent = EventObject | EventStrings;

/**
 * Transforms a map of events into a union type of event objects.
 * Each event object has a type and payload.
 * @template {EventsMap} T - the map to transform.
 *
 * @see {@linkcode Unionize} for the utility type that creates a union type from
 * the keys of the map.
 */
export type EventsR<T extends EventsMap> = {
  [K in keyof T & string]: { type: K; payload: T[K] };
}[keyof T & string];

/**
 * Internal helper to construct reduced emitter event union types.
 *
 * @template T - Emitter configuration map.
 */
type _EmitterConfigR<T extends EmitterConfigMap> =
  Unionize<T> extends infer U extends EmitterConfigMap
    ? U extends any
      ?
          | { type: `${keyof U & string}::next`; payload: U[keyof U]['next'] }
          | { type: `${keyof U & string}::error`; payload: U[keyof U]['error'] }
      : never
    : never;

/**
 * Internal helper to construct reduced child actor event union types.
 *
 * @template T - Child actor configuration map.
 */
type _ChildConfigR<T extends ChildConfigMap> = {
  [key in keyof T & string]: Unionize<T[key]> extends infer U
    ? U extends any
      ? { type: `${key}::on::${keyof U & string}`; payload: U[keyof U] }
      : never
    : never;
}[keyof T & string];

/**
 * Configuration map for children and emitter actors.
 *
 * @template {string} Sc - Children keys string union.
 * @template {string} Se - Emitters keys string union.
 */
export type ActorsConfigMap<
  Sc extends string = string,
  Se extends string = string,
> = { children?: ChildConfigMap<Sc>; emitters?: EmitterConfigMap<Se> };

/**
 * Represents a union type of all events, emitters, and child events.
 * It combines the transformed events, emitters, and child events into a single type.
 * @template {EventsMap} E - the map of events.
 * @template {ActorsConfigMap} A - the configuration map for actors which includes children and emitters.
 * @returns A union type of events, emitter-events, and child-events.
 */
export type ToEventsR<E extends EventsMap, A extends ActorsConfigMap> =
  | EventsR<E>
  | _EmitterConfigR<NotUndefined<A['emitters']>>
  | _ChildConfigR<NotUndefined<A['children']>>;

/**
 * Comprehensive union of custom events, actor events, and built-in event strings.
 *
 * @template {EventsMap} E - Events map.
 * @template {ActorsConfigMap} A - Actors map.
 */
export type ToEvents<E extends EventsMap, A extends ActorsConfigMap> =
  | ToEventsR<E, A>
  | EventStrings;

/**
 * Resolves event argument types based on payload optionality.
 *
 * @template {EventObject} E - Event object type.
 */
export type EventArgObject<E extends EventObject> = E extends any
  ? E['payload'] extends never
    ? E['type']
    : Equals<E['payload'], undefined> extends true
      ? E['type']
      : PrimitiveObject extends E['payload']
        ? E['type'] | E
        : Equals<E['payload'], EmptyObject> extends true
          ? E['type'] | E
          : E
  : never;

/**
 * Resolves event argument types for all events.
 *
 * @template {AllEvent} E - Event object or event string.
 */
export type EventArgAll<E extends AllEvent> = E extends string
  ? E
  : E extends EventObject
    ? EventArgObject<E>
    : never;

/**
 * Transforms an event map into arguments to send to the machine.
 * @template {EventsMap} E - the map of events.
 *
 * @see {@linkcode EventsR}, {@linkcode EventObject}
 */
export type EventArg<E extends EventsMap> = EventArgObject<EventsR<E>>;

/**
 * Extracts the type of the event from the event map.
 * @template {EventsMap} E - the map of events
 *
 * @see {@linkcode EventsR}, {@linkcode EventObject}
 */
export type EventArgT<E extends EventsMap> =
  EventsR<E> extends infer To extends EventObject ? To['type'] : never;

/**
 * Normalizes event strings and event objects into event objects of type {@linkcode EventObject}.
 *
 * @template {AllEvent} T - Event string or event object type.
 * @template {string} Ex - Event types to exclude.
 */
export type ToEventObject<T extends AllEvent, Ex extends string = never> = Exclude<
  T extends string ? { type: T; payload: EmptyObject } : T,
  { type: Ex }
>;

/**
 * Helper extracting tuple parameter list for event sender functions.
 *
 * @template {EventObject} T - Target event object.
 * @template {T['type']} E - Target event type key.
 * @template R - Inferred payload type.
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
