import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.161.190:8080',
        changeOrigin: true,
        secure: false,
      },
  }},
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.jpeg" ,"**/*.webp"] // Support common image formats
})