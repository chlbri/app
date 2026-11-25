/**
 * Helper surface injected into options callbacks.
 *
 * The `Addons` map lives in `@bemedev/app-plugins` so the utility package owns
 * the runtime contract used by `createUtilities`. This module only re-exports
 * it, along with the mode projections, for consumers of the options package.
 *
 * @module addons
 */

export type {
  Addons,
  AsyncActionHelper,
  AsyncAddons,
  AsyncAssign,
  AsyncGuardUnion,
  AsyncOptions,
  Fn,
  SyncAddons,
  SyncAssign,
  SyncGuardUnion,
  UtilityPair,
  ValueDefined,
  ValueIs,
} from '@bemedev/app-plugins';
