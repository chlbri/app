import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import machineEmitter1 from './emitter1.machine';

describe('Tests not defined emitters -> Machine1', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

  beforeAll(() => {
    vi.useFakeTimers();
    log.mockClear();
  });
  afterAll(() => {
    log.mockRestore();
  });

  const service = interpret(machineEmitter1, { context: 0 });
  const { start } = constructTests(vi, service);

  test(...start());

  test('#02 => Error is emmitted', () => {
    expect(log).toHaveBeenCalledWith('Emitter (interval) is not defined');
  });
});

afterAll(() => vi.useRealTimers());
