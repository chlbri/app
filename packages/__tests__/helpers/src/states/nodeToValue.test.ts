import { nodeToValue } from '@bemedev/app/states';

test('#01 => Coverage', () => {
  const node = nodeToValue({} as any);
  expect(node).toStrictEqual({});
});
