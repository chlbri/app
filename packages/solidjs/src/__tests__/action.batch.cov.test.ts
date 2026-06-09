import { interpret } from '@bemedev/app';
import _raw_machine from './action.batch.cov.machine';
import { pipe } from '../interpreters/pipe';

vi.useFakeTimers();
vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('Machine batch action', () => {
  const machine = _raw_machine
    .provideOptions(({ assign }) => ({
      actions: {
        inc1: assign('context', ({ context }) => context + 1),
      },
    }))
    .provideOptions(({ batch }, { _legacy }) => ({
      actions: {
        inc2: batch(_legacy.actions.inc1, _legacy.actions.inc1),
      },
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

          assign('context', ({ context }) => context + 3),

          voidAction(() =>
            console.warn('Tricky, last action increment by 3'),
          ),
        ),
      },
    }));

  const service = interpret(machine, { context: 0 });
  const solid = pipe(service);
  const ctx = solid.context();

  test('#00 => start the machine', service.start);

  test('#01 => context is at 0', () => {
    expect(service.state.context).toBe(0);
    expect(ctx()).toBe(0);
  });

  test('#02 => send INC1 event, context should be at 1', async () => {
    await service.send('INC1');
    expect(service.state.context).toBe(1);
    expect(ctx()).toBe(1);
  });

  test('#03 => send INC2 event, context should be at 3', async () => {
    await service.send('INC2');
    expect(service.state.context).toBe(3);
    expect(ctx()).toBe(3);
  });

  test('#04 => send INC5 event, context should be at 10', async () => {
    await service.send('INC5');
    expect(service.state.context).toBe(10);
    expect(ctx()).toBe(10);
  });
});
