import type { EventObject } from '#events';
import type { StateExtended } from '#states';
import type { Decompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Supported activity and timer action strings.
 */
export type TimeActionsTypes =
  | 'pauseActivity'
  | 'resumeActivity'
  | 'stopActivity'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'stopTimer';

/**
 * Internal union of base action category strings.
 */
type _ActionTypes =
  | 'assign'
  | 'void'
  | 'sendTo'
  | 'resend'
  | 'forceSend'
  | 'debounce'
  | TimeActionsTypes;

/**
 * Prefixed action category string types.
 */
export type ActionTypes = `actions.${_ActionTypes}`;

/**
 * Union of core application types.
 */
export type AppTypes = ActionTypes | 'guards' | 'pContext' | 'context';

/**
 * Function signature for accessing state properties by dot-delimited key.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type ByKey_F<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = <
  S extends StateExtended<E, Pc, Tc, T>,
  D = Decompose<S, { object: 'both'; start: false; sep: '.' }>,
  K extends keyof D & string = keyof D & string,
>(
  key: K,
) => D[K];
