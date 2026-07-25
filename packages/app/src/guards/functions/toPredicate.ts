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
import type {
  AsyncPredicateS3,
  SyncPredicateS3,
  PredicateMap,
} from '../types';

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

export type _ToPredicate = _ToPredicateF & { async: _ToPredicateAsyncF };

export type ToPredicate_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => {
  predicate?: SyncPredicateS3<Eo, Pc, Tc, T> | undefined;
  errors: string[];
};

export type ToPredicateAsync_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  guard: GuardConfig,
  guards: PredicateMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => {
  predicate?: AsyncPredicateS3<Eo, Pc, Tc, T> | undefined;
  errors: string[];
};

export type ToPredicate = ToPredicate_F & { async: ToPredicateAsync_F };

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
        const check = errors1.length > 0;
        if (check) {
          errors.push(...errors1);

          // Because if it has error, the function is not defined
          return false;
        }
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

const _toPredicateAsync: _ToPredicateAsyncF = (
  guard,
  _guards,
  ...events
) => {
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
      .map(guard => _toPredicate.async(guard, _guards, ...events))
      .filter(({ errors: errors1 }) => {
        const check = errors1.length > 0;
        if (check) {
          errors.push(...errors1);
          return false;
        }
        return true;
      })
      .map(({ func }) => func)
      .filter(isDefined);
  };

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

export const _toPredicate: _ToPredicate = expandFn(_toPredicateFn, {
  async: _toPredicateAsync,
});

/**
 *
 * @param guard of type {@linkcode GuardConfig}, the guard configuration to convert to a predicate.
 * @param guards of type {@linkcode PredicateMap}, the map of guards containing functions to execute.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns an object containing the predicate function and any errors encountered during the conversion.
 *
 * @see {@linkcode PrimitiveObject}
 * @see {@linkcode AsyncPredicateS3}
 * @see {@linkcode GuardDefUnion}
 * @see {@linkcode reduceFnMap}
 * @see {@linkcode isDescriber}
 * @see {@linkcode isString}
 * @see {@linkcode castings}
 * @see {@linkcode GUARD_TYPE}
 * @see {@linkcode recursive}
 */
export const toPredicate: ToPredicate = expandFn(
  (guard, guards, ...events) => {
    const { func, errors } = _toPredicate(guard, guards, ...events);

    if (!func) return { errors };

    return { predicate: recursive(func), errors };
  },
  {
    async: ((guard, guards, ...events) => {
      const { func, errors } = _toPredicate.async(
        guard,
        guards,
        ...events,
      );

      if (!func) return { errors };

      const predicate = asyncRecursive(func as any);

      const safePredicate = async (...args: any[]) => {
        try {
          return await predicate(...args);
        } catch {
          return false;
        }
      };

      return { predicate: safePredicate as any, errors };
    }) as ToPredicate['async'],
  },
);
