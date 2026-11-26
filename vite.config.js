import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No GitHub Pages o site fica em https://<usuario>.github.io/<repositorio>/,
// então os assets precisam desse prefixo. VITE_BASE permite trocar (ex.: "/" em domínio próprio).
export default defineConfig({
  base: process.env.VITE_BASE ?? '/ola-sou-a-manu/',
  plugins: [react()],
  test: {
    include: ['tests/js/**/*.test.js'],
  },
})
