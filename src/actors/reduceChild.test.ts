import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceChild } from './reduceChild';

describe('reduceChild', () => {
  const { acceptation, success } = createTests(reduceChild, {
    transform: result => {
      return {
        targets: Array.from(result.targets),
        actions: Array.from(result.actions),
        guards: Array.from(result.guards),
        pContextKeys: Array.from(result.pContextKeys),
      };
    },
  });

  describe('#00 => acceptation', () => acceptation());

  describe(
    '#01 => Success',
    success(
      {
        invite: 'no on nor contexts',
        parameters: { on: {} },
        expected: {
          actions: [],
          guards: [],
          targets: [],
          pContextKeys: [],
        },
      },
      {
        invite: 'string transition target',
        parameters: { on: { DONE: '/done' } },
        expected: {
          actions: [],
          guards: [],
          targets: ['/done'],
          pContextKeys: [],
        },
      },
      {
        invite: 'transition with actions and guards',
        parameters: {
          on: {
            NEXT: {
              target: '/child',
              actions: ['doSomething'],
              guards: [
                'canGo',
                { name: 'complexGuard', description: 'a complex guard' },
              ],
            },
          },
        },
        expected: {
          actions: ['doSomething'],
          guards: ['canGo', 'complexGuard'],
          targets: ['/child'],
          pContextKeys: [],
        },
      },
      {
        invite: 'multiple transitions',
        parameters: {
          on: {
            A: { target: '/a', actions: ['a1'] },
            B: [{ guards: ['g1'] }, '/b'],
          },
        },
        expected: {
          actions: ['a1'],
          guards: ['g1'],
          targets: ['/a', '/b'],
          pContextKeys: [],
        },
      },
      {
        invite: 'contexts -> pContextKeys',
        parameters: { contexts: { localA: 'pKeyA', localB: 'pKeyB' } },
        expected: {
          actions: [],
          guards: [],
          targets: [],
          pContextKeys: ['pKeyA', 'pKeyB'],
        },
      },
    ),
  );
});
