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
        '**/index.ts',
        '**/*.js',
        '**/*.cjs',
        '**/*.mjs',
        '**/*.d.ts',
        '**/types.ts',
        '**/__tests__/edges/arrayAssign/async.async.fsm.ts',
        '**/__tests__/interpreters/sync/data/machine2.ts',
        '**/__tests__/interpreters/async/data/machine2.ts',
        '**/__tests__/interpreters/async/data/machine21.ts',
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
      'packages/__tests__/project1/vitest.config.ts',
      'packages/app/vitest.config.ts',
      'packages/cli/vitest.config.ts',
      'packages/reactjs/vitest.config.ts',
      'packages/solidjs/vitest.config.ts',
      'packages/utils/bemedev/vitest.config.ts',
      'packages/vitest/vitest.config.ts',
      //Add all packages according to the package folder
    ],
  },
});
