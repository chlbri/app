import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import _machine3 from './always.3.machine';

describe('Integration testing for interpret, Children', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  const DELAY = 1000;

  describe('#02 => complex, two always with parameters', () => {
    const machine = _machine3;

    // machine.addPredicates({ returnFalse });
    machine.addOptions(({ isDefined }) => ({
      guards: { returnFalse: isDefined('pContext') },
    }));

    const service = interpret(machine);

    const { useStateValue, useWaiter, start } = constructTests(
      service,
      ({ waiter }) => ({ useWaiter: waiter(DELAY) }),
    );

    test(...start());
    test(...useStateValue('result2'));
    test(...useWaiter(10));
    test(...useStateValue('result2'));
  });
});

afterAll(() => vi.useRealTimers());
