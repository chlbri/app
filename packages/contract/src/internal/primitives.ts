/**
 * Vendored primitives.
 *
 * This package is intentionally self-contained: it does not import or
 * re-export types from `@bemedev/app`. The definitions below are copied from
 * the public typing surface used by machines so contracts can be consumed
 * without installing the main package.
 */

/** Union of JSON-compatible primitive values. */
export type JSON_Primitive = string | number | boolean | undefined;

/**
 * Recursive array type used by {@linkcode PrimitiveObject}.
 *
 * @template `T` - Element type.
 */
type RecursiveArrayOf<T> =
  | Array<T | RecursiveArrayOf<T>>
  | ReadonlyArray<T | RecursiveArrayOf<T>>;

/**
 * Dictionary mapping property keys to primitive objects.
 */
export interface PrimitiveObjectMap {
  [key: string]: PrimitiveObject;
}

/**
 * Primitive value, primitive map, or recursive array of primitives.
 */
export type PrimitiveObject =
  | JSON_Primitive
  | PrimitiveObjectMap
  | RecursiveArrayOf<JSON_Primitive | PrimitiveObjectMap>;

/**
 * Structural shape of a Standard Schema output.
 *
 * Copied from `@bemedev/typings` so contracts keep accepting the same
 * `type(...)` schemas without depending on that package.
 *
 * @template `T` - Inferred output type.
 */
export type StandardOutput<T = any> = { '~standard': { types?: { output: T } } };

/**
 * Extracts the output type from a type {@linkcode StandardOutput} schema.
 *
 * @template `T` - Standard output schema.
 */
export type inferT<T extends StandardOutput = StandardOutput> = Exclude<
  T['~standard']['types'],
  undefined
>['output'];

/**
 * Empty object type used for payload-less events.
 *
 * `Record<never, never>` is the lint-friendly equivalent of `{}`.
 */
export type EmptyObject = Record<never, never>;

/**
 * String-keyed record.
 *
 * @template `T` - Value type.
 */
export type RecordS<T = unknown> = Record<string, T>;

/**
 * Single value or a non-empty array of values.
 *
 * @template `T` - Value type.
 */
export type SingleOrArrayL<T> = T | readonly [...(readonly T[]), T];

/**
 * Removes `undefined` from a union.
 *
 * @template `T` - Source type.
 */
export type NotUndefined<T> = Exclude<T, undefined>;

/**
 * Strict type equality helper.
 *
 * @template `T` - Left type.
 * @template `U` - Right type.
 */
export type Equals<T, U> = T extends U ? (U extends T ? true : false) : false;

/**
 * Turns a record into a union of single-key objects.
 *
 * @template `T` - Source record.
 */
export type Unionize<T extends Record<string, any>> = {
  [P in keyof T]: { [Q in P]: T[P] };
}[keyof T];

/**
 * Requires the selected keys of a type.
 *
 * @template `T` - Source type.
 * @template `K` - Keys to require.
 */
export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
