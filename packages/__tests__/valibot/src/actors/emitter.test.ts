import { EmitterConfig_Schema } from '@bemedev/app-valibot';
import { createValibotTests } from "../fixtures";

describe('TESTS', () => {
  const schema = EmitterConfig_Schema('target1', 'target2');
  const { acceptation, success } = createValibotTests(schema);

  describe('#01 => Acceptation', acceptation);

  describe(
    '#01 => CASES',
    success(
      {
        invite: 'valid next string => true',
        parameters: [{ next: 'target1' }],
        expected: true,
      },
      {
        invite: 'valid next object => true',
        parameters: [{ next: { target: 'target1', actions: 'action1' } }],
        expected: true,
      },
      {
        invite: 'invalid next string => false',
        parameters: [{ next: 'target3' }],
        expected: false,
      },
      {
        invite: 'valid next and description => true',
        parameters: [{ next: 'target1', description: 'test emitter' }],
        expected: true,
      },
      {
        invite: 'valid next and error => true',
        parameters: [{ next: 'target1', error: 'target2' }],
        expected: true,
      },
      {
        invite: 'valid next, error, and complete => true',
        parameters: [
          { next: 'target1', error: 'target2', complete: 'action1' },
        ],
        expected: true,
      },
      {
        invite: 'valid next, error, and complete #2 => true',
        parameters: [
          {
            next: 'target1',
            error: [
              {
                target: 'target1',
                actions: 'action4',
                guards: ['guard1', 'guard2'],
              },
              { target: 'target2', actions: ['action1'] },
            ],
            complete: 'action2',
          },
        ],
        expected: true,
      },
      {
        invite: 'no next,vzlids error, and complete => false',
        parameters: [{ error: 'target2', complete: 'action1' }],
        expected: false,
      },
      {
        invite: 'invalid extra property => false',
        parameters: [{ next: 'target1', extra: 123 }],
        expected: false,
      },
    ),
  );
});
