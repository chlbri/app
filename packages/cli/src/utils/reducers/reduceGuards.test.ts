import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceGuards } from './reduceGuards';

describe('reduceGuards', () => {
  const { acceptation, success } = createTests(reduceGuards);

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      { invite: 'empty guards', parameters: [], expected: [] },
      {
        invite: 'single string guard',
        parameters: ['guard1'],
        expected: ['guard1'],
      },
      {
        invite: 'single describer object guard',
        parameters: [{ name: 'guard1', description: 'desc1' }],
        expected: [{ name: 'guard1', description: 'desc1' }],
      },
      {
        invite: 'and guard structure',
        parameters: [{ and: ['g1', 'g2'] }],
        expected: ['g1', 'g2'],
      },
      {
        invite: 'or guard structure',
        parameters: [{ or: ['g1', { name: 'g2', description: 'desc2' }] }],
        expected: ['g1', { name: 'g2', description: 'desc2' }],
      },
      {
        invite: 'nested and and or guards',
        parameters: [{ and: ['g1', { or: ['g2', 'g3'] }] }],
        expected: ['g1', 'g2', 'g3'],
      },
      {
        invite: 'deduplicates duplicate string guards',
        parameters: ['g1', 'g2', 'g1'],
        expected: ['g1', 'g2'],
      },
      {
        invite:
          'string guard followed by object guard with same key replaces string with object guard',
        parameters: ['g1', { name: 'g1', description: 'desc1' }],
        expected: [{ name: 'g1', description: 'desc1' }],
      },
      {
        invite:
          'object guard followed by string guard with same key keeps object guard',
        parameters: [{ name: 'g1', description: 'desc1' }, 'g1'],
        expected: [{ name: 'g1', description: 'desc1' }],
      },
      {
        invite:
          'object guard followed by object guard with same key keeps first object guard',
        parameters: [
          { name: 'g1', description: 'desc1' },
          { name: 'g1', description: 'desc2' },
        ],
        expected: [{ name: 'g1', description: 'desc1' }],
      },
    ),
  );
});
