import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({
    clean: true,
    sourcemap: true,
    ignoresJS: '**/*.example.ts',
    externals: ['@bemedev/interval3'],
  }),
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
            '!**/*.gen.ts',
            '../contract/lib/**',
            '../interval3/lib/**',
            '!**/.DS_Store',
            '../options/lib/**',
            '../plugins/core/lib/**',
            '../utils/bemedev/lib/**',
          ],
          output: ['lib/**', '!**/.DS_Store'],
        },
      },
    },
  },
});
