import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceActivity } from './reducers';

describe('reduceActivity', () => {
  const { acceptation, success } = createTests(reduceActivity, {
    transform: ({ actions, delays, guards }) => ({
      actions: Array.from(actions),
      guards: Array.from(guards),
      delays: Array.from(delays),
    }),
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'single string describer',
        parameters: [{ after: 'onEnter' }],
        expected: { actions: ['onEnter'], guards: [], delays: ['after'] },
      },
      {
        invite: 'single describer object',
        parameters: [
          { after: { name: 'onEnter', description: 'Called' } },
        ],
        expected: { actions: ['onEnter'], guards: [], delays: ['after'] },
      },
      {
        invite: 'single transition object',
        parameters: [
          {
            after: {
              actions: ['onEnter'],
              guards: ['isReady'],
            },
          },
        ],
        expected: {
          actions: ['onEnter'],
          guards: ['isReady'],
          delays: ['after'],
        },
      },
      {
        invite: 'mixed string and transition',
        parameters: [
          {
            a: 'act',
            b: { actions: ['act2'], guards: ['g1'] },
          },
        ],
        expected: {
          actions: ['act', 'act2'],
          guards: ['g1'],
          delays: ['a', 'b'],
        },
      },
      {
        invite: 'deduplicates values',
        parameters: {
          b: { actions: ['act'], guards: ['g'] },
          a: { actions: ['act'] },
        },

        expected: { actions: ['act'], guards: ['g'], delays: ['b', 'a'] },
      },
      {
        invite: 'Array Activity',
        parameters: {
          array: [{ guards: ['g'], actions: ['act1'] }, 'act2'],
        },

        expected: {
          actions: ['act1', 'act2'],
          guards: ['g'],
          delays: ['array'],
        },
      },
    ),
  );
});
