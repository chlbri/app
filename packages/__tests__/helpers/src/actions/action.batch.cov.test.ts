import { interpret } from '@bemedev/app';
import { swap } from '@bemedev/function-swap';
import type { StateExtendedFrom } from '@bemedev/app/types';
import _raw_machine from './action.batch.cov.machine';

vi.useFakeTimers();

describe('Machine batch action', () => {
  const fnBis = (data: number) => data + 1;
  type TT = StateExtendedFrom<typeof _raw_machine>;

  const machine = _raw_machine
    .provideOptions(({ assign }) => ({
      actions: {
        inc1: assign(
          'context',
          swap(fnBis).constraint<[TT]>()({ '[0]': '[0].context' }),
        ),
      },
    }))
    .provideOptions(({ batch }, { _legacy }) => ({
      actions: { inc2: batch(_legacy.actions.inc1, _legacy.actions.inc1) },
    }))
    .provideOptions(({ batch, assign, voidAction }, { _legacy }) => ({
      actions: {
        inc2: batch(
          _legacy.actions.inc2,
          voidAction(() => console.warn('Increment by 2')),
        ),

        inc5: batch(
          _legacy.actions.inc2,
          _legacy.actions.inc2,

          assign('context', async ({ context }) => context + 3, {
            catch: () => () => ({ context: 4 }),
          }),

          voidAction(() =>
            console.warn('Tricky, last action increment by 3'),
          ),
        ),
      },
    }));

  const service = interpret(machine, { context: 0 });

  test('#00 => start the machine', service.start);

  test('#01 => context is at 0', () =>
    expect(service.state.context).toBe(0));

  describe('#02 => send INC1 event', () => {
    test('#01 => send INC1', async () => {
      await service.send('INC1');
    });

    test('#02 => context should be at 1', () =>
      expect(service.state.context).toBe(1));
  });

  describe('#03 => send INC2 event', () => {
    test('#01 => send INC2', async () => {
      await service.send('INC2');
    });

    test('#02 => context should be at 3', () =>
      expect(service.state.context).toBe(3));
  });

  describe('#04 => send INC5 event', () => {
    test('#01 => send INC5', async () => {
      await service.send('INC5');
    });

    test('#02 => context should be at 10', () =>
      expect(service.context).toBe(10));
  });
});

afterAll(() => vi.useRealTimers());
