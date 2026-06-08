import { interpret } from '#exports/interpret';
import { createMachine } from '#exports/createMachine';

describe('#00 => Coverage getters', () => {
  const machine = createMachine({}, { sync: true });
  const service = interpret(machine);
  test('#01 =>  eventMap', () => {
    expect(service.eventsMap).toBeUndefined();
  });
  test('#02 => actorsMap', () => {
    expect(service.eventsMap).toBeUndefined();
  });
});
