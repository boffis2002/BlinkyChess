import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// /css, /images and /stockfish aren't proxied: they're served natively by
// Vite itself from client/public/{css,images,stockfish} (symlinked to the
// shared public/ assets).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
