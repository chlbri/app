import { AFTER_EVENT, ALWAYS_EVENT, INIT_EVENT } from '../constants';
import type { EventStrings } from '../types';

/**
 * Checks if the provided event is of type {@linkcode EventStrings}.
 *
 * @param event - The event value to check.
 *
 * @returns `true` if the event is of type {@linkcode EventStrings}, `false` otherwise.
 *
 * @see {@linkcode INIT_EVENT}, {@linkcode ALWAYS_EVENT}, {@linkcode AFTER_EVENT}
 */
export const isStringEvent = (event: any): event is EventStrings => {
  const out =
    typeof event === 'string' &&
    (event === INIT_EVENT ||
      event.endsWith(ALWAYS_EVENT) ||
      event.endsWith(AFTER_EVENT));

  return out;
};
