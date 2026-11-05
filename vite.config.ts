import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite publicarla en cualquier carpeta (GitHub Pages, Netlify...)
export default defineConfig({
  plugins: [react()],
  base: './',
});
