import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    bail: 100,
    maxConcurrency: 10,
    environment: 'node',
    testTimeout: 30000,
    env: { NODE_ENV: 'test' },
  },
});
