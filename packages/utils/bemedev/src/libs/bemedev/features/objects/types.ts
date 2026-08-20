import type { Fn } from '../../globals/types';
import type { Keys, Primitive } from '../common/types';
/**
 * A type that represents a true object, which is an object that does not have
 * any iterable properties or the `SymbolConstructor` property.
 *
 * @remarks This type is useful to ensure that the object is a plain object
 * without any special properties.
 *
 * @see {@linkcode Ru} for a utility type that represents a true object.
 * @see {@linkcode SymbolConstructor} for the symbol constructor type.
 */
/**
 * TrueObject type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type TrueObject = Ru & {
  [Symbol.iterator]?: never;
  //@ts-expect-error - 'SymbolConstructor' does not exist on type 'object'
  [SymbolConstructor]?: never;
};

/**
 * Alias of {@linkcode TrueObject}
 */
/**
 * To type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type To = TrueObject;

/**
 * NOmit type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type NOmit<T, K extends keyof T> = Omit<T, K>;
/**
 * DeepReadonly type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type DeepReadonly<T> = T extends Primitive
  ? T
  : {
      readonly [P in keyof T]: T[P] extends Fn
        ? T[P]
        : T[P] extends object
          ? DeepReadonly<T[P]>
          : T[P];
    };

/**
 * DeepPartial type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type DeepPartial<T> = T extends Primitive
  ? T
  : {
      [P in keyof T]?: T[P] extends Fn
        ? T[P]
        : T[P] extends object
          ? DeepPartial<T[P]>
          : T[P];
    };
// type TT = {
//   readonly a: string;
//   readonly b: {
//     readonly c: number;
//     readonly d: {
//       readonly e: boolean;
//       readonly f: {
//         readonly g: string[];
//       };
//     };
//   };
//   readonly h: () => void;
//   readonly i: {
//     readonly j: {
//       readonly k: string;
//       readonly l: {
//         readonly m: number;
//       };
//     };
//   };
// };
/**
 * Require type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Require<T, K extends keyof T> = NOmit<T, K> & Required<Pick<T, K>>;
/**
 * Unionize type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Unionize<T extends Record<string, any>> = {
  [P in keyof T]: { [Q in P]: T[P] };
}[keyof T];
// #region type _FlatMapByKey
// #region SubTypes
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type FilterFlagsLow<Base, Condition> = {
  [Key in keyof Base]: Condition extends Base[Key] ? Key : never;
};
/**
 * AllowedNames type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
/**
 * AllowedNamesLow type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type AllowedNamesLow<Base, Condition> = FilterFlagsLow<
  Base,
  Condition
>[keyof Base];
/**
 * SubTypeLow type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type SubTypeLow<Base extends object, Condition> = Pick<
  Base,
  AllowedNamesLow<Base, Condition>
>;
// #endregion
/**
 * Ru type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Ru = Record<Keys, unknown>;
// #region NoExtraKeys
/**
 * Generic type that restricts extra keys deeply on any object type.
 * Works with partial objects and ensures all keys match the schema exactly.
 *
 * @template T - The type to validate (the actual value type).
 * @template Schema - The schema type that defines allowed keys.
 *
 * @remarks
 * This type performs deep validation ensuring:
 * 1. No extra keys are present at the top level
 * 2. All nested object properties are recursively validated
 * 3. Works with partial/optional properties
 * 4. Preserves readonly modifiers
 *
 * @example
 * ```typescript
 * type MySchema = {
 *   name: string;
 *   config?: {
 *     value: number;
 *     nested?: {
 *       deep: boolean;
 *     };
 *   };
 * };
 *
 * // Valid - all keys match schema
 * type Valid = NoExtraKeys<{ name: 'test'; config: { value: 1 } }, MySchema>;
 *
 * // Invalid - 'extra' key is not in schema, will be typed as 'never'
 * type Invalid = NoExtraKeys<{ name: 'test'; extra: true }, MySchema>;
 * ```
 *
 * @see {@linkcode NoExtraKeysStrict} for a stricter version that requires exact match.
 */
/**
 * NoExtraKeys type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type NoExtraKeys<T, Schema> = T extends Primitive
  ? T
  : T & {
      [K in Exclude<keyof T, keyof Schema>]?: never;
    };

/**
 * A stricter version of {@linkcode NoExtraKeys} that also validates
 * that all keys in the schema are present in the type T.
 *
 * @template T - The type to validate (the actual value type).
 * @template Schema - The schema type that defines allowed keys.
 *
 * @remarks
 * Use this when you want to ensure not only that there are no extra keys,
 * but also that all required keys from the schema are present.
 *
 * @example
 * ```typescript
 * type MySchema = {
 *   name: string;
 *   value: number;
 * };
 *
 * // T must have both 'name' and 'value'
 * type Strict = NoExtraKeysStrict<{ name: 'test'; value: 1 }, MySchema>;
 * ```
 */
/**
 * NoExtraKeysStrict type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type NoExtraKeysStrict<T extends Schema, Schema> = NoExtraKeys<T, Schema>;
// #endregion NoExtraKeys

/**
 * Identitfy type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Identitfy<T> = T extends object ? T & { __id: string } : T;
