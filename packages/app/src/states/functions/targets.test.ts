import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { getTargetsFromConfig } from './targets';

describe('getTargetsFromConfig', () => {
  const { acceptation, success } = createTests(getTargetsFromConfig, {
    transform: Array.from,
  });

  describe('#00 => acceptation', acceptation);

  describe(
    '#01 => success',
    success(
      {
        invite: 'atomic node config',
        parameters: [{ type: 'atomic' }],
        expected: ['/'],
      },
      {
        invite: 'compound node config',
        parameters: [
          {
            type: 'compound',
            initial: 'a',
            states: {
              a: { type: 'atomic' },
              b: { type: 'atomic' },
            },
          },
        ],
        expected: ['/', '/a', '/b'],
      },
      {
        invite: 'nested compound/parallel node configs',
        parameters: [
          {
            type: 'parallel',
            states: {
              a: {},
              b: {
                initial: 'c',
                states: {
                  c: {},
                },
              },
            },
          },
        ],
        expected: ['/', '/a', '/b', '/b/c'],
      },
    ),
  );
});
