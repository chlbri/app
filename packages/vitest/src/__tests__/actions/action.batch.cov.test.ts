import { interpret } from '@bemedev/app';
import { constructTests } from '../../constructTests.js';
import _raw_machine from './action.batch.cov.machine';

vi.useFakeTimers();

describe('Machine batch action', () => {
  const machine = _raw_machine
    .provideOptions(({ assign }) => ({
      actions: { inc1: assign('context', ({ context }) => context + 1) },
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

  const { start, send, useValue } = constructTests(
    vi,
    service,
    ({ contexts: constructContexts }) => ({
      useValue: constructContexts(({ context }) => context, 'context'),
    }),
  );

  test(...start());
  test(...useValue(0));
  test(...send('INC1'));
  test(...useValue(1));
  test(...send('INC2'));
  test(...useValue(3));
  test(...send('INC5'));
  test(...useValue(10));
});

afterAll(() => vi.useRealTimers());
