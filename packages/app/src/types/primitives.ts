import type { DEFAULT_DELIMITER } from '#constants';
import type {
  Contract,
  ContractEventType,
  ContractEvents,
  Describer,
  EventStrings,
  RecordS,
  State,
  StatePOf,
} from '@bemedev/app-contract';
import type {
  DeepPartial,
  NOmit,
  NoExtraKeys,
  NotUndefined,
  UnionToIntersection,
  _UnionToIntersection2,
} from '@bemedev/app-contract/bemedev';
import type { KeyU } from '@bemedev/app-plugins/addons';
import type { EmptyObject } from '@bemedev/typings';

import {
  DESCRIBER_KEYS,
  isDescriber,
  isFunction,
  isString,
} from '@bemedev/app-options/internal';

export type {
  ExtractS,
  NoExtraKeys,
  NoExtraKeysStrict,
  NotReadonly,
  TrueObject,
  ValuesOf,
} from '@bemedev/app-contract/bemedev';
export type {
  FnMapFilterArray,
  FnMapFilterObject,
  SingleOrArrayL2,
  SingleOrArrayR,
} from '@bemedev/app-plugins/addons';
export type { KeyU };

export type {
  Describer,
  EventToType,
  FnMap,
  FnR,
  MaybePromise,
  Props,
  RecordS,
  SingleOrArrayL,
} from '@bemedev/app-contract';

export { EmptyObject };

/**
 * Type guard function signature for checking if a value is of type `string`.
 *
 * @param value - The value to check.
 *
 * @returns `true` if `value` is a string, `false` otherwise.
 */
export type IsString_F = (value: unknown) => value is string;

/**
 * `SingleOrArrayR` and `SingleOrArrayL2` are owned by
 * `@bemedev/app-plugins/addons` and re-exported at the top of this module.
 */

/**
 * Describer keys, function guard and string guard.
 *
 * They are re-exported from `@bemedev/app-options` so the machine runtime and
 * the option helpers share a single implementation.
 */
export { DESCRIBER_KEYS, isFunction, isString };

/**
 * Retrieves the `name` property from a type {@linkcode Describer}.
 *
 * @template | {@linkcode Describer} `T` - The describer type.
 */
export type FromDescriber<T extends Describer> = T['name'];

/**
 * Extracts the string name from a string or type {@linkcode Describer}.
 *
 * @param value - The input string or describer object.
 *
 * @returns The string name or the original string.
 */
export const fromDescriber = (value: string | Describer) => {
  return isDescriber(value) ? value.name : value;
};

/**
 * Resolves the effective value type of `T`, falling back to `U` when `T` is strictly `undefined`.
 *
 * @template `T` - The source type.
 * @template `U` - The fallback type used when `T` is `undefined`.
 *
 * @see -- type {@linkcode NotUndefined}
 */
export type Define<T, U> = T extends undefined
  ? U
  : undefined extends T
    ? NotUndefined<T>
    : T;

// #region group type ChangeProperties

// #region type ChangePropertyOption
/**
 * Option for changing a property access in an object.
 */
type ChangePropertyOption =
  | 'readonly'
  | 'readonly_undefined'
  | 'normal'
  | 'undefined';
// #endregion

// #region type ChangeProperty

/**
 * Changes the property access of a specific property in an object type.
 *
 * @template `T` - The object type to change.
 * @template `name` - The name of the property of `T` to change.
 * @template `replace` - The name of the property to replace the original property with.
 * @template | {@linkcode ChangePropertyOption} `option` - The option for changing the property access.
 *
 * @remarks The remaining properties of `T` are preserved unchanged.
 *
 * @see -- type {@linkcode NOmit}
 */

export type ChangeProperty<
  T extends object,
  name extends keyof T,
  replace extends string,
  option extends ChangePropertyOption = 'normal',
> = NOmit<T, name> &
  (name extends any
    ? option extends 'readonly'
      ? { +readonly [key in replace]: T[name] }
      : option extends 'readonly_undefined'
        ? { +readonly [key in replace]+?: T[name] }
        : option extends 'undefined'
          ? { [key in replace]+?: T[name] }
          : { [key in replace]: T[name] }
    : never);
// #endregion

/**
 * Internal helper type for mapping object keys to key strings structure.
 *
 * @template `T` - Target object type.
 * @template `AddObjectKey` - Whether to append the object key marker, defaults to `true`.
 * @template `Key` - Property key union, defaults to `keyof T`.
 */
type _KeyStrings<
  T extends object,
  AddObjectKey extends boolean = true,
  Key extends keyof T = keyof T,
> = Key extends string
  ? NotUndefined<T[Key]> extends object
    ? {
        [key in keyof T]: (T[key] extends infer T2 extends object
          ? UnionToIntersection<_KeyStrings<T2, AddObjectKey>>
          : never) &
          (AddObjectKey extends true
            ? { [key in HighMy]: string }
            : NonNullable<object>);
      }
    : { [key in Key]: string }
  : never;

