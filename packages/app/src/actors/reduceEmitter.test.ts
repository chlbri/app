import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceEmitter } from './reduceEmitter';

describe('reduceEmitter', () => {
  const { acceptation, success } = createTests(reduceEmitter, {
    transform: result => ({
      targets: Array.from(result.targets),
      actions: Array.from(result.actions),
      guards: Array.from(result.guards),
    }),
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'next as string',
        parameters: { next: '/idle' },
        expected: { targets: ['/idle'], actions: [], guards: [] },
      },
      {
        invite: 'next with actions',
        parameters: { next: { target: '/active', actions: ['onEnter'] } },
        expected: {
          targets: ['/active'],
          actions: ['onEnter'],
          guards: [],
        },
      },
      {
        invite: 'complete + next + error order and aggregation',
        parameters: {
          complete: { actions: 'done' },
          next: '/idle',
          error: { target: '/error', guards: 'isError' },
        },
        expected: {
          targets: ['/idle', '/error'],
          actions: ['done'],
          guards: ['isError'],
        },
      },
      {
        invite: 'describer actions and guards',
        parameters: {
          next: {
            target: '/x',
            actions: [{ name: 'act', description: 'act' }],
            guards: [{ name: 'g', description: 'g' }],
          },
        },
        expected: { targets: ['/x'], actions: ['act'], guards: ['g'] },
      },
      {
        invite: 'empty arrays',
        parameters: { next: ['/active'] },
        expected: { targets: ['/active'], actions: [], guards: [] },
      },
    ),
  );
});
