import type { SoA } from '@bemedev/typings';
import { isDescriber, isString, type Describer } from '~types';

export const checkAction = (
  entry: unknown,
): entry is string | Describer => {
  return isString(entry) || isDescriber(entry);
};

export const checkActions = (
  action: unknown,
): action is SoA<string | Describer> => {
  if (Array.isArray(action)) return action.every(checkAction);
  else return checkAction(action);
};

checkAction.orUndefined = (
  action: unknown,
): action is string | Describer | undefined => {
  if (action === undefined) return true;
  return checkAction(action);
};

checkActions.orUndefined = (
  action: unknown,
): action is SoA<string | Describer> | undefined => {
  if (action === undefined) return true;
  return checkActions(action);
};
