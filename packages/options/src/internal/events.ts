/**
 * Event helpers used by the option runtime.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation while producing the same `eventsList`.
 */

import { isChildConfig } from './checkers/children';

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
