import es from '../locales/es'

// Por ahora devuelve siempre español. Cuando exista el selector de idioma (Fase 5),
// este hook pasa a devolver los textos del idioma elegido sin tocar los componentes.
function useTexts() {
  return es
}

export default useTexts
