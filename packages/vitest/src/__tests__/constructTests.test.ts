import { interpret } from '@bemedev/app';
import { constructTests } from '../constructTests.js';
import _raw_machine from './constructTests.machine';

vi.useFakeTimers();
const myActivity = 50;

describe('constructTests coverage', () => {
  const machine = _raw_machine.provideOptions(({ assign }) => ({
    actions: {
      activity1: assign(
        'context.count',
        ({ context }) => context.count + 1,
      ),
    },
    delays: {
      myActivity,
    },
  }));

  const service = interpret(machine, {
    context: { count: 0, name: 'test' },
  });

  const {
    start,
    stop,
    dispose,
    pause,
    resume,
    send,
    useStateValue,
    changeIndex,
    useTags,
    useCount,
    waiter,
  } = constructTests(vi, service, ({ contexts, waiter }) => ({
    useCount: contexts(c => c.context.count, 'count'),
    waiter: waiter(myActivity),
  }));

  describe('Success path', () => {
    test(...start());
    test(...useCount(0));
    test(...useTags('tag1'));
    test(...useTags());
    test(...useStateValue('state1'));
    test(...send('NEXT'));
    test(...useStateValue('state2'));
    test(...useCount(0));
    test(...useTags('tag2'));
    test(...waiter());
    test(...useCount(1));
    test(...useTags());
    test(...useTags('tag3'));
    test(...waiter());
    test(...useCount(2));
    test(...useTags('tag2', 'tag3'));
    test(...waiter(18));
    test(...useCount(20));
    test(...pause());
    test(...waiter(1000));
    test(...useCount(20));
    test(...resume());
    test(...send('PREVIOUS'));
    test(...useStateValue('state1'));
    test(...changeIndex(idx => idx + 5));
    test(...useCount(20));
    test(...waiter(980));
    test(...useCount(20));
    test(...send('NEXT'));
    test(...useStateValue('state2'));
    test(...useCount(20));
    test(...waiter(980));
    test(...useCount(1000));
    test(...stop());
    test(...dispose());
  });
});
