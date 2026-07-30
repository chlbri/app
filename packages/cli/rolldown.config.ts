import { defineConfig } from '@bemedev/dev-utils/rolldown';

export default defineConfig({
  declarationMap: true,
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
}) as any;