/**
 * Maps all object property paths to string representation types.
 *
 * @template `T` - Target object type.
 * @template AddObjectKey - Whether to append object key marker. Defaults to `true`.
 * @template Key - Keys of `T`. Defaults to `keyof T`.
 */
export type KeyStrings<
  T extends object,
  AddObjectKey extends boolean = true,
  Key extends keyof T = keyof T,
> = _UnionToIntersection2<_KeyStrings<T, AddObjectKey, Key>>;

/**
 * Internal property key marker type for object key mapping.
 */
export type HighMy = '@my';

/**
 * Internal recursive helper type to change object properties.
 *
 * @template `T` - Source object type.
 * @template `U` - Deep partial key mapping.
 */
type __ChangeProperties<
  T extends object,
  U extends DeepPartial<KeyStrings<T>> = DeepPartial<KeyStrings<T>>,
> = {
  [
    key in keyof T as key extends keyof U
      ? U[key] extends infer U1
        ? U1 extends { [key in HighMy]: string }
          ? U1[HighMy]
          : U1 extends string
            ? U1
            : key
        : never
      : key
  ]: key extends keyof U
    ? T[key] extends infer T1 extends object
      ? Omit<U[key], HighMy> extends infer U1 extends DeepPartial<
          KeyStrings<T1, true>
        >
        ? __ChangeProperties<T1, U1>
        : never
      : T[key]
    : T[key];
};

/**
 * Internal helper type to change object property key mappings.
 *
 * @template `T` - Source object type.
 * @template `U` - Deep partial key mapping.
 * @template `option` - Property change option mode.
 */
type _ChangeProperties<
  T extends object,
  U extends DeepPartial<KeyStrings<T>> = DeepPartial<KeyStrings<T>>,
  option extends Extract<ChangePropertyOption, 'normal' | 'undefined'> = 'normal',
> =
  __ChangeProperties<T, U> extends infer Tn
    ? option extends 'undefined'
      ? DeepPartial<Tn>
      : Tn
    : never;

// #region type ChangeProperties
/**
 * Changes the properties of an object type based on a partial object type.
 *
 * @template `T` - The object type to change.
 * @template `U` - The partial object type that defines the changes.
 * @template | {@linkcode ChangePropertyOption} `option` - The option for changing the property access.
 *
 * @remarks Returns `T` unchanged when `U` already covers every key string of `T`.
 *
 * @see -- type {@linkcode DeepPartial}, -- type {@linkcode KeyStrings}, -- type {@linkcode _ChangeProperties}
 */
export type ChangeProperties<
  T extends object,
  U extends DeepPartial<KeyStrings<T>> = DeepPartial<KeyStrings<T>>,
  option extends Extract<ChangePropertyOption, 'normal' | 'undefined'> = 'normal',
> = DeepPartial<KeyStrings<T>> extends U ? T : _ChangeProperties<T, U, option>;
// #endregion

// #endregion

/**
 * Remap an object by adding an `__id` property.
 *
 * @template `T` - The object type to remap.
 */
export type Identify<T> = T extends object ? T & { __id: string } : T;

/**
 * A helper type to reduce an array type to its element type.
 * It extracts the element type from an array type, whether it is a readonly array or a
 * mutable array.
 *
 * @template `T` - The type to reduce.
 */
export type ReduceArray<T> = T extends readonly (infer U1)[]
  ? U1
  : T extends (infer U2)[]
    ? U2
    : T;

/**
 * The inverse of {@linkcode ReduceArray}.
 * Takes a type and wraps it in a readonly array, or returns it as-is if already an array.
 *
 * @template `T` - The type to wrap.
 */
export type ToArray<T> = T extends readonly unknown[]
  ? T
  : T extends unknown[]
    ? T
    : readonly T[];

/**
 * A helper type to reduce a function signature to its contract state.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - The return type of the function, defaults to `any`.
 *
 * @remarks This function signature is a reduced version of type
 * {@linkcode FnR} without the private context.
 *
 * @see -- type {@linkcode State}
 */
export type FnReduced<Ct extends Contract = Contract, R = any> = (
  state: State<Ct>,
) => R;

/**
 * `FnMapFilterArray` and `FnMapFilterObject` are owned by
 * `@bemedev/app-plugins/addons` and re-exported at the top of this module.
 */

/**
 * Internal helper type for reduced function maps.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - Return value type.
 * @template `Ex` - Event types to exclude.
 */
type _FnMapReduced<Ct extends Contract, R = any, Ex extends string = never> = {
  [key in Exclude<ContractEventType<Ct>, Ex>]?: (
    state: StatePOf<Ct, Extract<ContractEvents<Ct>, { type: key }>>,
  ) => R;
} & Partial<Record<EventStrings | 'else', FnReduced<Ct, R>>>;

