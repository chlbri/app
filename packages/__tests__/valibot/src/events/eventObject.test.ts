import { EventObjectSchema } from '@bemedev/app-valibot';
import { createValibotTests } from "../fixtures";

describe('TESTS', () => {
  describe('#01 => EventObjectSchema', () => {
    const { acceptation, success } = createValibotTests(EventObjectSchema);

    describe('#00 => Accpetation', acceptation);

    describe(
      '#01 => CASES',
      success(
        {
          invite: 'valid event object',
          parameters: [{ type: 'foo', payload: 'bar' }],
          expected: true,
        },
        {
          invite: 'valid event object with nested payload',
          parameters: [{ type: 'foo', payload: { data: 123 } }],
          expected: true,
        },
        {
          invite: 'invalid event object (null payload)',
          parameters: [{ type: 'foo', payload: null }],
          expected: false,
        },
        {
          invite: 'invalid event object (missing payload)',
          parameters: [{ type: 'foo' }],
          expected: false,
        },
        {
          invite: 'invalid event object (missing type)',
          parameters: [{ payload: 'bar' }],
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
