import { createValibotTests } from '#fixtures';
import { _FinallyConfigSchema, FinallyConfigSchema } from './finally';

describe('TESTS', () => {
  const { acceptation, success } = createValibotTests(FinallyConfigSchema);

  describe('#01 => Acceptation', acceptation);

  describe(
    '#01 => CASES',
    success(
      {
        invite: 'single action => true',
        parameters: ['action1'],
        expected: true,
      },
      {
        invite: 'array of string action #1 => true',
        parameters: [['action1']],
        expected: true,
      },
      {
        invite:
          'array of string action #2, but without guards for before actions => false',
        parameters: [['action1', 'action2']],
        expected: false,
      },
      {
        invite: 'single F schema => true',
        parameters: [{ actions: 'action1' }],
        expected: true,
      },
      {
        invite:
          'array with elements having guards, and last element without guard => true',
        parameters: [
          [
            { actions: 'action1', guards: 'guard1' },
            { actions: 'action2' },
          ],
        ],
        expected: true,
      },
      {
        invite:
          'array with elements having guards, and last element is simple action => true',
        parameters: [
          [{ actions: 'action1', guards: 'guard1' }, 'action2'],
        ],
        expected: true,
      },
      {
        invite: 'array where first element does not have guards => false',
        parameters: [[{ actions: 'action1' }, { actions: 'action2' }]],
        expected: false,
      },
      {
        invite: 'empty array => false',
        parameters: [[]],
        expected: false,
      },
    ),
  );
});