/**
 * A helper type to reduce a function signature to its contract state.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 * @template `R` - The return type of the function, defaults to `any`.
 * @template `Ex` - Event type strings to exclude.
 *
 * @see -- type {@linkcode _FnMapReduced}
 */
export type FnMapR<
  Ct extends Contract = Contract,
  R = any,
  Ex extends string = never,
> = FnReduced<Ct, R> | _FnMapReduced<Ct, R, Ex>;

/**
 * The partial version of {@linkcode KeyU}.
 *
 * @template `S` - The string keys of the record.
 * @template `R` - The type of the values in the record, optional
 *
 * @see -- type {@linkcode Partial}
 */
export type KeyO<S extends string, R = unknown> = Partial<KeyU<S, R>>;

/**
 * A type that represents an absent value.
 *
 * @remarks This type is useful when you want to allow a value to be absent or
 * explicitly set to `null` or `undefined`.
 */
export type NoValue = void | undefined | null;

/**
 * Type alias for constant {@linkcode DEFAULT_DELIMITER}.
 */
export type Delimiter = typeof DEFAULT_DELIMITER;

// #region NoExtraKeys

/**
 * `RecursiveObjectKeys`, `NoExtraKeys` and `NoExtraKeysStrict` are owned by
 * `@bemedev/app-contract/bemedev` and re-exported at the top of this module.
 */

/**
 * Deep version of {@linkcode NoExtraKeys} that processes Record types
 * (objects with dynamic string keys).
 *
 * @template `T` - The Record type to validate.
 * @template `Schema` - The schema type for each value in the record.
 *
 * @example
 * ```typescript
 * type StateSchema = {
 *   target: string;
 *   initial?: string;
 * };
 *
 * type States = NoExtraKeysRecord<
 *   { idle: { target: 'active' }; active: { target: 'idle' } },
 *   StateSchema
 * >;
 * ```
 */
export type NoExtraKeysRecord<T extends Record<string, any>, Schema> = {
  [K in keyof T]: NoExtraKeys<T[K], Schema>;
};

/**
 * Utility type to create a no-extra-keys validator for a specific schema.
 * This is useful when you want to create reusable type validators.
 *
 * @template `Schema` - The schema type to validate against.
 *
 * @example
 * ```typescript
 * type ConfigSchema = {
 *   name: string;
 *   options?: {
 *     enabled: boolean;
 *   };
 * };
 *
 * type ValidConfig<T extends ConfigSchema> = NoExtraKeysFor<ConfigSchema, T>;
 *
 * // Usage
 * function createConfig<T extends ConfigSchema>(config: ValidConfig<T>): T {
 *   return config as T;
 * }
 * ```
 */
export type NoExtraKeysFor<Schema, T extends Partial<Schema>> = NoExtraKeys<
  T,
  Schema
>;

// #endregion NoExtraKeys

/**
 * Filters an array type to only include elements that match a condition type.
 *
 * @template `Arr` - The array type to filter.
 * @template `Condition` - The condition type to filter by.
 *
 * @example
 * ```typescript
 * type Numbers = FilterArray<[1, 'two', 3, 'four', 5], number>;
 * // Result: [1, 3, 5]
 * ```
 */
export type FilterArray<
  Arr extends readonly unknown[],
  Condition,
> = Arr extends readonly [infer Head, ...infer Tail]
  ? Head extends Condition
    ? [Head, ...FilterArray<Tail, Condition>]
    : FilterArray<Tail, Condition>
  : [];

/**
 * Utility type representing a deep partial type or `undefined`.
 *
 * @template `T` - The object type.
 */
export type DeeperPartial<T> = DeepPartial<T> | undefined;

/**
 * Internal helper to construct optional property definition.
 *
 * @template `P` - Property value type.
 * @template `V` - Property key string.
 */
type _OptionalDefinition<P, V extends string> = undefined extends P
  ? { [K in V]?: P }
  : { [K in V]: P };

/**
 * Defines an optional or required property object based on whether property type `P` includes `undefined`.
 *
 * @template `P` - Property type.
 * @template `V` - Property key name string.
 * @template `R` - Resolved object structure.
 */
export type OptionalDefinition<
  P,
  V extends string,
  R extends _OptionalDefinition<P, V> = _OptionalDefinition<P, V>,
> = R extends never | RecordS<never> ? EmptyObject : R;

/**
 * Type guard function signature for checking deep equality of two values.
 *
 * @template `T` - The type of values to compare.
 *
 * @param first - The first value to compare.
 * @param next - The second value to compare.
 *
 * @returns `true` if the values are deeply equal, `false` otherwise.
 */
export type Dequal_F<T> = (first: T, next: T) => boolean;
