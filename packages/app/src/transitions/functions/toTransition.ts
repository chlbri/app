import { toAction } from '#actions';
import type { SimpleMachineOptions2 } from '#common/machine';
import type { EventObject } from '#events';
import { toPredicate, type GuardConfig } from '#guards';
import type { AsyncTransition, TransitionConfig } from '#transitions';

import { toArray } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';

export type ToTransition_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  config: TransitionConfig,
  options: Pick<SimpleMachineOptions2, 'actions' | 'guards'> | undefined,
  ...events: string[]
) => AsyncTransition<Eo, Pc, Tc, T>;

/**
 * Converts a transition configuration to a structured transition object with all functions.
 *
 * @param config - The transition configuration to convert.
 * @param options - Optional machine options that may include actions and guards configurations.
 * @param events - The events list used for action and guard resolution.
 * @returns A structured transition object with target, actions, guards, and optional description.
 *
 * @see {@linkcode ToTransition_F} for more details
 * @see {@linkcode toAction} for converting actions
 * @see {@linkcode toPredicate} for converting guards
 * @see {@linkcode toArray.typed} for ensuring typed arrays
 * @see {@linkcode toArray} for ensuring typed arrays
 */
export const toTransition: ToTransition_F = (
  config,
  options,
  ...events
) => {
  const isString = typeof config === 'string';
  if (isString) return { target: config };
  const { description, target } = config;

  const actions = toArray
    .typed(config.actions)
    .map(action => toAction(action, options?.actions, ...events));
  const guards = toArray<GuardConfig>(config.guards).map(guard =>
    toPredicate(guard, options?.guards, ...events),
  );

  const out = { target, actions, guards } as any;

  if (description) out.description = description;
  return out;
};
