import type {
  AsyncAction2,
  AsyncActionMap,
  WithDescriber,
} from '#actions';
import type { EventObject } from '#events';
import { reduceFnMap } from '#utils';
import type { PrimitiveObject } from '@bemedev/typings';
import { fromDescriber } from '~types';

/**
 * Function signature for converting an action describer to an executable action function.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Public context type.
 * @template {string} T - State path string type.
 * @template {EventObject} Eo - Event object type.
 *
 * @param action - Action describer or string key.
 * @param actions - Optional map of async actions.
 * @param events - List of machine event strings.
 *
 * @returns Executable action function of type {@linkcode AsyncAction2} or `undefined`.
 */
export type ToAction_F = {
  <
    Pc = any,
    Tc extends PrimitiveObject = PrimitiveObject,
    T extends string = string,
    Eo extends EventObject = EventObject,
  >(
    action: WithDescriber,
    actions: AsyncActionMap<Eo, Pc, Tc, T> | undefined,
    ...events: string[]
  ): AsyncAction2<Eo, Pc, Tc, T> | undefined;
};

const _toAction = (action: any, actions: any, ...events: string[]) => {
  const name = fromDescriber(action);
  const fn = actions?.[name];
  const func = fn ? reduceFnMap(fn, ...events) : undefined;
  return func;
};

/**
 * Converts an ActionConfig to a function that can be executed with the provided events list.
 * @param action of type {@linkcode WithDescriber}, action configuration to convert.
 * @param actions of type {@linkcode AsyncActionMap}, The actions map containing functions to execute.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 *
 * @see {@linkcode PrimitiveObject}
 * @see {@linkcode reduceFnMap}
 */
export const toAction: ToAction_F = _toAction as any;
