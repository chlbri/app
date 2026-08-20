import { defineConfig } from '@bemedev/dev-utils/rolldown';

export default defineConfig({
  declarationMap: true,
  sourcemap: true,
  ignoresJS: '**/*.example.ts',
});
