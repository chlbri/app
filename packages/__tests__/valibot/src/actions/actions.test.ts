import { ActionConfig_Schema } from '@bemedev/app-valibot';
import { createValibotTests } from "../fixtures";

describe('TESTS', () => {
  const { acceptation, success } = createValibotTests(ActionConfig_Schema);

  describe('#01 => Acceptation', acceptation);

  describe(
    '#01 => CASES',
    success(
      { invite: 'string => true', parameters: ['foo'], expected: true },
      { invite: 'empty string => true', parameters: [''], expected: true },
      {
        invite: 'empty object => false',
        parameters: [{}],
        expected: false,
      },
      { invite: 'null => false', parameters: [null], expected: false },
      {
        invite: 'undefined => false',
        parameters: [undefined],
        expected: false,
      },
      { invite: 'number => false', parameters: [34], expected: false },
      { invite: 'boolean => false', parameters: [true], expected: false },
      { invite: 'array #1 => false', parameters: [[]], expected: false },
      {
        invite: 'array #2 => false',
        parameters: [['data', 34]],
        expected: false,
      },
      {
        invite: 'random object => false',
        parameters: [{ data: 34 }],
        expected: false,
      },
      {
        invite: 'describe object => true',
        parameters: [{ name: 'action', description: 'A action' }],
        expected: true,
      },
      {
        invite: 'describe object with extra keys => false',
        parameters: [
          { name: 'action', description: 'A action', extra: 34 },
        ],
        expected: false,
      },
      {
        invite: 'describe object with missing required keys => false',
        parameters: [{ description: 'A action' }],
        expected: false,
      },
    ),
  );
});
