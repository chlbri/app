import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({
    clean: true,
    ignoresJS: '**/*.example.ts',
    externals: ['@bemedev/app', 'vitest'],
  }),
});
