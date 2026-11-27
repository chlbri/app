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
        invite: 'and guard structure',
        parameters: [{ and: ['g1', 'g2'] }],
        expected: ['g1', 'g2'],
      },
      {
        invite: 'or guard structure',
        parameters: [{ or: ['g1', 'g2'] }],
        expected: ['g1', 'g2'],
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
        invite: 'deduplicates guards across structures',
        parameters: ['g1', { and: ['g1', 'g2'] }, { or: ['g2', 'g3'] }],
        expected: ['g1', 'g2', 'g3'],
      },
    ),
  );
});
