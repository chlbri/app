import { createMachine } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';

export default createMachine(
  'edges.arrayAssign.complex',
  { on: { INC: { actions: ['incDeep'] } } },
  {
    eventsMap: typings.eventsMap({ INC: 'undefined' }),
    context: typings.context({
      number1: 'number',
      number2: 'number',
      deep: { number3: 'number', deep2: { number4: 'number' } },
    }),
  },
).provideOptions(({ assign }) => ({
  actions: {
    incDeep: assign(
      ['number1', 'number2', 'deep.deep2.number4'],
      ({ context }) => [
        context.number1 + 1,
        context.number2 + 2,
        context.deep.deep2.number4 + 4,
      ],
    ),
  },

}));
