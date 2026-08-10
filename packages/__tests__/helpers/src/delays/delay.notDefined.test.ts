import { DEFAULT_MAX_TIME_PROMISE } from '@bemedev/app/constants';
import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import machine from './delay.notDefined.machine';

vi.useFakeTimers();
describe('#05 => Delay is not defined', () => {
  const service = interpret(machine);

  const { useStateValue, useWaiter, start, useWarnings } = constructTests(
    vi,
    service,
    ({ waiter }) => ({ useWaiter: waiter(DEFAULT_MAX_TIME_PROMISE * 3) }),
  );

  test(...start());
  test(...useStateValue('idle'));
  test(...useWaiter());
  test(...useStateValue('idle'));
  describe(...useWarnings('Delay (DELAY) is not defined'));
});

afterAll(() => vi.useRealTimers());
