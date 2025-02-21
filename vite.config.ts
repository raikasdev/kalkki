import { defineConfig } from 'vite'
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Abikalkki',
        short_name: 'Abikalkki',
        description: 'Selainpohjainen tieteislaskin',
        theme_color: '#1D2D35',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        lang: 'fi',
      }
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html')
      }
    }
  }
})
