import type {
  ActionResult,
  Contract,
  FnMap,
  MaybeAsyncActionResult,
} from '@bemedev/app-contract';

export type {
  ActionResult,
  AsyncAction2,
  MaybeAsyncActionResult,
  SyncAction2,
} from '@bemedev/app-contract';

/**
 * Action names are plain strings, so there is nothing to strip.
 *
 * @template `T` - Input type.
 */
export type NoExtraKeysAction<T> = T extends string ? T : never;

/**
 * Read-only tuple/array of action names.
 *
 * @template `T` - Array of action names.
 */
export type NoExtraKeysActionArray<T extends ReadonlyArray<string>> =
  T extends readonly [
    infer Head extends string,
    ...infer Tail extends ReadonlyArray<string>,
  ]
    ? readonly [Head, ...NoExtraKeysActionArray<Tail>]
    : [];

/**
 * Action names across a single value, array, or read-only tuple.
 *
 * @template `T` - Target action type.
 */
export type NoExtraKeysActionSoa<T> =
  T extends ReadonlyArray<string> ? NoExtraKeysActionArray<T> : NoExtraKeysAction<T>;

/**
 * Action names are plain strings, so the configuration value is the key.
 *
 * @template `T` - Action configuration to reduce.
 *
 * @returns The action name.
 */
export type FromActionConfig<T> = T;

/**
 * Async action function map.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type AsyncAction<Ct extends Contract = Contract> = FnMap<
  Ct,
  MaybeAsyncActionResult<Ct>
>;

/**
 * Synchronous action function map.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncAction<Ct extends Contract = Contract> = FnMap<Ct, ActionResult<Ct>>;

/**
 * Represents a collection of actions, where each action is identified by a
 * string key.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type AsyncActionMap<Ct extends Contract = Contract> = Partial<
  Record<string, AsyncAction<Ct>>
>;

/**
 * Sync action configuration map.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncActionMap<Ct extends Contract = Contract> = Partial<
  Record<string, SyncAction<Ct>>
>;
