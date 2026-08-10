import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import { DELAY, machine } from './constants';

vi.useFakeTimers();
describe('Cannot perform Activity', () => {
  const defaultC = { pContext: undefined, context: undefined };
  const activity1 = vi.fn().mockReturnValue(defaultC);

  machine.addOptions(() => ({
    actions: { activity1 },
    delays: { DELAY: () => DELAY * 2 },
  }));

  const service = interpret(machine);
  const { useStateValue, start, waiter, send } = constructTests(
    vi,
    service,
    ({ waiter }) => ({ waiter: waiter(DELAY) }),
  );

  test(...start());
  test(...useStateValue('state1'));
  test(...waiter());
  test('#04 => activity2 is not called', () => expect(activity1).not.toBeCalled());
  test(...useStateValue('state1'));
  test(...send('NEXT', 8));
  test(...useStateValue('state2', 9));
  test(...send('NEXT', 10));
  test(...useStateValue('state1', 11));
  test(...waiter(3));

  describe('#12 => Check Activity', () => {
    test('#01 => activity1 is called one time', () => {
      expect(activity1).toHaveBeenCalledTimes(1);
    });

    test('#02 => activity1 is called with correct params', () => {
      expect(activity1).toHaveBeenCalledWith({
        ...defaultC,
        event: { type: 'NEXT', payload: {} },
        status: 'busy',
        tags: [],
        value: 'state1',
      });
    });
  });
});

afterAll(() => vi.useRealTimers());
