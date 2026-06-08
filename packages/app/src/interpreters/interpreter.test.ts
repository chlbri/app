import { interpret } from '#exports/interpret';
import { createMachine } from '#exports/createMachine';

describe('#00 => Coverage getters', () => {
  const machine = createMachine({});
  const service = interpret(machine);
  test('eventMap', () => {
    expect(service.eventsMap).toBeUndefined();
  });
});
