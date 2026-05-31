import { createMachine } from '#exports/createMachine';
import { interpret } from '#exports/interpret';
import { constructTests } from '#fixtures';

describe('TESTS', () => {
  const machine = createMachine(
    {
      initial: 'prev',
      states: {
        prev: {
          on: {
            NEXT: '/next',
          },
        },
        next: {
          on: {
            NEXT: '/prev',
          },
        },
      },
    },
    {
      sync: true,
    },
  );

  const service = interpret(machine);

  const { start, stop, next, useStateValue } = constructTests(
    service,
    ({ sender }) => ({
      next: sender('NEXT'),
    }),
  );

  test(...start());
  test(...useStateValue('prev'));
  test(...next());
  test(...useStateValue('next'));
  test(...stop());
});
