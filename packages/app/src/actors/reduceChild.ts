import type { ChildConfig } from './types';
import { reduceTransitions, type TransitionConfig } from '#transitions';
import { toArray } from '@bemedev/app-utils-bemedev';
import { createBetterSet } from '@bemedev/better-set';
import { pipe } from '@bemedev/pipe';
import { paramArray, tap } from '@bemedev/pipe/extensions';

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

  return {
    ...result,
    pContextKeys,
  };
};
