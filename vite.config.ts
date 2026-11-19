import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages has no SPA rewrites; serving index.html as 404.html lets deep links
 * such as /EchoWork/dashboard load the app, which then routes client-side.
 */
const spaFallback = (): Plugin => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const out = resolve(__dirname, 'dist');
    copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'));
  },
});

export default defineConfig({
  // "/" locally; the Pages workflow sets BASE_PATH=/EchoWork/.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), spaFallback()],
});
