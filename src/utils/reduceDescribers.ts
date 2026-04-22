import { fromDescriber } from '~types';
import type { WithDescriber } from '../actions/types';

export const reduceDescribers = (...describers: WithDescriber[]) => {
  const keys = new Set<string>();

  describers.forEach(describer => {
    const key = fromDescriber(describer);
    keys.add(key);
  });

  return keys;
};
