import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
  server: {
    host: true,
    // `vercel dev` serves /api on 3000; `npm run dev` alone proxies to it.
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
  },
});
