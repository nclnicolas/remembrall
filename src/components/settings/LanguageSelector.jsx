import { LANGUAGES } from '../../constants/language'
import useLanguage from '../../hooks/useLanguage'
import useTexts from '../../hooks/useTexts'
import './LanguageSelector.css'

// Cada idioma se muestra con su propio nombre, sin traducir, para poder reconocerlo.
const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.ES, label: 'Español' },
  { value: LANGUAGES.EN, label: 'English' },
]

function LanguageSelector() {
  const texts = useTexts()
  const { language, setLanguage } = useLanguage()

  return (
    <fieldset className="language-selector">
      <legend>{texts.settings.languageLabel}</legend>
      {LANGUAGE_OPTIONS.map((option) => (
        <label key={option.value} className="language-selector-option">
          <input
            type="radio"
            name="language"
            value={option.value}
            checked={language === option.value}
            onChange={() => setLanguage(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}

export default LanguageSelector
