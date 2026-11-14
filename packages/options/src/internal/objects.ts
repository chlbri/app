/**
 * Object helpers used by the option runtime.
 *
 * These are self-contained copies of the `@bemedev/app` utilities the machine
 * option helpers rely on, so this package never imports the machine package.
 */

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
export const byKey2Low = (obj: any, key: string, options?: ByKey2Options) => {
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
 * Nested property reader with an untyped alias.
 *
 * @param obj - Target object to traverse.
 * @param key - Key path, split on `'.'`.
 *
 * @returns The reached nested value.
 */
export const byKey2 = Object.assign((obj: any, key: string) => byKey2Low(obj, key), {
  low: byKey2Low,
});

/**
 * Type guard checking that a value is a function.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a function.
 */
export const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === 'function';
