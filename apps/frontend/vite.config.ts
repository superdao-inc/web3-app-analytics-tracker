import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: './index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
});
