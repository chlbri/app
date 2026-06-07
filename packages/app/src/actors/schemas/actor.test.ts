import { createValibotTests } from '#fixtures';
import { ActorConfig_Schema } from './actor';

describe('TESTS', () => {
  const schema = ActorConfig_Schema('target1', 'target2');
  const { acceptation, success } = createValibotTests(schema);

  describe('#01 => Acceptation', acceptation);

  describe(
    '#01 => CASES',
    success(
      {
        invite: 'valid child config => true',
        parameters: [{ contexts: { key: 'value' } }],
        expected: true,
      },
      {
        invite: 'valid emitter config => true',
        parameters: [{ next: 'target1' }],
        expected: true,
      },
      {
        invite: 'invalid config => false',
        parameters: [{}],
        expected: false,
      },
      {
        invite: 'invalid next target => false',
        parameters: [{ next: 'invalid' }],
        expected: false,
      },
    ),
  );
});
