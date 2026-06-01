import type { EventObject } from '#events';
import type { StateExtended } from '#states';
import type { Decompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';

export type TimeActionsTypes =
  | 'pauseActivity'
  | 'resumeActivity'
  | 'stopActivity'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'stopTimer';

type _ActionTypes =
  | 'assign'
  | 'void'
  | 'sendTo'
  | 'resend'
  | 'forceSend'
  | 'debounce'
  | TimeActionsTypes;

export type ActionTypes = `actions.${_ActionTypes}`;

export type AppTypes = ActionTypes | 'guards' | 'pContext' | 'context';

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
