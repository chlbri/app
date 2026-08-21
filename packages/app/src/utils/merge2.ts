import { type Decompose } from '@bemedev/decompose';
import type { TrueObject } from '~types';

/**
 * Properties for the {@linkcode merge2} function.
 *
 * @template | {@linkcode TrueObject} `T` - Target object type.
 * @template `K` - Key path string type.
 */
export type MergeProps2<T extends TrueObject, K extends string> = {
  /** Target object to merge into. */
  target: T;
  /** Optional source object containing values to merge. */
  source?: T;
  /** Dot-separated key path indicating which property to merge. */
  key: K;
};

/**
 * Merges a specific property designated by a dot-separated `key` path from `source` into a clone of `target`.
 *
 * @template | {@linkcode TrueObject} `T` - Target object type.
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
export const merge2 = <
  T extends TrueObject,
  D = Decompose<T, { object: 'both'; start: false; sep: '.' }>,
  K extends keyof D & string = keyof D & string,
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

  const next = source[_key];
  if (next == undefined || next === null) return target;

  const _target: any = structuredClone(target);
  if (keys.length === 0) {
    _target[_key] = next;
    return _target;
  }

  _target[_key] = merge2({
    target: _target[_key],
    source: next,
    key: keys.join('.'),
  } as any);

  return _target;
};
