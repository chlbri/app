import { DEFAULT_DELIMITER } from '#constants';
import { replaceAll } from '#utils';
import { decomposeSV, type StateValue } from '@bemedev/decompose';
import { isString } from '~types';

import type { NodeConfig2 } from '../types';
import { flatMap } from './flatMap';
import { getChildren } from './getChildren';
import { getParents } from './getParents';
import { recomposeConfig } from './recompose';

/**
 * Function signature for converting a state value into a node configuration.
 *
 * @template | {@linkcode StateValue} `T` - State value type.
 *
 * @param body - Node configuration body.
 * @param from - State value input.
 * @param initial - Optional initial state flag.
 *
 * @returns Converted type {@linkcode NodeConfig2} object.
 */
export type ValueToNodeConfig_F = <T extends StateValue>(
  body: NodeConfig2,
  from: T,
  initial?: boolean,
) => NodeConfig2;

/**
 * Converts a state value to a node configuration based on the provided body and from value.
 *
 * @param body - The node configuration body to convert from.
 * @param from - The state value to convert to a node configuration.
 * @param initial - Optional flag to indicate if the initial state should be included.
 * @returns A node configuration object that represents the state value.
 *
 * @see {@linkcode flatMap}, {@linkcode getChildren}, {@linkcode getParents}, {@linkcode recomposeConfig}, {@linkcode DEFAULT_DELIMITER}
 */
export const valueToNodeConfig: ValueToNodeConfig_F = (body, from) => {
  const flatBody = flatMap(body, false);
  const keysFlatBody = Object.keys(flatBody);
  const fromIsString = isString(from);
  if (fromIsString) {
    const check2 = keysFlatBody.includes(from);
    if (check2) {
      const parents = getParents(from as any);
      const children = getChildren(from, ...keysFlatBody);
      const out1: any = {};

      parents.concat(children).forEach(key => {
        out1[key] = (flatBody as any)[key];
      });

      const out: any = recomposeConfig(out1);
      return out;
    }
    return {};
  }

  const flatFrom = decomposeSV(from)
    .map(key =>
      replaceAll({ entry: key, match: '.', replacement: DEFAULT_DELIMITER }),
    )
    .map(key => `/${key}`);

  const out1: any = {};

  flatFrom.forEach((key1, _, all) => {
    const parents = getParents(key1 as any);
    const check4 = keysFlatBody.some(key => key.startsWith(key1));

    parents.forEach(parent => {
      out1[parent] = (flatBody as any)[parent];
    });

    /* v8 ignore else -- @preserve */
    if (check4) {
      out1[key1] = (flatBody as any)[key1];

      const initial = (flatBody as any)[key1].initial;
      if (initial) {
        const _initial = `${key1}${DEFAULT_DELIMITER}${initial}`;
        const cannotContinue = all.some(key =>
          key.startsWith(`${key1}${DEFAULT_DELIMITER}`),
        );
        if (cannotContinue) return;
        out1[_initial] = (flatBody as any)[_initial];
      }
    }
  });

  const out2 = recomposeConfig(out1);
  return out2;
};
