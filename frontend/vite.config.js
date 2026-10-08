import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.VITE_API_URL || 'https://placement-predictor-2-8o1t.onrender.com';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
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
      '/predict': apiTarget,
      '/health': apiTarget,
      '/defaults': apiTarget,
      '/analyze-resume': apiTarget,
      '/match-job': apiTarget,
      '/career-chat': apiTarget,
    }
  },
  preview: {
    port: 5174,
    host: true,
    allowedHosts: true
  }
})
