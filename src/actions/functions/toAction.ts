import type {
  Action2,
  ActionMap,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ActionResult,
  WithDescriber,
} from '#actions';
import type { PrimitiveObject } from '#bemedev/globals/types';
import type { ActorsConfigMap, EventObject, EventsMap } from '#events';
import { reduceFnMap } from '#utils';
import { fromDescriber } from '~types';

export type ToAction_F = {
  <
    E extends EventsMap = EventsMap,
    A extends ActorsConfigMap = ActorsConfigMap,
    Pc = any,
    Tc extends PrimitiveObject = PrimitiveObject,
    T extends string = string,
    Eo extends EventObject = EventObject,
  >(
    events: E,
    actorsMap: A,
    action: WithDescriber,
    actions?: ActionMap<Eo, Pc, Tc, T>,
  ): Action2<Eo, Pc, Tc, T> | undefined;
};

const _toAction = (
  events: any,
  actorsMap: any,
  action: any,
  actions?: any,
) => {
  const name = fromDescriber(action);
  const fn = actions?.[name];
  const func = fn ? reduceFnMap(events, actorsMap, fn) : undefined;
  return func;
};

/**
 * Converts an ActionConfig to a function that can be executed with the provided eventsMap and actorsMap.
 * @param events of type {@linkcode EventsMap}, events map to use for resolving the action.
 * @param actorsMap of type {@linkcode PromiseeMap}, the promisees map to use for resolving the action.
 * @param action of type {@linkcode WithDescriber}, action configuration to convert.
 * @param actions of type {@linkcode ActionMap}, The actions map containing functions to execute.
 *
 * @see {@linkcode PrimitiveObject}
 * @see {@linkcode ActionResult}
 * @see {@linkcode reduceFnMap}
 */
export const toAction: ToAction_F = _toAction as any;
