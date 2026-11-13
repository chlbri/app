import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    bail: 100,
    maxConcurrency: 100,
    logHeapUsage: true,
    environment: 'node',
    testTimeout: 30000,
    env: { NODE_ENV: 'test' },
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    clearMocks: false,
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils'] } },
  },
  run: {
    tasks: {
      'generate:lib': {
        dependsOn: ['@bemedev/app-cli#pretest'],
        command:
          'vpx app-cli generate -c ./src --contract && vp fmt ./src/app.contract.gen.ts',
        cache: {
          input: ['src/**', '!src/app.contract.gen.ts'],
          output: ['src/app.contract.gen.ts'],
        },
      },
    },
  },
});
