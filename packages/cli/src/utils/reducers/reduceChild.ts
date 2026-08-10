import { reduceTransitions } from './reduceTransitions';
import {
  toArray,
  type ChildConfig,
  type TransitionConfig,
} from '@bemedev/app';
import { createBetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { paramArray, tap } from '@bemedev/pipe/extensions/common';

/**
 * Reduces a child machine configuration into symbol sets and pContext keys.
 *
 * @param child - Child machine configuration object of type {@linkcode ChildConfig}.
 *
 * @returns Reduced symbol sets object including `pContextKeys`.
 */
export const reduceChild = (child: ChildConfig) => {
  const pContextKeys = createBetterSet<string>();

  const result = pipe(
    () => child,
    tap(
      pipe(
        v => v.contexts,
        v => v ?? {},
        Object.values,
        paramArray(pContextKeys.add),
      ),
    ),
    v => v.on,
    on => on ?? {},
    on => Object.values(on),
    v => v.flat(),
    toArray<TransitionConfig>,
    paramArray(reduceTransitions),
  )();

  return { ...result, pContextKeys };
};
