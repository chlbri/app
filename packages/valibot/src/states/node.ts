import type { NodeConfig2 } from '@bemedev/app/states';
import type { RefineStringArray } from '@bemedev/app/types';
import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';
import { Transitions_Schema } from '../transitions/transitions';
import { recordV } from '../utils/record';
import { SoaLSchema } from '../utils/soa';
import { ActivityConfig_Schema } from './activity';

export const CommonNodeConfigEntries = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return {
    ...Transitions_Schema(...paths).entries,
    description: v.optional(v.string()),
    entry: v.optional(SoaLSchema(ActionConfig_Schema)),
    exit: v.optional(SoaLSchema(ActionConfig_Schema)),
    tags: v.optional(SoaLSchema(v.string())),
    initial: v.optional(v.string()),
    activities: v.optional(recordV(v.string(), ActivityConfig_Schema)),

    type: v.optional(
      v.union([
        v.literal('compound'),
        v.literal('parallel'),
        v.literal('atomic'),
      ]),
    ),
  };
};

const _checkNodeType = (node: any) => {
  const checkAtomic =
    (!node.type || node.type === 'atomic') &&
    node.states === undefined &&
    node.initial === undefined;

  const checkParallel =
    node.type === 'parallel' &&
    node.states !== undefined &&
    node.initial === undefined;

  const checkCompound =
    (!node.type || node.type === 'compound') &&
    node.states !== undefined &&
    node.initial !== undefined;

  return checkAtomic || checkParallel || checkCompound;
};

export const checkNodeType = v.check(
  _checkNodeType,
  'Must be "Atomic" or "Parallel" or "Compound" config',
);

export const NodeConfig_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
): v.BaseSchema<
  NodeConfig2<RefineStringArray<T>>,
  NodeConfig2<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.strictObject(
      {
        ...CommonNodeConfigEntries(...paths),
        states: v.optional(
          recordV(
            v.string(),
            v.lazy(() => NodeConfig_Schema(...paths)),
          ),
        ),
      },
      ({ path = [] }) => {
        const key = path.map(({ key }) => key).join('.');
        return `Unexpected key '${key}' in node config`;
      },
    ),
    checkNodeType,
  ) as any;
};
