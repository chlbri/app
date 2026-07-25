import { createValibotTests } from '#fixtures';
import { GuardConfig_Schema } from './union';

describe('TESTS', () => {
  describe('#01 => GuardSchema', () => {
    const { acceptation, success } =
      createValibotTests(GuardConfig_Schema);

    describe('#00 => Accpetation', acceptation);

    describe(
      '#01 => CASES',
      success(
        { invite: '"guard1"', parameters: ['guard1'], expected: true },
        {
          invite: '["guard1", "guard2"]',
          parameters: [['guard1', 'guard2']],
          expected: false,
        },
        {
          invite: '{ "and": ["guard1", "guard2"] }',
          parameters: [{ and: ['guard1', 'guard2'] }],
          expected: true,
        },
        {
          invite: '{ "or": ["guard1", "guard2"] }',
          parameters: [{ or: ['guard1', 'guard2'] }],
          expected: true,
        },
        {
          invite: '{ "or": { "or": ["guard1"] } }',
          parameters: [{ or: { or: ['guard1'] } }],
          expected: false,
        },
        {
          invite: '{ "and": { "and": ["guard1"] } }',
          parameters: [{ and: { and: ['guard1'] } }],
          expected: false,
        },
        {
          invite: '{ "and": { "or": ["guard1"] } }',
          parameters: [{ and: { or: ['guard1'] } }],
          expected: false,
        },
        {
          invite: '{ "and": ["guard1", { "and": ["guard2", "guard3"] }] }',
          parameters: [{ and: ['guard1', { and: ['guard2', 'guard3'] }] }],
          expected: true,
        },
        {
          invite: '{ "or": ["guard1", { "and": ["guard2", "guard3"] }] }',
          parameters: [{ or: ['guard1', { and: ['guard2', 'guard3'] }] }],
          expected: true,
        },
        {
          invite:
            '{ "or": { "and": ["guard1", { "or": ["guard2", "guard3"] }] } }',
          parameters: [{ or: ['guard1', { or: ['guard2', 'guard3'] }] }],
          expected: true,
        },
        {
          invite:
            '{ "and": { "or": ["guard1", { "and": ["guard2", "guard3"] }] } }',
          parameters: [
            { and: { or: ['guard1', { and: ['guard2', 'guard3'] }] } },
          ],
          expected: false,
        },
      ),
    );
  });
});
