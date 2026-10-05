import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Fase 1: solo manifest. El plugin genera el service worker, pero no se registra
    // (injectRegister: false). Registro, cache y actualización quedan para la Fase 6.
    VitePWA({
      injectRegister: false,
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Remembrall',
        short_name: 'Remembrall',
        description: 'Crea tus recordatorios y organiza tu trabajo.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    }),
  ],
})
