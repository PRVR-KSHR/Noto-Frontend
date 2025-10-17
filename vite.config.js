import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Remove conflicting headers that cause COOP issues
  },
  // Add build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
