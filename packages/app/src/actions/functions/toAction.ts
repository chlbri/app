import type { AsyncAction2, AsyncActionMap, WithDescriber } from '#actions';
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

/**
 * Internal helper function to convert an action configuration into an executable function.
 *
 * @param action - Action configuration.
 * @param actions - Map of actions.
 * @param events - List of event names.
 *
 * @returns Executable action function or `undefined`.
 */
const _toAction = (action: any, actions: any, ...events: string[]) => {
  const name = fromDescriber(action);
  const fn = actions?.[name];
  const func = fn ? reduceFnMap(fn, ...events) : undefined;
  return func;
};

/**
 * Converts an action configuration of type {@linkcode WithDescriber} into an executable action function.
 *
 * @param action - Action configuration of type {@linkcode WithDescriber}.
 * @param actions - Map of actions of type {@linkcode AsyncActionMap}.
 * @param events - List of event names.
 *
 * @returns Executable action function of type {@linkcode AsyncAction2} or `undefined`.
 *
 * @see -- type {@linkcode PrimitiveObject}, {@linkcode reduceFnMap}
 */
export const toAction: ToAction_F = _toAction as any;
