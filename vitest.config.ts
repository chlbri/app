import { defineConfig } from 'vitest/config';
import { exclude } from '@bemedev/dev-utils/vitest-exclude';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { host: '0.0.0.0' },
  plugins: [
    exclude({
      ignoreCoverageFiles: [
        '**/index.ts',
        '**/node_modules/**',
        '**/*.js',
        '**/*.cjs',
        '**/*.mjs',
        '**/*.d.ts',
        '**/types.ts',
        '**/*.example.ts',
        '**/*.types.ts',
        '**/*.typegen.ts',
        '**/*.fixtures.ts',
        '**/fixtures/**',
        '**/*.test-d.ts',
        '**/*.machine.ts',
        '**/experimental.ts',
        '**/src/utils/nothing.ts',
        '**/fixtures.ts',
        '**/libs/bemedev/**/*',
        '**/fixture.ts',
        '**/*.fixture.ts',
        '**/test.ts',
        '**/src/cli/cli.ts',
        '**/src/cli/core/helpers/**',
        '**/__tests__/**',
      ],
    }),
  ],

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
