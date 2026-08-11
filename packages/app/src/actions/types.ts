import type { EventObject } from '#events';
import type { DeepPartial, NoExtraKeys } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Describer, FnMap, FnR, FromDescriber } from '~types';

/**
 * JSON configuration for an action.
 *
 * @see {@linkcode Describer} for more details.
 */
/**
 * JSON configuration for an action.
 *
 * @see {@linkcode Describer} for more details.
 */
export type WithDescriber = string | Describer;

/**
 * Enforces no extra keys when value is a describer object.
 *
 * @template T - Input type.
 */
export type NoExtraKeysWithDescriber<T> = T extends string
  ? T
  : NoExtraKeys<T, Describer>;

/**
 * Enforces no extra keys on read-only tuple/array of describers.
 *
 * @template {ReadonlyArray<WithDescriber>} T - Array of describer types.
 */
export type NoExtraKeysWithDescriberArray<
  T extends ReadonlyArray<WithDescriber>,
> = T extends readonly [
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
 * @template T - Target action describer type.
 */
export type NoExtraKeysWithDescriberSoa<T> =
  T extends ReadonlyArray<WithDescriber>
    ? NoExtraKeysWithDescriberArray<T>
    : T extends WithDescriber[]
      ? NoExtraKeysWithDescriber<T[number]>[]
      : NoExtraKeysWithDescriber<T>;

/**
 * Retrieves the name of the action if it is a describer, otherwise returns the action itself.
 * @template T - ActionConfig to reduce
 * @returns The name of the action if it is a describer, otherwise the action itself.
 *
 * @see {@linkcode FromDescriber} for more details.
 */
export type FromActionConfig<T> = T extends Describer
  ? FromDescriber<T>
  : T;

/**
 * Represents the result of executing an action, which includes the private context and the context.
 *
 * @template Pc - The type of the private context.
 * @template {PrimitiveObject} Tc - The type of the context.
 * @returns an type {@linkcode ActionResult} object containing the private context and the type {@linkcode PrimitiveObject} context.
 */
export type ActionResult<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = DeepPartial<{ pContext: Pc; context: Tc }>;

/**
 * An action may return synchronously or asynchronously.
 *
 * Any action (user-provided or produced by an `addOptions` helper except
 * `debounce`) may return type {@linkcode ActionResult} or a promise that resolves to one.
 *
 * @template Pc - The type of the private context.
 * @template {PrimitiveObject} Tc - The type of the context.
 */
export type MaybeAsyncActionResult<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = ActionResult<Pc, Tc> | Promise<ActionResult<Pc, Tc>>;

/**
 * Async action function map.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type AsyncAction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnMap<E, Pc, Tc, T, MaybeAsyncActionResult<Pc, Tc>>;

/**
 * Synchronous action function map.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SyncAction<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnMap<E, Pc, Tc, T, ActionResult<Pc, Tc>>;

/**
 * Represents a collection of actions, where each action is identified by a string key.
 *
 * @template {EventObject} E - all events.
 * @template Pc - the type of the private context.
 * @template {PrimitiveObject} Tc - the type of the context.
 * @template {string} T - state path type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 */
export type SyncActionMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<Record<string, SyncAction<E, Pc, Tc, T>>>;

/**
 * Async action function executor.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 */
export type AsyncAction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, MaybeAsyncActionResult<Pc, Tc>>;

/**
 * Sync action function executor.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 */
export type SyncAction2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, ActionResult<Pc, Tc>>;
