import contentCollections from '@content-collections/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import viteSolid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    contentCollections({}),
    tanstackStart({}),
    nitro(),
    viteSolid({ ssr: true }),
  ],
});
