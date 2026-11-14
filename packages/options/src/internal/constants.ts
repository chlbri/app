/**
 * Internal constants shared by the option helpers.
 *
 * They mirror the event markers and fallback value used by `@bemedev/app` so
 * the helpers produced here behave exactly like the machine ones.
 */

/** Internal event emitted when a machine starts. */
export const INIT_EVENT = 'machine$$init' as const;

/** Internal event emitted by an `always` transition. */
export const ALWAYS_EVENT = 'machine$$always' as const;

/** Internal event emitted by an `after` transition. */
export const AFTER_EVENT = 'machine$$after' as const;

/** Placeholder returned by {@linkcode nothing} in test environments. */
export const DEFAULT_NOTHING = 'nothing' as const;

/**
 * Fallback used when a function map has no matching event entry.
 *
 * @returns `'nothing'` in test environments, `undefined` otherwise.
 */
export const nothing = () => {
  if (process.env.NODE_ENV === 'test') return DEFAULT_NOTHING;
  return;
};
