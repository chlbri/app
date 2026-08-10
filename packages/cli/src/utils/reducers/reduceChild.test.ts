import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceChild } from './reduceChild';

describe('reduceChild', () => {
  const { acceptation, success } = createTests(reduceChild, {
    transform: ({ actions, guards, targets, pContextKeys }) => ({
      actions: Array.from(actions),
      guards: Array.from(guards),
      targets: Array.from(targets),
      pContextKeys: Array.from(pContextKeys),
    }),
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'empty child config',
        parameters: [{} as any],
        expected: {
          actions: [],
          guards: [],
          targets: [],
          pContextKeys: [],
        },
      },
      {
        invite: 'child config with contexts only',
        parameters: [{ contexts: { key1: 'ctx1', key2: 'ctx2' } }],
        expected: {
          actions: [],
          guards: [],
          targets: [],
          pContextKeys: ['ctx1', 'ctx2'],
        },
      },
      {
        invite: 'child config with single on transition',
        parameters: [{ on: { NEXT: '/target1' } }],
        expected: {
          actions: [],
          guards: [],
          targets: ['/target1'],
          pContextKeys: [],
        },
      },
      {
        invite: 'child config with complex on transitions and contexts',
        parameters: [
          {
            contexts: { user: 'userId' },
            on: {
              SUBMIT: {
                target: '/submitted',
                actions: ['onSubmitAction'],
                guards: ['canSubmitGuard'],
              },
            },
          },
        ],
        expected: {
          actions: ['onSubmitAction'],
          guards: ['canSubmitGuard'],
          targets: ['/submitted'],
          pContextKeys: ['userId'],
        },
      },
    ),
  );
});
