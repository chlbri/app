import { DeepReadonly } from '@bemedev/app-options/bemedev';
import { expandFn } from '@bemedev/app-options/bemedev';

/**
 * Utility function for making objects deeply read-only with optional property freezing.
 *
 * Includes property {@linkcode readonly.freeze}.
 *
 * @template `T` - Object type returned as deeply read-only.
 *
 * @param obj - The object to return as deeply read-only.
 *
 * @returns The same object typed as type {@linkcode DeepReadonly}.
 */
export const readonly = expandFn(
  <const T extends object>(obj: T): DeepReadonly<T> => {
    return obj as any;
  },
  {
    /**
     * Freezes and returns a deeply read-only object.
     *
     * @template `T` - Object type.
     * @param obj - The object to freeze.
     *
     * @returns Deeply read-only frozen object.
     */
    freeze: <const T extends object>(obj: T): DeepReadonly<T> => {
      return Object.freeze(obj) as any;
    },
  },
);
