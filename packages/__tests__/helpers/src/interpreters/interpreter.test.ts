import { interpret } from '@bemedev/app';
import { createMachine } from '@bemedev/app';

describe('Coverage getters', () => {
  const machine = createMachine({});
  const service = interpret(machine);

  test('#01 => eventMap', () => expect(service.eventsMap).toBeUndefined());
});
