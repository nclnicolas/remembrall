import { THEMES } from '../../constants/theme'
import useTexts from '../../hooks/useTexts'
import useTheme from '../../hooks/useTheme'
import './ThemeSelector.css'

const THEME_OPTIONS = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM]

function ThemeSelector() {
  const texts = useTexts()
  const { theme, setTheme } = useTheme()

  return (
    <fieldset className="theme-selector">
      <legend>{texts.settings.themeLabel}</legend>
      {THEME_OPTIONS.map((option) => (
        <label key={option} className="theme-selector-option">
          <input
            type="radio"
            name="theme"
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          {texts.settings.themes[option]}
        </label>
      ))}
    </fieldset>
  )
}

export default ThemeSelector
