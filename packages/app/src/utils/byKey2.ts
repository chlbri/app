import {
  byKey2 as _byKey2,
  type ByKey2Options,
} from '@bemedev/app-options/internal';
import { expandFn } from '@bemedev/app-options/bemedev';
import type { Decompose } from '@bemedev/decompose';

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
