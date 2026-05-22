import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: 'VXNOIR MUSIC',
        short_name: 'VXNOIR',
        description: 'Ultra Premium Futuristic Music Streaming',
        theme_color: '#0a0a12',
        background_color: '#04040d',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.audius\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'audius-cache', expiration: { maxEntries: 50, maxAgeSeconds: 300 } }
          },
          {
            urlPattern: /^https:\/\/itunes\.apple\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'itunes-cache', expiration: { maxEntries: 100, maxAgeSeconds: 600 } }
          }
        ]
      }
    })
  ],
  resolve: { alias: { '@': '/src' } }
})
