import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    bail: 100,
    maxConcurrency: 10,
    environment: 'jsdom',
    env: { NODE_ENV: 'test', RTL_SKIP_AUTO_CLEANUP: 'true' },
    testTimeout: 30000,
  },
});
