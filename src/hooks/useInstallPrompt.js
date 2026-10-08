import { useCallback, useSyncExternalStore } from 'react'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

// iOS (incluido iPadOS, que se identifica como Mac con pantalla táctil) no ofrece
// instalar desde la página: el usuario debe usar "Agregar a pantalla de inicio".
function isIos() {
  const { userAgent, platform, maxTouchPoints } = window.navigator
  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  )
}

// `beforeinstallprompt` se dispara una sola vez, poco después de cargar la app. Por eso se
// escucha desde el arranque (main.jsx importa este módulo) y no al montar Configuración,
// donde el evento ya se habría perdido.
let installEvent = null
let installed = typeof window !== 'undefined' && isStandalone()
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installEvent = event
    notify()
  })

  window.addEventListener('appinstalled', () => {
    installEvent = null
    installed = true
    notify()
  })
}

// Estado de instalación de la PWA. En navegadores con `beforeinstallprompt` (Chromium)
// guarda el evento para ofrecer un botón propio; el navegador conserva además su propia opción.
function useInstallPrompt() {
  const event = useSyncExternalStore(subscribe, () => installEvent)
  const isInstalled = useSyncExternalStore(subscribe, () => installed)

  // El evento solo puede usarse una vez, haya aceptado o no el usuario.
  const install = useCallback(async () => {
    if (event === null) return
    event.prompt()
    await event.userChoice
    installEvent = null
    notify()
  }, [event])

  return {
    canInstall: event !== null,
    isInstalled,
    isIos: isIos(),
    install,
  }
}

export default useInstallPrompt
