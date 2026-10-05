import { useLayoutEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY } from '../constants/theme'
import storageService from '../services/storageService'
import { ThemeContext } from './ThemeContext'

const VALID_THEMES = Object.values(THEMES)

function getInitialTheme() {
  const storedTheme = storageService.get(THEME_STORAGE_KEY, DEFAULT_THEME)
  return VALID_THEMES.includes(storedTheme) ? storedTheme : DEFAULT_THEME
}

// "system" no define data-theme: tokens.css resuelve el tema con prefers-color-scheme.
function applyTheme(theme) {
  const root = document.documentElement
  if (theme === THEMES.SYSTEM) {
    delete root.dataset.theme
  } else {
    root.dataset.theme = theme
  }
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme) => {
        if (!VALID_THEMES.includes(nextTheme)) return
        setThemeState(nextTheme)
        storageService.set(THEME_STORAGE_KEY, nextTheme)
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
