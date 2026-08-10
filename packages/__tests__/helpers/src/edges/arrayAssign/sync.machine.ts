import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'arrayAssignSync',
  { on: { INC: { actions: ['incthearray'] } } },
  {
    sync: true,
    context: typings.context({ number1: 'number', number2: 'number' }),
    eventsMap: typings.eventsMap({ INC: 'undefined' }),
  },
).provideOptions(({ assign }) => ({
  actions: {
    incthearray: assign(
      ['context.number1', 'context.number2'],
      ({ context }) => [context.number1 + 1, context.number2 + 1],
    ),
  },
}));
