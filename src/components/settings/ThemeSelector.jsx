import { THEMES } from '../../constants/theme'
import useTheme from '../../hooks/useTheme'
import './ThemeSelector.css'

const THEME_OPTIONS = [
  { value: THEMES.LIGHT, label: 'Light' },
  { value: THEMES.DARK, label: 'Dark' },
  { value: THEMES.SYSTEM, label: 'System' },
]

function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <fieldset className="theme-selector">
      <legend>Theme</legend>
      {THEME_OPTIONS.map((option) => (
        <label key={option.value} className="theme-selector-option">
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={theme === option.value}
            onChange={() => setTheme(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}

export default ThemeSelector
