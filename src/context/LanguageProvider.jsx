import { useLayoutEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
} from '../constants/language'
import storageService from '../services/storageService'
import { LanguageContext } from './LanguageContext'

const VALID_LANGUAGES = Object.values(LANGUAGES)

function getInitialLanguage() {
  const storedLanguage = storageService.get(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE)
  return VALID_LANGUAGES.includes(storedLanguage)
    ? storedLanguage
    : DEFAULT_LANGUAGE
}

function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  // Mantiene <html lang> alineado con el idioma de la interfaz.
  useLayoutEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        if (!VALID_LANGUAGES.includes(nextLanguage)) return
        setLanguageState(nextLanguage)
        storageService.set(LANGUAGE_STORAGE_KEY, nextLanguage)
      },
    }),
    [language],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export default LanguageProvider
