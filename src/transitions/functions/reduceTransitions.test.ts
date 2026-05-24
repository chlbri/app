import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceTransitions } from './reduceTransitions';

describe('reduceTransitions', () => {
  const { acceptation, success } = createTests(reduceTransitions, {
    transform: result => {
      return {
        targets: Array.from(result.targets),
        actions: Array.from(result.actions),
        guards: Array.from(result.guards),
      };
    },
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'single string transition',
        parameters: ['idle'],
        expected: { targets: ['idle'], actions: [], guards: [] },
      },
      {
        invite: 'object transition without actions or guards',
        parameters: [{ target: 'active' }],
        expected: { targets: ['active'], actions: [], guards: [] },
      },
      {
        invite: 'object transition with description',
        parameters: [
          { target: 'idle', description: 'Transition to idle state' },
          'idle',
        ],
        expected: { targets: ['idle'], actions: [], guards: [] },
      },
      {
        invite: 'single string action',
        parameters: [
          {
            actions: 'onEnter',
          },
        ],
        expected: {
          targets: [],
          actions: ['onEnter'],
          guards: [],
        },
      },
      {
        invite: 'multiple string actions',
        parameters: [
          { target: 'active', actions: ['onEnter', 'notify', 'log'] },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter', 'notify', 'log'],
          guards: [],
        },
      },
      {
        invite: 'describer action',
        parameters: [
          {
            target: 'active',
            actions: { name: 'onEnter', description: 'Called on enter' },
          },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter'],
          guards: [],
        },
      },
      {
        invite: 'mixed string and describer actions',
        parameters: [
          {
            target: 'active',
            actions: [
              'onEnter',
              { name: 'notify', description: 'Notify listeners' },
            ],
          },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter', 'notify'],
          guards: [],
        },
      },
      {
        invite: 'duplicate string actions',
        parameters: [
          { target: 'active', actions: ['onEnter', 'onEnter'] },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter'],
          guards: [],
        },
      },
      {
        invite: 'single string guard',
        parameters: [{ target: 'active', guards: 'isReady' }],
        expected: {
          targets: ['active'],
          actions: [],
          guards: ['isReady'],
        },
      },
      {
        invite: 'multiple guards',
        parameters: [
          { target: 'active', guards: ['isReady', 'hasPermission'] },
        ],
        expected: {
          targets: ['active'],
          actions: [],
          guards: ['isReady', 'hasPermission'],
        },
      },
      {
        invite: 'multiple transitions variadic',
        parameters: ['idle', { target: 'active' }, { target: 'paused' }],
        expected: {
          targets: ['idle', 'active', 'paused'],
          actions: [],
          guards: [],
        },
      },
      {
        invite: 'complex transition with actions and guards',
        parameters: [
          { target: 'active', actions: 'onEnter', guards: 'isReady' },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter'],
          guards: ['isReady'],
        },
      },
      {
        invite: 'multiple actions and guards combined',
        parameters: [
          {
            target: 'active',
            actions: ['onEnter', 'notify'],
            guards: ['isReady', 'hasPermission'],
          },
        ],
        expected: {
          targets: ['active'],
          actions: ['onEnter', 'notify'],
          guards: ['isReady', 'hasPermission'],
        },
      },
      {
        invite: 'no arguments',
        parameters: [],
        expected: {
          targets: [],
          actions: [],
          guards: [],
        },
      },
      {
        invite: 'preserves action insertion order',
        parameters: [
          {
            target: 'active',
            actions: ['third', 'first', 'second'],
          },
        ],
        expected: {
          targets: ['active'],
          actions: ['third', 'first', 'second'],
          guards: [],
        },
      },
      {
        invite: 'preserves mixed action insertion order',
        parameters: [
          {
            target: 'active',
            actions: [
              { name: 'first', description: 'First' },
              'second',
              { name: 'third', description: 'Third' },
            ],
          },
        ],
        expected: {
          targets: ['active'],
          actions: ['first', 'second', 'third'],
          guards: [],
        },
      },
      {
        invite: 'describer guard',
        parameters: [
          {
            target: 'active',
            guards: {
              name: 'isReady',
              description: 'Check if system is ready',
            },
          },
        ],
        expected: {
          targets: ['active'],
          actions: [],
          guards: ['isReady'],
        },
      },
      {
        invite: 'mixed string and describer guards',
        parameters: [
          {
            target: 'active',
            guards: [
              'isReady',
              { name: 'hasPermission', description: 'Check permissions' },
            ],
          },
          'active',
        ],
        expected: {
          targets: ['active'],
          actions: [],
          guards: ['isReady', 'hasPermission'],
        },
      },
      {
        invite: 'full transition with all features',
        parameters: [
          {
            target: '/active',
            actions: [
              'onEnter',
              { name: 'notify', description: 'Notify' },
            ],
            guards: [
              'isReady',
              { name: 'hasPermission', description: 'Has permission' },
            ],
            description: 'Transition to active state',
          },
          '/idle',
        ],
        expected: {
          targets: ['/active', '/idle'],
          actions: ['onEnter', 'notify'],
          guards: ['isReady', 'hasPermission'],
        },
      },
    ),
  );
});
