import type { Contexts } from '#common/interpreter';
import type { PrimitiveObject } from '@bemedev/typings';
import { deepmerge } from 'deepmerge-ts';
import type { Describer, Describer2 } from '~types';

/**
 * Merges multiple context functions into a single composite reducer function.
 *
 * @template Pc - Type of the public context. Defaults to `any`.
 * @template {PrimitiveObject} Tc - Type of the state context. Defaults to type {@linkcode PrimitiveObject}.
 *
 * @param remains - Rest parameter of functions returning target and context objects.
 *
 * @returns A composite function that deep-merges all remaining contexts.
 *
 * @see -- type {@linkcode Contexts}
 */
export const reduceRemainings = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
>(
  ...remains: (() => { result: Contexts<Pc, Tc>; target?: string })[]
) => {
  const remaining = (): { target?: string; result: Contexts<Pc, Tc> } => {
    let target: string | undefined = undefined;
    let result: Contexts<Pc, Tc> = {};

    remains
      .map(f => f())
      .forEach(remain => {
        target = remain.target;
        result = deepmerge(result, remain.result) as any;
      });

    return { target, result };
  };

  return remaining;
};

/**
 * Function signature for converting a string name or type {@linkcode Describer} object into a type {@linkcode Describer2}.
 *
 * @param arg - String name or partial describer.
 *
 * @returns Fully formatted type {@linkcode Describer2} object.
 */
export type ToDescriber_F = (arg: string | Describer) => Describer2;

/**
 * Converts a string name or type {@linkcode Describer} into a normalized type {@linkcode Describer2} object.
 *
 * @param name - State name or describer object.
 *
 * @returns Normalized type {@linkcode Describer2} object.
 *
 * @see -- type {@linkcode ToDescriber_F}
 */
export const toDescriber: ToDescriber_F = name => {
  const check = typeof name === 'object';
  if (check) {
    return name;
  }
  return { name };
};
