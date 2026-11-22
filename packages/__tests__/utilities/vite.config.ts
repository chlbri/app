import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    bail: 100,
    maxConcurrency: 100,
    environment: 'node',
    passWithNoTests: true,
    testTimeout: 30000,
    env: { NODE_ENV: 'test' },
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    clearMocks: false,
    name: 'utilities',
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils'] } },
  },
});
