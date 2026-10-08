import { describe, expect, it } from 'vitest'
import en from './en'
import es from './es'

// Lista cada clave con el tipo de su valor (texto o función), p. ej. "form.errors.tooLong:function".
function describeShape(node, path = '') {
  return Object.entries(node)
    .flatMap(([key, value]) => {
      const fullPath = path ? `${path}.${key}` : key
      return typeof value === 'object'
        ? describeShape(value, fullPath)
        : [`${fullPath}:${typeof value}`]
    })
    .sort()
}

function collectFunctions(node) {
  return Object.values(node).flatMap((value) => {
    if (typeof value === 'function') return [value]
    return typeof value === 'object' ? collectFunctions(value) : []
  })
}

describe('diccionarios de idioma', () => {
  it('es y en tienen exactamente las mismas claves y tipos', () => {
    expect(describeShape(en)).toEqual(describeShape(es))
  })

  it('no tienen textos vacíos', () => {
    const emptyTexts = (node) =>
      Object.values(node).some((value) =>
        typeof value === 'object' ? emptyTexts(value) : value === '',
      )
    expect(emptyTexts(es)).toBe(false)
    expect(emptyTexts(en)).toBe(false)
  })

  it('las funciones de texto devuelven texto para un valor y para varios', () => {
    for (const dictionary of [es, en]) {
      for (const textFunction of collectFunctions(dictionary)) {
        expect(textFunction(1)).toEqual(expect.any(String))
        expect(textFunction(3)).toEqual(expect.any(String))
      }
    }
  })
})
