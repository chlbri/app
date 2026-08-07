import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    bail: 1_000,
    maxConcurrency: 10,
    environment: 'node',
    logHeapUsage: false,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 30000,
    typecheck: { enabled: true, ignoreSourceErrors: false },
  },
});
