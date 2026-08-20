import type { SoA } from '@bemedev/typings';
import { isDescriber, isString, type Describer } from '~types';

/**
 * Type guard for checking if an entry is a string or action describer.
 *
 * @param entry - Target value.
 *
 * @returns `true` if string or type {@linkcode Describer}, `false` otherwise.
 */
export const checkAction = (entry: unknown): entry is string | Describer => {
  return entry !== null && (isString(entry) || isDescriber(entry));
};

/**
 * Type guard for checking single action entry or array of action entries.
 *
 * @param action - Target value.
 *
 * @returns `true` if single or array of action descriptors, `false` otherwise.
 */
export const checkActions = (action: unknown): action is SoA<string | Describer> => {
  if (Array.isArray(action)) return action.every(checkAction);
  else return checkAction(action);
};

checkActions.orUndefined = (
  action: unknown,
): action is SoA<string | Describer> | undefined => {
  if (action === undefined) return true;
  return checkActions(action);
};
