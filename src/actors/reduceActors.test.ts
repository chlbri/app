import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceActors } from './reduceActors';

describe('reduceActors', () => {
  const { acceptation, success } = createTests(reduceActors, {
    transform: result => ({
      targets: Array.from(result.targets),
      actions: Array.from(result.actions),
      guards: Array.from(result.guards),
      pContextKeys: Array.from(result.pContextKeys),
      emitters: Array.from(result.emitters),
      children: Array.from(result.children),
    }),
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'single emitter',
        parameters: { em1: { next: '/idle' } },
        expected: {
          actions: [],
          guards: [],
          targets: ['/idle'],
          pContextKeys: [],
          emitters: ['em1'],
          children: [],
        },
      },
      {
        invite: 'single child',
        parameters: { ch1: { on: { DONE: '/done' } } },
        expected: {
          actions: [],
          guards: [],
          targets: ['/done'],
          pContextKeys: [],
          emitters: [],
          children: ['ch1'],
        },
      },
      {
        invite: 'mixed emitter + child',
        parameters: {
          e1: { next: { target: '/a', actions: ['onEnter'] } },
          c1: {
            on: { X: { target: '/b', guards: ['can'] } },
            contexts: { l: 'pKey' },
          },
        },
        expected: {
          actions: ['onEnter'],
          guards: ['can'],
          targets: ['/a', '/b'],
          pContextKeys: ['pKey'],
          emitters: ['e1'],
          children: ['c1'],
        },
      },
      {
        invite: 'deduplicates values',
        parameters: {
          e1: { next: { target: '/a', actions: ['act'] } },
          c1: {
            on: { A: { target: '/b', actions: ['act'], guards: ['g'] } },
          },
        },
        expected: {
          actions: ['act'],
          guards: ['g'],
          targets: ['/a', '/b'],
          pContextKeys: [],
          emitters: ['e1'],
          children: ['c1'],
        },
      },
    ),
  );
});
