import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Ruta base del sitio. Por defecto '/'. Para publicar en una subruta (ej. GitHub Pages:
  // https://usuario.github.io/remembrall/) se define VITE_BASE_PATH=/remembrall/ al compilar.
  const env = loadEnv(mode, '.', 'VITE_')
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [
      react(),
      // El service worker se registra desde la app (virtual:pwa-register/react) y la
      // actualización es con aviso: la versión nueva espera a que el usuario la acepte.
      // En desarrollo no se genera service worker (devOptions por defecto).
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          id: base,
          name: 'Remembrall',
          short_name: 'Remembrall',
          description: 'Creá tus recordatorios y organizá tu trabajo.',
          lang: 'es',
          display: 'standalone',
          // start_url y scope se completan con la ruta base.
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  }
})
