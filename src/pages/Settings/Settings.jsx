import DataExport from '../../components/settings/DataExport'
import InstallApp from '../../components/settings/InstallApp'
import LanguageSelector from '../../components/settings/LanguageSelector'
import ThemeSelector from '../../components/settings/ThemeSelector'
import useTexts from '../../hooks/useTexts'

function Settings() {
  const texts = useTexts()

  return (
    <div>
      <h1>{texts.settings.title}</h1>
      <p>{texts.settings.description}</p>
      <section>
        <h2>{texts.settings.appearanceTitle}</h2>
        <ThemeSelector />
      </section>
      <section>
        <h2>{texts.settings.languageTitle}</h2>
        <LanguageSelector />
      </section>
      <section>
        <h2>{texts.settings.dataTitle}</h2>
        <DataExport />
      </section>
      <section>
        <h2>{texts.settings.appTitle}</h2>
        <InstallApp />
      </section>
    </div>
  )
}

export default Settings
