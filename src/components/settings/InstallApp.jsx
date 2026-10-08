import useInstallPrompt from '../../hooks/useInstallPrompt'
import useTexts from '../../hooks/useTexts'
import './InstallApp.css'

function InstallApp() {
  const texts = useTexts()
  const { canInstall, isInstalled, isIos, install } = useInstallPrompt()

  if (isInstalled) {
    return <p className="install-app-message">{texts.pwa.installed}</p>
  }

  if (canInstall) {
    return (
      <div className="install-app">
        <button type="button" onClick={install}>
          {texts.pwa.installButton}
        </button>
      </div>
    )
  }

  return (
    <p className="install-app-message">
      {isIos ? texts.pwa.iosHint : texts.pwa.installUnavailable}
    </p>
  )
}

export default InstallApp
