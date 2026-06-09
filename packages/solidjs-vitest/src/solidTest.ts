import { createRoot } from 'solid-js';
import type { SolidTest_F } from './solidTest.types';

/**
 * A testing helper that wraps the execution of the solid-app `pipe` function inside `createRoot`.
 * This prevents the "computations created outside a createRoot" warning in tests,
 * while keeping the exact same TypeScript typings.
 *
 * @example
 * ```ts
 * import { pipe as _pipe } from '@bemedev/app-solidjs';
 * import { pipe } from '@bemedev/app-solidjs-vitest';
 *
 * const solid = pipe(() => _pipe(service));
 * ```
 */
export const solidTest: SolidTest_F = solid => {
  return createRoot(dispose => {
    const originalDispose = solid.dispose;

    const customDispose = () => {
      originalDispose();
      dispose();
    };

    if (typeof Symbol !== 'undefined' && Symbol.dispose) {
      solid[Symbol.dispose] = customDispose;
    }
    if (typeof Symbol !== 'undefined' && Symbol.asyncDispose) {
      solid[Symbol.asyncDispose] = async () => customDispose();
    }

    return solid as any;
  });
};
