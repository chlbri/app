import { DeepReadonly } from '#bemedev/globals/types';
import { expandFn } from '#bemedev/globals/utils/expandFn';

export const readonly = expandFn(
  <const T extends object>(obj: T): DeepReadonly<T> => {
    return obj as any;
  },
  {
    freeze: <const T extends object>(obj: T): DeepReadonly<T> => {
      return Object.freeze(obj) as any;
    },
  },
);
