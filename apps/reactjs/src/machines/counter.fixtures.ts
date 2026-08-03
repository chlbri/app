import { createInterval } from '@bemedev/app/bemedev';
import { eventToType } from '@bemedev/app/events';
import { faker } from '@faker-js/faker';
import { counterMachine, type Service } from './counter';

export const TEST_LOGS = (
  { canEvents, send }: Service,
  interval = 100,
) => {
  const ids = new Set<string>();
  let index = 0;
  const all = createInterval({
    id: 'interval',
    callback: () => {
      const payload =
        Array.from(ids)[
          faker.number.int({ min: 0, max: Math.max(ids.size - 1, 0) })
        ];

      const events = [
        ...counterMachine.eventsList.filter(
          e => e !== 'TOGGLE_LOG_EXPAND',
        ),
        { type: 'TOGGLE_LOG_EXPAND' as const, payload },
      ];
      const out = faker.helpers.arrayElement(
        events.filter(event => canEvents(eventToType(event) as any)),
      );
      const _payload = `${out}-${index + 1}`;
      ids.add(_payload);
      index++;
      send(out);
    },
    interval,
    exact: true,
  });

  return all;
};
