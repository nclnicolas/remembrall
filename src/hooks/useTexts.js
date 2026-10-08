import { LANGUAGES } from '../constants/language'
import en from '../locales/en'
import es from '../locales/es'
import useLanguage from './useLanguage'

const TEXTS_BY_LANGUAGE = {
  [LANGUAGES.ES]: es,
  [LANGUAGES.EN]: en,
}

// Devuelve los textos de la interfaz en el idioma elegido.
// El contenido que escribe el usuario (títulos, descripciones) no se traduce.
function useTexts() {
  const { language } = useLanguage()
  return TEXTS_BY_LANGUAGE[language]
}

export default useTexts
