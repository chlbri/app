import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({
    clean: true,
    ignoresJS: ['**/*.example.ts', '**/fixtures.ts'],
    externals: [
      '@bemedev/app',
      'vitest',
      'cmd-ts',
      'node-watch',
      'ts-morph',
      'fast-glob',
      '@bemedev/better-set',
      '@bemedev/decompose',
      '@bemedev/pipe',
      '@bemedev/sleep',
    ],
  }),
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
  run: {
    tasks: {
      pack: {
        command: 'vp pack',
        cache: {
          input: [
            'src/**',
            'package.json',
            'tsconfig.json',
            'vite.config.ts',
            { pattern: 'tsconfig.json', base: 'workspace' },
            { pattern: 'pnpm-lock.yaml', base: 'workspace' },
          ],
          output: ['lib/**'],
        },
      },
    },
  },
});
