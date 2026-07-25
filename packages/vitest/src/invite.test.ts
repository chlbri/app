import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { buildIndex } from './invite';

describe('buildIndex', () => {
  const { acceptation, success, fails } = createTests(buildIndex);
  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => success',
    success(
      { invite: 'default values', parameters: [], expected: '0' },
      { invite: 'index = 0, max = 0', parameters: [0, 0], expected: '0' },
      {
        invite: 'index = 1, max = 10',
        parameters: [1, 10],
        expected: '01',
      },
      {
        invite: 'index = 5, max = 100',
        parameters: [5, 100],
        expected: '005',
      },
    ),
  );

  describe(
    '#02 => fails',
    fails(
      {
        invite: 'index < 0',
        parameters: [-1, 5],
        error: 'index (-1) and max (5) must be positive integers',
      },
      {
        invite: 'max < 0',
        parameters: [2, -5],
        error: 'index (2) and max (-5) must be positive integers',
      },
      {
        invite: 'index and max < 0',
        parameters: [-2, -5],
        error: 'index (-2) and max (-5) must be positive integers',
      },
      {
        invite: 'index > max',
        parameters: [5, 3],
        error: 'index (5) must be less than or equal to max (3)',
      },
    ),
  );
});
