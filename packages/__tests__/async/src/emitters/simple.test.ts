import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import { notU } from '@bemedev/app/utils';
import { createPausable } from '@bemedev/rx-pausable';
import { interval, map, take } from 'rxjs';
import machineEmitter1, { WAITERS } from './emitter1.machine';

vi.useFakeTimers();
describe('Simple Machine2 (from Machine1)', () => {
  const mockFn = vi.fn();

  const machine = machineEmitter1
    .provideOptions(({ assign }) => ({
      actions: {
        assigN: assign({
          'interval::next': ({ payload, context }) =>
            notU(context) + payload,
        }),
      },
      actors: {
        emitters: {
          interval: () =>
            createPausable(
              interval(WAITERS.short).pipe(
                take(5),
                map(v => v + 1),
                map(v => v * 5),
              ),
            ),
        },
      },
    }))
    .provideOptions(({ action }) => ({
      actions: {
        mockCompleteAction: action(() => {
          mockFn('Complete action executed');
        }),
      },
    }));

  const service = interpret(machine, { context: 0 });

  const {
    useContext,
    waiter,
    useNext,
    start,
    resume,
    pause,
    stop,
    useStateValue,
    useMock,
  } = constructTests(
    service,
    ({ contexts, sender, waiter, tupleOf, getIndex }) => ({
      useContext: contexts(({ context }) => context),
      useNext: sender('NEXT'),
      waiter: waiter(WAITERS.short),

      useMock: (fails = false) => {
        const invite = `#${getIndex()} => mockFn called${fails ? ' => (fails)' : ''}`;

        return tupleOf(invite, () => {
          expect(mockFn).toHaveBeenCalledWith('Complete action executed');
          mockFn.mockClear();
        });
      },
    }),
  );

  test(...start());
  test(...useContext(0));
  test(...waiter());
  test(...useContext(5));
  test(...useNext());
  test(...waiter());
  test(...useContext(15));
  test(...useNext());
  test(...waiter());
  test(...useContext(30));
  test(...useNext());
  test(...waiter());
  test(...useContext(50));
  test(...useNext());
  test(...pause());
  test(...waiter());
  test(...useContext(50));
  test(...resume());
  test.fails(...useMock());
  test(...waiter());
  test(...useContext(75));
  test(...useStateValue('inactive'));
  test(...useNext());
  test(...useStateValue('active'));
  test(...useContext(75));
  test(...useMock());
  //Resume without pause, no effect
  test(...resume());
  test(...waiter());
  test(...useContext(75));
  test(...stop());
});
