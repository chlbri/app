import { DeepReadonly } from '@bemedev/app-utils-bemedev';
import { expandFn } from '@bemedev/app-utils-bemedev';

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
