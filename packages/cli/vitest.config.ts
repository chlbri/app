import { defineProject } from 'vite-plus';

export default defineProject({
  test: {
    bail: 100,

    environment: 'node',
    testTimeout: 30000,
    env: { NODE_ENV: 'test' },
    globals: true,
    clearMocks: false,
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils'] } },
  },
});
