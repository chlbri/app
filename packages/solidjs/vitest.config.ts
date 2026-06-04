import { aliasTs } from '@bemedev/dev-utils/vitest-alias';
import { exclude } from '@bemedev/dev-utils/vitest-exclude';
import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.json';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    aliasTs(tsconfig as any),
    exclude({
      ignoreCoverageFiles: [],
    }),
    solidPlugin(),
  ],
  server: {
    host: '0.0.0.0',
  },
  test: {
    bail: 100,
    maxConcurrency: 10,
    allowOnly: true,
    passWithNoTests: true,
    slowTestThreshold: 3000,
    environment: 'jsdom',
    env: {
      NODE_ENV: 'test',
    },
    globals: true,
    logHeapUsage: false,
    testTimeout: 30000,
    typecheck: {
      enabled: true,
      ignoreSourceErrors: false,
    },
    coverage: {
      enabled: true,
      reportsDirectory: '.coverage',
      provider: 'v8',
    },
  },
});
