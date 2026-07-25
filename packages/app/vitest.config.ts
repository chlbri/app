import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    bail: 100,
    maxConcurrency: 10,
    environment: 'node',
    logHeapUsage: false,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30000,
  },
});
