import { defineConfig } from '@bemedev/dev-utils/rolldown';

export default defineConfig({
  declarationMap: true,
  ignoresJS: '**/*.example.ts',
  externals: ['@bemedev/app-cli'],
});
