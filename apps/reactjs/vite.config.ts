import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, lazyPlugins } from 'vite-plus';

const config = defineConfig({
  server: { port: 3011 },
  resolve: { tsconfigPaths: true, dedupe: ['react', 'react-dom'] },
  ssr: { noExternal: ['lucide-react', '@bemedev/app', '@bemedev/app-reactjs'] },

  plugins: lazyPlugins(() => {
    return [devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()];
  }),

  test: {
    bail: 100,
    maxConcurrency: 100,
    environment: 'jsdom',
    env: { NODE_ENV: 'test', RTL_SKIP_AUTO_CLEANUP: 'true' },
    testTimeout: 30000,
    clearMocks: false,
    globals: true,
    // Inline dev-utils: it nests its own vitest copy, breaking test collection
    server: { deps: { inline: ['@bemedev/dev-utils', '@bemedev/react-sync'] } },
  },
});

export default config;
