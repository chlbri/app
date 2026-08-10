import type { NodeConfig2 } from '@bemedev/app/states';
import type { RefineStringArray } from '@bemedev/app/types';
import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';
import { Transitions_Schema } from '../transitions/transitions';
import { recordV } from '../utils/record';
import { SoaLSchema } from '../utils/soa';
import { ActivityConfig_Schema } from './activity';

/**
 * Creates common Valibot object schema entries for state node configurations.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Object containing common node schema field definitions.
 *
 * @see {@linkcode Transitions_Schema}, {@linkcode ActionConfig_Schema}, {@linkcode ActivityConfig_Schema}
 */
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

/**
 * Internal predicate function to validate node configuration consistency across atomic, parallel, and compound types.
 *
 * @param node - The node configuration object to validate.
 *
 * @returns `true` if node type matches its structure, `false` otherwise.
 */
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

/**
 * Valibot check action to validate node type structural integrity.
 *
 * @see {@linkcode _checkNodeType}
 */
export const checkNodeType = v.check(
  _checkNodeType,
  'Must be "Atomic" or "Parallel" or "Compound" config',
);

/**
 * Valibot schema builder for validating state machine configuration nodes.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Valibot schema for validating machine node configuration of type {@linkcode NodeConfig2}.
 *
 * @see {@linkcode CommonNodeConfigEntries}, {@linkcode checkNodeType}
 */
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
