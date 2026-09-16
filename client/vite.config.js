import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const target = 'http://localhost:8989'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/home': target,
      '/css': target,
      '/images': target,
      '/socket.io': { target, ws: true },
    },
  },
})
