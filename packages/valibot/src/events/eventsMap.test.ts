import { EventsMapSchema } from './eventsMap';
import { createValibotTests } from '../fixtures';

describe('TESTS', () => {
  describe('#01 => EventsMapSchema', () => {
    const { acceptation, success } = createValibotTests(EventsMapSchema);

    describe('#00 => Accpetation', acceptation);

    describe(
      '#01 => CASES',
      success(
        { invite: 'empty object', parameters: [{}], expected: true },
        {
          invite: 'valid events map',
          parameters: [{ event1: 'payload1', event2: { data: 42 } }],
          expected: true,
        },
        {
          invite: 'invalid events map (null payload)',
          parameters: [{ event1: null }],
          expected: false,
        },
        {
          invite: 'non-object value',
          parameters: ['foo'],
          expected: false,
        },
      ),
    );
  });
});
