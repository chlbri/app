import { defineConfig as pack } from '@bemedev/dev-utils/pack';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: pack.bemedev({ clean: true, sourcemap: true }),
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
});
