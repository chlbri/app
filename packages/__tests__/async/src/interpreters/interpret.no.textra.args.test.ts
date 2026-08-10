import { createMachine } from '@bemedev/app';
import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';

describe('TESTS', () => {
  const machine = createMachine({
    initial: 'prev',
    states: {
      prev: { on: { NEXT: '/next' } },
      next: { on: { NEXT: '/prev' } },
    },
  });

  const service = interpret(machine);

  const { start, stop, next, useStateValue } = constructTests(
    vi,
    service,
    ({ sender }) => ({ next: sender('NEXT') }),
  );

  test(...start());
  test(...useStateValue('prev'));
  test(...next());
  test(...useStateValue('next'));
  test(...stop());
});
