import type {
  Contract,
  ContractContext,
  ContractEventType,
  ContractEvents,
  EventStrings,
  NotUndefined,
  StateExtended,
  StatePextendedOf,
} from '@bemedev/app-contract';
import type { Ru, SubType, TrueObject, ValuesOf } from '@bemedev/app-utils-bemedev';
import type { DecomposeC } from '../types';

/**
 * Internal helper function map type keyed by event types.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `Item` - Type of the item to filter.
 * @template `Ex` - Event types to exclude.
 */
type _FnMapFilterArray<Ct extends Contract, Item, Ex extends string> = {
  [key in Exclude<ContractEventType<Ct>, EventStrings | Ex>]?: (
    item: Item,
    index: number,
    state: StatePextendedOf<Ct, Extract<ContractEvents<Ct>, { type: key }>>,
  ) => boolean;
} & Partial<
  Record<
    EventStrings | 'else',
    (item: Item, index: number, state: StateExtended<Ct>) => boolean
  >
>;

/**
 * Function map filter array type.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `Item` - Type of the item to filter.
 * @template `Ex` - Event types to exclude.
 */
export type FnMapFilterArray<
  Ct extends Contract = Contract,
  Item = any,
  Ex extends string = never,
> =
  | ((item: Item, index: number, state: StateExtended<Ct>) => boolean)
  | _FnMapFilterArray<Ct, Item, Ex>;

/**
 * Internal helper function map type keyed by event types.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `Item` - Type of the item to filter.
 * @template `Ex` - Event types to exclude.
 */
type _FnMapFilterObject<Ct extends Contract, Item, Ex extends string> = {
  [key in Exclude<ContractEventType<Ct>, EventStrings | Ex>]?: (
    item: Item,
    state: StatePextendedOf<Ct, Extract<ContractEvents<Ct>, { type: key }>>,
  ) => boolean;
} & Partial<
  Record<EventStrings | 'else', (item: Item, state: StateExtended<Ct>) => boolean>
>;

/**
 * Function map filter object type.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `Item` - Type of the item to filter.
 * @template `Ex` - Event types to exclude.
 */
export type FnMapFilterObject<
  Ct extends Contract = Contract,
  Item = any,
  Ex extends string = never,
> =
  | ((item: Item, state: StateExtended<Ct>) => boolean)
  | _FnMapFilterObject<Ct, Item, Ex>;

/**
 * Function type signature for creating a filter property action helper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `A` - Action return type.
 *
 * @returns Action of type `A` filtering the supplied context key.
 */
export type CommonFilterAction<Ct extends Contract = Contract, A = any> = <
  D = 0 extends 1 & ContractContext<Ct>
    ? Record<string, any>
    : SubType<DecomposeC<ContractContext<Ct>>, TrueObject | any[] | undefined>,
  K extends keyof D & string = keyof D & string,
>(
  key: K,
  fn: NotUndefined<D[K]> extends Array<infer Item>
    ? FnMapFilterArray<Ct, Item>
    : NotUndefined<D[K]> extends Ru
      ? FnMapFilterObject<Ct, ValuesOf<NotUndefined<D[K]>>>
      : never,
) => A;
