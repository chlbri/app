import type { BetterSet } from '@bemedev/better-set';
import type { NodeConfig3, RecordS } from '@bemedev/app/types';

/**
 * Context object accumulating symbol sets during parseTree traversal.
 */
export type ParseTreeContext = {
  actions: BetterSet<string>;
  guards: BetterSet<string>;
  emitters: BetterSet<string>;
  children: BetterSet<string>;
  delays: BetterSet<string>;
  allPaths: BetterSet<string>;
  targets: BetterSet<string>;
  events: BetterSet<string>;
  pContextKeys: BetterSet<string>;
  tags: BetterSet<string>;
  __flat?: RecordS<NodeConfig3>;
};

/**
 * Basic state targets and initial configuration paths object.
 */
export type ConfigPaths2 = { targets: string[]; initial?: string };

/**
 * Recursive configuration paths tree representing state hierarchy.
 */
export type ConfigPaths = ConfigPaths2 & { states?: RecordS<ConfigPaths> };

/**
 * Strict version of type {@linkcode ConfigPaths} ensuring no extra keys are permitted.
 *
 * @template {ConfigPaths} T - ConfigPaths type extending type {@linkcode ConfigPaths}.
 */
export type NoExtraKeysConfigPaths<T extends ConfigPaths> = T & {
  [K in Exclude<keyof T, keyof ConfigPaths>]: never;
} & {
  states?: {
    [K in keyof T['states']]: T['states'][K] extends infer TK extends ConfigPaths
      ? NoExtraKeysConfigPaths<TK>
      : never;
  };
};
