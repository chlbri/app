import type { AsyncAction2, AsyncActionMap } from '#actions';
import type { Contract } from '@bemedev/app-options';
import { reduceFnMap } from '@bemedev/app-plugins/internal';

/**
 * Function signature for converting an action describer to an executable action function.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @param action - Action describer or string key.
 * @param actions - Optional map of async actions.
 * @param events - List of machine event strings.
 *
 * @returns Executable action function of type {@linkcode AsyncAction2} or `undefined`.
 */
export type ToAction_F = {
  <Ct extends Contract = Contract>(
    action: string,
    actions: AsyncActionMap<Ct> | undefined,
    ...events: string[]
  ): AsyncAction2<Ct> | undefined;
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
  const fn = actions?.[action];
  const func = fn ? reduceFnMap(fn, ...events) : undefined;
  return func;
};

/**
 * Converts an action name into an executable action function.
 *
 * @param action - Action name.
 * @param actions - Map of actions of type {@linkcode AsyncActionMap}.
 * @param events - List of event names.
 *
 * @returns Executable action function of type {@linkcode AsyncAction2} or `undefined`.
 *
 * @see -- type {@linkcode PrimitiveObject}, {@linkcode reduceFnMap}
 */
export const toAction: ToAction_F = _toAction as any;
