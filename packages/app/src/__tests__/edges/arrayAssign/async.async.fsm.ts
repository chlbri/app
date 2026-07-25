import { createMachine } from '#exports/createMachine';
import { typings } from '#utils';

export default createMachine(
  'arrayAsyncAssign',
  { on: { INC: { actions: ['incthearray'] } } },
  {
    context: typings.context({ number1: 'number', number2: 'number' }),
    eventsMap: typings.eventsMap({ INC: 'undefined' }),
  },
).provideOptions(({ assign, voidAction }) => {
  return {
    actions: {
      incthearray: assign(
        ['context.number1', 'context.number2'],
        async ({ context }) => [context.number1 + 1, context.number2 + 1],
        { catch: () => voidAction(() => console.log('toto')) },
      ),
    },
  };
});
