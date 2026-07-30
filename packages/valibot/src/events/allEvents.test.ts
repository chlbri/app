import { AllEventsSchema } from './allEvents';
import { createValibotTests } from '../fixtures';

describe('TESTS', () => {
  describe('#01 => AllEventsSchema', () => {
    const { acceptation, success } = createValibotTests(AllEventsSchema);

    describe('#00 => Accpetation', acceptation);

    describe(
      '#01 => CASES',
      success(
        {
          invite: '"machine$$init"',
          parameters: ['machine$$init'],
          expected: true,
        },
        {
          invite: '"machine$$always"',
          parameters: ['machine$$always'],
          expected: true,
        },
        {
          invite: '"machine$$after"',
          parameters: ['machine$$after'],
          expected: true,
        },
        {
          invite: '"machine$$exceeded"',
          parameters: ['machine$$exceeded'],
          expected: true,
        },
        {
          invite: 'valid event object',
          parameters: [{ type: 'foo', payload: 'bar' }],
          expected: true,
        },
        { invite: '"other"', parameters: ['other'], expected: false },
        {
          invite: 'invalid event object (missing payload)',
          parameters: [{ type: 'foo' }],
          expected: false,
        },
      ),
    );
  });
});
