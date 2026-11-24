/**
 * Event helpers used by the option runtime.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation while producing the same `eventsList`.
 */

import { isChildConfig } from './checkers/children';

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
 * Transforms a raw event argument into a standardized event object.
 *
 * @param event - Event string or event object.
 *
 * @returns Event object holding `type` and `payload`.
 */
export const transformEventArg = (event: any) => {
  if (typeof event === 'string') return { type: event, payload: {} };
  return { ...event, payload: event.payload };
};

/**
 * Collects every event string supported by a configuration and its descendants.
 *
 * @param node - State node configuration.
 *
 * @returns Array of event strings.
 */
export const constructEventsMap = (node: any): string[] => {
  const out: string[] = [];

  const on = node?.on;
  if (on) out.push(...Object.keys(on));

  const actors = node?.actors;
  if (actors) {
    for (const [key, actor] of Object.entries(actors)) {
      if (isChildConfig(actor)) {
        const on = (actor as any).on;
        if (on) Object.keys(on).forEach(k => out.push(`${key}::on::${k}`));
      } else {
        out.push(`${key}::next`);
        out.push(`${key}::error`);
      }
    }
  }

  const states = node?.states;
  if (states) {
    Object.values(states).forEach(state => out.push(...constructEventsMap(state)));
  }

  return out;
};
