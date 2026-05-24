import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { reduceDescribers } from './reduceDescribers';

describe('reduceDescribers', () => {
  const { acceptation, success } = createTests(reduceDescribers, {
    transform: Array.from,
  });

  describe('#00 => accepation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'single string action',
        parameters: 'action1',
        expected: ['action1'],
      },
      {
        invite: 'single describer action',
        parameters: {
          name: 'action1',
          description: 'This is action1',
        },
        expected: ['action1'],
      },
      {
        invite: 'multiple string actions',
        parameters: ['action1', 'action2', 'action3'],
        expected: ['action1', 'action2', 'action3'],
      },
      {
        invite: 'multiple describer actions',
        parameters: [
          'action3',
          { name: 'action1', description: 'This is action1' },
          { name: 'action2', description: 'This is action2' },
          { name: 'action3', description: 'This is action3' },
        ],
        expected: ['action3', 'action1', 'action2'],
      },
      {
        invite: 'mixed string and describer actions',
        parameters: [
          'action1',
          { name: 'action2', description: 'This is action2' },
          'action3',
        ],
        expected: ['action1', 'action2', 'action3'],
      },
      {
        invite: 'duplicate string action',
        parameters: ['action1', 'action1'],
        expected: ['action1'],
      },
      {
        invite: 'duplicate describer action',
        parameters: [
          { name: 'action1', description: 'First description' },
          { name: 'action1', description: 'Second description' },
        ],
        expected: ['action1'],
      },
      {
        invite: 'string followed by describer with same name',
        parameters: [
          'action1',
          { name: 'action1', description: 'This is action1' },
        ],
        expected: ['action1'],
      },
      {
        invite: 'describer followed by string with same name',
        parameters: [
          { name: 'action1', description: 'This is action1' },
          'action1',
        ],
        expected: ['action1'],
      },
      {
        invite: 'multiple strings with one duplicate',
        parameters: ['action1', 'action2', 'action1', 'action3'],
        expected: ['action1', 'action2', 'action3'],
      },
      {
        invite: 'multiple describers with one duplicate',
        parameters: [
          { name: 'action1', description: 'First' },
          { name: 'action2', description: 'Second' },
          { name: 'action1', description: 'Third' },
        ],
        expected: ['action1', 'action2'],
      },
      {
        invite: 'complex scenario with mixed types and duplicates',
        parameters: [
          'action1',
          {
            name: 'action2',
            description: 'Describer for action2',
          },
          'action3',
          'action1',
          {
            name: 'action4',
            description: 'Describer for action4',
          },
          'action2',
        ],
        expected: ['action1', 'action2', 'action3', 'action4'],
      },
      {
        invite:
          'string, describer, then different describer with same name',
        parameters: [
          'action1',
          { name: 'action1', description: 'First describer' },
          { name: 'action1', description: 'Second describer' },
        ],
        expected: ['action1'],
      },
      {
        invite: 'no arguments',
        parameters: [],
        expected: [],
      },
      {
        invite: 'many identical strings',
        parameters: ['same', 'same', 'same', 'same'],
        expected: ['same'],
      },
      {
        invite: 'many identical describers',
        parameters: [
          { name: 'same', description: 'Same action' },
          { name: 'same', description: 'Same action' },
          { name: 'same', description: 'Same action' },
        ],
        expected: ['same'],
      },
      {
        invite:
          'string, then describer with same name, then another action',
        parameters: [
          'first',
          'middle',
          { name: 'middle', description: 'Middle action' },
          'last',
        ],
        expected: ['first', 'middle', 'last'],
      },
    ),
  );
});
