/**
 * Internal constants shared by the option helpers.
 *
 * They mirror the event markers and fallback value used by `@bemedev/app` so
 * the helpers produced here behave exactly like the machine ones.
 */

import { IS_TEST } from './environment';

/** Internal event emitted when a machine starts. */
export const INIT_EVENT = 'machine$$init' as const;

/** Internal event emitted by an `always` transition. */
export const ALWAYS_EVENT = 'machine$$always' as const;

/** Internal event emitted by an `after` transition. */
export const AFTER_EVENT = 'machine$$after' as const;

/** Placeholder returned by {@linkcode nothing} in test environments. */
export const DEFAULT_NOTHING = 'nothing' as const;

/**
 * A utility function used when no action is required or when a placeholder value is needed.
 *
 * @returns In test environment constant {@linkcode DEFAULT_NOTHING}, otherwise `undefined`.
 */
export const nothing = () => {
  if (IS_TEST()) {
    console.log(`${DEFAULT_NOTHING} call ${DEFAULT_NOTHING}`);
    return DEFAULT_NOTHING;
  }
  return;
};
