import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        siswa: resolve(__dirname, 'siswa.html'),
        instruktur: resolve(__dirname, 'instruktur.html'),
        super: resolve(__dirname, 'super.html')
      }
    }
  }
})