import { defineConfig } from 'vite'
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path';

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const packageJson = JSON.parse(
  readFileSync("./package.json").toString("utf-8"),
);

process.env.VITE_GIT_COMMIT = commitHash;
process.env.VITE_APP_VERSION = packageJson.version;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Kalkki',
        short_name: 'Kalkki',
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
    {
      name: 'generate-manifest',
      apply: 'build',
      closeBundle() {
        // Manifest data
        const manifest = {
          version: packageJson.version,
          gitHash: commitHash,
          buildDate: new Date().toISOString(),
        };

        // Write manifest.json to the dist directory
        const distPath = resolve('dist', 'manifest.json');
        writeFileSync(distPath, JSON.stringify(manifest, null, 2));

        console.log('✅ Manifest generated:', distPath);
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, "./src"),
    },
  },
})