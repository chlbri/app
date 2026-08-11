import type { EventObject } from '#events';
import { FnR } from '~types';
import type {
  DefinedValue,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AsyncPredicateS2,
} from '../../types';
import { isNotValue, isValue } from './value';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Function signature for checking if a path in context or events is defined/undefined.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 *
 * @param path - Target path string of type {@linkcode DefinedValue}.
 *
 * @returns Guard evaluation function of type {@linkcode FnR}.
 */
export type IsDefinedS_F = <
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
>(
  path: DefinedValue<Pc, Tc>,
) => FnR<E, Pc, Tc, T, boolean>;

/**
 * Checks if the given path is defined (not undefined or null).
 * @param path : A {@linkcode DefinedValue}, the path to retrieve.
 * @returns A {@linkcode AsyncPredicateS2} function that returns true if the path is defined, false otherwise.
 *
 * @see {@linkcode isNotValue}
 */
export const isDefinedS: IsDefinedS_F = path => {
  return isNotValue(path, undefined, null);
};

/**
 * Checks if the given path is undefined or null.
 * @param path : A {@linkcode DefinedValue} , the path to retrieve.
 * @returns A {@linkcode AsyncPredicateS2} function that returns true if the path is undefined or null, false otherwise.
 *
 * @see {@linkcode isValue}
 */
export const isNotDefinedS: IsDefinedS_F = path => {
  return isValue(path, undefined, null);
};
