import { interpret } from '@bemedev/app';
import { createMachine } from '@bemedev/app';

describe('#00 => Coverage getters', () => {
  const machine = createMachine({});
  const service = interpret(machine);
  test('eventMap', () => {
    expect(service.eventsMap).toBeUndefined();
  });
});
