import { useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import useTexts from '../../hooks/useTexts'
import './UpdatePrompt.css'

// Registra el service worker y avisa cuando hay una versión nueva o cuando la app
// ya puede usarse sin conexión. La actualización la decide el usuario: recargar la
// página podría hacerle perder lo escrito en un formulario.
function UpdatePrompt() {
  const texts = useTexts()
  const registrationRef = useRef(null)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null
    },
  })

  // Busca una versión nueva al volver a la pestaña.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        registrationRef.current?.update()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  if (needRefresh) {
    return (
      <div className="update-prompt" role="status">
        <p>{texts.pwa.updateAvailable}</p>
        <div className="update-prompt-actions">
          <button type="button" onClick={() => updateServiceWorker(true)}>
            {texts.pwa.updateButton}
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            aria-label={texts.common.close}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  if (offlineReady) {
    return (
      <div className="update-prompt" role="status">
        <p>{texts.pwa.offlineReady}</p>
        <div className="update-prompt-actions">
          <button
            type="button"
            onClick={() => setOfflineReady(false)}
            aria-label={texts.common.close}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default UpdatePrompt
