import { nodeToValue } from '@bemedev/app/states';

test('Coverage', () => {
  const node = nodeToValue({} as any);
  expect(node).toStrictEqual({});
});
