import type { EventObject } from '#events';
import type {
  ActionResult,
  MaybeAsyncActionResult,
  WithDescriber,
} from '@bemedev/app-options';
import type { NoExtraKeys } from '@bemedev/app-options/bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Describer, FnMap, FromDescriber } from '~types';

export type {
  ActionResult,
  AsyncAction2,
  MaybeAsyncActionResult,
  SyncAction2,
  WithDescriber,
} from '@bemedev/app-options';

/**
 * Enforces no extra keys when value is a describer object.
 *
 * @template `T` - Input type.
 */
export type NoExtraKeysWithDescriber<T> = T extends string
  ? T
  : NoExtraKeys<T, Describer>;

/**
 * Enforces no extra keys on read-only tuple/array of describers.
 *
 * @template | {@linkcode WithDescriber} `T` - Array of describer types.
 */
export type NoExtraKeysWithDescriberArray<T extends ReadonlyArray<WithDescriber>> =
  T extends readonly [
    infer Head extends WithDescriber,
    ...infer Tail extends ReadonlyArray<WithDescriber>,
  ]
    ? readonly [
        NoExtraKeysWithDescriber<Head>,
        ...NoExtraKeysWithDescriberArray<Tail>,
      ]
    : [];

/**
 * Enforces no extra keys across single value, array, or read-only tuple of describers.
 *
 * @template `T` - Target action describer type.
 */
export type NoExtraKeysWithDescriberSoa<T> =
  T extends ReadonlyArray<WithDescriber>
    ? NoExtraKeysWithDescriberArray<T>
    : T extends WithDescriber[]
      ? NoExtraKeysWithDescriber<T[number]>[]
      : NoExtraKeysWithDescriber<T>;

/**
 * Retrieves the name of the action if it is a describer, otherwise returns the action itself.
 * @template `T` - ActionConfig to reduce
 * @returns The name of the action if it is a describer, otherwise the action itself.
 *
 * @see -- type {@linkcode FromDescriber}
 */
export type FromActionConfig<T> = T extends Describer ? FromDescriber<T> : T;

/**
 * Async action function map.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type AsyncAction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnMap<E, Pc, Tc, T, MaybeAsyncActionResult<Tc>>;

/**
 * Synchronous action function map.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type SyncAction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnMap<E, Pc, Tc, T, ActionResult<Tc>>;

/**
 * Represents a collection of actions, where each action is identified by a string key.
 *
 * @template | {@linkcode EventObject} `E` - all events.
 * @template `Pc` - the type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - the type of the context.
 * @template `T` - state path type.
 */
export type AsyncActionMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, AsyncAction<E, Pc, Tc, T>>>;

/**
 * Sync action configuration map.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 */
export type SyncActionMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, SyncAction<E, Pc, Tc, T>>>;
