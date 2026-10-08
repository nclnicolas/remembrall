import { useCallback, useEffect, useState } from 'react'

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

// Estado de instalación de la PWA. En navegadores con `beforeinstallprompt` (Chromium)
// guarda el evento para ofrecer un botón propio; el navegador conserva además su propia opción.
function useInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null)
  const [isInstalled, setIsInstalled] = useState(isStandalone)

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setInstallEvent(event)
    }

    function handleAppInstalled() {
      setInstallEvent(null)
      setIsInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // El evento solo puede usarse una vez, haya aceptado o no el usuario.
  const install = useCallback(async () => {
    if (installEvent === null) return
    installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
  }, [installEvent])

  return {
    canInstall: installEvent !== null,
    isInstalled,
    isIos: isIos(),
    install,
  }
}

export default useInstallPrompt
