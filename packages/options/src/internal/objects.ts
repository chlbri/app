/**
 * Object helpers used by the option runtime.
 *
 * These are self-contained copies of the `@bemedev/app` utilities the machine
 * option helpers rely on, so this package never imports the machine package.
 */

import { expandFn } from '@bemedev/app-utils-bemedev';
import { Decompose } from '@bemedev/decompose';

/** Options accepted when reading a nested property. */
export type ByKey2Options = {
  /** Separator used to split the key path. Defaults to `'.'`. */
  sep?: string;
  /** Whether to strip the leading character from the key path. Defaults to `false`. */
  start?: boolean;
};

/**
 * Type guard checking that a value is a plain, non-null, non-array object.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a true object.
 */
const isTrueObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Walks down `key` segments inside `obj` and returns the reached value.
 *
 * @param obj - Target object to traverse.
 * @param key - Key path, split with `sep`.
 * @param options - Optional traversal options.
 *
 * @returns The reached nested value.
 */
const _byKey2 = (obj: any, key: string, options?: ByKey2Options) => {
  if (obj === undefined || obj === null) return undefined;
  const { sep = '.', start = false } = options ?? {};
  const __key = start ? key.substring(1) : key;
  const keys = __key.split(sep);
  let current = obj;

  for (const k of keys) {
    if (!isTrueObject(current)) return current;
    current = current[k];
  }

  return current;
};

/**
 * Retrieves a nested value from an object using a dot-separated (or custom delimited) key path.
 *
 * Includes property `low` for untyped key lookups.
 *
 * @template `T` - Target object type.
 * @template `D` - Decomposed representation of `T`.
 * @template `K` - Valid key path in `D`.
 * @template | {@linkcode ByKey2Options} `O` - Options type.
 *
 * @param obj - Target object to retrieve property from.
 * @param key - Key path pointing to the desired property.
 * @param options - Optional configuration options of type {@linkcode ByKey2Options}.
 *
 * @returns The retrieved nested property value, or `undefined`.
 *
 * @see -- type {@linkcode Decompose}
 */
export const byKey2 = expandFn(
  <
    T,
    D = Decompose<T, { object: 'both'; start: false; sep: '.' }>,
    K extends keyof D & string = keyof D & string,
    O extends ByKey2Options = ByKey2Options,
  >(
    obj: T,
    key: K,
    options?: O,
  ) => {
    return _byKey2(obj, key, options);
  },
  { low: _byKey2 },
);

/**
 * Type guard checking that a value is a function.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a function.
 */
export const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === 'function';
