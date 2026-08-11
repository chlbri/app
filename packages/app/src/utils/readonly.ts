import { DeepReadonly } from '@bemedev/app-utils-bemedev';
import { expandFn } from '@bemedev/app-utils-bemedev';

/**
 * Utility function for making objects deeply read-only with optional property freezing.
 */
export const readonly = expandFn(
  <const T extends object>(obj: T): DeepReadonly<T> => {
    return obj as any;
  },
  {
    /**
     * Freezes and returns a deeply read-only object.
     *
     * @template {object} T - Object type.
     * @param obj - The object to freeze.
     *
     * @returns Deeply read-only frozen object.
     */
    freeze: <const T extends object>(obj: T): DeepReadonly<T> => {
      return Object.freeze(obj) as any;
    },
  },
);
