import type { ChildConfig } from './types';

import toArray from '#bemedev/features/arrays/castings/toArray';
import { _unknown } from '#bemedev/globals/utils/_unknown';
import { reduceTransitions, type TransitionConfig } from '#transitions';
import { pipe } from '@bemedev/pipe';

type Output = {
  actions: Set<string>;
  guards: Set<string>;
  targets: Set<string>;
  pContextKeys: Set<string>;
};

export type ReduceChild_F = (child: ChildConfig) => Output;

export const reduceChild: ReduceChild_F = child => {
  const pContextKeys = new Set<string>();

  const pipeContexts = pipe(
    (child: ChildConfig) => child.contexts,
    contexts => contexts ?? {},
    contexts => Object.values(contexts),
    values => {
      values.forEach(pContextKeys.add.bind(pContextKeys));
      return pContextKeys;
    },
  );

  const pipeOn = pipe(
    (child: ChildConfig) => child.on,
    on => on ?? {},
    on => Object.values(on),
    v => v.flat(),
    v => toArray<TransitionConfig>(v),
    v => reduceTransitions(...v),
  );

  const result = pipeOn(child);
  pipeContexts(child);

  return {
    ...result,
    pContextKeys,
  };
};
