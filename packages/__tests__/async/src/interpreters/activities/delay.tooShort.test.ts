import { DEFAULT_MIN_ACTIVITY_TIME } from '@bemedev/app/constants';
import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import { machine } from './constants';

vi.useFakeTimers();
describe('Delay is too long', () => {
  const activity1 = vi.fn().mockReturnValue({});

  machine.addOptions(() => ({
    actions: { activity1 },
    delays: { DELAY: DEFAULT_MIN_ACTIVITY_TIME / 2 },
  }));

  const service = interpret(machine);
  const { useStateValue, start } = constructTests(service);

  test(...start());
  test(...useStateValue('state1', 1));

  test('#03 => activity1 is not called', () => {
    expect(activity1).not.toBeCalled();
  });

  describe('#03 => Check the warnings', () => {
    test('#01 => Length of warnings', () => {
      expect(service._warningsCollector?.size).toBe(1);
    });

    test('#02 => Check the warning', () => {
      expect(service._warningsCollector).toContain(
        'Delay (DELAY) is too short',
      );
    });
  });
});

afterAll(() => vi.useRealTimers());
