import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import viteSolid from 'vite-plugin-solid';
import { lazyPlugins } from 'vite-plus';

export default defineConfig({
  server: { port: 3012 },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    tanstackStart({}),
    nitro(),
    viteSolid({ ssr: true, extensions: ['.js', '.ts', '.jsx', '.tsx'] }),
  ]),
});
