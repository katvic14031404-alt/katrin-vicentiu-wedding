import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps the build portable: dist/ works from any folder or sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2019', cssCodeSplit: false },
});
