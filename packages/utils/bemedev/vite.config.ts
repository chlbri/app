import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({ clean: true, sourcemap: true }),
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
          ],
          output: ['lib/**'],
        },
      },
    },
  },
});
