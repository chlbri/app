import { defineProject } from 'vite-plus';

export default defineProject({
  resolve: { tsconfigPaths: true },

  test: {
    bail: 100,
    maxConcurrency: 100,
    typecheck: { enabled: true, ignoreSourceErrors: true },
    allowOnly: true,
    environment: 'node',
    env: { NODE_ENV: 'test' },
    globals: true,
    logHeapUsage: false,
    testTimeout: 30000,
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: false,
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils'] } },
  },

  run: {
    tasks: {
      'generate:lib': {
        dependsOn: ['@bemedev/app-cli#pretest'],
        command: 'vpx app-cli generate -c ./src',
        cache: { input: ['src/**', '!src/app.gen.ts'], output: ['src/app.gen.ts'] },
      },
    },
  },
});
