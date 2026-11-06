import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({
    clean: true,
    sourcemap: true,
    excludesTS: ['src/fixtures.ts'],
    ignoresJS: ['**/*.example.ts', '**/fixtures.ts'],
    externals: ['@bemedev/app', 'valibot', 'vitest', '@bemedev/dev-utils'],
  }),
});
