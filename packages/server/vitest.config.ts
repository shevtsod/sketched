import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// https://docs.nestjs.com/recipes/swc
export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    root: './',
    clearMocks: true,
    coverage: {
      exclude: ['**/__mocks__/**', '**/generated/prisma/**'],
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      src: resolve(__dirname, './src'),
    },
  },
});
