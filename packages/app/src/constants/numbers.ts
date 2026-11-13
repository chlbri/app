/**
 * The default maximum number of milliseconds to wait for a promise to resolve.
 * Ten minutes.
 */
export const DEFAULT_MAX_TIME_PROMISE = 600_000;

/**
 * The default minimum number of milliseconds to wait for an activity to complete.
 */
export const DEFAULT_MIN_ACTIVITY_TIME = 10;

/**
 * The default maximum number of consecutive self transitions allowed before an error is thrown.
 */
export const DEFAULT_MAX_SELF_TRANSITIONS = 100;

/**
 * Time interval in milliseconds used to re-initialize the self transition counter.
 * Twice constant {@linkcode DEFAULT_MIN_ACTIVITY_TIME}.
 */
export const TIME_TO_RINIT_SELF_COUNTER = DEFAULT_MIN_ACTIVITY_TIME * 2;
