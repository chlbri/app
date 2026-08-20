import { GUARD_TYPE } from '#constants';
import type { EventObject } from '#events';
import type { GuardConfig } from '#guards';
import type { StateExtended } from '#states';
import { reduceFnMap } from '#utils';
import { expandFn, isDefined } from '@bemedev/app-utils-bemedev';
import recursive, {
  type AsyncGuardDefUnion,
  type GuardDefUnion,
} from '@bemedev/boolean-recursive';
import asyncRecursive from '@bemedev/boolean-recursive/async';
import type { PrimitiveObject } from '@bemedev/typings';
import { isDescriber, isString } from '../../types/primitives';
import type { AsyncPredicateS3, SyncPredicateS3, PredicateMap } from '../types';

/**
 * Signature for sync guard recursive parser function.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param guard - Guard configuration.
 * @param guards - Predicate map.
 * @param events - Machine events list.
 */
export type _ToPredicateF = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => {
  func?: GuardDefUnion<[StateExtended<Eo, Pc, Tc, T>]> | undefined;
  errors: string[];
};

/**
 * Signature for async guard recursive parser function.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param guard - Guard configuration.
 * @param guards - Predicate map.
 * @param events - Machine events list.
 */
export type _ToPredicateAsyncF = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => {
  func?: AsyncGuardDefUnion<[StateExtended<Eo, Pc, Tc, T>]> | undefined;
  errors: string[];
};

/**
 * Internal helper for converting guard configurations into boolean-recursive definitions.
 */
export type _ToPredicate = _ToPredicateF & { async: _ToPredicateAsyncF };

/**
 * Signature for converting guard config into executable sync predicate.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param guard - Guard configuration.
 * @param guards - Predicate map.
 * @param events - Machine events list.
 */
export type ToPredicate_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => { predicate?: SyncPredicateS3<Eo, Pc, Tc, T> | undefined; errors: string[] };

/**
 * Signature for converting guard config into executable async predicate.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param guard - Guard configuration.
 * @param guards - Predicate map.
 * @param events - Machine events list.
 */
export type ToPredicateAsync_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => { predicate?: AsyncPredicateS3<Eo, Pc, Tc, T> | undefined; errors: string[] };

/**
 * Combined type for sync and async guard predicate converters.
 *
 * @see -- type {@linkcode ToPredicate_F}, -- type {@linkcode ToPredicateAsync_F}
 */
export type ToPredicate = ToPredicate_F & { async: ToPredicateAsync_F };

/**
 * Internal implementation to convert a synchronous guard configuration into a predicate structure.
 *
 * @param guard - Guard configuration.
 * @param _guards - Map of predicates.
 * @param events - List of event names.
 *
 * @returns Object containing optional predicate function and accumulated error strings.
 */
const _toPredicateFn: _ToPredicateF = (guard, _guards, ...events) => {
  const errors: string[] = [];

  if (isDescriber(guard)) {
    const fn = _guards?.[guard.name];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(fn, ...events) : undefined;
    if (!func) errors.push(`Predicate (${guard.name}) is not defined`);
    return { func: func as any, errors };
  }

  if (isString(guard)) {
    const fn = _guards?.[guard];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(fn, ...events) : undefined;
    if (!func) errors.push(`Predicate (${guard}) is not defined`);
    return { func: func as any, errors };
  }

  const makeArray = (guards: GuardConfig[]) => {
    return guards
      .map(guard => _toPredicate(guard, _guards, ...events))
      .filter(({ errors: errors1 }) => {
        errors.push(...errors1);
        return true;
      })
      .map(({ func }) => func)
      .filter(isDefined);
  };

  if (GUARD_TYPE.and in guard) {
    const and = makeArray(guard.and);
    const check = and.length < 1;
    if (check) return { errors };

    return { func: { and }, errors };
  }

  const or = makeArray(guard.or);
  const check = or.length < 1;
  if (check) return { errors };

  return { func: { or }, errors };
};

/**
 * Internal implementation to convert an asynchronous guard configuration into a predicate structure.
 *
 * @param guard - Guard configuration.
 * @param _guards - Map of predicates.
 * @param events - List of event names.
 *
 * @returns Object containing optional predicate function and accumulated error strings.
 */
const _toPredicateAsyncFn: _ToPredicateAsyncF = (guard, _guards, ...events) => {
  const errors: string[] = [];

  if (isDescriber(guard)) {
    const fn = _guards?.[guard.name];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(fn, ...events) : undefined;
    if (!func) errors.push(`Predicate (${guard.name}) is not defined`);
    return { func: func as any, errors };
  }

  if (isString(guard)) {
    const fn = _guards?.[guard];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(fn, ...events) : undefined;
    if (!func) errors.push(`Predicate (${guard}) is not defined`);
    return { func: func as any, errors };
  }

  const makeArray = (guards: GuardConfig[]) =>
    guards
      .map(guard => _toPredicateAsyncFn(guard, _guards, ...events))
      .filter(({ errors: errors1 }) => {
        errors.push(...errors1);
        return true;
      })
      .map(({ func }) => func)
      .filter(isDefined);

  if (GUARD_TYPE.and in guard) {
    const and = makeArray(guard.and);
    const check = and.length < 1;
    if (check) return { errors };
    return { func: { and } as any, errors };
  }

  const or = makeArray(guard.or);
  const check = or.length < 1;
  if (check) return { errors };
  return { func: { or } as any, errors };
};

/**
 * Internal converter function resolving guard definitions into recursive guard objects.
 */
export const _toPredicate: _ToPredicate = expandFn(_toPredicateFn, {
  async: _toPredicateAsyncFn,
});

/**
 * Converts a guard configuration into an executable predicate function.
 *
 * @param guard - The guard configuration of type {@linkcode GuardConfig}.
 * @param guards - The map of guards containing functions to execute.
 * @param events - List of events of the machine.
 *
 * @returns An object containing the predicate function and any errors encountered.
 *
 * @see {@linkcode reduceFnMap}, {@linkcode isDescriber}, {@linkcode isString}, {@linkcode GUARD_TYPE}, {@linkcode recursive}
 */
export const toPredicate: ToPredicate = expandFn(
  (guard, guards, ...events) => {
    const { func, errors } = _toPredicate(guard, guards, ...events);
    if (!func) return { errors };
    const predicate = recursive(func);
    return { predicate, errors };
  },
  {
    async: ((guard, guards, ...events) => {
      const { func, errors } = _toPredicate.async(guard, guards, ...events);

      if (!func) return { errors };
      const _predicate = asyncRecursive(func as any);

      const predicate = async (...args: any[]) => {
        try {
          return await _predicate(...args);
        } catch {
          return false;
        }
      };

      return { predicate, errors };
    }) as ToPredicate['async'],
  },
);
