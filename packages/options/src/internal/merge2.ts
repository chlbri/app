/**
 * Deep merge helpers used by the `assign`, `batch`, `_for`, `_while` and
 * `_doWhile` option helpers.
 *
 * Vendored from `@bemedev/app` to keep this package independent from the
 * machine runtime.
 */

import { expandFn } from './expandFn';

/** Source object and key path to merge. */
export type Merger<T = any, K extends string = string> = {
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key?: K;
};

/** Properties accepted by {@linkcode merge2}. */
export type MergeProps2<T = any, K extends string = string> = {
  /** Target object to merge into. */
  target: T;
} & Merger<T, K>;

/**
 * Merges a property designated by a dot-separated `key` path from `source`
 * into `target`.
 *
 * @param props - Target, source and key path.
 *
 * @returns The merged target, or `source` when no `key` is provided.
 */
const _merge2 = ({ target, source, key }: MergeProps2): any => {
  if (!key) return source;

  const keys = key.split('.');
  const _key = keys.shift()!;
  const next = (source as any)?.[_key];

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

  _merge2({ target: (target as any)[_key], source: next, key: keys.join('.') });

  return target;
};

/**
 * Sequentially merges multiple key paths from multiple sources into `target`.
 *
 * @param target - Target object to merge into.
 * @param sources - Variadic list of mergers.
 *
 * @returns The merged target.
 */
export const merge2 = expandFn(_merge2, {
  multiple: (target: any, ...sources: Merger[]): any =>
    sources.reduce((acc, source) => _merge2({ target: acc, ...source }), target),
});
