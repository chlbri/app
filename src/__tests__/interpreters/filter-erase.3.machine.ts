import { createMachine } from '#machine';
import { type } from '@bemedev/typings';
import { record } from '@bemedev/typings/helpers';
import * as v from 'valibot';

const scores = record('number');

export default createMachine(
  'src/__tests__/interpreters/filter-erase.3.machine',
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          SET_SCORES: {
            actions: 'setScores',
          },
          FILTER_HIGH_SCORES: {
            actions: 'filterHighScores',
            target: '/filtered',
          },
        },
      },
      filtered: {},
    },
  },
  {
    // Can implement typings with valibot validators
    context: v.object({
      scores: v.record(v.string(), v.number()),
    }),

    eventsMap: type({
      SET_SCORES: { scores },
      FILTER_HIGH_SCORES: 'never',
    }),
  },
);
