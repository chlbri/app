import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';

export default createMachine(
  'arrayAssign',
  { on: { INC: { actions: ['incthearray'] } } },
  {
    context: type({ number1: 'number', number2: 'number' }),
    eventsMap: type({ INC: 'undefined' }),
  },
).provideOptions(({ assign }) => {
  return {
    actions: {
      incthearray: assign(['number1', 'number2'], ({ context }) => [
        context.number1 + 1,
        context.number2 + 1,
      ]),
    },
  };
});
