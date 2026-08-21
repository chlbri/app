import { expandFn } from '@bemedev/app-utils-bemedev';
import { type Decompose } from '@bemedev/decompose';

export type Merger<T, K extends string> = {
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key: K;
};

/**
 * Properties for the {@linkcode merge2} function.
 *
 * @template  `T` - Target object type.
 * @template `K` - Key path string type.
 */
export type MergeProps2<T, K extends string> = {
  /** Target object to merge into. */
  target: T;
} & Merger<T, K>;

/**
 * Merges a specific property designated by a dot-separated `key` path from `source` into a clone of `target`.
 *
 * @template  `T` - Target object type.
 * @template `D` - Decomposed representation of `T`.
 * @template `K` - Valid dot-separated key path in `D`.
 *
 * @param props - Configuration properties of type {@linkcode MergeProps2}.
 * @param props.target - Target object to merge into.
 * @param props.source - Optional source object to merge values from.
 * @param props.key - Dot-separated key path.
 *
 * @returns Cloned `target` with the specified `key` merged from `source`.
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
  }: MergeProps2<T, K>): T => {
    const checkDefined = source === undefined || source === null;
    if (checkDefined) return target;

    const keys = key.split('.');
    const _key = keys.shift();
    if (!_key) return target;

    const next = (source as any)[_key];
    if (next == undefined || next === null) return target;

    if (keys.length === 0) {
      (target as any)[_key] = next;
      return target;
    }

    (target as any)[_key] = merge2({
      target: (target as any)[_key],
      source: next,
      key: keys.join('.'),
    } as any);

    return target;
  },
  {
    multiple: <T, D = Decompose<T, { object: 'both'; start: false; sep: '.' }>>(
      target: T,
      ...sources: Merger<T, keyof D & string>[]
    ) => {
      return sources.reduce(
        (target, source) => merge2({ target, ...source } as any),
        target,
      );
    },
  },
);
