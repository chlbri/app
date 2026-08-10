import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  resolve: { tsconfigPaths: true },
  test: {
    bail: 100,
    maxConcurrency: 10,
    allowOnly: true,
    environment: 'node',
    env: { NODE_ENV: 'test' },
    globals: true,
    logHeapUsage: false,
    name: 'valibot',
  },
});
