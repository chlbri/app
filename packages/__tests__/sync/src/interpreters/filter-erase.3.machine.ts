import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/typings';
import { record } from '@bemedev/typings/helpers';

const scores = record('number');

export default createMachine(
  'src/__tests__/interpreters/filter-erase.3.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_SCORES: { actions: 'setScores' },
          FILTER_HIGH_SCORES: { actions: 'filterHighScores', target: '/filtered' },
        },
      },
      filtered: { on: { RETURN: '/idle' } },
    },
  },
  {
    context: type(({ partial }) => partial({ scores })),

    eventsMap: type({
      SET_SCORES: { scores },
      FILTER_HIGH_SCORES: 'never',
      RETURN: 'never',
    }),
    sync: true,
  },
);
