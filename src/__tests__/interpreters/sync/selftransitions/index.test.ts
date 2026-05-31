import { fakeWaiter } from '#fixtures';
import { interpret } from '#exports/interpret';
import _machine2 from './index.2.machine';

beforeAll(() => {
  vi.useFakeTimers();
});

it('should handle always self transitions', async () => {
  const machine = _machine2;

  const service = interpret(machine);

  service.start();
  await fakeWaiter(0);
  expect(service.value).toEqual('active');
});
