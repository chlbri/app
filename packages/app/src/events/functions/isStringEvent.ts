import {
  AFTER_EVENT,
  ALWAYS_EVENT,
  INIT_EVENT,
  MAX_EXCEEDED_EVENT_TYPE,
} from '../constants';
import type { EventStrings } from '../types';

/** Array of system event string values. */
const VALUES: string[] = [INIT_EVENT, MAX_EXCEEDED_EVENT_TYPE];

/**
 * Checks if the provided event is of type {@linkcode EventStrings}.
 *
 * @param event - The event value to check.
 *
 * @returns `true` if the event is of type {@linkcode EventStrings}, `false` otherwise.
 *
 * @see {@linkcode INIT_EVENT}, {@linkcode ALWAYS_EVENT}, {@linkcode AFTER_EVENT}, {@linkcode MAX_EXCEEDED_EVENT_TYPE}
 */
export const isStringEvent = (event: any): event is EventStrings => {
  const out =
    typeof event === 'string' &&
    (VALUES.includes(event) ||
      event.endsWith(ALWAYS_EVENT) ||
      event.endsWith(AFTER_EVENT));

  return out;
};
