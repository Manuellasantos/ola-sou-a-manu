import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// caminho do site no GitHub Pages
export default defineConfig({
  base: process.env.VITE_BASE ?? '/ola-sou-a-manu/',
  plugins: [react()],
  test: {
    include: ['tests/js/**/*.test.js'],
  },
})
