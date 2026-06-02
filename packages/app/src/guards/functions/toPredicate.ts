import { GUARD_TYPE } from '#constants';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import type { GuardConfig } from '#guards';
import type { StateExtended } from '#states';
import { reduceFnMap } from '#utils';
import { isDefined } from '@bemedev/app-utils-bemedev';
import recursive, { type GuardDefUnion } from '@bemedev/boolean-recursive';
import type { PrimitiveObject } from '@bemedev/typings';
import { isDescriber, isString } from '~types';
import type { AsyncPredicateS3, PredicateMap } from '../types';

export type _ToPredicateF = <
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  events: E,
  actorsMap: A,
  guard: GuardConfig,
  guards?: PredicateMap<Eo, Pc, Tc, T>,
) => {
  func?: GuardDefUnion<[StateExtended<Eo, Pc, Tc, T>]> | undefined;
  errors: string[];
};

export type ToPredicate_F = <
  E extends EventsMap = EventsMap,
  A extends ActorsConfigMap = ActorsConfigMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  events: E,
  actorsMap: A,
  guard: GuardConfig,
  guards?: PredicateMap<Eo, Pc, Tc, T>,
) => {
  predicate?: AsyncPredicateS3<Eo, Pc, Tc, T> | undefined;
  errors: string[];
};

const _toPredicate: _ToPredicateF = (
  events,
  actorsMap,
  guard,
  _guards,
) => {
  const errors: string[] = [];

  if (isDescriber(guard)) {
    const fn = _guards?.[guard.name];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(events, actorsMap, fn) : undefined;
    if (!func) errors.push(`Predicate (${guard.name}) is not defined`);
    return { func, errors };
  }

  if (isString(guard)) {
    const fn = _guards?.[guard];
    if (typeof fn === 'boolean') return { func: () => fn, errors };
    const func = fn ? reduceFnMap(events, actorsMap, fn) : undefined;
    if (!func) errors.push(`Predicate (${guard}) is not defined`);
    return { func, errors };
  }

  const makeArray = (guards: GuardConfig[]) => {
    return guards
      .map(guard => _toPredicate(events, actorsMap, guard, _guards))
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

/**
 *
 * @param events of type {@linkcode EventsMap} [E], the events map to use for resolving the predicate.
 * @param promisees of type {@linkcode PromiseeMap} [P], the promisees map to use for resolving the predicate.
 * @param guard of type {@linkcode GuardConfig}, the guard configuration to convert to a predicate.
 * @param guards of type {@linkcode PredicateMap}, the map of guards containing functions to execute.
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
export const toPredicate: ToPredicate_F = (
  events,
  actorsMap,
  guard,
  guards,
) => {
  const { func, errors } = _toPredicate(events, actorsMap, guard, guards);

  if (!func) return { errors };

  return { predicate: recursive(func), errors };
};
