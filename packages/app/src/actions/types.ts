import type {
  ActionResult,
  MaybeAsyncActionResult,
  WithDescriber,
} from '@bemedev/app-options';
import type { NoExtraKeys } from '@bemedev/app-options/bemedev';
import type { Contract } from '@bemedev/app-options';
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
