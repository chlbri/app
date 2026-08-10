import type { NodeConfig2 } from '@bemedev/app/states';
import type { RefineStringArray } from '@bemedev/app/types';
import * as v from 'valibot';
import {
  checkNodeType,
  CommonNodeConfigEntries,
  NodeConfig_Schema,
} from './states/node';
import { recordV } from './utils/record';

/**
 * Valibot schema builder for machine state configuration node.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 * @param paths - Allowed target state paths.
 * @returns Valibot schema for validating a machine node configuration.
 */
export const Config_Schema = <
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
