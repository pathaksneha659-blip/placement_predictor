import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/predict': 'http://127.0.0.1:8000',
      '/health': 'http://127.0.0.1:8000',
      '/defaults': 'http://127.0.0.1:8000',
      '/analyze-resume': 'http://127.0.0.1:8000',
      '/match-job': 'http://127.0.0.1:8000',
      '/career-chat': 'http://127.0.0.1:8000',
    }
  },
  preview: {
    port: 5174,
    host: true,
    allowedHosts: true
  }
})

