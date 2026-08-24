import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'arrayAsyncAssign',
  { on: { INC: { actions: ['incthearray'] } } },
  {
    context: typings.context({ number1: 'number', number2: 'number' }),
    eventsMap: typings.eventsMap({ INC: 'undefined' }),
  },
).provideOptions(({ assign, action }) => {
  return {
    actions: {
      incthearray: assign(
        ['number1', 'number2'],
        async ({ context }) => [context.number1 + 1, context.number2 + 1],
        { catch: () => action(() => console.log('toto')) },
      ),
    },
  };
});

