import { expandFn } from '@bemedev/app-utils-bemedev';
import { type Decompose } from '@bemedev/decompose';

/**
 * Configuration object defining a source object and a key path to merge.
 *
 * @template `T` - Source object type.
 * @template `K` - Key path string type.
 */
export type Merger<T, K extends string = string> = {
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key?: K;
};

/**
 * Properties for the {@linkcode merge2} function.
 *
 * @template `T` - Target object type.
 * @template `K` - Key path string type.
 */
export type MergeProps2<T, K extends string = string> = {
  /** Target object to merge into. */
  target: T;
} & Merger<T, K>;

/**
 * Merges a specific property designated by a dot-separated `key` path from `source` into `target`.
 *
 * Includes property {@linkcode merge2.multiple}.
 *
 * @template `T` - Target object type.
 * @template `D` - Decomposed representation of `T`.
 * @template `K` - Valid dot-separated key path in `D`.
 *
 * @param props - Configuration properties of type {@linkcode MergeProps2}.
 * @param props.target - Target object to merge into.
 * @param props.source - Optional source object to merge values from.
 * @param props.key - Dot-separated key path.
 *
 * @returns The `target` object with the specified `key` merged from `source`.
 *
 * @remarks Does not handle the case `key === '.'`, as it is not needed.
 *
 * @see -- type {@linkcode Decompose}
 */
export const merge2 = expandFn(
  <
    T,
    D = Decompose<T, { object: 'both'; start: false; sep: '.' }>,
    const K extends keyof D & string = keyof D & string,
  >({
    target,
    source,
    key,
  }: MergeProps2<T, K>): T | undefined => {
    if (!key) {
      return source as any;
    }

    const keys = key.split('.');
    const _key = keys.shift()!;

    // #region Maybe use later
    // const checkEmpty = _key === null || _key === undefined || _key === '';
    // if (checkEmpty) return target;
    // #endregion

    const next = (source as any)[_key];

    if (keys.length === 0) {
      (target as any)[_key] = next;
      return target;
    }

    if (
      (target as any)[_key] === undefined ||
      (target as any)[_key] === null ||
      typeof (target as any)[_key] !== 'object'
    ) {
      (target as any)[_key] = {};
    }

    merge2({
      target: (target as any)[_key],
      source: next,
      key: keys.join('.'),
    } as any);

    return target;
  },
  {
    /**
     * Sequentially merges multiple properties designated by key paths from multiple source objects into `target`.
     *
     * @template `T` - Target object type.
     * @template `D` - Decomposed representation of `T`.
     *
     * @param target - Target object to merge into.
     * @param sources - Variadic list of source objects with key paths of type {@linkcode Merger}.
     *
     * @returns The `target` object with all specified properties merged.
     *
     * @see -- type {@linkcode Decompose}
     */
    multiple: <T, D = Decompose<T, { object: 'both'; start: false; sep: '.' }>>(
      target: T,
      ...sources: Merger<T, keyof D & string>[]
    ): T | undefined => {
      return sources.reduce(
        (target, source) => merge2({ target, ...source } as any),
        target as T | undefined,
      );
    },
  },
);
