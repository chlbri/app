import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'arrayAssign',
  { on: { INC: { actions: ['incthearray'] } } },
  {
    context: typings.context({ number1: 'number', number2: 'number' }),
    eventsMap: typings.eventsMap({ INC: 'undefined' }),
  },
).provideOptions(({ assign }) => {
  return {
    actions: {
      incthearray: assign(
        ['number1', 'number2'],
        ({ context }) => [context.number1 + 1, context.number2 + 1],
      ),
    },

  };
});
