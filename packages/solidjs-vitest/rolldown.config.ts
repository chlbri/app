import { defineConfig } from '@bemedev/dev-utils/rolldown';

export default defineConfig.bemedev({
  declarationMap: true,
  ignoresJS: '**/*.example.ts',
  externals: ['@bemedev/app', 'vitest'],
}) as any;
