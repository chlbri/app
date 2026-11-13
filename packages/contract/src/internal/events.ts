/**
 * Vendored event types.
 *
 * Copied from the machine event surface so contracts can describe typed events
 * without importing `@bemedev/app`.
 */

import type {
  EmptyObject,
  Equals,
  NotUndefined,
  PrimitiveObject,
  Unionize,
} from './primitives';

/** Type of the initial machine event. */
export type InitEvent = 'machine$$init';

/** Type of an always machine event. */
export type AlwaysEvent = `${string}/machine$$always`;

/** Type of an after machine event. */
export type AfterEvent = `${string}/machine$$after`;

/** Union of all built-in event strings. */
export type EventStrings = InitEvent | AlwaysEvent | AfterEvent;

/**
 * Map of event names to their payloads.
 */
export type EventsMap = Record<string, PrimitiveObject>;

/**
 * Typed event object.
 *
 * @template `T` - Payload type.
 */
export type EventObject<T = any> = {
  type: string;
  payload: T;
  __internal?: EventStrings;
};

/** Union of an event object or a built-in event string. */
export type AllEvent = EventObject | EventStrings;

/**
 * Transforms a map of events into a union of event objects.
 *
 * @template `T` - Events map.
 */
export type EventsR<T extends EventsMap> = {
  [K in keyof T & string]: { type: K; payload: T[K]; __internal?: EventStrings };
}[keyof T & string];

/** Definition of an emitter's next and error payloads. */
export type EmitterDef = { next: PrimitiveObject; error: PrimitiveObject };

/**
 * Map of emitter names to their definitions.
 *
 * @template `S` - Emitter key union.
 */
export type EmitterConfigMap<S extends string = string> = Record<S, EmitterDef>;

/** Child configuration definition (an events map). */
export type ChildConfigDef = EventsMap;

/**
 * Map of child names to their events maps.
 *
 * @template `S` - Child key union.
 */
export type ChildConfigMap<S extends string = string> = Record<S, ChildConfigDef>;

/**
 * Configuration map for children and emitter actors.
 *
 * @template `Sc` - Child key union.
 * @template `Se` - Emitter key union.
 */
export type ActorsConfigMap<
  Sc extends string = string,
  Se extends string = string,
> = { children?: ChildConfigMap<Sc>; emitters?: EmitterConfigMap<Se> };

/**
 * Internal helper constructing emitter event union types.
 *
 * @template `T` - Emitter configuration map.
 */
type _EmitterConfigR<T extends EmitterConfigMap> =
  Unionize<T> extends infer U extends EmitterConfigMap
    ? U extends any
      ? (
          | { type: `${keyof U & string}::next`; payload: U[keyof U]['next'] }
          | { type: `${keyof U & string}::error`; payload: U[keyof U]['error'] }
        ) & { __internal?: EventStrings }
      : never
    : never;

/**
 * Internal helper constructing child actor event union types.
 *
 * @template `T` - Child configuration map.
 */
type _ChildConfigR<T extends ChildConfigMap> = {
  [key in keyof T & string]: Unionize<T[key]> extends infer U
    ? U extends any
      ? {
          type: `${key}::on::${keyof U & string}`;
          payload: U[keyof U];
          __internal?: EventStrings;
        }
      : never
    : never;
}[keyof T & string];

/**
 * Union of custom, emitter and child events.
 *
 * @template `E` - Events map.
 * @template `A` - Actors configuration map.
 */
export type ToEventsR<E extends EventsMap, A extends ActorsConfigMap> =
  | EventsR<E>
  | _EmitterConfigR<NotUndefined<A['emitters']>>
  | _ChildConfigR<NotUndefined<A['children']>>;

/**
 * Union of every event accepted by a machine.
 *
 * @template `E` - Events map.
 * @template `A` - Actors configuration map.
 */
export type ToEvents<E extends EventsMap, A extends ActorsConfigMap> =
  | ToEventsR<E, A>
  | EventStrings;

/**
 * Resolves the argument accepted when sending an event object.
 *
 * @template `E` - Event object type.
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
 * Resolves the argument accepted when sending any event.
 *
 * @template `E` - Event object or built-in event string.
 */
export type EventArgAll<E extends AllEvent> = E extends string
  ? E
  : E extends EventObject
    ? EventArgObject<E>
    : never;

/**
 * Normalizes event strings and event objects into event objects.
 *
 * @template `T` - Event string or event object.
 * @template `Ex` - Event types to exclude.
 */
export type ToEventObject<T extends AllEvent, Ex extends string = never> = Exclude<
  T extends string
    ? { type: T; payload: EmptyObject; __internal?: EventStrings }
    : T,
  { type: Ex }
>;
