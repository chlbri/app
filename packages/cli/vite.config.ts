import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

/**
 * Building the `pack` block reads the tsconfig of `process.cwd()` and walks
 * every directory under it. Vitest loads this config from the workspace root
 * for every run, which scans the whole monorepo (~20s) for nothing: tests
 * never read `pack`. So it is only built outside the test mode.
 */
const buildPack = () =>
  pack.bemedev({
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
  });

export default defineConfig(({ mode }) => ({
  ...(mode !== 'test' && { pack: buildPack() }),
  test: {
    bail: 100,
    maxConcurrency: 100,
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
        dependsOn: [
          {
            task: 'pack',
            from: ['dependencies', 'devDependencies', 'peerDependencies'],
          },
        ],
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
}));
