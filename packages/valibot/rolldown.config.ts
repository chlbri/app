import { defineConfig } from '@bemedev/dev-utils/rolldown';

export default defineConfig.bemedev({
  declarationMap: true,
  excludesTS: ['src/fixtures.ts'],
  ignoresJS: ['**/*.example.ts', '**/fixtures.ts'],
  externals: ['@bemedev/app', 'valibot', 'vitest', '@bemedev/dev-utils'],
});
