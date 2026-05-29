import { NON_BREAKABLE_SPACE, VISIBLE_ESPACE } from '../constants';

export const espace = (newText: string) => {
  if (newText === '') {
    return VISIBLE_ESPACE;
  }
  return newText;
};

export const repeatSpace = (count = 1) => {
  return NON_BREAKABLE_SPACE.repeat(count);
};
