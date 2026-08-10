import * as v from 'valibot';
import { ActionConfig_Schema } from '../actions';
import { GuardConfig_Schema } from '../guards';
import { SoaLSchema } from '../utils/soa';
import { TargetSchema } from './target';

/**
 * Valibot schema builder for transition configuration objects with actions (optional target).
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Strict object schema for action-driven transition configuration.
 *
 * @see {@linkcode TargetSchema}, {@linkcode SoaLSchema}, {@linkcode ActionConfig_Schema}, {@linkcode GuardConfig_Schema}
 */
export const TransitionConfigMapA_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const target = v.optional(TargetSchema(paths));

  return v.strictObject({
    target,
    actions: SoaLSchema(ActionConfig_Schema),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
    description: v.optional(v.string()),
  });
};

/**
 * Valibot schema builder for transition configuration objects requiring explicit target.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Strict object schema for target-driven transition configuration.
 *
 * @see {@linkcode TargetSchema}, {@linkcode SoaLSchema}, {@linkcode ActionConfig_Schema}, {@linkcode GuardConfig_Schema}
 */
export const TransitionConfigMapF_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const target = TargetSchema(paths);

  return v.strictObject({
    target,
    actions: v.optional(SoaLSchema(ActionConfig_Schema)),
    guards: v.optional(SoaLSchema(GuardConfig_Schema)),
    description: v.optional(v.string()),
  });
};

/**
 * Valibot schema builder for transition configuration objects requiring guards.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Union schema of action/target transition maps with mandatory guards.
 *
 * @see {@linkcode TransitionConfigMapA_Schema}, {@linkcode TransitionConfigMapF_Schema}, {@linkcode GuardConfig_Schema}
 */
export const TransitionConfigMapG_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  const out = v.union([
    v.strictObject({
      ...v.omit(TransitionConfigMapA_Schema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
    v.strictObject({
      ...v.omit(TransitionConfigMapF_Schema(...paths), ['guards']).entries,
      guards: SoaLSchema(GuardConfig_Schema),
    }),
  ]);

  return out;
};

/**
 * Valibot schema builder for transition configuration objects requiring both target and guards.
 *
 * @template {ReadonlyArray<string>} T - Array of valid state path string literals.
 *
 * @param paths - Allowed target state paths.
 *
 * @returns Strict object schema for target transition maps with mandatory guards.
 *
 * @see {@linkcode TransitionConfigMapF_Schema}, {@linkcode GuardConfig_Schema}
 */
export const TransitionConfigMapFG_Schema = <
  const T extends ReadonlyArray<string>,
>(
  ...paths: T
) => {
  return v.strictObject({
    ...v.omit(TransitionConfigMapF_Schema(...paths), ['guards']).entries,
    guards: SoaLSchema(GuardConfig_Schema),
  });
};
