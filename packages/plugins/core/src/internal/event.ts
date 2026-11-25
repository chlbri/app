import { EventObject } from '@bemedev/app-contract';

/** Internal event emitted when a machine starts. */
export const INIT_EVENT = 'machine$$init' as const;

/** Internal event emitted by an `always` transition. */
export const ALWAYS_EVENT = 'machine$$always' as const;

/** Internal event emitted by an `after` transition. */
export const AFTER_EVENT = 'machine$$after' as const;

/**
 * Type guard checking that an event is an internal event marker.
 *
 * @param event - Value to check.
 *
 * @returns `true` when `event` is an internal event string.
 */
export const isStringEvent = (event: any): event is string => {
  const out =
    typeof event === 'string' &&
    (event === INIT_EVENT ||
      event.endsWith(ALWAYS_EVENT) ||
      event.endsWith(AFTER_EVENT));

  return out;
};

/**
 * Signature of {@linkcode transformEventArg}.
 *
 * @template | {@linkcode EventObject} `T` - Event object type returned.
 *
 * @param event - Raw event string or event object.
 *
 * @returns The standardized event object.
 */
export type TransformEventArg = <T extends EventObject = EventObject>(
  event: string | EventObject,
) => T;

/**
 * Transforms a raw event argument into a standardized event object.
 *
 * @param event - Event string or event object.
 *
 * @returns Event object holding `type` and `payload`.
 *
 * @see -- type {@linkcode TransformEventArg}
 */
export const transformEventArg: TransformEventArg = event => {
  if (typeof event === 'string') return { type: event, payload: {} };
  return { ...event, payload: event.payload } as any;
};
