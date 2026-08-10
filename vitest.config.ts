import { defineConfig, defaultExclude } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { host: '0.0.0.0' },

  test: {
    passWithNoTests: true,
    slowTestThreshold: 3000,
    logHeapUsage: true,
    globals: true,
    typecheck: { enabled: true, ignoreSourceErrors: false },
    env: { NODE_ENV: 'test' },

    coverage: {
      enabled: true,
      reportsDirectory: '.coverage',
      provider: 'v8',
      exclude: [
        ...defaultExclude,
        '**/types.ts',
        '**/*.example.ts',
        '**/*.types.ts',
        '**/*.fixtures.ts',
        '**/fixtures/**',
        '**/*.machine.ts',
        '**/experimental.ts',
        '**/src/utils/nothing.ts',
        '**/fixtures.ts',
        '**/libs/bemedev/**/*',
        '**/fixture.ts',
        '**/*.fixture.ts',
        '**/test.ts',
        '**/src/core/helpers/**',
      ],
    },

    projects: [
      'packages/__tests__/sync/vitest.config.ts',
      'packages/__tests__/async/vitest.config.ts',
      'packages/__tests__/helpers/vitest.config.ts',
      'packages/cli/vitest.config.ts',
      'packages/reactjs/vitest.config.ts',
      'packages/solidjs/vitest.config.ts',
      'packages/utils/bemedev/vitest.config.ts',
      'packages/vitest/vitest.config.ts',
      'packages/valibot/vitest.config.ts',
    ],
  },
});
