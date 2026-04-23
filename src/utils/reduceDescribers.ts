import { fromDescriber } from '~types';
import type { WithDescriber } from '../actions/types';
import { createBetterSet } from './set';

export const reduceDescribers = (...describers: WithDescriber[]) => {
  const keys = createBetterSet<string>();

  describers.forEach(describer => {
    const key = fromDescriber(describer);
    keys.add(key);
  });

  return keys;
};
