import type { Merger } from '@bemedev/app-options';
import { merge2 as _merge2 } from '@bemedev/app-options/internal';
import { type Decompose } from '@bemedev/decompose';
import type { FnBasic } from '../bemedev';

export type { Merger } from '@bemedev/app-options';

/**
 * Properties for the {@linkcode merge2} function.
 *
 * @template `T` - Target object type.
 * @template `K` - Key path string type.
 */
type MergeProps2<T, K extends string = string> = {
  /** Target object to merge into. */
  target: T;
} & Merger<T, K>;

export type Merge2_F = FnBasic<
  <
    T,
    D = Decompose<T, { object: 'both'; start: false; sep: '.' }>,
    const K extends keyof D & string = keyof D & string,
  >({
    target,
    source,
    key,
  }: MergeProps2<T, K>) => T | undefined,
  {
    readonly multiple: <
      T,
      D = Decompose<T, { object: 'both'; start: false; sep: '.' }>,
    >(
      target: T,
      ...sources: Merger<T, keyof D & string>[]
    ) => T | undefined;
  }
>;

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
export const merge2: Merge2_F = _merge2;
