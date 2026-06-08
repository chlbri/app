import { createValibotTests } from '#fixtures';
import { ChildConfig_Schema } from './child';

describe('TESTS', () => {
  describe('#02 => ChildConfig_Schema', () => {
    const { acceptation, success } = createValibotTests(
      ChildConfig_Schema(),
    );

    describe('#01 => Acceptation', acceptation);

    describe(
      '#01 => CASES',
      success(
        {
          invite: 'only contexts => true',
          parameters: [{ contexts: { key: 'value' } }],
          expected: true,
        },
        {
          invite: 'only on => true',
          parameters: [{ on: { target1: ['target2'] } }],
          expected: true,
        },
        {
          invite: 'both contexts and on => true',
          parameters: [
            { contexts: { key: 'value' }, on: { target1: ['target2'] } },
          ],
          expected: true,
        },
        {
          invite: 'neither contexts nor on => false',
          parameters: [{}],
          expected: false,
        },
        {
          invite: 'neither contexts nor on, and description => false',
          parameters: [
            {
              description: 'description',
            },
          ],
          expected: false,
        },
        {
          invite: 'contexts and all target => true',
          parameters: [
            {
              contexts: { key: 'value' },
              on: { RANDOM_EVENT: ['targrandomtargetet2'] },
            },
          ],
          expected: true,
        },
        {
          invite: 'contexts and all target #2 => true',
          parameters: [
            {
              contexts: { key: 'value' },
              on: { RANDOM_EVENT: 'targrandomtargetet2' },
            },
          ],
          expected: true,
        },
        {
          invite: 'invalid extra property => false',
          parameters: [{ contexts: { key: 'value' }, extra: 123 }],
          expected: false,
        },
      ),
    );
  });
});
