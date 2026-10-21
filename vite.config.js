import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { proxy: { '/api': 'http://127.0.0.1:1488', '/uploads': 'http://127.0.0.1:1488' } },
  plugins: [
    tailwindcss(),
  ],
})