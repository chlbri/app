import {
  checkNodeType,
  CommonNodeConfigEntries,
  NodeConfig_Schema,
} from '#states';
import { recordV } from '#utils/schemas';
import * as v from 'valibot';
import type { NodeConfig, RefineStringArray } from '~types';

export const Config_Schema = <
  T extends ReadonlyArray<string> = ReadonlyArray<string>,
>(
  ...paths: T
): v.BaseSchema<
  NodeConfig<RefineStringArray<T>>,
  NodeConfig<RefineStringArray<T>>,
  any
> => {
  return v.pipe(
    v.strictObject(
      {
        ...CommonNodeConfigEntries(...paths),
        strict: v.optional(v.boolean()),
        __longRuns: v.optional(v.boolean()),

        states: v.optional(
          recordV(
            v.string('Keys of states must be of type "string"'),
            NodeConfig_Schema(...paths),
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
