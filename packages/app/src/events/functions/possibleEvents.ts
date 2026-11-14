import type { NodeConfig2 } from '#states';
import { isDefined } from '@bemedev/app-options/bemedev';
import type { RecordS } from '~types';

/**
 * Returns a list of all possible events from a flat record of NodeConfig.
 *
 * @param flat - Flat record of type {@linkcode RecordS}<{@linkcode NodeConfig2}>.
 *
 * @returns An array of event names.
 */
export const possibleEvents = (flat: RecordS<NodeConfig2>) => {
  const events: string[] = [];

  const values = Object.values(flat);
  values.forEach(value => {
    const on = value.on;
    const check = isDefined(on);

    if (check) {
      events.push(...Object.keys(on));
    }
  });

  return events;
};
