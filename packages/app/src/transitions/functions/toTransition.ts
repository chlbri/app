import { toAction } from '#actions';
import { toPredicate } from '#guards';
import type { AsyncTransition } from '#transitions';
import { toArray } from '@bemedev/app-utils-bemedev';

import type {
  Contract,
  ContractOptions,
  GuardConfig,
  TransitionConfig,
  WithDescriber,
} from '@bemedev/app-contract';

/**
 * Function signature for converting transition config into structured transition object.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 *
 * @param config - Transition configuration input.
 * @param options - Machine options object.
 * @param events - List of machine event names.
 *
 * @returns Structured transition instance of type {@linkcode AsyncTransition}.
 */
export type ToTransition_F = <Ct extends Contract = Contract>(
  config: TransitionConfig,
  options: Pick<ContractOptions<Ct>, 'actions' | 'guards'> | undefined,
  ...events: string[]
) => AsyncTransition<Ct>;

/**
 * Converts a transition configuration to a structured transition object with all functions.
 *
 * @param config - The transition configuration to convert.
 * @param options - Optional machine options that may include actions and guards configurations.
 * @param events - The events list used for action and guard resolution.
 * @returns A structured transition object with target, actions, guards, and optional description.
 *
 * @see {@linkcode toAction}, {@linkcode toPredicate}
 */
export const toTransition: ToTransition_F = (config, options, ...events) => {
  const isString = typeof config === 'string';
  if (isString) return { target: config };
  const { description, target } = config;

  const actions = toArray<WithDescriber>(config.actions).map(action =>
    toAction(action, options?.actions, ...events),
  );
  const guards = toArray<GuardConfig>(config.guards).map(guard =>
    toPredicate(guard, options?.guards, ...events),
  );

  const out = { target, actions, guards } as any;

  if (description) out.description = description;
  return out;
};
