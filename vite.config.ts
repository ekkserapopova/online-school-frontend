import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      'api/': 'http://127.0.0.1:8080/'
    },
    port:3000
  },
  plugins: [react()],
})
