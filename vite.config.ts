import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html')
      }
    }
  }
})
