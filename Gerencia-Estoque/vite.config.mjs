// vite.config.mjs
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/login.jsx', 'resources/js/home.jsx', 'resources/js/products.jsx', 'resources/js/clients.jsx', 'resources/js/sales.jsx', 'resources/js/repairs.jsx',],
      refresh: true,
    }),
    react(),
  ],
})
