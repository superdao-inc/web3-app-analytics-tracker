import { defineConfig } from 'vite';

import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'browser',
    lib: {
      entry: './browser.ts',
      formats: ['iife'],
      name: 'superdaoTracker',
      fileName: () => `supertracker-${version}.js`,
    },
  },
});
