import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'assets/images'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@worker-mock-server': path.resolve(__dirname, 'worker-mock-server'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@__mocks__': path.resolve(__dirname, '__mocks__'),
    }
  }
});
