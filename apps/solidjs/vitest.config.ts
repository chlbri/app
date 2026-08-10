import { defineProject } from '@bemedev/dev-utils/vitest-extended';
import solidPlugin from 'vite-plugin-solid';

export default defineProject({
  plugins: [solidPlugin({ solid: {}, dev: true })],

  test: {
    bail: 100,
    maxConcurrency: 10,
    environment: 'jsdom',
    testTimeout: 30000,
  },
});
