import { interpret } from '@bemedev/app';
import _machine2 from './index.2.machine';

beforeAll(() => {
  vi.useFakeTimers();
});

it('should handle always self transitions', async () => {
  const machine = _machine2;

  const service = interpret(machine);

  service.start();
  await vi.advanceTimersByTimeAsync(0);
  expect(service.value).toEqual('active');
});
