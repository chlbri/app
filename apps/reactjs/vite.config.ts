import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

const config = defineConfig({
  server: { port: 3011 },
  resolve: { tsconfigPaths: true, dedupe: ['react', 'react-dom'] },
  ssr: {
    noExternal: ['lucide-react', '@bemedev/app', '@bemedev/app-reactjs'],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});

export default config;
