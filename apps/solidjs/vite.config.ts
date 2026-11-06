import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteSolid from 'vite-plugin-solid';
import { defineProject, lazyPlugins } from 'vite-plus';

export default defineProject({
  server: { port: 3012 },
  resolve: { tsconfigPaths: true },

  plugins: lazyPlugins(() => {
    const isTest = process.env.NODE_ENV === 'test';

    return [
      tailwindcss(),
      tanstackStart({}),
      nitro(),

      viteSolid({
        ssr: !isTest,
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        dev: isTest,
      }),
    ];
  }),

  test: {
    bail: 100,

    globals: true,
    environment: 'jsdom',
    testTimeout: 30000,
    clearMocks: false,
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils'] } },
  },
});
