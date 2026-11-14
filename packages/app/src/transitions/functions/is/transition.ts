import { checkActions } from '#actions';
import { checkValues } from '#utils';
import type {
  TransitionConfigF,
  TransitionConfigMapA,
  TransitionConfigMapF,
} from '../../types';

import { isTransitionConfigMap } from '@bemedev/app-options/internal';
export {
  isSingleOrArrayT,
  isTransitionArray,
  isTransitionConfig,
  isTransitionConfigMap,
} from '@bemedev/app-options/internal';

/**
 * Type guard for checking if a transition map requires a target.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigMapF}, `false` otherwise.
 */
export const isTransitionConfigMapTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMapF<T[number]> => {
  return isTransitionConfigMap(value, ...keys) && value.target !== undefined;
};

/**
 * Type guard for checking if a transition map requires actions.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigMapA}, `false` otherwise.
 */
export const isTransitionConfigMapActions = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigMapA<T[number]> => {
  return isTransitionConfigMap(value, ...keys) && checkActions(value.actions);
};

/**
 * Type guard for checking target-required transition configuration.
 *
 * @template `T` - Keys tuple type.
 *
 * @param value - Value to check.
 * @param keys - Allowed target paths.
 *
 * @returns `true` if type {@linkcode TransitionConfigF}, `false` otherwise.
 */
export const isTransitionConfigTarget = <T extends string[] = string[]>(
  value: unknown,
  ...keys: T
): value is TransitionConfigF<T[number]> => {
  if (typeof value === 'string') {
    return checkValues(value, ...keys);
  }
  return isTransitionConfigMapTarget(value, ...keys);
};
